/* Private preparation. Not deployed. No SDK, cookies, stable IDs, or automatic capture. */
(function(root){
'use strict';
const STORE='history-map.analytics.exclude.v1';
const EVENTS=Object.freeze(['app_open','map_interaction','event_open','timeline_event','collection_change','share_open','share_copy']);
function make(env,config={}){
 const sent=new Set();let id=null;
 function readExcluded(){return env.localStorage.getItem(STORE)==='1';}
 function reason(){
  if(config.enabled!==true)return 'disabled';
  const isProjectSite=env.location.origin==='https://baruchiro.github.io'&&env.location.pathname.startsWith('/history-map/');
  const isCustomSite=env.location.origin==='https://history.baruchiro.com'&&env.location.pathname==='/';
  if(!isProjectSite&&!isCustomSite)return 'non-production';
  if(env.navigator.webdriver)return 'automation';
  if(env.navigator.globalPrivacyControl===true||env.navigator.doNotTrack==='1'||env.doNotTrack==='1')return 'privacy-preference';
  try{if(readExcluded())return 'internal-browser';}catch{return 'storage-unavailable';}
  if(new URL(env.location.href).searchParams.get('analytics')==='off')return 'internal-link';
  if(!/^phc_[A-Za-z0-9]+$/.test(config.token||''))return 'invalid-project-token';
  if(config.endpoint!=='https://us.i.posthog.com/i/v0/e/')return 'invalid-endpoint';
  if(!env.crypto?.randomUUID)return 'randomness-unavailable';
  return '';
 }
 function setExcluded(value){try{env.localStorage.setItem(STORE,value?'1':'0');return true;}catch{return false;}}
 function bootstrap(){
  const u=new URL(env.location.href);
  if(u.searchParams.get('analytics')==='off'){
   // Leave the URL marker intact if persistence fails, so it still prevents capture.
   if(setExcluded(true)){u.searchParams.delete('analytics');env.history.replaceState(null,'',u.href);}
  }
  return record('app_open');
 }
 function record(name){
  if(reason()||!EVENTS.includes(name)||sent.has(name))return false;
  id=id||env.crypto.randomUUID();sent.add(name);
  // All properties are fixed. No arbitrary properties or DOM values are accepted.
  const payload={api_key:config.token,event:'history_map_'+name,distinct_id:id,properties:{app:'history-map',schema_version:1,$process_person_profile:false}};
  try{const p=env.fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',keepalive:true});p.catch(()=>{});return true;}catch{return false;}
 }
 return {bootstrap,record,reason,setExcluded};
}
if(typeof module!=='undefined'&&module.exports)module.exports={make,STORE,EVENTS};else root.HistoryAnalytics={make};
})(typeof globalThis!=='undefined'?globalThis:this);
