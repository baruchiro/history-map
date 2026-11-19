import threading,http.server,functools,json,os
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser(description='Optional settings regression, requires Playwright Python and Chrome')
parser.add_argument('--url');parser.add_argument('--out',default='/tmp/history-settings')
args=parser.parse_args()
root=str(Path(__file__).resolve().parents[1]/'docs')
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=root));threading.Thread(target=server.serve_forever,daemon=True).start()
base=args.url or f'http://127.0.0.1:{server.server_port}/';out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROME_BIN','/usr/bin/google-chrome'),headless=True,args=['--no-sandbox'])
 for name,w,h in [('mobile',390,844),('narrow',320,720),('desktop',1280,850),('landscape',844,390)]:
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base);page.wait_for_selector('#borders path');page.locator('#advanced>summary').click()
  assert page.locator('#settings-content').is_visible();assert not page.locator('#contribute').is_visible();assert not page.locator('#sourceNotes').is_visible()
  page.screenshot(path=str(out/(name+'-content.png')))
  page.locator('#search').fill('zzzz-no-match');assert page.locator('#events button').count()==0;page.locator('#search').fill('')
  page.locator('#listChoices input[value=spaceflight-launches-sample]').check();assert 'spaceflight-launches-sample' in page.url
  page.locator('[data-settings=display]').click();assert not page.locator('#search').is_visible()
  page.locator('[data-range=false]').click();assert not page.locator('#window').is_checked();assert page.locator('[data-range=false]').get_attribute('aria-pressed')=='true'
  page.locator('[data-range=true]').click();assert page.locator('#window').is_checked()
  page.locator('#showBorders').uncheck();page.wait_for_function('document.querySelectorAll("#borders path").length===0')
  page.locator('#showBorders').check();page.wait_for_selector('#borders path');assert not page.locator('#contribute').is_visible()
  page.screenshot(path=str(out/(name+'-display.png')))
  page.locator('#prev').click();assert page.locator('#year').inner_text()!='1969';page.locator('#next').click()
  page.locator('#zoomIn').click();page.locator('#zoomOut').click()
  page.locator('[data-settings=about]').click();assert not page.locator('#contributionPrompt').is_visible();page.screenshot(path=str(out/(name+'-about.png')))
  page.locator('#sourceNotes>summary').click();assert page.locator('#borderStatus').is_visible();page.locator('#sourceNotes>summary').click()
  page.locator('#contributorTools>summary').click();page.locator('#contribute summary').click();assert page.locator('#contributionPrompt').is_visible();page.locator('#copyPrompt').click();page.wait_for_function('document.querySelector("#promptStatus").textContent.length>0')
  page.locator('#advanced .close-panel').click();page.locator('#advanced>summary').click();assert page.locator('#settings-content').is_visible();assert not page.locator('#contribute').is_visible()
  # Directional keyboard navigation follows the visible RTL button order.
  page.locator('[data-settings=content]').focus();page.keyboard.press('ArrowLeft');assert page.locator('#settings-display').is_visible();page.keyboard.press('End');assert page.locator('#settings-about').is_visible()
  page.keyboard.press('Escape');assert not page.locator('#advanced').evaluate('(e)=>e.open')
  assert page.evaluate('document.documentElement.scrollWidth===innerWidth');assert not errors,errors
  print(name,'PASS');page.close()
 browser.close()
server.shutdown()
