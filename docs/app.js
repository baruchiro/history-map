'use strict';
const $=id=>document.getElementById(id), NS='http://www.w3.org/2000/svg';let chosenLists=new Set();let wikipediaSnapshots={},catalog=[],all=[],year=1969,selected='',timer=null,zoom=1,selectedTerritory=null;
const text=(tag,value,cls)=>{const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el;};
function svgEl(tag,attrs){const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));return el;}
function stop(){if(timer)clearInterval(timer);timer=null;$('play').textContent='◁ ניגון';}
function listColor(key){let h=0;for(const c of key)h=(h*31+c.charCodeAt(0))|0;return `hsl(${Math.abs(h)%360} 45% 38%)`;}
function matchesSearch(e,q){return (e.title+' '+e.place+' '+e.year+' '+(e.endYear||'')).toLocaleLowerCase().includes(q);}
function candidates(){const seen=new Map(),q=$('search').value.trim().toLocaleLowerCase();const rows=[...chosenLists].map(k=>catalog.find(l=>l.key===k)).filter(Boolean).flatMap((l,i)=>l.library.items.filter(e=>!q||l.title.toLocaleLowerCase().includes(q)||matchesSearch(e,q)).map(e=>({...e,shape:i===1?'square':'circle',kind:l.kind,listTitle:l.title,listKey:l.key,color:listColor(l.key)})));for(const e of rows){const key=JSON.stringify([e.kind,e.year,e.endYear,e.date,e.title,e.place,e.lat,e.lon,e.source,e.text]);const prior=seen.get(key);if(prior){prior.listTitle+=' · '+e.listTitle;prior.listKeys.push(e.listKey);if(e.id===selected)prior.id=e.id;continue;}e.listKeys=[e.listKey];seen.set(key,e);}return [...seen.values()].sort((a,b)=>a.year-b.year);} 
function renderListChoices(){
 const focusKey=$('listChoices').contains(document.activeElement)?document.activeElement.value:null;const q=$('search').value.trim().toLocaleLowerCase();$('listChoices').replaceChildren();let found=0;
 for(const l of catalog){if(q&&!l.title.toLocaleLowerCase().includes(q)&&!l.library.items.some(e=>matchesSearch(e,q)))continue;found++;
 const row=text('label','','collection-choice'),input=document.createElement('input');input.type='checkbox';input.checked=chosenLists.has(l.key);input.value=l.key;input.setAttribute('aria-label',l.title);input.onchange=()=>{if(input.checked)chosenLists.add(l.key);else chosenLists.delete(l.key);stop();fitYearToEvents();render();};
 const label=text('span','','collection-name'),title=text('strong',l.title),years=l.library.items.flatMap(e=>[e.year,HistoryEventTime.endOf(e)]);label.append(title,text('small',years.length?formatYear(Math.min(...years))+' עד '+formatYear(Math.max(...years)):'ללא אירועים'));const swatch=text('i','');swatch.style.background=listColor(l.key);swatch.setAttribute('aria-hidden','true');row.append(input,swatch,label);$('listChoices').append(row);
 }
 if(focusKey)[...$('listChoices').querySelectorAll('input')].find(i=>i.value===focusKey)?.focus({preventScroll:true});
 $('listChoiceStatus').textContent=found?chosenLists.size+' רשימות נבחרו': 'לא נמצאו רשימות';
}

