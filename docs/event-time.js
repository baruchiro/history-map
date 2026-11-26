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
const MONTHS=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const MAX_MONTH_SPAN_YEARS=3;
/* Optional month (1-12) refines a point event or a span's first year. Month index = year*12+month-1, valid for common-era years only. */
function startIndex(e){return e.year*12+(e.month?e.month-1:0);}
function endIndex(e){return e.endYear!==undefined?e.endYear*12+11:e.month?startIndex(e):e.year*12+11;}
function includesMonth(e,idx,range){return range?startIndex(e)<=idx&&idx<=endIndex(e):startIndex(e)<=idx;}
function monthName(m){return MONTHS[m-1];}
function formatMonth(idx,format){return MONTHS[((idx%12)+12)%12]+' '+format(Math.floor(idx/12));}
/* Month mode: some event has a month, all years are common era, and the whole timeline spans at most 3 years. Wide timelines stay in years. */
function monthMode(events){
 if(!events.length||!events.some(e=>e.month))return false;
 if(events.some(e=>e.year<1))return false;
 const lo=Math.min(...events.map(startIndex)),hi=Math.max(...events.map(endIndex));
 return hi-lo<=MAX_MONTH_SPAN_YEARS*12;
}
function label(event,format){const f=y=>format(y),first=event.month?monthName(event.month)+' '+f(event.year):f(event.year);return isSpan(event)?first+' עד '+f(endOf(event)):first;}
function describe(year,range,format,window){
 const w=window===undefined?MAX_WINDOW:window;
 return (range?(w?'אירועים מ־'+format(year-w)+' עד '+format(year+w):'אירועים בשנת '+format(year)):'אירועים שהתרחשו עד '+format(year))
  +(range?' · רשומות טווח נראות בכל שנות הטווח':' · רשומות טווח נראות משנת התחילתן');
}
const api={includes,describe,label,distance,endOf,isSpan,windowFor,startIndex,endIndex,includesMonth,monthName,formatMonth,monthMode,MONTHS};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HistoryEventTime=api;
})(typeof globalThis!=='undefined'?globalThis:this);
