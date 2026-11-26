const test=require('node:test'),assert=require('node:assert/strict');
const ex=require('../docs/export.js'),time=require('../docs/event-time.js');
const measure=(s,px)=>s.length*px*.55;
const ev=(id,year,month,lon,lat,shape='circle',color='#a33')=>({id,year,month,title:'אירוע '+id,place:'מקום',text:'תיאור של האירוע '+id+' עם כמה מילים כדי לבדוק גלישת שורות בתמונה המיוצאת',lat,lon,shape,color});
const events=[ev('c',1933,3,13.4,52.5),ev('a',1933,1,13.4,52.5),ev('b',1933,2,11.4,48.2,'square','#36a'),{...ev('d',1933,undefined,12.4,41.9),title:'A & B <x> "q"'}];
const st=(extra={})=>({events,lists:[{title:'רשימה א',color:'#a33',shape:'circle'},{title:'רשימה ב',color:'#36a',shape:'square'}],viewBox:[330,40,120,67],land:['M0 0L10 10Z'],visibleIds:new Set(['c','b']),
 timeLabel:'מרץ 1933',title:'',measure,monthMode:true,formatYear:String,formatMonth:i=>time.formatMonth(i,String),label:e=>time.label(e,String),startIndex:time.startIndex,endIndex:time.endIndex,...extra});
for(const kind of ['timeline','map','both']){
 test('export '+kind+': well-formed svg, escaped text, sane size',()=>{
  const o=ex.build(kind,st({visibleIds:new Set(['c','b','d'])}));
  assert.ok(o.svg.startsWith('<svg')&&o.svg.endsWith('</svg>'));assert.equal(o.width,1080);assert.ok(o.height>300&&o.height<20000);
  assert.ok(!/undefined|NaN/.test(o.svg),'no undefined or NaN');
  assert.ok(!o.svg.includes('<x>')&&!o.svg.includes('A & B'),'text is escaped');
  assert.ok(o.svg.includes('A &amp; B &lt;x&gt;'));
 });
}
test('timeline mixes lists chronologically',()=>{
 const o=ex.build('timeline',st()).svg;const order=['אירוע a','אירוע b','אירוע c'].map(t=>o.indexOf(t));
 assert.ok(order[0]<order[1]&&order[1]<order[2]);
 assert.ok(o.indexOf('ינואר 1933')<o.indexOf('פברואר 1933'));
});
test('map at a moment shows only visible events, numbered from 1',()=>{
 const o=ex.build('map',st()).svg;assert.ok(o.includes('אירוע b')&&o.includes('אירוע c'));assert.ok(!o.includes('אירוע a'));
 assert.ok(!o.includes('>3<'),'two visible events are numbered 1 and 2');
});
test('map with timeline includes every event and a fitted view',()=>{
 const o=ex.build('both',st()).svg;for(const t of ['אירוע a','אירוע b','אירוע c'])assert.ok(o.includes(t));
 const v=ex.fitView(events);assert.equal(v[2]/v[3],2);assert.ok(v[0]>=0&&v[0]+v[2]<=720&&v[1]>=0&&v[1]+v[3]<=360);
 const x=(13.4+180)*2;assert.ok(v[0]<=x&&x<=v[0]+v[2]);
});
test('wrap and fit respect width and line cap',()=>{
 const lines=ex.wrap('מילה '.repeat(40),200,16,measure,3);assert.equal(lines.length,3);assert.ok(lines[2].endsWith('…'));
 assert.ok(ex.fit('x'.repeat(100),100,16,measure).endsWith('…'));assert.equal(ex.fit('קצר',100,16,measure),'קצר');
});
