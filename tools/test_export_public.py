import importlib.util,json,subprocess,tempfile,unittest,unicodedata
from pathlib import Path
from export_public import scrub,exclusion,export,ROOT_REPORT

class PublicExportTests(unittest.TestCase):
    def test_unicode_identity_and_contacts_are_removed_without_changing_synthetic_policy(self):
        who={'names':['Nguyễn Văn A','NguyenVanA'],'student_id':'11111111','emails':['student-private@example.invalid']}
        fake_source=Path('/Users')/'example'/'Documents'/'project'
        text=f'Nguyễn Văn A / NguyenVanA / 11111111 / student-private@example.invalid {fake_source} / 20/11/2026 / SIM-NV-1'
        result=scrub(text,who,fake_source)
        for private in ['Nguyễn Văn A','NguyenVanA','11111111','student-private@example.invalid',str(fake_source.parent.parent)]:self.assertNotIn(private,result)
        self.assertIn('20/11/2026 / SIM-NV-1',result)
        self.assertNotIn(unicodedata.normalize('NFD','Nguyễn Văn A'),scrub(unicodedata.normalize('NFD',text),who,fake_source))
    def test_private_and_generated_paths_are_excluded_but_fixture_source_remains(self):
        for value in ['demo-hust/.env.local','demo-hust/.vercel/project.json','Artifact_De_tai_chinh/Tuan_7/received/register.json','Artifact_tham_khao/Quy_dinh_HUST_2026/originals/file.pdf','report.xlsx','report.pdf','AGENTS.md']:
            self.assertIsNotNone(exclusion(Path(value)),value)
        self.assertIsNone(exclusion(Path('demo-hust/src/data/documents.json')))
        self.assertIsNone(exclusion(Path('demo-hust/.env.example')))
    def test_fresh_export_respects_deletion_and_tracked_secret_without_editing_source(self):
        with tempfile.TemporaryDirectory() as temporary:
            base=Path(temporary);source=base/'private';out=base/'public';source.mkdir()
            subprocess.run(['git','init','-q',str(source)],check=True)
            config=source/ROOT_REPORT/'config/thong_tin.tex';config.parent.mkdir(parents=True)
            config.write_text('\\newcommand{\\HoTenSinhVien}{Nguyễn Văn A}\n\\newcommand{\\MaSoSinhVien}{11111111}\n\\newcommand{\\EmailSinhVien}{student-private@example.invalid}\n')
            app=source/'demo-hust';(app/'docs').mkdir(parents=True);(app/'docs/source-manifest.json').write_text('{"sources":[]}')
            (app/'.env.example').write_text('GEMINI_API_KEY=TEST_MUST_BE_REMOVED\nCHAT_ADAPTER=fixture\n')
            (source/'.gitignore').write_text('.env.local\n');(source/'.env.local').write_text('PRIVATE_TEST_ONLY')
            (source/'deleted.md').write_text('removed')
            subprocess.run(['git','-C',str(source),'add','-f','.env.local','deleted.md'],check=True)
            (source/'deleted.md').unlink()
            before=config.read_bytes();result=export(source,out,True)
            self.assertTrue(result['apply']);self.assertEqual(config.read_bytes(),before)
            self.assertFalse((out/'.env.local').exists());self.assertFalse((out/'deleted.md').exists())
            self.assertNotIn('TEST_MUST_BE_REMOVED',(out/'demo-hust/.env.example').read_text())
            self.assertIn('Sinh viên',(out/ROOT_REPORT/'config/thong_tin.tex').read_text())
            self.assertFalse((out/'.git').exists())
            with self.assertRaises(ValueError):export(source,source/'nested',True)

if __name__=='__main__':unittest.main()
