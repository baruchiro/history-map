/* History map list analytics. POST /list-view {"list":"<catalog key>"} adds 1 to a per-day counter.
   Stored: UTC day, list key, count. Nothing else: no IP, headers, cookies, user agent or identifiers are read or stored.
   Only keys in allowed-lists.json (generated from the catalog) are accepted; everything else is rejected. */
import allowed from '../allowed-lists.json' with {type:'json'};
const ORIGINS=['https://history.baruchiro.com','https://baruchiro.github.io'];
const KEYS=new Set(allowed.lists);
function cors(origin){
 const ok=ORIGINS.includes(origin);
 return ok?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400',Vary:'Origin'}:{};
}
const reply=(status,origin,body=null)=>new Response(body,{status,headers:{...cors(origin),'Cache-Control':'no-store'}});
export default {
 async fetch(req,env){
  const origin=req.headers.get('Origin')||'';const url=new URL(req.url);
  if(url.pathname!=='/list-view')return reply(404,origin);
  if(req.method==='OPTIONS')return ORIGINS.includes(origin)?reply(204,origin):reply(403,origin);
  if(req.method!=='POST')return reply(405,origin);
  if(!ORIGINS.includes(origin))return reply(403,origin);
  let list;
  try{const text=await req.text();if(text.length>200)return reply(413,origin);list=JSON.parse(text)?.list;}catch{return reply(400,origin);}
  if(typeof list!=='string'||!KEYS.has(list))return reply(400,origin);
  const day=new Date().toISOString().slice(0,10);
  await env.DB.prepare('INSERT INTO list_views (day,list,count) VALUES (?1,?2,1) ON CONFLICT(day,list) DO UPDATE SET count=count+1').bind(day,list).run();
  return reply(204,origin);
 }
};
