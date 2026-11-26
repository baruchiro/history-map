const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs');
const html=fs.readFileSync(__dirname+'/../docs/index.html','utf8'),app=fs.readFileSync(__dirname+'/../docs/app.js','utf8');
test('export button and one dialog hold the three export kinds',()=>{
 assert.ok(html.includes('id="exportView"'));
 const d=html.slice(html.indexOf('<dialog aria-labelledby="exportTitle"'));const dlg=d.slice(0,d.indexOf('</dialog>'));
 for(const k of ['timeline','map','both'])assert.ok(dlg.includes('data-export="'+k+'"'));
 assert.equal((html.match(/data-export=/g)||[]).length,3,'export buttons only in the dialog');
});
test('button, Ctrl/Cmd+P and print all open the same dialog',()=>{
 assert.ok(app.includes("$('exportView').onclick=openExport"));
 assert.ok(/e\.ctrlKey\|\|e\.metaKey/.test(app)&&app.includes("e.preventDefault();openExport()"));
 assert.ok(app.includes("addEventListener('beforeprint',openExport)"));
});