function render(){const c=candidates();updateTimelineExtent(c);const visible=c.filter(e=>HistoryEventTime.includes(e,year,$('window').checked));const active=visible.find(e=>e.id===selected)||visible.at(-1);$('year').textContent=formatYear(year);$('yearInput').value=String(year);$('time').value=String(year);$('count').textContent=visible.length+' אירועים';$('timeMeaning').textContent=HistoryEventTime.describe(year,$('window').checked,formatYear);$('parallelDemo').hidden=!(chosenLists.size===2&&chosenLists.has('space-age-1957-1977')&&chosenLists.has('african-independence-1956-1977')); $('eventInfo').querySelector('summary').setAttribute('aria-label',visible.length+($('window').checked?' אירועים סביב השנה':' אירועים עד השנה')+' · פרטים ומקורות');$('pins').replaceChildren();$('events').replaceChildren();$('detail').replaceChildren();
for(const e of [...visible.filter(e=>e.id!==active?.id),...(active?[active]:[])]){const g=svgEl('g',{transform:`translate(${(e.lon+180)*2},${(90-e.lat)*2})`,tabindex:0,role:'button','aria-label':HistoryEventTime.label(e,formatYear)+': '+e.title,style:'--list-color:'+e.color,class:'pin'+(e.id===active?.id?' active':'')});const vb=$('world').viewBox.baseVal,box=$('world').getBoundingClientRect();const r=Math.max(vb.width/box.width,vb.height/box.height);g.append(svgEl('circle',{r:13*r,fill:'transparent'}));if(e.id===active?.id)g.append(svgEl('circle',{r:12*r,class:'halo'}));g.append(e.shape==='circle'?svgEl('circle',{r:5*r,class:'mark'}):svgEl('rect',{x:-4.5*r,y:-4.5*r,width:9*r,height:9*r,class:'mark'}));const choose=()=>{if(mapMoved)return;selected=e.id;stop();render();$('eventInfo').open=true;};g.addEventListener('click',choose);g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();choose();}});$('pins').append(g);}
for(const e of visible){const btn=text('button','',e.id===active?.id?'active':'');btn.append(text('b',HistoryEventTime.label(e,formatYear)),text('span',e.title),text('small',e.place));btn.addEventListener('click',()=>{selected=e.id;stop();render();});$('events').append(btn);}
if(active){$('detail').append(text('p',active.listTitle+' · '+({historical:'אירוע היסטורי',tradition:'מסורת מיוחסת',fiction:'סיפורת'}[active.kind]||active.kind),'date'),text('p',active.date),text('h2',active.title),text('p',active.place),text('p',active.text));try{const u=new URL(active.source);if(u.protocol==='https:'&&!u.username&&!u.password){const a=text('a','מקור: '+active.publisher);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';$('detail').append(a);}}catch{}}
if(active)appendWikipediaIntro(active);
else $('detail').append(text('h2','אין אירועים בבחירה הזאת'),text('p','שנו שנה, רשימה או חיפוש כדי לראות אירועים.'));
$('prev').disabled=!c.some(e=>e.year<year);$('next').disabled=!c.some(e=>e.year>year);syncView();renderBorders();renderTimelineTicks(c);renderMapLabels(visible,active);renderListChoices();syncSettings();$('scope').textContent='הרשימות נקראות מקטלוג JSON שנוצר מקובצי התרומה ב־GitHub. רשימות אישיות אינן מועלות לאתר.';}
function step(d){const c=candidates();const e=d>0?c.find(e=>e.year>year):[...c].reverse().find(e=>e.year<year);if(e){year=e.year;selected=e.id;render();return true;}return false;}
function setZoom(f){const v=$('world').getAttribute('viewBox').split(/\s+/).map(Number);const factor=Math.min(v[2]/90,v[3]/45,Math.max(Math.max(v[2]/720,v[3]/360),f));const w=v[2]/factor,h=v[3]/factor;zoom=720/w;$('world').setAttribute('viewBox',`${Math.max(0,Math.min(720-w,v[0]+(v[2]-w)/2))} ${Math.max(0,Math.min(360-h,v[1]+(v[3]-h)/2))} ${w} ${h}`);render();}
async function start(){try{const [cat,land]=await Promise.all([fetch('site/catalog.json').then(r=>{if(!r.ok)throw Error();return r.json();}),fetch('site/land.json').then(r=>{if(!r.ok)throw Error();return r.json();})]);if(cat.schemaVersion!==1||!Array.isArray(cat.lists)||!cat.lists.length)throw Error();try{const cache=await fetch('site/wikipedia-intros.json',{signal:AbortSignal.timeout(5000)}).then(r=>r.ok?r.json():null);if(cache?.schemaVersion===1)wikipediaSnapshots=cache.snapshots||{};}catch{}catalog=cat.lists;all=catalog.flatMap(x=>x.library.items);for(const d of land)$('land').append(svgEl('path',{d}));chosenLists=new Set(['space-age-1957-1977','african-independence-1956-1977'].filter(k=>catalog.some(l=>l.key===k)));if(!chosenLists.size)chosenLists.add(catalog[0].key);const min=-3400,max=2024;$('time').min=String(min);$('time').max=String(max);$('min').textContent=formatYear(min);$('max').textContent=formatYear(max);$('time').addEventListener('input',()=>{stop();const y=Number($('time').value);year=y===0?(year<0?1:-1):y;render();});for(const id of ['search','window'])$(id).addEventListener('input',()=>{stop();if(id==='search')fitYearToEvents();render();});$('goYear').onclick=()=>{if(jumpYear(Number($('yearInput').value)))$('yearChooser').open=false;};$('yearInput').onkeydown=e=>{if(e.key==='Enter')$('goYear').click();};$('showBorders').onchange=()=>{syncView();renderBorders();};$('prev').onclick=()=>{stop();step(-1);};$('next').onclick=()=>{stop();step(1);};$('play').onclick=()=>{if(timer){stop();return;}if(!candidates().some(e=>e.year>year))year=candidates()[0]?.year||year;timer=setInterval(()=>{if(!step(1))stop();},1700);$('play').textContent='Ⅱ השהיה';render();};$('zoomIn').onclick=()=>setZoom(2);$('zoomOut').onclick=()=>setZoom(.5);$('reset').onclick=()=>{$('selectionHint').textContent='גבולות מקורבים · בחרו מקום או סמן';zoom=1;$('world').setAttribute('viewBox','0 0 720 360');render();};setupMapGestures();if(!location.hash){year=1962;$('window').checked=true;$('world').setAttribute('viewBox','170 40 380 210');zoom=720/380;}restoreView();document.addEventListener('keydown',e=>{if(e.key==='Escape'){for(const id of ['yearChooser','advanced','eventInfo'])$(id).open=false;}});$('yearChooser').addEventListener('toggle',()=>document.body.classList.toggle('year-editing',$('yearChooser').open));$('copyView').onclick=copyView;$('copyShare').onclick=copyShare;$('closeShare').onclick=()=>$('shareDialog').close();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).open=false);for(const id of ['advanced','eventInfo'])$(id).addEventListener('toggle',()=>{if($(id).open){$(id==='advanced'?'eventInfo':'advanced').open=false;document.body.classList.remove('quiet-map');}});setupEventCues();setupSettings();$('contributionPrompt').value=contributionPrompt;$('copyPrompt').onclick=async()=>{try{await navigator.clipboard.writeText(contributionPrompt);$('promptStatus').textContent='הפרומפט הועתק. הדביקו אצל הסוכן שלכם והחליפו את הנושא.';}catch{$('contributionPrompt').focus();$('contributionPrompt').select();$('promptStatus').textContent='הטקסט נבחר. השתמשו בהעתקה של הדפדפן.';}};addEventListener('hashchange',()=>{stop();restoreView();render();});$('status').textContent='קטלוג: '+catalog.length+' רשימות · אירועים עם מקורות · עדכון 19.11.2026';render();}catch{$('status').textContent='לא ניתן לטעון את קובצי הנתונים. נסו לרענן או לפתוח את מאגר הפרויקט.';}}
function formatYear(y){return y<0?Math.abs(y)+' לפנה״ס':String(y);}
function jumpYear(y){if(!Number.isInteger(y)||y===0||y< -3400||y>2024){$('yearError').textContent='הזינו שנה בין 3400 לפנה״ס ל־2024, ללא שנת 0.';return;}$('yearError').textContent='';stop();year=y;selected='';render();return true;}
const borderCache=new Map();let borderKey=null,borderRows=[],borderSerial=0;
function borderColor(name){let h=0;for(const c of name)h=(h*31+c.charCodeAt(0))|0;return `hsl(${Math.abs(h)%360} 35% 68%)`;}
async function renderBorders(){const serial=++borderSerial;if(!$('showBorders').checked){$('borders').replaceChildren();$('borderStatus').textContent='שכבת הגבולות כבויה.';return;}const key=year<1500?Math.floor(year/500)*500:Math.floor(year/100)*100;
if(borderKey!==key){$('borders').replaceChildren();$('borderStatus').textContent='טוען תקופת גבולות…';try{if(!borderCache.has(key))borderCache.set(key,fetch(`site/borders/${key}.json`).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{borderCache.delete(key);throw e;}));const rows=await borderCache.get(key);if(serial!==borderSerial)return;borderRows=rows;borderKey=key;}catch{if(serial===borderSerial)$('borderStatus').textContent='לא ניתן לטעון גבולות לתקופה הזאת. האירועים עדיין זמינים.';return;}}
if(serial!==borderSerial)return;const visible=borderRows.filter(x=>x.from<=year&&x.to>=year);$('borders').replaceChildren();for(const b of visible){const path=svgEl('path',{d:b.d,fill:borderColor(b.name),stroke:'#75685d','stroke-width':.45/zoom,'fill-opacity':.55,'fill-rule':'evenodd',tabindex:0,role:'button','aria-label':b.name+' · '+formatYear(b.from)+' עד '+formatYear(b.to)});const title=svgEl('title',{});title.textContent=b.name;path.append(title);const choose=()=>{if(mapMoved)return;selectedTerritory=b.id;syncView();$('selectionHint').textContent=b.name+' · '+formatYear(b.from)+' עד '+formatYear(b.to)+' · גבול מקורב';$('territoryDetail').replaceChildren(text('strong',b.name),text('span',' · תקופת הגאומטריה במקור: '+formatYear(b.from)+' עד '+formatYear(b.to)+'. גבול מקורב.'));};path.onclick=choose;path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};$('borders').append(path);}$('borderStatus').textContent=formatYear(year)+' · '+visible.length+' ישויות במקור · Cliopatria';const territory=visible.find(b=>b.id===selectedTerritory);$('selectionHint').textContent=territory?territory.name+' · '+formatYear(territory.from)+' עד '+formatYear(territory.to)+' · גבול מקורב':'גבולות מקורבים · בחרו מקום או סמן';$('territoryDetail').textContent=territory?territory.name+' · תקופת הגאומטריה במקור: '+formatYear(territory.from)+' עד '+formatYear(territory.to)+'. גבול מקורב.':'בחרו שטח במפה לשמו ולתקופת המקור.';}

