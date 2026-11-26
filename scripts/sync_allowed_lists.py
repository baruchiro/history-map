#!/usr/bin/env python3
"""Regenerate workers/analytics/allowed-lists.json from docs/site/catalog.json."""
import json,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
cat=json.loads((root/'docs/site/catalog.json').read_text(encoding='utf-8'))
(root/'workers/analytics/allowed-lists.json').write_text(json.dumps({"lists":sorted(l['key'] for l in cat['lists'])},indent=1)+"\n",encoding='utf-8')
