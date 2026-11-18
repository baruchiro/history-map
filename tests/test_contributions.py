import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from check_contributions import check

class ContributionTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); self.root=Path(self.tmp.name)
        self.data=json.loads((Path(__file__).resolve().parents[1]/'examples/minimal-input.json').read_text())
    def tearDown(self): self.tmp.cleanup()
    def write(self,name='spaceflight-launches-sample.json'):
        p=self.root/name; p.write_text(json.dumps(self.data)); return p
    def bad(self):
        with self.assertRaises((ValueError,TypeError)): check(self.root)
    def test_catalog(self):
        self.write(); self.assertEqual(check(self.root)['schemaVersion'],1)
    def test_no_files(self): self.bad()
    def test_filename_key_must_match(self): self.write('different.json'); self.bad()
    def test_nested_directory_rejected(self): (self.root/'nested').mkdir(); self.bad()
    def test_symlink_rejected(self):
        target=self.write(); (self.root/'linked.json').symlink_to(target); self.bad()
    def test_oversize(self):
        p=self.write(); p.write_text(' '*65537); self.bad()
    def test_empty_list(self):
        self.data['lists'][0]['events']=[]; self.write(); self.bad()
    def test_multiple_lists_per_file(self):
        self.data['lists'].append(copy.deepcopy(self.data['lists'][0])); self.write(); self.bad()
    def test_duplicate_json_key(self):
        p=self.write(); p.write_text('{"lists":[],"lists":[]}'); self.bad()
    def test_unrecognized_file(self): self.write('readme.md'); self.bad()

if __name__=='__main__': unittest.main()
