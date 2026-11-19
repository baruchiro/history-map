import copy
import json
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from event_lists import compile_lists, validate, encoded

class ListsTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads((Path(__file__).resolve().parents[1] / 'examples/minimal-input.json').read_text())
    def event(self):
        return self.data['lists'][0]['events'][0]
    def bad(self):
        with self.assertRaises((ValueError, TypeError)):
            compile_lists(self.data)
    def test_compiles_and_roundtrips(self):
        b=compile_lists(self.data)
        self.assertEqual(validate(json.loads(encoded(b))), b)
    def test_ids_are_stable(self):
        self.assertEqual(compile_lists(self.data), compile_lists(copy.deepcopy(self.data)))
    def test_zero_year_rejected(self):
        self.event()['year']=0; self.bad()
    def test_fractional_year_rejected(self):
        self.event()['year']=1.5; self.bad()
    def test_bce_label(self):
        self.event()['year']=-1; del self.event()['date']
        self.assertEqual(compile_lists(self.data)['items'][0]['date'], '1 BCE')
    def test_nonfinite_rejected(self):
        self.event()['lat']=float('nan'); self.bad()
    def test_coordinate_range(self):
        self.event()['lon']=181; self.bad()
    def test_bad_source(self):
        self.event()['source']='javascript:alert(1)'; self.bad()
    def test_credentials_rejected(self):
        self.event()['source']='https://secret@example.com/'; self.bad()
    def test_duplicate_events(self):
        self.data['lists'][0]['events']*=2; self.bad()
    def test_duplicate_lists(self):
        self.data['lists']*=2; self.bad()
    def test_unknown_fields(self):
        self.event()['execute']='no'; self.bad()
    def test_tradition_label(self):
        self.data['lists'][0]['kind']='tradition'
        self.assertIn('Attributed tradition', compile_lists(self.data)['items'][0]['text'])
    def test_size_budget(self):
        e=self.event(); self.data['lists'][0]['events']=[]
        for i in range(20):
            x=dict(e); x['title']=f'Event {i}'; x['text']='א'*1000
            self.data['lists'][0]['events'].append(x)
        self.bad()
    def test_overlong_caveat_not_truncated(self):
        self.event()['text']='x'*1200; self.event()['uncertainty']='Important caveat'; self.bad()
    def test_dangling_layer(self):
        b=compile_lists(self.data); b['items'][0]['layer']='list-missing'
        with self.assertRaises(ValueError): validate(b)
    def test_two_lists_comparison(self):
        other=copy.deepcopy(self.data['lists'][0]); other['key']='another-list'
        self.data['lists'].append(other)
        b=compile_lists(self.data); self.assertEqual(len(b['collections']),2)
        self.assertNotEqual(b['items'][0]['id'], b['items'][1]['id'])
    def test_end_year_roundtrips(self):
        self.event()['endYear']=2024
        b=compile_lists(self.data)
        self.assertEqual(b['items'][0]['endYear'], 2024)
        self.assertEqual(validate(json.loads(encoded(b))), b)
    def test_end_year_default_date_labels_span(self):
        self.event()['endYear']=2024; self.event().pop('date', None)
        self.assertEqual(compile_lists(self.data)['items'][0]['date'], '1969\u20132024')
    def test_end_year_bce_default_date(self):
        self.event()['year']=-500; self.event()['endYear']=-400; self.event().pop('date', None)
        self.assertEqual(compile_lists(self.data)['items'][0]['date'], '500 BCE\u2013400 BCE')
    def test_end_year_must_follow_year(self):
        self.event()['endYear']=1900; self.bad()
    def test_end_year_equal_rejected(self):
        self.event()['endYear']=self.event()['year']; self.bad()
    def test_end_year_zero_rejected(self):
        self.event()['endYear']=0; self.bad()
    def test_end_year_fractional_rejected(self):
        self.event()['endYear']=1033.5; self.bad()
    def test_point_event_ids_unchanged_by_span_support(self):
        base=compile_lists(copy.deepcopy(self.data))
        again=compile_lists(copy.deepcopy(self.data))
        self.assertEqual(base['items'][0]['id'], again['items'][0]['id'])
        self.assertNotIn('endYear', base['items'][0])
    def test_span_changes_event_identity(self):
        base=compile_lists(copy.deepcopy(self.data))['items'][0]['id']
        self.event()['endYear']=2024
        self.assertNotEqual(base, compile_lists(self.data)['items'][0]['id'])

if __name__=='__main__': unittest.main()
