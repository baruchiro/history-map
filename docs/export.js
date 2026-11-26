/* Image export: builds a standalone SVG from the selected lists and the current view. No network, no personal data, no analytics.
   kinds: 'timeline' (lists mixed by time), 'map' (map at the current moment), 'both' (map with all events, timeline below). */
(function(root){
'use strict';
const W=1080,PAD=36,FONT="'Noto Sans Hebrew',Arial,sans-serif",INK='#29251E',MUTED='#6E665A',PAPER='#FAF8F2',SEA='#F1ECDD',LAND='#D9D4C2',LINE='#B9B09B';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>Math.round(n*100)/100;
/* Greedy word wrap with an injected text measure, so tests can run without a canvas. */
function wrap(text,maxPx,px,measure,maxLines){
 const words=String(text).split(/\s+/).filter(Boolean),lines=[];let cur='';
 for(const w of words){const next=cur?cur+' '+w:w;if(cur&&measure(next,px)>maxPx){lines.push(cur);cur=w;}else cur=next;}
 if(cur)lines.push(cur);
 if(maxLines&&lines.length>maxLines){const cut=lines.slice(0,maxLines);cut[maxLines-1]=cut[maxLines-1].replace(/[\s,.;:]*$/,'')+'…';return cut;}
 return lines;
}
function fit(text,maxPx,px,measure){
 let t=String(text);if(measure(t,px)<=maxPx)return t;
 while(t.length>1&&measure(t+'…',px)>maxPx)t=t.slice(0,-1);return t.trimEnd()+'…';
}
/* anchor is physical: 'end' = right-aligned at x, 'start' = left-aligned at x. With direction=rtl SVG's own start/end are logical, so they swap. */
function text(x,y,s,{size=18,weight=400,fill=INK,anchor='end'}={}){
 const a=anchor==='end'?'start':anchor==='start'?'end':'middle';
 return `<text x="${num(x)}" y="${num(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${a}" direction="rtl" unicode-bidi="plaintext">${esc(s)}</text>`;
}
function mark(shape,x,y,r,color,extra=''){
 return shape==='square'?`<rect x="${num(x-r)}" y="${num(y-r)}" width="${num(2*r)}" height="${num(2*r)}" fill="${color}" ${extra}/>`:`<circle cx="${num(x)}" cy="${num(y)}" r="${num(r)}" fill="${color}" ${extra}/>`;
}
function frame(h,body,defs=''){
 return {width:W,height:Math.ceil(h),svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Math.ceil(h)}" viewBox="0 0 ${W} ${Math.ceil(h)}" font-family="${FONT}"><rect width="${W}" height="${Math.ceil(h)}" fill="${PAPER}"/>${defs}${body}</svg>`};
}
function legend(lists,y,measure){
 let out='',cy=y;
 lists.forEach(l=>{out+=mark(l.shape,W-PAD-8,cy-6,7,l.color)+text(W-PAD-24,cy,fit(l.title,W-2*PAD-30,18,measure),{size:18});cy+=28;});
 return {out,y:cy};
}
const footer=(y)=>text(W-PAD,y,'history.baruchiro.com',{size:14,fill:MUTED})+text(PAD,y,'המפה של ברוך',{size:14,fill:MUTED,anchor:'start'});
/* Chronological numbering shared by map pins, the timeline axis and the key. */
function ordered(events,S){return [...events].sort((a,b)=>S(a)-S(b)||String(a.id).localeCompare(String(b.id)));}
function keyList(items,y,label,measure,cols){
 let out='';const colW=(W-2*PAD)/cols,per=Math.ceil(items.length/cols),rowH=cols>1?24:28;
 items.forEach((it,i)=>{const c=Math.floor(i/per),r=i%per,x=W-PAD-c*colW,yy=y+r*rowH;
  out+=mark(it.e.shape,x-9,yy-6,9,it.e.color)+text(x-9,yy-2,String(it.n),{size:11,weight:700,fill:'#fff',anchor:'middle'});
  out+=text(x-26,yy,fit(label(it.e)+' · '+it.e.title,colW-40,cols>1?15:17,measure),{size:cols>1?15:17});});
 return {out,y:y+Math.ceil(items.length/cols)*rowH};
}
function mapPart(st,items,y,showTime){
 const vb=st.viewBox,h=Math.round(W*vb[3]/vb[2]),k=W/vb[2];
 let g=`<svg x="0" y="${num(y)}" width="${W}" height="${h}" viewBox="${vb.join(' ')}" overflow="hidden"><rect x="0" y="0" width="720" height="360" fill="${SEA}"/>`;
 g+=`<g fill="${LAND}" stroke="${LINE}" stroke-width="${num(.6/k)}">${st.land.map(d=>`<path d="${esc(d)}"/>`).join('')}</g>`;
 for(const it of items){const e=it.e,px=(e.lon+180)*2,py=(90-e.lat)*2,r=9/k;
  g+=mark(e.shape,px,py,r,e.color,`stroke="#fff" stroke-width="${num(1.5/k)}"`);
  g+=`<text x="${num(px)}" y="${num(py+3.8/k)}" font-size="${num(11/k)}" font-weight="700" fill="#fff" text-anchor="middle">${it.n}</text>`;}
 g+='</svg>';
 return {out:g,y:y+h};
}
function buildTimeline(st){
 const {measure,label}=st,S=st.startIndex,items=ordered(st.events,S);
 let body='',y=64;
 body+=text(W-PAD,y,st.title||'ציר זמן',{size:30,weight:700});y+=34;
 const lg=legend(st.lists,y,measure);body+=lg.out;y=lg.y+14;
 const lineX=W-PAD-150,textR=lineX-26,textW=textR-PAD-6,start=y;let rows='';
 for(const e of items){
  const t=wrap(e.text||'',textW,16,measure,2),place=fit(e.place||'',textW,15,measure);
  const rowH=34+22+(t.length?t.length*21+4:0)+20;
  rows+=mark(e.shape,lineX,y+10,8,e.color,'stroke="#fff" stroke-width="2"');
  rows+=text(lineX+20,y+16,label(e),{size:19,weight:700,fill:e.color,anchor:'start'});
  rows+=text(textR,y+16,fit(e.title,textW,21,measure),{size:21,weight:700});
  rows+=text(textR,y+38,place,{size:15,fill:MUTED});
  t.forEach((ln,i)=>{rows+=text(textR,y+60+i*21,ln,{size:16});});
  y+=rowH;
 }
 body+=`<line x1="${lineX}" y1="${start}" x2="${lineX}" y2="${y-14}" stroke="${LINE}" stroke-width="3"/>`+rows;
 y+=10;body+=footer(y);
 return frame(y+24,body);
}
/* A 2:1 view box around every event, with margin, inside the 720x360 world. */
function fitView(events){
 const xs=events.map(e=>(e.lon+180)*2),ys=events.map(e=>(90-e.lat)*2),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 const w=Math.min(720,Math.max((x1-x0)*1.35,(y1-y0)*1.35*2,60)),h=w/2,cx=(x0+x1)/2,cy=(y0+y1)/2;
 return [Math.max(0,Math.min(720-w,cx-w/2)),Math.max(0,Math.min(360-h,cy-h/2)),w,h].map(n=>Math.round(n*1000)/1000);
}
function buildMap(st,withTimeline){
 const {measure,label}=st,S=st.startIndex,E=st.endIndex,all=ordered(st.events,S).map((e,i)=>({e,n:i+1}));
 const shown=withTimeline?all:ordered(st.events.filter(e=>st.visibleIds.has(e.id)),S).map((e,i)=>({e,n:i+1}));
 if(withTimeline)st={...st,viewBox:fitView(st.events)};
 let body='',y=64;
 body+=text(W-PAD,y,withTimeline?(st.title||'מפה וציר זמן'):st.timeLabel,{size:34,weight:700});y+=30;
 const lg=legend(st.lists,y,measure);body+=lg.out;y=lg.y+4;
 const m=mapPart(st,shown,y);body+=m.out;y=m.y+30;
 if(withTimeline){
  const lo=Math.min(...all.map(it=>S(it.e))),hi=Math.max(...all.map(it=>E(it.e))),monthly=st.monthMode,span=Math.max(1,hi-lo),x0=PAD+14,x1=W-PAD-14;
  const pos=i=>x1-(i-lo)/span*(x1-x0),axisY=y+60;
  body+=`<line x1="${x0}" y1="${axisY}" x2="${x1}" y2="${axisY}" stroke="${LINE}" stroke-width="3"/>`;
  const unit=monthly?1:12,labelCount=Math.max(2,Math.floor((x1-x0)/90)),stepUnits=[1,2,5,10,20,25,50,100,200,500,1000].find(s=>Math.ceil(span/unit/s)<=labelCount)||2000;
  const tickStep=(monthly?(Math.ceil(span/labelCount)):stepUnits*12);
  for(let i=Math.ceil(lo/tickStep)*tickStep;i<=hi;i+=tickStep){const x=pos(i);body+=`<line x1="${num(x)}" y1="${axisY}" x2="${num(x)}" y2="${axisY+8}" stroke="${LINE}"/>`+text(x,axisY+26,monthly?st.formatMonth(i):st.formatYear(Math.floor(i/12)),{size:13,fill:MUTED,anchor:'middle'});}
  const lanes=[];
  for(const it of all){const x=pos(S(it.e));let l=lanes.findIndex(p=>Math.abs(p-x)>=20);if(l<0){l=lanes.length<4?lanes.length:0;}lanes[l]=x;
   const cy=axisY-18-l*22;body+=`<line x1="${num(x)}" y1="${cy}" x2="${num(x)}" y2="${axisY}" stroke="${it.e.color}" stroke-opacity=".5"/>`+mark(it.e.shape,x,cy,9,it.e.color,'stroke="#fff" stroke-width="1.5"')+text(x,cy+4,String(it.n),{size:11,weight:700,fill:'#fff',anchor:'middle'});}
  y=axisY+56;
  const k=keyList(all,y,label,measure,2);body+=k.out;y=k.y;
 }else{
  const k=keyList(shown,y,label,measure,1);body+=k.out;y=k.y;
  if(!shown.length)body+=text(W-PAD,y,'אין אירועים ברגע הזה',{size:17,fill:MUTED}),y+=28;
 }
 y+=8;body+=footer(y);
 return frame(y+24,body);
}
function build(kind,st){
 if(kind==='timeline')return buildTimeline(st);
 if(kind==='map')return buildMap(st,false);
 if(kind==='both')return buildMap(st,true);
 throw new Error('unknown export kind');
}
const api={build,wrap,fit,fitView,W};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HistoryExport=api;
})(typeof globalThis!=='undefined'?globalThis:this);
