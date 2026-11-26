document.addEventListener('click',e=>{
 const el=e.target.closest('button,[role="button"]');if(!el)return;
 if(el.closest('#pins,#events'))historyAnalytics.record('event_open');
 if(el.closest('#eventTicks,#timelineEventChoices')||['prev','next','play'].includes(el.id))historyAnalytics.record('timeline_event');
 if(el.id==='copyView')historyAnalytics.record('share_open');
},true);
document.addEventListener('change',e=>{if(e.target.matches('#listChoices input')){historyAnalytics.record('collection_change');if(e.target.checked)historyAnalytics.recordList(e.target.value);}},true); // capture: the list re-renders on change and detaches the input before a bubbling listener runs
let historyPointer=null;
document.addEventListener('pointerdown',e=>{if(e.target.closest('#world'))historyPointer={x:e.clientX,y:e.clientY};});
document.addEventListener('pointerup',e=>{if(historyPointer&&Math.hypot(e.clientX-historyPointer.x,e.clientY-historyPointer.y)>5)historyAnalytics.record('map_interaction');historyPointer=null;});
document.addEventListener('input',e=>{if(e.target.id==='time')historyAnalytics.record('timeline_event');});
