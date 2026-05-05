goog.provide('surfaceappliance.clock');
if((typeof surfaceappliance !== 'undefined') && (typeof surfaceappliance.clock !== 'undefined') && (typeof surfaceappliance.clock.light_history !== 'undefined')){
} else {
surfaceappliance.clock.light_history = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
}
if((typeof surfaceappliance !== 'undefined') && (typeof surfaceappliance.clock !== 'undefined') && (typeof surfaceappliance.clock.camera_ready_QMARK_ !== 'undefined')){
} else {
surfaceappliance.clock.camera_ready_QMARK_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
surfaceappliance.clock.weather_url = (""+"https://api.open-meteo.com/v1/forecast"+"?latitude=34.2542"+"&longitude=-110.0298"+"&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m"+"&temperature_unit=fahrenheit"+"&wind_speed_unit=mph");
surfaceappliance.clock.code_map = cljs.core.PersistentHashMap.fromArrays([(0),(65),(1),(55),(95),(48),(75),(61),(51),(3),(2),(82),(45),(53),(81),(73),(71),(80),(63)],["Clear","Heavy rain","Mostly clear","Heavy drizzle","Thunderstorm","Rime fog","Heavy snow","Light rain","Light drizzle","Overcast","Partly cloudy","Heavy showers","Fog","Drizzle","Rain showers","Snow","Light snow","Rain showers","Rain"]);
surfaceappliance.clock.by_id = (function surfaceappliance$clock$by_id(id){
return document.getElementById(id);
});
surfaceappliance.clock.set_text_BANG_ = (function surfaceappliance$clock$set_text_BANG_(id,text){
var temp__5825__auto__ = surfaceappliance.clock.by_id(id);
if(cljs.core.truth_(temp__5825__auto__)){
var el = temp__5825__auto__;
return (el.textContent = text);
} else {
return null;
}
});
surfaceappliance.clock.set_html_BANG_ = (function surfaceappliance$clock$set_html_BANG_(id,html){
var temp__5825__auto__ = surfaceappliance.clock.by_id(id);
if(cljs.core.truth_(temp__5825__auto__)){
var el = temp__5825__auto__;
return (el.innerHTML = html);
} else {
return null;
}
});
surfaceappliance.clock.now_parts = (function surfaceappliance$clock$now_parts(){
var formatter = (new Intl.DateTimeFormat([],({"hour": "numeric", "minute": "2-digit", "second": "2-digit"})));
var parts = formatter.formatToParts((new Date()));
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (m,part){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(m,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(part.type),part.value);
}),cljs.core.PersistentArrayMap.EMPTY,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(parts));
});
surfaceappliance.clock.update_time_BANG_ = (function surfaceappliance$clock$update_time_BANG_(){
var map__7651 = surfaceappliance.clock.now_parts();
var map__7651__$1 = cljs.core.__destructure_map(map__7651);
var hour = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7651__$1,new cljs.core.Keyword(null,"hour","hour",-555989214));
var minute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7651__$1,new cljs.core.Keyword(null,"minute","minute",-642875969));
var second = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7651__$1,new cljs.core.Keyword(null,"second","second",-444702010));
var now = (new Date());
var date_text = now.toLocaleDateString([],({"weekday": "long", "month": "long", "day": "numeric"}));
surfaceappliance.clock.set_html_BANG_("time",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5142__auto__ = hour;
if(cljs.core.truth_(or__5142__auto__)){
return or__5142__auto__;
} else {
return "--";
}
})())+"<span class=\"colon\">:</span>"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5142__auto__ = minute;
if(cljs.core.truth_(or__5142__auto__)){
return or__5142__auto__;
} else {
return "--";
}
})())+"<span id=\"seconds\">"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5142__auto__ = second;
if(cljs.core.truth_(or__5142__auto__)){
return or__5142__auto__;
} else {
return "--";
}
})())+"</span>"));

return surfaceappliance.clock.set_text_BANG_("date",date_text);
});
surfaceappliance.clock.compass_label = (function surfaceappliance$clock$compass_label(deg){
var dirs = new cljs.core.PersistentVector(null, 8, 5, cljs.core.PersistentVector.EMPTY_NODE, ["N","NE","E","SE","S","SW","W","NW"], null);
var idx = cljs.core.mod(Math.round((deg / (45))),cljs.core.count(dirs));
return cljs.core.nth.cljs$core$IFn$_invoke$arity$2(dirs,idx);
});
surfaceappliance.clock.render_light_graph_BANG_ = (function surfaceappliance$clock$render_light_graph_BANG_(){
var history__$1 = cljs.core.deref(surfaceappliance.clock.light_history);
var svg_width = (600);
var svg_height = (140);
var pad = (10);
if((cljs.core.count(history__$1) >= (2))){
var min_light = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.min,history__$1);
var max_light = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.max,history__$1);
var span = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(max_light - min_light));
var points = cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2((function (i,value){
var x = ((i / (cljs.core.count(history__$1) - (1))) * svg_width);
var y = ((svg_height - pad) - (((value - min_light) / span) * (svg_height - (pad * (2)))));
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [x,y], null);
}),history__$1);
var line_path = clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2((function (i,p__7657){
var vec__7658 = p__7657;
var x = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7658,(0),null);
var y = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7658,(1),null);
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((((i === (0)))?"M":"L"))+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(x.toFixed((1)))+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(y.toFixed((1))));
}),points));
var last_x = cljs.core.first(cljs.core.last(points));
var fill_path = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(line_path)+" L "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(last_x.toFixed((1)))+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(svg_height)+" L 0 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(svg_height)+" Z");
var current = cljs.core.last(history__$1);
var percent = Math.round(((current / (255)) * (100)));
surfaceappliance.clock.by_id("graph-line").setAttribute("d",line_path);

