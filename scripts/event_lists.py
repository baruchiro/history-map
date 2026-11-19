#!/usr/bin/env python3
"""Compile researched lists to the map's existing local-library JSON contract."""
import argparse
import hashlib
import json
import math
import re
from pathlib import Path

LIMIT = 14500

def require(ok, message):
    if not ok:
        raise ValueError(message)

def text(value, name, limit, empty=False):
    require(isinstance(value, str) and (empty or bool(value.strip())) and len(value) <= limit,
            f'{name}: expected {"optional " if empty else "nonempty "}text up to {limit} characters')
    return value

def number(value, name, bound):
    require(type(value) in (int, float) and math.isfinite(value) and abs(value) <= bound,
            f'{name}: invalid geographic coordinate')

def year(value):
    require(type(value) is int and value != 0 and -5000 <= value <= 2100,
            'year: integer -5000..2100, excluding zero')

def span(e):
    year(e['year'])
    if 'endYear' not in e:
        return
    year(e['endYear'])
    require(e['endYear'] > e['year'], 'endYear: must be later than year; omit it for a single-year point event')

def year_label(value):
    return str(value) if value > 0 else str(-value) + ' BCE'

def source(value):
    from urllib.parse import urlsplit
    text(value, 'source', 2000)
    u = urlsplit(value)
    require(u.scheme == 'https' and bool(u.hostname) and not u.username and not u.password,
            'source: expected HTTPS URL without credentials')

def wikipedia(value):
    require(type(value) is dict and set(value)=={'language','pageId'}, 'wikipedia: expected language/pageId')
    require(isinstance(value['language'],str) and re.fullmatch(r'[a-z]{2,3}',value['language']), 'wikipedia: invalid language')
    require(type(value['pageId']) is int and value['pageId']>0, 'wikipedia: invalid pageId')
    return value

def encoded(bundle):
    # Non-ASCII is kept as UTF-8, matching JSON.stringify byte accounting in the app.
    return json.dumps(bundle, ensure_ascii=False, separators=(',', ':'), allow_nan=False)

def validate(bundle):
    require(type(bundle) is dict and set(bundle) == {'collections', 'items'}, 'expected collections/items bundle')
    cols, items = bundle['collections'], bundle['items']
    require(isinstance(cols, list) and len(cols) <= 30, 'at most 30 collections')
    require(isinstance(items, list) and len(items) <= 80, 'at most 80 events')
    ids = set()
    for c in cols:
        require(type(c) is dict and set(c) == {'id', 'name'}, 'collection: invalid fields')
        text(c['id'], 'collection id', 200)
        require(c['id'].startswith('list-') and c['id'] not in ids, 'duplicate or invalid collection id')
        ids.add(c['id'])
        text(c['name'], 'collection name', 80)
    event_ids = set()
    fields = {'id','year','date','title','place','lat','lon','layer','text','source','publisher'}
    for e in items:
        require(type(e) is dict and fields <= set(e) <= fields | {'wikipedia','endYear'}, 'event: invalid fields')
        text(e['id'], 'event id', 200)
        require(e['id'].startswith('custom-') and e['id'] not in event_ids, 'duplicate or invalid event id')
        event_ids.add(e['id'])
        require(e['layer'] in ids, 'event references missing list')
        year(e['year']); span(e); number(e['lat'], 'lat', 90); number(e['lon'], 'lon', 180)
        for k, limit in [('title',120),('place',120),('date',80),('publisher',120)]:
            text(e[k], k, limit)
        text(e['text'], 'text', 1200, empty='wikipedia' in e)
        source(e['source'])
        if 'wikipedia' in e: wikipedia(e['wikipedia'])
    require(len(encoded(bundle).encode('utf-8')) <= LIMIT, 'bundle exceeds 14500-byte map storage limit')
    return bundle

def digest(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()[:20]

def compile_lists(data):
    require(type(data) is dict and set(data) == {'lists'} and isinstance(data['lists'], list), 'expected lists array')
    bundle = {'collections': [], 'items': []}
    keys = set()
    for li in data['lists']:
        require(type(li) is dict and set(li) == {'key','title','kind','events'}, 'list: invalid fields')
        key = text(li['key'], 'stable list key', 100)
        require(key not in keys, 'duplicate list key'); keys.add(key)
        require(li['kind'] in ('historical','tradition','fiction'), 'kind: historical, tradition or fiction')
        require(isinstance(li['events'], list), 'events must be an array')
        layer = 'list-' + digest(key)
        bundle['collections'].append({'id':layer, 'name':li['title']})
        for raw in li['events']:
            required = {'year','title','place','lat','lon','source','publisher'}
            require(type(raw) is dict and required <= set(raw) <= required | {'text','date','uncertainty','wikipedia','endYear'}, 'source event: invalid fields')
            e = dict(raw)
            require('text' in e or 'wikipedia' in e, 'text or wikipedia required')
            e.setdefault('text','')
            span(e)
            uncertainty = text(e.pop('uncertainty', ''), 'uncertainty', 1000, empty=True)
            note = {'historical':'','tradition':'Attributed tradition, not independent historical verification. ',
                    'fiction':'Fictional chronology, not historical fact. '}[li['kind']]
            e['text'] = note + text(e['text'], 'text', 1200, empty='wikipedia' in e) + ('\nUncertainty: ' + uncertainty if uncertainty else '')
            e['date'] = e.get('date', year_label(e['year']) + ('\u2013' + year_label(e['endYear']) if 'endYear' in e else ''))
            span_key = '\0' + str(e['endYear']) if 'endYear' in e else ''
            e['id'] = 'custom-' + digest(key + '\0' + str(e['year']) + span_key + '\0' + str(e['title']) + '\0' + str(e['place']))
            e['layer'] = layer
            bundle['items'].append(e)
    bundle['items'].sort(key=lambda e:(e['year'],e['id']))
    return validate(bundle)

def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'), parse_constant=lambda _: (_ for _ in ()).throw(ValueError('non-finite JSON number')))

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    subs = ap.add_subparsers(dest='command', required=True)
    c = subs.add_parser('compile'); c.add_argument('input'); c.add_argument('--out', required=True)
    v = subs.add_parser('validate'); v.add_argument('input')
    args = ap.parse_args()
    try:
        data = read(args.input)
        result = compile_lists(data) if args.command == 'compile' else validate(data)
        if args.command == 'compile':
            with open(args.out, 'x', encoding='utf-8') as f:
                f.write(encoded(result))
        print(f'Valid: {len(result["collections"])} lists, {len(result["items"])} events, {len(encoded(result).encode("utf-8"))} bytes')
    except (ValueError, OSError, TypeError, KeyError) as exc:
        ap.exit(1, f'Error: {exc}\n')

if __name__ == '__main__':
    main()
