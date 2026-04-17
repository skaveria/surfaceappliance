(ns server
  (:require [org.httpkit.server :as http]
            [clojure.java.io :as io]))

(defn handler [_]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body (slurp (io/file "screen.html"))})

(http/run-server handler {:port 8080})
(println "server on http://localhost:8080")