surfaceappliance.clock.by_id("graph-fill").setAttribute("d",fill_path);

return surfaceappliance.clock.set_text_BANG_("graph-readout",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(percent)+"% \u00B7 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(history__$1))+" samples"));
} else {
return null;
}
});
surfaceappliance.clock.init_camera_BANG_ = (function surfaceappliance$clock$init_camera_BANG_(){
if(cljs.core.not((function (){var and__5140__auto__ = navigator.mediaDevices;
if(cljs.core.truth_(and__5140__auto__)){
return navigator.mediaDevices.getUserMedia;
} else {
return and__5140__auto__;
}
})())){
return surfaceappliance.clock.set_text_BANG_("graph-readout","camera unavailable");
} else {
return navigator.mediaDevices.getUserMedia(({"video": ({"width": ({"ideal": (320)}), "height": ({"ideal": (240)})}), "audio": false})).then((function (stream){
var video = surfaceappliance.clock.by_id("cam");
(video.srcObject = stream);

return (video.onloadedmetadata = (function (){
cljs.core.reset_BANG_(surfaceappliance.clock.camera_ready_QMARK_,true);

return surfaceappliance.clock.set_text_BANG_("graph-readout","collecting light");
}));
})).catch((function (_){
cljs.core.reset_BANG_(surfaceappliance.clock.camera_ready_QMARK_,false);

return surfaceappliance.clock.set_text_BANG_("graph-readout","camera unavailable");
}));
}
});
surfaceappliance.clock.sample_light_BANG_ = (function surfaceappliance$clock$sample_light_BANG_(){
if(cljs.core.truth_(cljs.core.deref(surfaceappliance.clock.camera_ready_QMARK_))){
var video = surfaceappliance.clock.by_id("cam");
var canvas = surfaceappliance.clock.by_id("cam-canvas");
var ctx = canvas.getContext("2d",({"willReadFrequently": true}));
if((video.readyState >= (2))){
ctx.drawImage(video,(0),(0),canvas.width,canvas.height);

var pixels = ctx.getImageData((0),(0),canvas.width,canvas.height).data;
var len = pixels.length;
var pixel_count = (len / (4));
var sum = (function (){var i = (0);
var acc = (0);
while(true){
if((i >= len)){
return acc;
} else {
var r = (pixels[i]);
var g = (pixels[(i + (1))]);
var b = (pixels[(i + (2))]);
var G__7725 = (i + (4));
var G__7726 = (((acc + (0.2126 * r)) + (0.7152 * g)) + (0.0722 * b));
i = G__7725;
acc = G__7726;
continue;
}
break;
}
})();
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(surfaceappliance.clock.light_history,(function (xs){
var next_xs = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(xs,(sum / pixel_count));
if((cljs.core.count(next_xs) > (120))){
return cljs.core.vec(cljs.core.rest(next_xs));
} else {
return next_xs;
}
}));

return surfaceappliance.clock.render_light_graph_BANG_();
} else {
return null;
}
} else {
return null;
}
});
surfaceappliance.clock.update_weather_BANG_ = (function surfaceappliance$clock$update_weather_BANG_(){
return fetch(surfaceappliance.clock.weather_url).then((function (p1__7671_SHARP_){
return p1__7671_SHARP_.json();
})).then((function (data){
var current = data.current;
var temp = Math.round(current.temperature_2m);
var weather_code = current.weather_code;
var desc = cljs.core.get.cljs$core$IFn$_invoke$arity$3(surfaceappliance.clock.code_map,weather_code,"Weather");
var wind_speed = Math.round(current.wind_speed_10m);
var wind_dir = Math.round(current.wind_direction_10m);
surfaceappliance.clock.set_text_BANG_("weather",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(temp)+"\u00B0F \u00B7 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(desc)));

surfaceappliance.clock.set_text_BANG_("wind-speed",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(wind_speed)+" mph"));

surfaceappliance.clock.set_text_BANG_("wind-dir",surfaceappliance.clock.compass_label(wind_dir));

return (surfaceappliance.clock.by_id("needle").style.transform = (""+"rotate("+cljs.core.str.cljs$core$IFn$_invoke$arity$1((wind_dir - (270)))+"deg)"));
})).catch((function (_){
surfaceappliance.clock.set_text_BANG_("weather","weather unavailable");

surfaceappliance.clock.set_text_BANG_("wind-speed","-- mph");

return surfaceappliance.clock.set_text_BANG_("wind-dir","---");
}));
});
surfaceappliance.clock.init_BANG_ = (function surfaceappliance$clock$init_BANG_(){
surfaceappliance.clock.update_time_BANG_();

surfaceappliance.clock.update_weather_BANG_();

surfaceappliance.clock.init_camera_BANG_();

setInterval(surfaceappliance.clock.update_time_BANG_,(1000));

setInterval(surfaceappliance.clock.update_weather_BANG_,(60000));

return setInterval(surfaceappliance.clock.sample_light_BANG_,(2000));
});
goog.exportSymbol('surfaceappliance.clock.init_BANG_', surfaceappliance.clock.init_BANG_);
surfaceappliance.clock.init_BANG_();

//# sourceMappingURL=surfaceappliance.clock.js.map
