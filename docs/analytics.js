/* Coarse activity with allowlisted publication attribution. No SDK, cookies, stable IDs or automatic capture. */
(function(root){
'use strict';
const STORE='history-map.analytics.exclude.v1';
const EVENTS=Object.freeze(['app_open','map_interaction','event_open','timeline_event','collection_change','share_open','share_copy']);
// Publication IDs identify posts, never visitors. All transmitted values are constants.
const CAMPAIGN='history-map-first-look-202611';
const PUBLICATIONS=Object.freeze({
 'wa-channel-01':['whatsapp','owned-channel'], 'wa-status-01':['whatsapp','status'],
 'linkedin-01':['linkedin','social'], 'fb-page-01':['facebook','social'],
 'x-01':['x','social'], 'bluesky-01':['bluesky','social'],
 'mastodon-01':['mastodon','social'], 'instagram-01':['instagram','social'],
 'threads-01':['threads','social'], 'hemed-idea-01':['teacher-community','editorial-submission']
});
function attribution(href){
 try{
  const p=new URL(href).searchParams;
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content'])if(p.getAll(key).length!==1)return {};
  const publication=p.get('utm_content'),entry=Object.hasOwn(PUBLICATIONS,publication)?PUBLICATIONS[publication]:null;
  if(!entry||p.get('utm_campaign')!==CAMPAIGN||p.get('utm_source')!==entry[0]||p.get('utm_medium')!==entry[1])return {};
  return {attribution_source:entry[0],attribution_medium:entry[1],attribution_campaign:CAMPAIGN,attribution_publication:publication};
 }catch{return {};}
}
function make(env,config={}){
 const sent=new Set();let id=null;
 const labels=attribution(env.location.href);
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
  const payload={api_key:config.token,event:'history_map_'+name,distinct_id:id,properties:{app:'history-map',schema_version:1,$process_person_profile:false,...labels}};
  try{const p=env.fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',keepalive:true});p.catch(()=>{});return true;}catch{return false;}
 }
 return {bootstrap,record,reason,setExcluded};
}
if(typeof module!=='undefined'&&module.exports)module.exports={make,STORE,EVENTS,attribution,PUBLICATIONS,CAMPAIGN};else root.HistoryAnalytics={make};
})(typeof globalThis!=='undefined'?globalThis:this);
