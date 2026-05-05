(ns surfaceappliance.clock
  (:require [clojure.string :as str]))

(defonce light-history (atom []))
(defonce camera-ready? (atom false))

(def weather-url
  (str "https://api.open-meteo.com/v1/forecast"
       "?latitude=34.2542"
       "&longitude=-110.0298"
       "&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m"
       "&temperature_unit=fahrenheit"
       "&wind_speed_unit=mph"))

(def code-map
  {0 "Clear"
   1 "Mostly clear"
   2 "Partly cloudy"
   3 "Overcast"
   45 "Fog"
   48 "Rime fog"
   51 "Light drizzle"
   53 "Drizzle"
   55 "Heavy drizzle"
   61 "Light rain"
   63 "Rain"
   65 "Heavy rain"
   71 "Light snow"
   73 "Snow"
   75 "Heavy snow"
   80 "Rain showers"
   81 "Rain showers"
   82 "Heavy showers"
   95 "Thunderstorm"})

(defn by-id [id]
  (.getElementById js/document id))

(defn set-text! [id text]
  (when-let [el (by-id id)]
    (set! (.-textContent el) text)))

(defn set-html! [id html]
  (when-let [el (by-id id)]
    (set! (.-innerHTML el) html)))

(defn now-parts []
  (let [formatter (js/Intl.DateTimeFormat.
                   #js []
                   #js {:hour "numeric"
                        :minute "2-digit"
                        :second "2-digit"})
        parts (.formatToParts formatter (js/Date.))]
    (reduce
     (fn [m part]
       (assoc m (keyword (.-type part)) (.-value part)))
     {}
     (array-seq parts))))

(defn update-time! []
  (let [{:keys [hour minute second]} (now-parts)
        now (js/Date.)
        date-text (.toLocaleDateString
                   now
                   #js []
                   #js {:weekday "long"
                        :month "long"
                        :day "numeric"})]
    (set-html!
     "time"
     (str (or hour "--")
          "<span class=\"colon\">:</span>"
          (or minute "--")
          "<span id=\"seconds\">"
          (or second "--")
          "</span>"))
    (set-text! "date" date-text)))

(defn compass-label [deg]
  (let [dirs ["N" "NE" "E" "SE" "S" "SW" "W" "NW"]
        idx (mod (js/Math.round (/ deg 45)) (count dirs))]
    (nth dirs idx)))

(defn render-light-graph! []
  (let [history @light-history
        svg-width 600
        svg-height 140
        pad 10]
    (when (>= (count history) 2)
      (let [min-light (apply min history)
            max-light (apply max history)
            span (max 1 (- max-light min-light))
            points (map-indexed
                    (fn [i value]
                      (let [x (* (/ i (dec (count history))) svg-width)
                            y (- svg-height
                                 pad
                                 (* (/ (- value min-light) span)
                                    (- svg-height (* pad 2))))]
                        [x y]))
                    history)
            line-path (->> points
                           (map-indexed
                            (fn [i [x y]]
                              (str (if (zero? i) "M" "L")
                                   " "
                                   (.toFixed x 1)
                                   " "
                                   (.toFixed y 1))))
                           (str/join " "))
            last-x (first (last points))
            fill-path (str line-path
                           " L " (.toFixed last-x 1) " " svg-height
                           " L 0 " svg-height
                           " Z")
            current (last history)
            percent (js/Math.round (* (/ current 255) 100))]
        (.setAttribute (by-id "graph-line") "d" line-path)
        (.setAttribute (by-id "graph-fill") "d" fill-path)
        (set-text! "graph-readout"
                   (str percent "% · " (count history) " samples"))))))

(defn init-camera! []
  (if-not (and (.-mediaDevices js/navigator)
               (.-getUserMedia (.-mediaDevices js/navigator)))
    (set-text! "graph-readout" "camera unavailable")
    (-> (.getUserMedia
         (.-mediaDevices js/navigator)
         #js {:video #js {:width #js {:ideal 320}
                          :height #js {:ideal 240}}
              :audio false})
        (.then
         (fn [stream]
           (let [video (by-id "cam")]
             (set! (.-srcObject video) stream)
             (set! (.-onloadedmetadata video)
                   (fn []
                     (reset! camera-ready? true)
                     (set-text! "graph-readout" "collecting light"))))))
        (.catch
         (fn [_]
           (reset! camera-ready? false)
           (set-text! "graph-readout" "camera unavailable"))))))

(defn sample-light! []
  (when @camera-ready?
    (let [video (by-id "cam")
          canvas (by-id "cam-canvas")
          ctx (.getContext canvas "2d" #js {:willReadFrequently true})]
      (when (>= (.-readyState video) 2)
        (.drawImage ctx video 0 0 (.-width canvas) (.-height canvas))
        (let [pixels (.-data (.getImageData ctx 0 0 (.-width canvas) (.-height canvas)))
              len (.-length pixels)
              pixel-count (/ len 4)
              sum (loop [i 0 acc 0]
                    (if (>= i len)
                      acc
                      (let [r (aget pixels i)
                            g (aget pixels (+ i 1))
                            b (aget pixels (+ i 2))]
                        (recur (+ i 4)
                               (+ acc
                                  (* 0.2126 r)
                                  (* 0.7152 g)
                                  (* 0.0722 b))))))]
          (swap! light-history
                 (fn [xs]
                   (let [next-xs (conj xs (/ sum pixel-count))]
                     (if (> (count next-xs) 120)
                       (vec (rest next-xs))
                       next-xs))))
          (render-light-graph!))))))

(defn update-weather! []
  (-> (js/fetch weather-url)
      (.then #(.json %))
      (.then
       (fn [data]
         (let [current (.-current data)
               temp (js/Math.round (.-temperature_2m current))
               weather-code (.-weather_code current)
               desc (get code-map weather-code "Weather")
               wind-speed (js/Math.round (.-wind_speed_10m current))
               wind-dir (js/Math.round (.-wind_direction_10m current))]
           (set-text! "weather" (str temp "°F · " desc))
           (set-text! "wind-speed" (str wind-speed " mph"))
           (set-text! "wind-dir" (compass-label wind-dir))
           (set! (.. (by-id "needle") -style -transform)
                 (str "rotate(" (- wind-dir 270) "deg)")))))
      (.catch
       (fn [_]
         (set-text! "weather" "weather unavailable")
         (set-text! "wind-speed" "-- mph")
         (set-text! "wind-dir" "---")))))

(defn ^:export init! []
  (update-time!)
  (update-weather!)
  (init-camera!)

  (js/setInterval update-time! 1000)
  (js/setInterval update-weather! 60000)
  (js/setInterval sample-light! 2000))

(init!)
