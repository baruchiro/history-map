/* Point events happen in one year; span records (endYear) stay active from their first year through their last. */
(function(root){
'use strict';
const MAX_WINDOW=25;
function endOf(event){return event.endYear!==undefined?event.endYear:event.year;}
function isSpan(event){return endOf(event)!==event.year;}
/* Nearby-year context scales with the visible timeline span: a short timeline shows a point event only in its own year, while a many-centuries one keeps the original ±25-year context. */
function windowFor(span){return Number.isFinite(span)&&span>0?Math.min(MAX_WINDOW,Math.round(span/50)):0;}
function includes(event,year,range,window){
 const w=window===undefined?MAX_WINDOW:window;
 if(isSpan(event))return range?event.year<=year&&year<=endOf(event):event.year<=year;
 return range?Math.abs(event.year-year)<=w:event.year<=year;
}
function distance(event,year){
 if(year<event.year)return event.year-year;
 const end=endOf(event);
 return year>end?year-end:0;
}
function label(event,format){return isSpan(event)?format(event.year)+' עד '+format(endOf(event)):format(event.year);}
function describe(year,range,format,window){
 const w=window===undefined?MAX_WINDOW:window;
 return (range?(w?'אירועים מ־'+format(year-w)+' עד '+format(year+w):'אירועים בשנת '+format(year)):'אירועים שהתרחשו עד '+format(year))
  +(range?' · רשומות טווח נראות בכל שנות הטווח':' · רשומות טווח נראות משנת התחילתן');
}
const api={includes,describe,label,distance,endOf,isSpan,windowFor};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HistoryEventTime=api;
})(typeof globalThis!=='undefined'?globalThis:this);