function syncView(){const map=$('world').getAttribute('viewBox').split(/\s+/).map(Number);const hash=HistoryViewState.encode({year,a:[...chosenLists][0]||'',b:[...chosenLists][1]||'',lists:[...chosenLists],range:$('window').checked,borders:$('showBorders').checked,search:$('search').value,map,event:selected,territory:selectedTerritory});const u=new URL(location.href);u.search='';u.hash=hash;history.replaceState(null,'',u.href);$('viewLink').href=u.href;}
function restoreView(){const s=HistoryViewState.decode(location.hash,catalog.map(x=>x.key));if(s.year!==undefined)year=s.year;if(s.lists!==undefined)chosenLists=new Set(s.lists);else if(s.a||s.b)chosenLists=new Set([s.a,s.b].filter(Boolean));if(s.range!==undefined)$('window').checked=s.range;if(s.borders!==undefined)$('showBorders').checked=s.borders;if(s.search!==undefined)$('search').value=s.search;if(s.map){$('world').setAttribute('viewBox',s.map.join(' '));zoom=720/s.map[2];}selected=all.some(e=>e.id===s.event)?s.event:'';selectedTerritory=s.territory??null;}
async function copyView(){syncView();const url=$('viewLink').href;if(navigator.share){try{await navigator.share({title:'העולם על המפה',url});return;}catch(e){if(e.name==='AbortError')return;}}$('shareUrl').value=url;$('copyStatus').textContent='';$('shareDialog').showModal();}
async function copyShare(){try{await navigator.clipboard.writeText($('shareUrl').value);historyAnalytics.record('share_copy');$('copyStatus').textContent='הקישור הועתק';}catch{$('shareUrl').focus();$('shareUrl').select();$('copyStatus').textContent='בחרו והעתיקו את הקישור';}}


