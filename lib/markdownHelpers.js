/**
 * Shared markdown/Jina parsing helpers.
 * Used by: analyze.js, analyzer.js, proPageAnalyzer.js
 */

function mdHeadings(raw) {
  const result = [];
  for (const line of raw.split('\n')) {
    const h3 = line.match(/^###\s+(.+)/); if (h3) { result.push({ level: 'h3', text: h3[1].trim() }); continue; }
    const h2 = line.match(/^##\s+(.+)/);  if (h2) { result.push({ level: 'h2', text: h2[1].trim() }); continue; }
    const h1 = line.match(/^#\s+(.+)/);   if (h1) { result.push({ level: 'h1', text: h1[1].trim() }); }
  }
  return result;
}

function mdExternalLinks(raw, hostname) {
  const regex = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  const links = [];
  let m;
  while ((m = regex.exec(raw)) !== null) {
    if (!hostname || !m[2].includes(hostname)) links.push(m[2]);
  }
  return links;
}

function mdAllLinks(raw) {
  const regex = /\[([^\]]*)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g;
  const links = [];
  let m;
  while ((m = regex.exec(raw)) !== null) links.push(m[2].toLowerCase());
  return links;
}

function jinaTitle(raw) { return raw.match(/^Title:\s*(.+)/m)?.[1]?.trim() || ''; }
function jinaDescription(raw) { return raw.match(/^Description:\s*(.+)/m)?.[1]?.trim() || ''; }

module.exports = { mdHeadings, mdExternalLinks, mdAllLinks, jinaTitle, jinaDescription };
