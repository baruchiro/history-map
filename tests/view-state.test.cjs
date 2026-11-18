const test=require('node:test'),assert=require('node:assert/strict'),v=require('../docs/view-state.js');
const keys=['voyages-and-encounters','science-and-technology'];
test('round-trips public view',()=>{const s={year:-500,a:keys[0],b:keys[1],range:true,borders:true,search:'פרס & space',map:[300,40,360,180],event:'custom-test',territory:191};assert.deepEqual(v.decode(v.encode(s),keys),s);});
test('ignores malformed dates, unapproved lists and view boxes',()=>{for(const y of ['0','Infinity','-3401','2025','1.5',''])assert.equal(v.decode('#v=1&y='+y,keys).year,undefined);for(const map of ['-1,0,720,360','0,0,900,450','0,0,360,360','NaN,0,90,45','0,0,10,5'])assert.equal(v.decode('#v=1&map='+map,keys).map,undefined);assert.equal(v.decode('#v=1&a=https://evil.invalid',keys).a,undefined);});
test('no external navigation or HTML interpretation',()=>{const s=v.decode('#v=1&redirect=https://evil.invalid&event=%3Cscript%3E&q=%3Cimg%3E',keys);assert.equal(s.redirect,undefined);assert.equal(s.event,undefined);assert.equal(s.search,'<img>');});
test('requires known version and bounds query length',()=>{assert.deepEqual(v.decode('#v=99&y=1969',keys),{});assert.equal(v.decode('#v=1&q='+'x'.repeat(121),keys).search,undefined);});

test('round-trip BCE endpoints and exact map zoom',()=>{for(const y of [-3400,-1,1,2024]){const s={year:y,a:keys[0],b:keys[1],range:false,borders:false,search:'',map:[12.345678,123.456789,90,45],event:''};const d=v.decode(v.encode(s),keys);assert.equal(d.year,y);assert.deepEqual(d.map,s.map);}});
