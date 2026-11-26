const test=require('node:test'),assert=require('node:assert/strict');
const time=require('../docs/event-time.js'),view=require('../docs/view-state.js');
const point=(year)=>({year}),span=(year,endYear)=>({year,endYear});
test('Rambam completion event does not persist at 1922 in nearby-year mode',()=>{
 assert.equal(time.includes(point(1180),1922,true),false);
 assert.equal(time.includes(point(1180),1180,true),true);
 assert.equal(time.includes(point(1180),1922,false),true);
});
test('default window includes 25 years either side, not arbitrary lifetimes',()=>{
 for(const y of [1155,1180,1205])assert.equal(time.includes(point(y),1180,true),true);
 for(const y of [1154,1206])assert.equal(time.includes(point(y),1180,true),false);
 assert.equal(time.includes(point(1181),1180,false),false);
});
test('window scales with the visible timeline span, capped at 25',()=>{
 assert.equal(time.windowFor(12),0);
 assert.equal(time.windowFor(21),0);
 assert.equal(time.windowFor(61),1);
 assert.equal(time.windowFor(240),5);
 assert.equal(time.windowFor(400),8);
 assert.equal(time.windowFor(1110),22);
 assert.equal(time.windowFor(2473),25);
 assert.equal(time.windowFor(5424),25);
 assert.equal(time.windowFor(100000),25);
 assert.equal(time.windowFor(0),0);
 assert.equal(time.windowFor(NaN),0);
});
test('a short timeline shows a point event only in its own year',()=>{
 const w=time.windowFor(12);
 assert.equal(time.includes(point(1935),1933,true,w),false);
 assert.equal(time.includes(point(1935),1935,true,w),true);
 assert.equal(time.includes(point(1933),1934,true,w),false);
});
test('span record stays visible through its whole range in nearby-year mode',()=>{
 const sura=span(225,1033);
 assert.equal(time.includes(sura,600,true),true);
 assert.equal(time.includes(sura,225,true),true);
 assert.equal(time.includes(sura,1033,true),true);
 assert.equal(time.includes(sura,224,true),false);
 assert.equal(time.includes(sura,1034,true),false);
});
test('span record is visible from its start year in cumulative mode',()=>{
 const sura=span(225,1033);
 assert.equal(time.includes(sura,1900,false),true);
 assert.equal(time.includes(sura,225,false),true);
 assert.equal(time.includes(sura,224,false),false);
});
test('a point event near a span start does not inherit the span',()=>{
 assert.equal(time.includes(point(225),600,true),false);
 assert.equal(time.includes(point(225),600,false),true);
});
test('span distance is zero anywhere inside the range',()=>{
 const sura=span(225,1033);
 assert.equal(time.distance(sura,600),0);
 assert.equal(time.distance(sura,100),125);
 assert.equal(time.distance(sura,1100),67);
 assert.equal(time.distance(point(1180),1180),0);
});
test('labels show the span or the single year',()=>{
 assert.equal(time.label(span(225,1033),String),'225 עד 1033');
 assert.equal(time.label(point(1180),String),'1180');
 assert.equal(time.label(point(-142),y=>y<0?Math.abs(y)+' לפנה״ס':String(y)),'142 לפנה״ס');
});
test('point-event and span meaning remain explicit in the description',()=>{
 assert.equal(time.describe(1922,true,String),'אירועים מ־1897 עד 1947 · רשומות טווח נראות בכל שנות הטווח');
 assert.equal(time.describe(1933,true,String,0),'אירועים בשנת 1933 · רשומות טווח נראות בכל שנות הטווח');
 assert.equal(time.describe(1922,false,String),'אירועים שהתרחשו עד 1922 · רשומות טווח נראות משנת התחילתן');
});
test('shared modes remain backward compatible, corrected view uses range',()=>{
 assert.equal(view.decode('#v=1&y=1922&mode=all').range,false);
 assert.equal(view.decode('#v=1&y=1922&mode=range').range,true);
});

test('month resolution: index, label and month mode',()=>{
 const m=(year,month,extra={})=>({year,month,...extra});
 assert.equal(time.startIndex(m(1933,3)),1933*12+2);
 assert.equal(time.startIndex({year:1933}),1933*12);
 assert.equal(time.endIndex({year:1933}),1933*12+11);
 assert.equal(time.endIndex(m(1933,3)),1933*12+2);
 assert.equal(time.endIndex(m(1933,3,{endYear:1934})),1934*12+11);
 assert.equal(time.label(m(1933,3),String),'מרץ 1933');
 assert.equal(time.label({year:1933},String),'1933');
 assert.equal(time.formatMonth(1933*12+0,String),'ינואר 1933');
 assert.equal(time.monthMode([m(1933,1),m(1933,12)]),true);
 assert.equal(time.monthMode([m(1933,1),{year:1933}]),true);
 assert.equal(time.monthMode([{year:1933},{year:1934}]),false,'no month, stays in years');
 assert.equal(time.monthMode([m(1933,1),m(1945,5)]),false,'wide span stays in years');
 assert.equal(time.monthMode([m(-44,3),m(-43,1)]),false,'BCE stays in years');
 assert.equal(time.monthMode([]),false);
});
test('month resolution: visibility by month, whole-year events show all year',()=>{
 const e=(year,month)=>({year,month});
 const idx=(y,mo)=>y*12+mo-1;
 assert.equal(time.includesMonth(e(1933,3),idx(1933,3),true),true);
 assert.equal(time.includesMonth(e(1933,3),idx(1933,4),true),false);
 assert.equal(time.includesMonth(e(1933,3),idx(1933,2),true),false);
 assert.equal(time.includesMonth(e(1933,3),idx(1933,4),false),true,'all-up-to-now mode');
 assert.equal(time.includesMonth({year:1933},idx(1933,9),true),true);
 assert.equal(time.includesMonth({year:1933},idx(1934,1),true),false);
 const span={year:1933,month:6,endYear:1934};
 assert.equal(time.includesMonth(span,idx(1933,5),true),false);
 assert.equal(time.includesMonth(span,idx(1933,6),true),true);
 assert.equal(time.includesMonth(span,idx(1934,12),true),true);
});
