#!/usr/bin/env python3
"""Validate data-only list contributions and build a reviewable catalog. No network."""
import argparse
import json
import os
from pathlib import Path
import re
import sys
from event_lists import compile_lists, encoded

MAX_FILES = 200
MAX_SOURCE_BYTES = 65536

def check(root):
    root = Path(root)
    if not root.is_dir() or root.is_symlink():
        raise ValueError('lists must be a real directory')
    entries = sorted(root.iterdir())
    if not entries or len(entries) > MAX_FILES:
        raise ValueError('catalog requires 1..200 list files')
    catalog = {'schemaVersion': 1, 'lists': []}
    seen = set()
    for path in entries:
        if path.is_symlink() or not path.is_file() or not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,79}\.json', path.name):
            raise ValueError('lists directory must contain only regular slug-named JSON files')
        if path.stat().st_size > MAX_SOURCE_BYTES:
            raise ValueError('list file exceeds 64 KiB')
        raw = path.read_text(encoding='utf-8')
        def pairs(rows):
            obj={}
            for key,value in rows:
                if key in obj: raise ValueError('duplicate JSON object key')
                obj[key]=value
            return obj
        data = json.loads(raw, object_pairs_hook=pairs)
        if not isinstance(data, dict) or set(data) != {'lists'} or not isinstance(data['lists'], list) or len(data['lists']) != 1:
            raise ValueError('each contribution file contains exactly one list')
        li = data['lists'][0]
        b = compile_lists(data)
        if not b['items']: raise ValueError('list must contain at least one event')
        if li['key'] != path.stem: raise ValueError('list key must match filename')
        if li['key'] in seen: raise ValueError('duplicate list key')
        seen.add(li['key'])
        catalog['lists'].append({'key':li['key'],'title':li['title'],'kind':li['kind'],'library':b})
    return catalog

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('lists_dir'); ap.add_argument('--out')
    args=ap.parse_args()
    try:
        result=check(args.lists_dir)
        if args.out:
            out=Path(args.out)
            with out.open('x', encoding='utf-8') as f: f.write(encoded(result))
        print(f'Valid catalog: {len(result["lists"])} lists. Structural checks only; human content review still required.')
    except (ValueError, OSError, TypeError, KeyError) as exc:
        # Do not echo contributor-controlled payloads into CI workflow commands.
        print('Contribution validation failed: ' + type(exc).__name__, file=sys.stderr)
        return 1
    return 0

if __name__=='__main__': raise SystemExit(main())
