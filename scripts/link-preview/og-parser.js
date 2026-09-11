/**
 * HTML 문자열에서 Open Graph 메타를 추출한다. 네트워크 없음.
 * 검사 범위는 </head>까지(상한 2MB). </head>가 없으면 앞 200KB만 본다.
 * YouTube처럼 <head> 안에 수백 KB 인라인 스크립트를 두는 사이트가 있어
 * 고정 200KB로 자르면 og:* 를 놓친다.
 */
const HEAD_LIMIT = 200 * 1024;
const HEAD_HARD_LIMIT = 2 * 1024 * 1024;

function headSection(html) {
  const end = html.search(/<\/head\s*>/i);
  return end === -1 ? html.slice(0, HEAD_LIMIT) : html.slice(0, Math.min(end, HEAD_HARD_LIMIT));
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

function clean(s) {
  return decodeEntities(s).replace(/\s+/g, ' ').trim();
}

/**
 * <meta ... property|name="key" ... content="..."> 를 속성 순서와 무관하게 찾는다.
 */
function readMeta(html, key) {
  const tagRe = /<meta\b[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(html))) {
    const tag = m[0];
    const keyMatch = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i);
    if (!keyMatch || keyMatch[1].toLowerCase() !== key) continue;
    const contentMatch = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i);
    if (contentMatch && contentMatch[1].trim()) return clean(contentMatch[1]);
  }
  return null;
}

function readTitleTag(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m && m[1].trim() ? clean(m[1]) : null;
}

function toAbsolute(url, base) {
  if (!url) return null;
  try {
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

function parseOpenGraph(html, pageUrl) {
  const head = headSection(html);
  return {
    title: readMeta(head, 'og:title') ?? readTitleTag(head),
    description: readMeta(head, 'og:description') ?? readMeta(head, 'description'),
    image: toAbsolute(readMeta(head, 'og:image'), pageUrl),
    siteName: readMeta(head, 'og:site_name'),
  };
}

module.exports = { parseOpenGraph };
