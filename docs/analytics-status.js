(function(){
 const status=document.getElementById('analyticsStatus'),browser=document.getElementById('analyticsBrowserStatus');
 function refresh(){
  status.textContent='מדידת השימוש כבויה לכולם כרגע. לא נשלחים אירועי שימוש.';
  try{const excluded=localStorage.getItem('history-map.analytics.exclude.v1')==='1';browser.textContent=excluded?'הדפדפן הזה מוחרג ממדידת שימוש.':'הדפדפן הזה עדיין לא מסומן כמוחרג.';}catch{browser.textContent='לא ניתן לשמור החרגה בדפדפן הזה. המדידה חסומה בו.';}
 }
 document.getElementById('excludeBrowser').onclick=()=>{historyAnalytics.setExcluded(true);refresh();};
 document.getElementById('includeBrowser').onclick=()=>{historyAnalytics.setExcluded(false);refresh();};
 let excluded=false;try{excluded=localStorage.getItem('history-map.analytics.exclude.v1')==='1';}catch{}
 if(excluded){
  const dialog=document.createElement('dialog');dialog.dir='rtl';
  const title=document.createElement('h2');title.textContent='הדפדפן הזה מוחרג';
  const text=document.createElement('p');text.textContent='הסימון נשמר. מדידת השימוש עדיין כבויה לכולם, ולא נשלח אירוע שימוש מהביקור הזה.';
  const note=document.createElement('p');note.textContent='יש לפתוח את קישור ההחרגה בכל דפדפן ומכשיר שבהם משתמשים לבדיקה.';
  const close=document.createElement('button');close.textContent='הבנתי, למפה';close.onclick=()=>dialog.close();
  dialog.append(title,text,note,close);document.body.append(dialog);dialog.showModal();
 }

 refresh();
})();
