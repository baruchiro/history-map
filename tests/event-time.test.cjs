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