const contributionPrompt="אני רוצה ליצור רשימת אירועים למפה ההיסטורית בנושא: [הנושא שלי]. טווח זמן ואזור רצויים: [אפשר לציין].\nקרא/י את הנחיות המחקר והפורמט: https://github.com/baruchiro/history-map/blob/master/SKILL.md\nואת תהליך התרומה: https://github.com/baruchiro/history-map/blob/master/CONTRIBUTING.md\nבנה/י רשימה קטנה וממוקדת עם מקורות שנפתחו ונבדקו, תאריכים ומיקומים מבוססים והערות לאי־ודאות. הבחן/י בין היסטוריה, מסורת וסיפורת. אל תמציא/י תאריך או מקום רק כדי למלא שדה.\nפעל/י לפי הסכמה: https://github.com/baruchiro/history-map/blob/master/schema/event-list-v1.schema.json\nדוגמה מלאה: https://github.com/baruchiro/history-map/blob/master/lists/spaceflight-launches-sample.json\nהכן/י קובץ lists/<stable-key>.json ובדוק/י אותו בכלי האימות שבמאגר. אין לכלול מידע אישי, סודות או שינויים בקוד ובתהליכי העבודה.\nהחזר/י את הקובץ, סיכום המקורות והמגבלות והצעת תרומה לבדיקה. פתיחת PR מחשבון שלי דורשת אישור שלי; ללא הרשאה לגיטהאב החזר/י קובץ JSON שאוכל להגיש. אין למזג או לפרסם אוטומטית. הרשימה תופיע במפה רק לאחר ביקורת ומיזוג ועדכון הקטלוג בידי מתחזק.";

