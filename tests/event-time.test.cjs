const test=require('node:test'),assert=require('node:assert/strict');
const time=require('../docs/event-time.js'),view=require('../docs/view-state.js');
test('Rambam completion event does not persist at 1922 in nearby-year mode',()=>{
 assert.equal(time.includes(1180,1922,true),false);
 assert.equal(time.includes(1180,1180,true),true);
 assert.equal(time.includes(1180,1922,false),true);
});
test('window includes 25 years either side, not arbitrary lifetimes',()=>{
 for(const y of [1155,1180,1205])assert.equal(time.includes(y,1180,true),true);
 for(const y of [1154,1206])assert.equal(time.includes(y,1180,true),false);
 assert.equal(time.includes(1181,1180,false),false);
});
test('point-event meaning and cumulative date remain explicit',()=>{
 assert.equal(time.describe(1922,true,String),'אירועים מ־1897 עד 1947 · לא תקופות חיים');
 assert.equal(time.describe(1922,false,String),'אירועים שהתרחשו עד 1922 · לא תקופות חיים');
});
test('shared modes remain backward compatible, corrected view uses range',()=>{
 assert.equal(view.decode('#v=1&y=1922&mode=all').range,false);
 assert.equal(view.decode('#v=1&y=1922&mode=range').range,true);
});
