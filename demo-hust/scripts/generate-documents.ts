import { mkdir, writeFile } from 'node:fs/promises';
import { documents, documentMarkdown } from '../src/lib/documents';
async function main(){await mkdir('public/tai-lieu',{recursive:true});for(const doc of documents)await writeFile(`public/tai-lieu/${doc.id}.md`,documentMarkdown(doc.id)!);console.log(`Generated ${documents.length} source documents.`);}
main().catch(e=>{console.error(e);process.exitCode=1;});
