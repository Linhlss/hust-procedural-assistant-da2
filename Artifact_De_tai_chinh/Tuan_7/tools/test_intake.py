import unittest,tempfile,json
from pathlib import Path
from intake import receive,check,check_faq,digest

class IntakeTests(unittest.TestCase):
    def test_dry_run_and_receipt_preserve_original_and_unknown_metadata(self):
        with tempfile.TemporaryDirectory() as t:
            p=Path(t);file=p/'quy-dinh.txt';file.write_text('Nội dung thử, không phải HUST.')
            before=digest(file);root=p/'received'
            self.assertFalse(receive(root,[file],'Synthetic test')['applied']);self.assertFalse(root.exists())
            receive(root,[file],'Synthetic test',scopes=['T6'],requests=['D07'],apply=True)
            data=json.loads((root/'register.json').read_text())['sources'][0]
            self.assertEqual(digest(root/data['originalPath']),before);self.assertEqual(digest(file),before)
            self.assertIsNone(data['effectiveFrom']);self.assertEqual(data['permissions']['model']['state'],'unknown')
            self.assertTrue(check(root)['valid'])
            (root/data['originalPath']).write_text('changed')
            self.assertFalse(check(root)['valid'])
    def test_duplicate_contents_keep_both_provenance_receipts(self):
        with tempfile.TemporaryDirectory() as t:
            p=Path(t);a=p/'a.txt';b=p/'b.txt';a.write_text('same');b.write_text('same');root=p/'received'
            receive(root,[a],'first source',apply=True);receive(root,[b],'second source',apply=True)
            rows=json.loads((root/'register.json').read_text())['sources']
            self.assertEqual(len(rows),1);self.assertEqual(len(rows[0]['receipts']),2)
            self.assertEqual(rows[0]['sourceStatus'],'unverified_original')
    def test_faq_split_leakage_and_unsubstantiated_frequency_are_visible(self):
        with tempfile.TemporaryDirectory() as t:
            p=Path(t)/'faq.json'
            base={'question':'Cần chuẩn bị gì?','caseGroup':'case-1','card':'T6','origin':'synthetic','answerStatus':'pending'}
            p.write_text(json.dumps({'records':[dict(base,id='1',split='development'),dict(base,id='2',split='heldout',frequency='frequent')]}))
            result=check_faq(p);self.assertFalse(result['valid']);self.assertEqual(len(result['issues']),2)
if __name__=='__main__':unittest.main()