let mapMoved=false;
function setupMapGestures(){
 const svg=$('world'), pointers=new Map();let base=null;
 const view=()=>svg.getAttribute('viewBox').split(/\s+/).map(Number);
 const geometry=()=>{const p=[...pointers.values()];return {x:p.reduce((s,v)=>s+v.x,0)/p.length,y:p.reduce((s,v)=>s+v.y,0)/p.length,d:p.length>1?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0};};
 const begin=()=>{const rect=svg.getBoundingClientRect(),v=view(),scale=Math.min(rect.width/v[2],rect.height/v[3]);base={...geometry(),v,rect:{left:rect.left+(rect.width-v[2]*scale)/2,top:rect.top+(rect.height-v[3]*scale)/2,width:v[2]*scale,height:v[3]*scale}};};
 svg.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;mapMoved=false;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});begin();});
 svg.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const g=geometry(),r=base.rect;const scale=base.d&&g.d?g.d/base.d:1;const factor=Math.max(Math.max(base.v[2]/720,base.v[3]/360),Math.min(base.v[2]/90,base.v[3]/45,scale));const width=base.v[2]/factor,height=base.v[3]/factor;
 const dx=(g.x-base.x)*base.v[2]/r.width,dy=(g.y-base.y)*base.v[3]/r.height;
 if(Math.abs(g.x-base.x)+Math.abs(g.y-base.y)>5||Math.abs(scale-1)>.02){mapMoved=true;svg.setPointerCapture(e.pointerId);}
 const u=(base.x-r.left)/r.width,t=(base.y-r.top)/r.height;
 const x=Math.max(0,Math.min(720-width,base.v[0]+base.v[2]*u-width*u-dx)),y=Math.max(0,Math.min(360-height,base.v[1]+base.v[3]*t-height*t-dy));
 svg.setAttribute('viewBox',[x,y,width,height].join(' '));zoom=720/width;
 });
 const end=e=>{pointers.delete(e.pointerId);if(pointers.size)begin();else{syncView();setTimeout(()=>{mapMoved=false;render();},60);}};
 svg.addEventListener('pointerup',end);svg.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!e.buttons&&pointers.has(e.pointerId))end(e);});svg.addEventListener('pointercancel',end);
 svg.addEventListener('click',e=>{if(!mapMoved&&!e.target.closest('#pins,#borders'))document.body.classList.toggle('quiet-map');});
 svg.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();setZoom(e.deltaY<0?1.15:1/1.15);},{passive:false});
}
start();

