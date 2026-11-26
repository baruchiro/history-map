import test from 'node:test';import assert from 'node:assert/strict';
import worker from '../src/index.js';
const ORIGIN='https://history.baruchiro.com';
function env(){const rows=[];return {rows,DB:{prepare(sql){return {bind:(...a)=>({run:async()=>{rows.push({sql,a});}})};}}};}
const call=(e,{method='POST',path='/list-view',origin=ORIGIN,body='{"list":"empress-elisabeth-sisi"}'}={})=>worker.fetch(new Request('https://w.test'+path,{method,headers:origin?{Origin:origin}:{},body:method==='POST'?body:undefined}),e);
test('counts a catalog key from the site',async()=>{const e=env();const r=await call(e);assert.equal(r.status,204);assert.equal(r.headers.get('Access-Control-Allow-Origin'),ORIGIN);assert.equal(e.rows.length,1);assert.deepEqual(e.rows[0].a,[new Date().toISOString().slice(0,10),'empress-elisabeth-sisi']);});
test('stores only day and key: query binds nothing else',async()=>{const e=env();await call(e);assert.equal(e.rows[0].a.length,2);assert.ok(/INSERT INTO list_views \(day,list,count\)/.test(e.rows[0].sql));});
test('rejects unknown keys, bad bodies, other origins, wrong methods, other paths',async()=>{
 for(const [opts,code] of [[{body:'{"list":"nope"}'},400],[{body:'not json'},400],[{body:'{"list":1}'},400],[{body:'x'.repeat(300)},413],[{origin:'https://evil.example'},403],[{origin:null},403],[{method:'GET'},405],[{path:'/other'},404]]){
  const e=env();const r=await call(e,opts);assert.equal(r.status,code,JSON.stringify(opts));assert.equal(e.rows.length,0);}
});
test('preflight only for the site',async()=>{const e=env();assert.equal((await call(e,{method:'OPTIONS'})).status,204);assert.equal((await call(e,{method:'OPTIONS',origin:'https://evil.example'})).status,403);});
