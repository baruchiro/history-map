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
 assert.ok(app.includes("addEventListener('beforeprint',()=>{if(!printingNow)openExport();})"));
});
test('each export button is an illustration with an accessible name and no visible text',()=>{
 const btns=html.match(/<button[^>]*data-export=[^>]*>.*?<\/button>/g);assert.equal(btns.length,3);
 for(const b of btns){assert.ok(/aria-label="[^"]+"/.test(b)&&/title="[^"]+"/.test(b)&&b.includes('<svg'));assert.equal(b.replace(/<svg.*<\/svg>/,'').replace(/<[^>]+>/g,'').trim(),'');}
});
test('PDF format toggle exists and prints through a dedicated sheet',()=>{
 assert.ok(html.includes('data-fmt="png"')&&html.includes('data-fmt="pdf"')&&html.includes('id="printSheet"'));
 assert.ok(app.includes("exportFmt==='pdf'")&&app.includes('print()')&&app.includes('printingNow'));
});
test('former text-only buttons are icon buttons with accessible names',()=>{
 for(const id of ['goYear','copyShare','prev','next','play','excludeBrowser','includeBrowser','copyPrompt']){
  const m=html.match(new RegExp('<button[^>]*id="'+id+'"[^>]*>.*?</button>'));assert.ok(m,id);
  assert.ok(/aria-label="[^"]+"/.test(m[0])&&/title="[^"]+"/.test(m[0])&&m[0].includes('<svg'),id);
  assert.equal(m[0].replace(/<svg.*<\/svg>/,'').replace(/<[^>]+>/g,'').trim(),'',id+' has no visible text');
 }
 const tabs=html.match(/<button[^>]*data-settings=[^>]*>.*?<\/button>/g);assert.equal(tabs.length,3);
 for(const t of tabs)assert.ok(t.includes('<svg')&&/aria-label="[^"]+"/.test(t));
 assert.ok(app.includes('PAUSESVG')&&app.includes('PLAYSVG'));
});