function syncSettings(){
 document.querySelectorAll('[data-range]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.range===String($('window').checked))));
}
function setupSettings(){
 const buttons=[...document.querySelectorAll('[data-settings]')];
 function show(key){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.settings===key)));document.querySelectorAll('.settings-page').forEach(p=>p.hidden=p.id!=='settings-'+key);}
 buttons.forEach((b,i)=>{b.onclick=()=>show(b.dataset.settings);b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowLeft'?1:-1)+buttons.length)%buttons.length;buttons[n].focus();buttons[n].click();};});
 document.querySelectorAll('[data-range]').forEach(b=>b.onclick=()=>{$('window').checked=b.dataset.range==='true';stop();render();});
 $('advanced').addEventListener('toggle',()=>{if(!$('advanced').open){show('content');document.querySelectorAll('#settings-about details').forEach(d=>d.open=false);}});
 syncSettings();
}

function setupEventCues(){
 $('closeTimelineEvents').onclick=()=>$('timelineEvents').close();
 let frame;addEventListener('resize',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>render());});
}
function cueJump(e){
 stop();year=e.year;selected=e.id;
 const v=$('world').getAttribute('viewBox').split(/\s+/).map(Number),x=(e.lon+180)*2,y=(90-e.lat)*2;
 if(x<v[0]+v[2]*.1||x>v[0]+v[2]*.9||y<v[1]+v[3]*.1||y>v[1]+v[3]*.9){v[0]=Math.max(0,Math.min(720-v[2],x-v[2]/2));v[1]=Math.max(0,Math.min(360-v[3],y-v[3]/2));$('world').setAttribute('viewBox',v.join(' '));}
 render();
}
function renderTimelineTicks(events){
 const rail=$('eventTicks');rail.replaceChildren();
 const width=rail.clientWidth,min=Number($('time').min),max=Number($('time').max),inset=8;
 if(!width)return;
 const positions=events.map(e=>({e,x:inset+(1-(e.year-min)/(max-min))*(width-2*inset)})).sort((a,b)=>a.x-b.x);
 // Exact marks retain their dates. Hit areas are separately clustered to avoid overlapping buttons.
 let last=-100;
 for(const p of positions){if(p.x-last<3)continue;const tick=text('i','');tick.style.left=p.x+'px';tick.className='event-tick '+(p.e.shape==='square'?'second':'first');tick.setAttribute('aria-hidden','true');rail.append(tick);last=p.x;}
 const bins=new Map(),n=Math.max(1,Math.floor(width/44));
 for(const p of positions){const key=Math.min(n-1,Math.floor(p.x/width*n));if(!bins.has(key))bins.set(key,[]);bins.get(key).push(p);}
 for(const [key,items]of bins){const es=items.map(p=>p.e).sort((a,b)=>a.year-b.year),button=text('button','');button.type='button';button.className='tick-hit';button.style.left=key/n*100+'%';button.style.width=100/n+'%';button.setAttribute('aria-label',es.length===1?formatYear(es[0].year)+': '+es[0].title:es.length+' אירועים בין '+formatYear(es[0].year)+' ל־'+formatYear(es.at(-1).year));button.title=button.getAttribute('aria-label');
 const badge=text('span',es.length>1?String(es.length):'');badge.className='tick-count';badge.style.left=Math.max(7,Math.min(width/n-7,items.reduce((a,p)=>a+p.x,0)/items.length-key/n*width))+'px';button.append(badge);
 button.onclick=()=>{if(es.length===1){cueJump(es[0]);return;}$('timelineEventChoices').replaceChildren();for(const e of es){const choice=text('button',HistoryEventTime.label(e,formatYear)+' · '+e.title);choice.type='button';choice.onclick=()=>{$('timelineEvents').close();cueJump(e);};$('timelineEventChoices').append(choice);}$('timelineEvents').showModal();};rail.append(button);}
}
function renderMapLabels(events,active){
 const old=$('mapLabels');if(old)old.remove();const labels=svgEl('g',{id:'mapLabels'});$('pins').append(labels);
 const leaders=svgEl('g',{'aria-hidden':'true'});labels.append(leaders);
 const svg=$('world'),v=svg.viewBox.baseVal,box=svg.getBoundingClientRect(),scale=Math.min(box.width/v.width,box.height/v.height),ox=box.left+(box.width-v.width*scale)/2-v.x*scale,oy=box.top+(box.height-v.height*scale)/2-v.y*scale;
 const occupied=[...document.querySelectorAll('.basic-bar>button,#yearChooser,header,.timeline,#selectionHint,#advanced,#eventInfo')].filter(el=>el.getClientRects().length).map(el=>{const b=el.getBoundingClientRect();return{x:b.x-5,y:b.y-5,w:b.width+10,h:b.height+10};});
 const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 const ranked=[...events].sort((a,b)=>(b.id===active?.id)-(a.id===active?.id)||HistoryEventTime.distance(a,year)-HistoryEventTime.distance(b,year));
 // Round-robin the visible stories before spending the limited label budget.
 // A busy recent history must not crowd out the other selected history.
 const groups=[...new Set(ranked.map(e=>e.listKey))].map(key=>ranked.filter(e=>e.listKey===key)),sorted=[];
 while(groups.some(g=>g.length))for(const g of groups)if(g.length)sorted.push(g.shift());
 // Reserve pin centers as well, so a title cannot hide another event.
 const pins=events.map(e=>({x:ox+(e.lon+180)*2*scale-9,y:oy+(90-e.lat)*2*scale-9,w:18,h:18}));occupied.push(...pins);
 let shown=0;
 for(const e of sorted){if(shown>=6)break;const px=ox+(e.lon+180)*2*scale,py=oy+(90-e.lat)*2*scale;if(px<0||py<0||px>innerWidth||py>innerHeight)continue;
 const full=e.title,limit=innerWidth<600?23:32,short=full.length>limit?full.slice(0,limit-2)+'…':full;
 const t=svgEl('text',{'font-size':12/scale,'font-family':'Arial,sans-serif',direction:'rtl','text-anchor':'start'});t.textContent=HistoryEventTime.label(e,formatYear)+' · '+short;labels.append(t);const badges=e.listKeys||[e.listKey],badgeWidth=badges.length*12+6;const tw=t.getComputedTextLength()*scale+16+badgeWidth,th=27;
 const tries=[{x:px+13,y:py-th/2},{x:px-13-tw,y:py-th/2},{x:px-tw/2,y:py-15-th},{x:px-tw/2,y:py+15},{x:px+13,y:py+22},{x:px-tw/2,y:py+32},{x:px-tw/2,y:py-60-th},{x:px-tw/2,y:py+60},{x:Math.min(innerWidth-8-tw,Math.max(8,px-tw/2)),y:py-60-th}];
 // width and height belong to each candidate, not to the SVG coordinate system.
 t.remove();
 const slot=tries.map(b=>({...b,w:tw,h:th})).find(b=>b.x>=8&&b.y>=8&&b.x+b.w<=innerWidth-8&&b.y+b.h<=innerHeight-8&&!occupied.some(a=>overlap(a,b)));
 if(!slot)continue;occupied.push(slot);shown++;
 const lx=Math.max(slot.x,Math.min(px,slot.x+tw)),ly=Math.max(slot.y,Math.min(py,slot.y+th));
 if(Math.hypot(lx-px,ly-py)>20)leaders.append(svgEl('line',{x1:(px-ox)/scale,y1:(py-oy)/scale,x2:(lx-ox)/scale,y2:(ly-oy)/scale,stroke:e.color||'#547c76','stroke-width':1/scale,'stroke-opacity':.65,'pointer-events':'none'}));
 const g=svgEl('g',{'data-event-label':e.id,role:'button',tabindex:0,'aria-label':HistoryEventTime.label(e,formatYear)+': '+full,class:'event-label'});const choose=()=>{if(mapMoved)return;selected=e.id;stop();render();$('eventInfo').open=true;};g.onclick=choose;g.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();choose();}};const bg=svgEl('rect',{x:(slot.x-ox)/scale,y:(slot.y-oy)/scale,width:tw/scale,height:th/scale,rx:(e.shape==='square'?3:13.5)/scale,fill:'#fffefa','fill-opacity':.97,stroke:e.color,'stroke-width':(e.id===active?.id?2.2:1.3)/scale});
 for(let i=0;i<badges.length;i++){const bx=(slot.x+tw-12-i*12-ox)/scale,by=(slot.y+13.5-oy)/scale,col=listColor(badges[i]);g.append(e.shape==='square'?svgEl('rect',{x:bx-3.5/scale,y:by-3.5/scale,width:7/scale,height:7/scale,fill:col}):svgEl('circle',{cx:bx,cy:by,r:3.5/scale,fill:col}));}
 t.setAttribute('x',(slot.x+tw-8-badgeWidth-ox)/scale);t.setAttribute('y',(slot.y+18-oy)/scale);t.setAttribute('fill','#3c3531');const title=svgEl('title',{});title.textContent=full;g.prepend(bg);g.append(t,title);labels.append(g);
 }
}

