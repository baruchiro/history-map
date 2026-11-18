import json,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'docs/site/borders'
class BorderTests(unittest.TestCase):
 def test_provenance(self):
  p=json.loads((ROOT/'provenance.json').read_text());self.assertEqual(p['license'],'CC BY 4.0');self.assertEqual(p['records'],13797)
 def test_persian_periods_retained(self):
  rows=json.loads((ROOT/'-1000.json').read_text())+json.loads((ROOT/'-500.json').read_text())
  a={x['id']:x for x in rows if x['name']=='Achaemenid Empire'};self.assertEqual(len(a),13)
  active=[x for x in a.values() if x['from']<=-500<=x['to']];self.assertEqual(len(active),1);self.assertEqual(active[0]['to'],-481)
 def test_chunks_have_valid_periods_and_paths(self):
  for p in ROOT.glob('*.json'):
   if p.stem=='provenance':continue
   start=int(p.stem);end=start+(499 if start<1500 else 99)
   for x in json.loads(p.read_text()):
    self.assertLessEqual(x['from'],x['to']);self.assertLessEqual(x['from'],end);self.assertGreaterEqual(x['to'],start);self.assertTrue(x['d'].startswith('M'));self.assertTrue(x['d'].endswith('Z'))
