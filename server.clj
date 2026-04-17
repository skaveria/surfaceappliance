(ns server
  (:require [org.httpkit.server :as http]
            [clojure.java.shell :refer [sh]]))

(defn weather-text []
  (let [{:keys [out]} (sh "bash" "-lc" "curl -s 'wttr.in/Show+Low?format=%t+%C'")]
    (if (seq out) out "weather unavailable")))

(defn time-text []
  (let [{:keys [out]} (sh "date" "+%I:%M %p")]
    (.trim out)))

(defn handler [_]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body (str "<html><body style='margin:0;background:#111;color:#eee;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;'>"
              "<div id='app' style='text-align:center'>"
              "<div style='font-size:10vw'>" (time-text) "</div>"
              "<div style='font-size:4vw;opacity:.85'>" (weather-text) "</div>"
              "</div>"
              "<script>setInterval(async()=>{let t=await (await fetch('/')).text();let d=new DOMParser().parseFromString(t,'text/html');document.querySelector('#app').innerHTML=d.querySelector('#app').innerHTML;},10000)</script>"
              "</body></html>")})

(http/run-server handler {:port 8080})
(println "server on http://localhost:8080")
