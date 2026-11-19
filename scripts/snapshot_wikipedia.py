#!/usr/bin/env python3
"""Explicit maintenance fetch of referenced intros. Never called by the public app or CI."""
import argparse, datetime, json, urllib.parse, urllib.request
from pathlib import Path
from event_lists import wikipedia

def snapshot(ref):
    wikipedia(ref)
    params={'action':'query','prop':'extracts|info|pageprops','pageids':ref['pageId'],
            'exintro':1,'explaintext':1,'inprop':'url','format':'json','formatversion':2}
    url='https://'+ref['language']+'.wikipedia.org/w/api.php?'+urllib.parse.urlencode(params)
    req=urllib.request.Request(url,headers={'User-Agent':'HistoryMapIntroSnapshot/0.1 (https://github.com/baruchiro/history-map)'})
    with urllib.request.urlopen(req,timeout=15) as r:
        if r.geturl().split('/')[2]!=ref['language']+'.wikipedia.org': raise ValueError('unexpected redirect host')
        raw=r.read(262145)
        if len(raw)>262144: raise ValueError('response too large')
    page=json.loads(raw)['query']['pages'][0]
    if page.get('missing') or page.get('invalid') or 'disambiguation' in page.get('pageprops',{}): raise ValueError('not an article')
    intro=page.get('extract','').strip()
    if not intro: raise ValueError('empty intro')
    paragraph=next((p.strip() for p in intro.split('\n') if p.strip()),'')
    truncated=len(paragraph)>1200
    paragraph=paragraph[:1200]+('…' if truncated else '')
    return {**ref,'title':page['title'],'sourceUrl':page['fullurl'],'revisionId':page['lastrevid'],
            'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'excerpt':paragraph,'modified':truncated or paragraph!=intro,'license':'CC BY-SA 4.0',
            'licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','method':'TextExtracts plain-text lead; first nonempty paragraph, max 1200 chars'}

def main():
    ap=argparse.ArgumentParser();ap.add_argument('lists_dir');ap.add_argument('--out',required=True);args=ap.parse_args()
    refs={}
    for path in sorted(Path(args.lists_dir).glob('*.json')):
        for li in json.loads(path.read_text())['lists']:
            for event in li['events']:
                if 'wikipedia' in event:
                    ref=wikipedia(event['wikipedia']);refs[f"{ref['language']}:{ref['pageId']}"]=ref
    result={'schemaVersion':1,'snapshots':{}}
    for key,ref in refs.items(): result['snapshots'][key]=snapshot(ref)
    Path(args.out).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print('Wrote',len(refs),'review-required intro snapshots')
if __name__=='__main__':main()
