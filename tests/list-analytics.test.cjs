const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('fs');
const {make,LIST_ENDPOINT}=require('../docs/analytics');
function ctx(url='https://history.baruchiro.com/',nav={}){const values=new Map(),requests=[];const env={location:new URL(url),navigator:nav,localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},history:{},crypto:{randomUUID:()=>'x'},fetch:(u,o)=>{requests.push({url:u,o});return Promise.resolve({ok:true});}};
 return {env,values,requests,client:make(env,{enabled:true,token:'phc_TESTONLY',endpoint:'https://us.i.posthog.com/i/v0/e/',list_endpoint:LIST_ENDPOINT})};}
test('list key goes only to the list endpoint, once, as a bare key',()=>{const c=ctx();a.equal(c.client.recordList('empress-elisabeth-sisi'),true);a.equal(c.client.recordList('empress-elisabeth-sisi'),false);a.equal(c.requests.length,1);a.equal(c.requests[0].url,LIST_ENDPOINT);a.deepEqual(JSON.parse(c.requests[0].o.body),{list:'empress-elisabeth-sisi'});a.equal(c.requests[0].o.credentials,'omit');a.equal(c.requests[0].o.referrerPolicy,'no-referrer');});
test('excluded, automation, DNT and bad keys send nothing',()=>{
 const x=ctx();x.env.localStorage.setItem('history-map.analytics.exclude.v1','1');a.equal(x.client.recordList('abc-def'),false);
 a.equal(ctx(undefined,{webdriver:true}).client.recordList('abc-def'),false);a.equal(ctx(undefined,{doNotTrack:'1'}).client.recordList('abc-def'),false);
 const c=ctx();for(const k of ['','A b','x','../x',{}, 'a'.repeat(90)])a.equal(c.client.recordList(k),false);a.equal(c.requests.length,0);});
test('worker allowlist equals the catalog keys',()=>{
 const cat=JSON.parse(fs.readFileSync(__dirname+'/../docs/site/catalog.json','utf8')).lists.map(l=>l.key).sort();
 const al=JSON.parse(fs.readFileSync(__dirname+'/../workers/analytics/allowed-lists.json','utf8')).lists;
 a.deepEqual(al,cat,'run python3 scripts/sync_allowed_lists.py');
});
