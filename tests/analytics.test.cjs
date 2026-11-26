const {test}=require('node:test'),a=require('node:assert/strict');const {make,STORE,EVENTS}=require('../docs/analytics');
function ctx(url='https://baruchiro.github.io/history-map/#q=PRIVATE&event=PRIVATE',cfg={}){const values=new Map(),requests=[];const env={location:new URL(url),navigator:{},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},history:{replaceState:(_,__,u)=>env.location=new URL(u)},crypto:{randomUUID:()=> '00000000-0000-4000-8000-000000000001'},fetch:(u,o)=>{requests.push({url:u,options:o,body:JSON.parse(o.body)});return Promise.resolve({ok:true})}};const config={enabled:true,privacyVerified:true,token:'phc_TESTONLY',endpoint:'https://us.i.posthog.com/i/v0/e/',...cfg};return {env,config,values,requests,client:make(env,config)};}
test('off by default blocks every request',()=>{const c=ctx(undefined,{enabled:false});a.equal(c.client.bootstrap(),false);a.equal(c.requests.length,0)});
for(const [name,url,nav] of [['localhost','http://localhost:9000/',{}],['preview','https://preview.invalid/history-map/',{}],['other repository','https://baruchiro.github.io/other/',{}],['custom hostname over HTTP','http://history.baruchiro.com/',{}],['unrelated custom-host path','https://history.baruchiro.com/other/',{}],['automation',undefined,{webdriver:true}],['DNT',undefined,{doNotTrack:'1'}],['GPC',undefined,{globalPrivacyControl:true}]])test('zero requests '+name,()=>{const c=ctx(url);Object.assign(c.env.navigator,nav);a.equal(c.client.bootstrap(),false);a.equal(c.requests.length,0)});
test('internal exclusion persists before first event and preserves shared map hash',()=>{const c=ctx('https://baruchiro.github.io/history-map/?analytics=off#q=PRIVATE');a.equal(c.client.bootstrap(),false);a.equal(c.values.get(STORE),'1');a.equal(c.env.location.hash,'#q=PRIVATE');a.equal(c.env.location.search,'');a.equal(c.requests.length,0);c.client.setExcluded(false);a.equal(c.client.reason(),'')});
test('storage failure fails closed',()=>{const c=ctx();c.env.localStorage.getItem=()=>{throw Error()};a.equal(c.client.bootstrap(),false);a.equal(c.requests.length,0)});
test('allowlist and per-page event cap, fixed properties, no URL/referrer/content',()=>{for(const url of ['https://baruchiro.github.io/history-map/#q=PRIVATE','https://history.baruchiro.com/?utm_source=PRIVATE#q=PRIVATE']){const c=ctx(url);c.client.bootstrap();for(const e of EVENTS){c.client.record(e);a.equal(c.client.record(e),false)}a.equal(c.client.record('PRIVATE'),false);a.equal(c.requests.length,EVENTS.length);a.equal(c.client.record('event_open',{title:'PRIVATE'}),false);for(const r of c.requests){a.deepEqual(Object.keys(r.body).sort(),['api_key','distinct_id','event','properties']);a.deepEqual(r.body.properties,{app:'history-map',schema_version:1,$process_person_profile:false});a.equal(r.options.credentials,'omit');a.equal(r.options.referrerPolicy,'no-referrer');a.ok(!JSON.stringify(r).includes('PRIVATE'))}c.client.setExcluded(true);a.equal(c.client.record('event_open'),false)}});
test('no persistent identity or cookies',()=>{const c=ctx();c.client.bootstrap();a.equal(c.values.size,0);a.equal(c.env.document,undefined)});
test('read key rejected in capture config and arbitrary destinations rejected',()=>{for(const cfg of [{token:'phx_NEVERFRONTEND'},{endpoint:'https://unapproved.invalid/'}]){const c=ctx(undefined,cfg);a.equal(c.client.bootstrap(),false);a.equal(c.requests.length,0)}});
test('failed network is not retried or fatal',()=>{const c=ctx();c.env.fetch=()=>Promise.reject(Error());a.equal(c.client.bootstrap(),true);a.equal(c.client.bootstrap(),false)});

test('device class is coarse, fixed-vocabulary and omitted when unknown',()=>{
 const {deviceClass}=require('../docs/analytics');
 const mm=coarse=>q=>({matches:q==='(pointer: coarse)'?coarse:false});
 a.deepEqual(deviceClass({}),{});
 a.deepEqual(deviceClass({matchMedia:mm(false),screen:{width:1920,height:1080}}),{device_class:'desktop'});
 a.deepEqual(deviceClass({matchMedia:mm(true),screen:{width:390,height:844}}),{device_class:'phone'});
 a.deepEqual(deviceClass({matchMedia:mm(true),screen:{width:820,height:1180}}),{device_class:'tablet'});
 a.deepEqual(deviceClass({matchMedia:()=>{throw Error()}}),{});
 for(const [coarse,screen,want] of [[true,{width:390,height:844},'phone'],[false,{width:1280,height:800},'desktop']]){
  const c=ctx();c.env.matchMedia=mm(coarse);c.env.screen=screen;const client=make(c.env,c.config);client.bootstrap();
  a.deepEqual(c.requests[0].body.properties,{app:'history-map',schema_version:1,$process_person_profile:false,device_class:want});
  a.ok(!JSON.stringify(c.requests[0]).includes('844'));
 }
});
