const { parseOpenGraph } = require('./og-parser');

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const USER_AGENT = 'Mozilla/5.0 (compatible; blog-link-preview/1.0; +https://github.com/LeChuckbb)';

/**
 * MDX 본문에서 외부 링크 URL을 추출한다.
 * - `![alt](url)` 이미지는 제외 (S3 이미지가 다수)
 * - `[text](url "title")` 의 title 부분은 잘라낸다
 * - http(s)만, 등장 순서 유지, 중복 제거
 */
function extractExternalUrls(mdx) {
  const seen = new Set();
  const re = /(!?)\[[^\]]*\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(mdx))) {
    if (m[1] === '!') continue;
    seen.add(m[2]);
  }
  return [...seen];
}

function isFresh(entry, nowMs, retryErrorAfterMs) {
  if (!entry) return false;
  if (!entry.error) return true; // 성공 항목은 영구
  const fetchedAt = Date.parse(entry.fetchedAt || 0);
  return nowMs - fetchedAt < retryErrorAfterMs;
}

async function fetchOne(url, { fetchImpl, timeoutMs, nowIso }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml' },
    });
    if (!res.ok) return { error: `HTTP ${res.status}`, fetchedAt: nowIso };
    const html = await res.text();
    const og = parseOpenGraph(html, url);
    if (!og.title) return { error: 'no title', fetchedAt: nowIso };
    return { ...og, fetchedAt: nowIso };
  } catch (err) {
    const msg = err && err.name === 'AbortError' ? 'timeout' : String((err && err.message) || err);
    return { error: msg, fetchedAt: nowIso };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 외부 URL들의 OG 메타를 증분 수집한다.
 * 성공 항목은 재수집하지 않고, 실패 항목은 retryErrorAfterMs 경과 시 재시도.
 * 본문에서 사라진 URL은 결과에서 제거한다. 입력 cache는 변경하지 않는다.
 */
async function collectLinkPreviews({
  urls,
  cache,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  concurrency = 5,
  timeoutMs = 5000,
  retryErrorAfterMs = SEVEN_DAYS,
  log = () => {},
}) {
  const nowDate = now();
  const nowMs = nowDate.getTime();
  const nowIso = nowDate.toISOString();

  const result = {};
  const queue = [];
  for (const url of urls) {
    if (isFresh(cache[url], nowMs, retryErrorAfterMs)) result[url] = cache[url];
    else queue.push(url);
  }

  log(`🔗 링크 미리보기: 캐시 ${Object.keys(result).length}개, 수집 ${queue.length}개`);

  let next = 0;
  async function worker() {
    while (next < queue.length) {
      const url = queue[next++];
      const entry = await fetchOne(url, { fetchImpl, timeoutMs, nowIso });
      result[url] = entry;
      log(entry.error ? `  ✗ ${url} (${entry.error})` : `  ✓ ${url}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));

  // 키를 정렬해 diff가 안정되게 한다
  return Object.fromEntries(Object.keys(result).sort().map((k) => [k, result[k]]));
}

module.exports = { extractExternalUrls, collectLinkPreviews };
