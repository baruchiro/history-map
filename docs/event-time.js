/* Point-event dates, not lifetimes or continuous institutional activity. */
(function(root){
'use strict';
function includes(eventYear,year,range){return range?Math.abs(eventYear-year)<=25:eventYear<=year;}
function describe(year,range,format){return (range?'אירועים מ־'+format(year-25)+' עד '+format(year+25):'אירועים שהתרחשו עד '+format(year))+' · לא תקופות חיים';}
const api={includes,describe};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HistoryEventTime=api;
})(typeof globalThis!=='undefined'?globalThis:this);
