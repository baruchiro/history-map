from pathlib import Path
import threading,http.server,functools,json,os,argparse
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url');parser.add_argument('--out',default='/tmp/history-event-cues');args=parser.parse_args();out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(Path(__file__).resolve().parents[1]/'docs')));threading.Thread(target=server.serve_forever,daemon=True).start();base=args.url or f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROME_BIN','/usr/bin/google-chrome'),headless=True,args=['--no-sandbox'])
 for name,w,h in [('mobile',390,844),('narrow',320,720),('desktop',1280,850),('landscape',844,390)]:
  page=b.new_page(viewport={'width':w,'height':h},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base);page.wait_for_selector('#borders path');page.wait_for_timeout(100)
  assert page.locator('#time').get_attribute('min')=='1956';assert page.locator('#time').get_attribute('max')=='1977'
  print(name,'labels',page.locator('[data-event-label]').count());assert page.locator('[data-event-label]').count()>0

  page.screenshot(path=str(out/(name+'.png')))
  assert page.locator('.event-tick').count()>0
  page.locator('[data-event-label]').first.click();assert page.locator('#eventInfo').evaluate('(el)=>el.open');page.locator('#eventInfo .close-panel').click()
  hit=page.locator('.tick-hit').first;hit.click()
  if page.locator('#timelineEvents').is_visible():
   page.screenshot(path=str(out/(name+'-choices.png')));page.locator('#timelineEventChoices button').first.click()
  assert not page.locator('#timelineEvents').is_visible();assert 'event=' in page.url
  page.wait_for_timeout(100);page.screenshot(path=str(out/(name+'-jump.png')))
  # A label's rendered text and its background must occupy the same bounded rectangle.
  for lab in page.locator('[data-event-label]').all():
   bg=lab.locator('rect').first.bounding_box();t=lab.locator('text').bounding_box();assert t['x']>=bg['x']-1 and t['x']+t['width']<=bg['x']+bg['width']+1,(name,bg,t)
  # Labels are actionable without stealing map background gestures.
  # Public catalog has three lists. Synthetic extra catalog entries exercise scale, not published history.
  page.locator('#advanced>summary').click()
  total=page.locator('#listChoices input').count()
  for row in page.locator('#listChoices input').all():row.check()
  assert page.evaluate('chosenLists.size')==total
  url=page.url;page.reload();page.wait_for_selector('#borders path');assert page.evaluate('chosenLists.size')==total
  page.locator('#advanced>summary').click();page.locator('#search').fill('טלסקופ');assert page.locator('#listChoices input').count()==1
  page.locator('#search').fill('עצמאות');assert page.locator('#listChoices input').count()>=1;assert page.locator('.event-tick').count()>1
  page.locator('#search').fill('no-such-collection-xyz');assert page.locator('#listChoices input').count()==0;assert page.locator('.event-tick').count()==0
  page.locator('#search').fill('')
  page.evaluate("catalog.push(...Array.from({length:5},(_,i)=>({key:'synthetic-'+i,title:'רשימת בדיקה '+i,kind:'historical',library:{items:[]}})));render()")
  for row in page.locator('#listChoices input').all():row.check()
  assert page.evaluate('chosenLists.size')==total+5
  for row in page.locator('#listChoices input').all():row.uncheck()
  assert page.evaluate('chosenLists.size')==0;assert page.locator('.event-tick').count()==0
  page.locator('#advanced .close-panel').click()
  # Legacy links recover the selected pair, year and framing without requiring the new lists field.
  page.goto(base+'#v=1&y=1969&a=voyages-and-encounters&b=science-and-technology&mode=range&borders=1&map=0,0,720,360');page.wait_for_selector('#borders path')
  assert page.evaluate('chosenLists.size')==2;assert page.locator('#world').get_attribute('viewBox')=='0 0 720 360'
  # Dense synthetic events at one location must not produce overlapping title blocks.
  page.evaluate("year=1969;renderMapLabels(Array.from({length:30},(_,i)=>({id:'dense'+i,title:'אירוע לדוגמה '+i,year:1969,lon:-80,lat:30,listKey:'dense',shape:'circle',color:'#547c76'})),null)")
  assert page.locator('[data-event-label]').count()<=6
  boxes=[x.bounding_box() for x in page.locator('[data-event-label] rect').all()]
  for i,a in enumerate(boxes):
   for z in boxes[i+1:]:assert not(a['x']<z['x']+z['width'] and a['x']+a['width']>z['x'] and a['y']<z['y']+z['height'] and a['y']+a['height']>z['y'])
  # Explicit external dates survive; a later collection choice refits deliberately.
  page.evaluate('jumpYear(-500)');assert page.locator('#time').get_attribute('min')=='-500';assert page.locator('#year').inner_text()=='500 לפנה״ס'
  page.reload();page.wait_for_selector('#borders path');assert page.locator('#year').inner_text()=='500 לפנה״ס'
  page.locator('#advanced>summary').click()
  for row in page.locator('#listChoices input').all():row.uncheck()
  assert page.locator('#time').is_disabled()
  page.locator('#listChoices input[value=spaceflight-launches-sample]').check()
  assert page.locator('#year').inner_text()=='1969';assert page.locator('#time').get_attribute('min')=='1968';assert page.locator('#time').get_attribute('max')=='1970'
  page.locator('#search').fill('no-match');assert page.locator('#time').is_disabled();page.locator('#search').fill('');assert page.locator('#time').is_enabled()
  assert not errors,errors;page.close()
 b.close()
server.shutdown()
