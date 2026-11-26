const test=require('node:test'),assert=require('node:assert/strict'),v=require('../docs/view-state.js');
const keys=['voyages-and-encounters','science-and-technology'];
test('round-trips public view',()=>{const s={year:-500,a:keys[0],b:keys[1],range:true,borders:true,search:'פרס & space',map:[300,40,360,180],event:'custom-test',territory:191};assert.deepEqual(v.decode(v.encode(s),keys),s);});
test('ignores malformed dates, unapproved lists and view boxes',()=>{for(const y of ['0','Infinity','-3401','2025','1.5',''])assert.equal(v.decode('#v=1&y='+y,keys).year,undefined);for(const map of ['-1,0,720,360','0,0,900,450','0,0,360,400','NaN,0,90,45','0,0,10,5'])assert.equal(v.decode('#v=1&map='+map,keys).map,undefined);assert.equal(v.decode('#v=1&a=https://evil.invalid',keys).a,undefined);});
test('no external navigation or HTML interpretation',()=>{const s=v.decode('#v=1&redirect=https://evil.invalid&event=%3Cscript%3E&q=%3Cimg%3E',keys);assert.equal(s.redirect,undefined);assert.equal(s.event,undefined);assert.equal(s.search,'<img>');});
test('requires known version and bounds query length',()=>{assert.deepEqual(v.decode('#v=99&y=1969',keys),{});assert.equal(v.decode('#v=1&q='+'x'.repeat(121),keys).search,undefined);});

test('round-trip BCE endpoints and exact map zoom',()=>{for(const y of [-3400,-1,1,2024]){const s={year:y,a:keys[0],b:keys[1],range:false,borders:false,search:'',map:[12.345678,123.456789,90,45],event:''};const d=v.decode(v.encode(s),keys);assert.equal(d.year,y);assert.deepEqual(d.map,s.map);}});

test('portrait touch viewport safely round-trips without imposing desktop aspect ratio',()=>{const state={year:1969,a:'one',b:'two',range:true,borders:true,map:[115.45,0,229.09,360]};const copy=v.decode(v.encode(state),['one','two']);assert.deepEqual(copy.map,state.map);for(const map of ['0,0,720,361','0,0,89,100','-1,0,90,45','700,0,90,45','0,350,90,45','0,0,Infinity,180'])assert.equal(v.decode('#v=1&map='+map).map,undefined);});

test('many selected lists, empty selection and legacy pair are distinct',()=>{
 const names=Array.from({length:50},(_,i)=>'list-'+i),base={year:1969,range:true,borders:true,map:[0,0,720,360],a:names[0],b:names[1]};
 assert.deepEqual(v.decode(v.encode({...base,lists:names}),names).lists,names);
 assert.deepEqual(v.decode(v.encode({...base,lists:[]}),names).lists,[]);
 const legacy=v.decode('#v=1&a=list-0&b=list-1',names);assert.equal(legacy.lists,undefined);assert.equal(legacy.a,'list-0');
 assert.deepEqual(v.decode('#v=1&lists=list-0,list-0,https://bad.invalid,unknown',names).lists,['list-0']);
});

test('month round-trips and bad months are ignored',()=>{
 const base={year:1933,a:'one',b:'two',range:true,borders:false,search:'',map:[0,0,720,360],event:''};
 assert.equal(v.decode(v.encode({...base,month:3}),['one','two']).month,3);
 assert.equal(v.decode(v.encode({...base,month:0}),['one','two']).month,undefined);
 for(const m of ['0','13','1.5','x',''])assert.equal(v.decode('#v=1&y=1933&m='+m).month,undefined);
});
