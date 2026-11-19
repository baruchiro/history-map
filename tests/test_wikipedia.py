import copy,json,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from event_lists import compile_lists,wikipedia
class WikipediaTests(unittest.TestCase):
 def test_explicit_ref_without_authored_description(self):
  data=json.loads((Path(__file__).resolve().parents[1]/'examples/minimal-input.json').read_text())
  event=data['lists'][0]['events'][0];event.pop('text');event['wikipedia']={'language':'en','pageId':19445}
  compiled=compile_lists(data)['items'][0]
  self.assertNotIn('Apollo',compiled['text']);self.assertEqual(compiled['wikipedia']['pageId'],19445)
 def test_no_description_and_no_reference_rejected(self):
  data=json.loads((Path(__file__).resolve().parents[1]/'examples/minimal-input.json').read_text());data['lists'][0]['events'][0].pop('text')
  with self.assertRaises(ValueError):compile_lists(data)
 def test_references_reject_urls_and_unknown_fields(self):
  for ref in [{'language':'https://evil.invalid','pageId':1},{'language':'en','pageId':True},{'language':'en','pageId':0},{'language':'en','pageId':1,'url':'https://evil.invalid'}]:
   with self.assertRaises(ValueError):wikipedia(ref)
if __name__=='__main__':unittest.main()
