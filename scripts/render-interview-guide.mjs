import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const input = resolve(root, 'docs/INTERVIEW_DEMO_GUIDE.md');
const output = resolve(root, 'docs/INTERVIEW_DEMO_GUIDE.html');
const source = await readFile(input, 'utf8');

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const inline = (value) => escapeHtml(value)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const lines = source.replaceAll('\r\n', '\n').split('\n');
const body = [];
let paragraph = [];
let listType = null;
let quote = [];
let code = [];
let inCode = false;

function closeParagraph() {
  if (paragraph.length) body.push(`<p>${inline(paragraph.join(' '))}</p>`);
  paragraph = [];
}

function closeList() {
  if (listType) body.push(`</${listType}>`);
  listType = null;
}

function closeQuote() {
  if (quote.length) body.push(`<blockquote>${inline(quote.join(' '))}</blockquote>`);
  quote = [];
}

function closeFlow() {
  closeParagraph();
  closeList();
  closeQuote();
}

for (const line of lines) {
  if (line.startsWith('```')) {
    closeFlow();
    if (inCode) {
      body.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      code = [];
    }
    inCode = !inCode;
    continue;
  }
  if (inCode) { code.push(line); continue; }

  const heading = line.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    closeFlow();
    const level = heading[1].length;
    body.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    continue;
  }

  const bullet = line.match(/^[-*]\s+(.+)$/);
  const numbered = line.match(/^\d+\.\s+(.+)$/);
  if (bullet || numbered) {
    closeParagraph(); closeQuote();
    const wanted = bullet ? 'ul' : 'ol';
    if (listType !== wanted) { closeList(); body.push(`<${wanted}>`); listType = wanted; }
    body.push(`<li>${inline((bullet || numbered)[1])}</li>`);
    continue;
  }

  if (line.startsWith('> ')) {
    closeParagraph(); closeList();
    quote.push(line.slice(2));
    continue;
  }

  if (!line.trim()) { closeFlow(); continue; }
  closeList(); closeQuote();
  paragraph.push(line.trim());
}
closeFlow();

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Interview and Demo Guide</title>
<style>
  @page { size: A4; margin: 17mm 17mm 19mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #202536; font: 10.5pt/1.55 "Segoe UI", Arial, sans-serif; }
  h1 { margin: 0 0 8mm; color: #332a88; font-size: 27pt; line-height: 1.12; letter-spacing: -.5pt; }
  h1::after { content: "Task Management System · Interview Preparation"; display: block; margin-top: 3mm; color: #697087; font-size: 10pt; font-weight: 500; letter-spacing: .2pt; }
  h2 { margin: 9mm 0 3mm; padding-bottom: 1.5mm; color: #4338a0; border-bottom: 1px solid #d9d7ef; font-size: 18pt; line-height: 1.2; break-after: avoid; }
  h3 { margin: 5mm 0 1.5mm; color: #34394d; font-size: 12.5pt; break-after: avoid; }
  p { margin: 0 0 3mm; }
  ul, ol { margin: 1mm 0 4mm; padding-left: 7mm; }
  li { margin: 1mm 0; }
  strong { color: #252a3d; }
  code { padding: .2mm 1mm; border-radius: 3px; background: #f0eff8; color: #4338a0; font: 9.5pt Consolas, monospace; }
  pre { margin: 3mm 0 5mm; padding: 4mm; border-left: 3px solid #6658dc; border-radius: 4px; background: #f5f5fa; white-space: pre-wrap; break-inside: avoid; }
  pre code { padding: 0; background: transparent; color: #252a3d; font-size: 9pt; }
  blockquote { margin: 3mm 0 5mm; padding: 3mm 4mm; border-left: 3px solid #6658dc; background: #f7f6fc; color: #444b62; font-style: italic; break-inside: avoid; }
  h2 + h3 { margin-top: 3mm; }
  @media print { h2 { break-before: auto; } a { color: inherit; text-decoration: none; } }
</style></head><body>${body.join('\n')}</body></html>`;

await writeFile(output, html);
console.log(output);
