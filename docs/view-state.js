/* Public map view state only. No credentials, personal libraries or external URL targets. */
(function(root){
'use strict';
const slug=/^[a-z0-9][a-z0-9-]{0,79}$/;
function number(s){return typeof s==='string'&&s.trim()!==''?Number(s):NaN;}
function decode(hash,keys=[]){const p=new URLSearchParams(String(hash).replace(/^#/,'')),s={};if(p.get('v')!=='1')return s;
 const y=number(p.get('y'));if(Number.isInteger(y)&&y!==0&&y>=-3400&&y<=2024)s.year=y;
 for(const k of ['a','b']){const v=p.get(k);if(v&&slug.test(v)&&keys.includes(v))s[k]=v;}
 if(p.has('lists'))s.lists=[...new Set(p.get('lists').split(',').filter(k=>slug.test(k)&&keys.includes(k)))];
 if(['range','all'].includes(p.get('mode')))s.range=p.get('mode')==='range';
 if(['0','1'].includes(p.get('borders')))s.borders=p.get('borders')==='1';
 const q=p.get('q');if(q!==null&&q.length<=120)s.search=q;
 const m=(p.get('map')||'').split(',').map(number);if(m.length===4&&m.every(Number.isFinite)&&m[2]>=90&&m[2]<=720&&m[3]>=45&&m[3]<=360&&m[0]>=0&&m[1]>=0&&m[0]+m[2]<=720.001&&m[1]+m[3]<=360.001)s.map=m;
 const event=p.get('event');if(event&&/^[a-zA-Z0-9_-]{1,160}$/.test(event))s.event=event;
 const territory=number(p.get('territory'));if(Number.isInteger(territory)&&territory>=0&&territory<20000)s.territory=territory;
 return s;}
function encode(s){const p=new URLSearchParams({v:'1',y:String(s.year),a:s.a,b:s.b,mode:s.range?'range':'all',borders:s.borders?'1':'0',map:s.map.map(x=>String(Number(x.toFixed(6)))).join(',')});if(Array.isArray(s.lists))p.set('lists',[...new Set(s.lists.filter(k=>slug.test(k)))].join(','));if(s.search)p.set('q',s.search.slice(0,120));if(s.event)p.set('event',s.event);if(Number.isInteger(s.territory))p.set('territory',String(s.territory));return '#'+p.toString();}
const api={decode,encode};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HistoryViewState=api;
})(typeof globalThis!=='undefined'?globalThis:this);