function fitYearToEvents(){const c=candidates();if(c.length)year=Math.max(c[0].year,Math.min(Math.max(...c.map(e=>HistoryEventTime.endOf(e))),year));}
function updateTimelineExtent(events){
 let lo=events.length?Math.min(events[0].year,year):year,hi=events.length?Math.max(Math.max(...events.map(e=>HistoryEventTime.endOf(e))),year):year;
 if(lo===hi){lo=Math.max(-3400,lo-1);hi=Math.min(2024,hi+1);}
 $('time').min=String(lo);$('time').max=String(hi);$('min').textContent=formatYear(lo);$('max').textContent=formatYear(hi);$('time').disabled=!events.length;
 $('time').setAttribute('aria-valuetext',formatYear(year));
}

function appendWikipediaIntro(event){
 const ref=event.wikipedia;if(!ref)return;const cached=wikipediaSnapshots[ref.language+':'+ref.pageId];
 const panel=text('section','','wikipedia-intro');panel.append(text('h3','רקע מוויקיפדיה'+(ref.language==='he'?' · עברית':ref.language==='en'?' · אנגלית':' · '+ref.language)));
 if(!cached||typeof cached.excerpt!=='string'){panel.append(text('p','תקציר רקע אינו זמין. תיאור האירוע והמקור נשארים זמינים.'));$('detail').append(panel);return;}
 let source;try{source=new URL(cached.sourceUrl);}catch{return;}if(source.protocol!=='https:'||source.hostname!==ref.language+'.wikipedia.org')return;
 panel.append(text('p',cached.excerpt));const credit=text('a','מתוך '+cached.title+' · תורמי ויקיפדיה');credit.href=source.href;credit.target='_blank';credit.rel='noopener noreferrer';panel.append(credit);const license=text('a','CC BY-SA 4.0');license.href='https://creativecommons.org/licenses/by-sa/4.0/';license.target='_blank';license.rel='noopener noreferrer';panel.append(text('span',' · '),license,text('small','קטע מתוך המבוא, עשוי להיות מקוצר. גרסה '+String(cached.revisionId)+' · נשמר '+String(cached.retrievedAt).slice(0,10)));panel.append(text('small','רקע כללי בלבד; אינו מקור אוטומטי לשנת האירוע או למיקומו. ייתכנו הבדלי תאריכים בין מקורות.'));$('detail').append(panel);
}
