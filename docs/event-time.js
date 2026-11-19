/* Point events happen in one year; span records (endYear) stay active from their first year through their last. */
(function(root){
'use strict';
const WINDOW=25;
function endOf(event){return event.endYear!==undefined?event.endYear:event.year;}
function isSpan(event){return endOf(event)!==event.year;}
function includes(event,year,range){
 if(isSpan(event))return range?event.year<=year&&year<=endOf(event):event.year<=year;
 return range?Math.abs(event.year-year)<=WINDOW:event.year<=year;
}
function distance(event,year){
 if(year<event.year)return event.year-year;
 const end=endOf(event);
 return year>end?year-end:0;
}
function label(event,format){return isSpan(event)?format(event.year)+' עד '+format(endOf(event)):format(event.year);}
function describe(year,range,format){
 return (range?'אירועים מ־'+format(year-WINDOW)+' עד '+format(year+WINDOW):'אירועים שהתרחשו עד '+format(year))
  +(range?' · רשומות טווח נראות בכל שנות הטווח':' · רשומות טווח נראות משנת התחילתן');
}
const api={includes,describe,label,distance,endOf,isSpan};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HistoryEventTime=api;
})(typeof globalThis!=='undefined'?globalThis:this);
