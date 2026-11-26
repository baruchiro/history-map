import threading,http.server,functools,json
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse,os,tempfile
parser=argparse.ArgumentParser(description='Optional real-browser/touch smoke check; requires Playwright Python and Chrome')
parser.add_argument('--url',help='Deployed site URL, otherwise serves local docs/')
parser.add_argument('--out',default=tempfile.mkdtemp(prefix='history-map-smoke-'))
args=parser.parse_args();Path(args.out).mkdir(parents=True,exist_ok=True)
root=str(Path(__file__).resolve().parents[1]/'docs')
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=root));threading.Thread(target=server.serve_forever,daemon=True).start()
base=args.url or f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROME_BIN','/usr/bin/google-chrome'),headless=True,args=['--no-sandbox'])
 report=[]
 for name,w,h in [('mobile',390,844),('narrow',320,720),('desktop',1280,850),('landscape',844,390)]:
  context=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<900,has_touch=True)
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base);page.wait_for_selector('#borders path');page.screenshot(path=f'{args.out}/{name}.png',full_page=False)
  assert page.locator('#advanced').get_attribute('open') is None
  assert page.locator('#world').bounding_box()['height']==h
  assert page.evaluate('document.documentElement.scrollWidth===innerWidth')
  assert page.locator('#world').is_visible()
  assert page.locator('#copyView').is_visible()
  assert page.locator('#yearScale span').count()>0
  assert page.locator('#persia').count()==0
  # Tap the visible US event marker. Actual pointer dispatch must open details.
  pin=page.locator('#pins [role=button]').filter(has=page.locator('circle.mark')).first
  pbox=pin.bounding_box();page.touchscreen.tap(pbox['x']+pbox['width']/2,pbox['y']+pbox['height']/2);assert page.locator('#eventInfo').evaluate('(el)=>el.open');assert not page.locator('body').evaluate('(el)=>el.classList.contains("quiet-map")')
  page.locator('#eventInfo .close-panel').click()
  page.locator('#world').scroll_into_view_if_needed()
  cdp=context.new_cdp_session(page);box=page.locator('#world').bounding_box();cx=box['x']+box['width']/2;cy=box['y']+box['height']/2
  before=page.locator('#world').get_attribute('viewBox')
  def touches(points):return [{'x':x,'y':y,'id':i+1,'radiusX':4,'radiusY':4,'force':1} for i,(x,y) in enumerate(points)]
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':touches([(cx-30,cy),(cx+30,cy)])})
  for d in [40,50,65,80]:cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':touches([(cx-d,cy),(cx+d,cy)])})
  cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(150)
  after=page.locator('#world').get_attribute('viewBox');assert float(after.split()[2])<float(before.split()[2]),(name,before,after)
  # One-finger drag after zoom must pan without selecting a territory.
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':touches([(cx,cy)])})
  for d in [10,25,40]:cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':touches([(cx+d,cy+10)])})
  cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(150)
  pan=page.locator('#world').get_attribute('viewBox');assert pan!=after
  assert 'territory=' not in page.url  # one-finger pan must not select a territory
  page.screenshot(path=f'{args.out}/{name}-gesture.png')
  url=page.url
  page.reload();page.wait_for_selector('#borders path')
  restored=page.locator('#world').get_attribute('viewBox');assert all(abs(float(a)-float(b))<.001 for a,b in zip(pan.split(),restored.split()))
  # Advanced controls still operate and expose understandable exact year.
  page.locator('#yearChooser>summary').click();page.locator('#yearInput').fill('-500');page.locator('#goYear').click();page.wait_for_function("document.querySelector('#year').textContent.includes('500')")
  assert page.locator('#year').inner_text()=='500 לפנה״ס'
  assert not errors,errors
  assert not page.locator('#yearChooser').evaluate('(el)=>el.open')
  page.locator('#reset').click();page.wait_for_timeout(100)
  assert page.locator('#world').get_attribute('viewBox')=='0 0 720 360'
  page.locator('#yearChooser>summary').click();page.locator('#yearInput').fill('1969');page.locator('#goYear').click()
  page.locator('#eventInfo>summary').click();page.locator('#events button').first.click()
  assert page.locator('#detail h2').inner_text()
  page.locator('#eventInfo .close-panel').click();page.locator('#advanced>summary').click();page.locator('[data-settings=about]').click();page.locator('#contributorTools>summary').click();page.locator('#contribute summary').click();assert page.locator('#contributionPrompt').is_visible()
  page.locator('#advanced .close-panel').click()
  # Territory tap uses actual hit-testing, then changing time clears stale selection hints.
  box=page.locator('#world').bounding_box()
  pt=page.locator('#world').evaluate('(el)=>{const p=new DOMPoint(220,205).matrixTransform(el.getScreenCTM());return {x:p.x,y:p.y}}');page.touchscreen.tap(pt['x'],pt['y'])
  page.wait_for_timeout(100)
  assert 'territory=' in page.url
  if name=='desktop':
   page.locator('#advanced>summary').click();page.locator('[data-settings=display]').click();page.locator('#zoomIn').click();page.locator('#advanced .close-panel').click();mouse_before=page.locator('#world').get_attribute('viewBox');page.locator('#world').scroll_into_view_if_needed();page.mouse.move(cx,cy);page.mouse.down();page.mouse.move(cx+55,cy+15,steps=6);page.mouse.up();page.wait_for_timeout(100)
   assert page.locator('#world').get_attribute('viewBox')!=mouse_before
  page.evaluate('Object.defineProperty(navigator,"share",{value:undefined,configurable:true})');page.locator('#copyView').click();page.locator('#shareDialog').wait_for(state='visible');page.locator('#copyShare').click();page.wait_for_function('document.querySelector("#copyStatus").textContent.length>0');page.locator('#closeShare').click();page.evaluate('Object.defineProperty(navigator,"share",{configurable:true,value:async data=>window.__shared=data})');page.locator('#copyView').click();page.wait_for_function('window.__shared?.url===document.querySelector("#viewLink").href')
  page.locator('#reset').click();pt=page.locator('#world').evaluate('(el)=>{const p=new DOMPoint(20,180).matrixTransform(el.getScreenCTM());return {x:p.x,y:p.y}}');page.touchscreen.tap(pt['x'],pt['y']);assert page.locator('body').evaluate('(el)=>el.classList.contains("quiet-map")');page.touchscreen.tap(pt['x'],pt['y']);assert not page.locator('body').evaluate('(el)=>el.classList.contains("quiet-map")')
  report.append({'size':name,'viewport':[w,h],'pinch_before':before,'pinch_after':after,'pan':pan,'roundtrip':restored,'errors':errors})
  context.close()
 Path(args.out,'results.json').write_text(json.dumps(report,indent=2))
 browser.close()
server.shutdown()
print(json.dumps(report,indent=2))
