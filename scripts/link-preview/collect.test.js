const { test } = require('node:test');
const assert = require('node:assert/strict');
const { extractExternalUrls, collectLinkPreviews } = require('./collect');

test('extractExternalUrls: 외부 링크만, 이미지 제외, 중복 제거', () => {
  const mdx = [
    '본문 [MDN](https://developer.mozilla.org/ko/docs/A) 과',
    '![그림](https://my-personal-image-bucket.s3.ap-northeast-2.amazonaws.com/x.png)',
    '[내부](/posts/redux-1) [앵커](#top)',
    '[또 MDN](https://developer.mozilla.org/ko/docs/A)',
    '[유튜브](https://www.youtube.com/watch?v=1 "제목")',
  ].join('\n');
  assert.deepEqual(extractExternalUrls(mdx), [
    'https://developer.mozilla.org/ko/docs/A',
    'https://www.youtube.com/watch?v=1',
  ]);
});

function okResponse(html) {
  return { ok: true, status: 200, headers: new Map([['content-type', 'text/html']]), text: async () => html };
}

test('collectLinkPreviews: 새 URL은 fetch해서 성공 항목으로 저장', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return okResponse('<meta property="og:title" content="T"><meta property="og:description" content="D">');
  };
  const now = () => new Date('2026-09-11T00:00:00Z');
  const out = await collectLinkPreviews({ urls: ['https://a.com/1'], cache: {}, fetchImpl, now });
  assert.deepEqual(calls, ['https://a.com/1']);
  assert.deepEqual(out['https://a.com/1'], {
    title: 'T', description: 'D', image: null, siteName: null,
    fetchedAt: '2026-09-11T00:00:00.000Z',
  });
});

test('collectLinkPreviews: 성공 캐시는 다시 fetch하지 않는다', async () => {
  let n = 0;
  const cache = { 'https://a.com/1': { title: 'T', fetchedAt: '2026-01-01T00:00:00.000Z' } };
  const out = await collectLinkPreviews({ urls: ['https://a.com/1'], cache, fetchImpl: async () => { n++; return okResponse(''); } });
  assert.equal(n, 0);
  assert.deepEqual(out, cache);
});

test('collectLinkPreviews: HTTP 실패는 error로 기록', async () => {
  const fetchImpl = async () => ({ ok: false, status: 404, headers: new Map(), text: async () => '' });
  const now = () => new Date('2026-09-11T00:00:00Z');
  const out = await collectLinkPreviews({ urls: ['https://a.com/gone'], cache: {}, fetchImpl, now });
  assert.deepEqual(out['https://a.com/gone'], { error: 'HTTP 404', fetchedAt: '2026-09-11T00:00:00.000Z' });
});

test('collectLinkPreviews: title 없으면 실패 처리', async () => {
  const out = await collectLinkPreviews({
    urls: ['https://a.com/x'], cache: {},
    fetchImpl: async () => okResponse('<p>no title</p>'),
    now: () => new Date('2026-09-11T00:00:00Z'),
  });
  assert.equal(out['https://a.com/x'].error, 'no title');
});

test('collectLinkPreviews: 실패 항목은 7일 지나야 재시도', async () => {
  let n = 0;
  const fetchImpl = async () => { n++; return okResponse('<title>Back</title>'); };
  const recent = { 'https://a.com/x': { error: 'HTTP 500', fetchedAt: '2026-09-10T00:00:00.000Z' } };
  const stale  = { 'https://a.com/x': { error: 'HTTP 500', fetchedAt: '2026-09-01T00:00:00.000Z' } };
  const now = () => new Date('2026-09-11T00:00:00Z');

  await collectLinkPreviews({ urls: ['https://a.com/x'], cache: recent, fetchImpl, now });
  assert.equal(n, 0);

  const out = await collectLinkPreviews({ urls: ['https://a.com/x'], cache: stale, fetchImpl, now });
  assert.equal(n, 1);
  assert.equal(out['https://a.com/x'].title, 'Back');
});

test('collectLinkPreviews: fetch 예외(타임아웃 등)도 error로 기록하고 계속 진행', async () => {
  const fetchImpl = async (url) => {
    if (url.endsWith('/bad')) throw new Error('timeout');
    return okResponse('<title>Good</title>');
  };
  const out = await collectLinkPreviews({
    urls: ['https://a.com/bad', 'https://a.com/good'], cache: {}, fetchImpl,
    now: () => new Date('2026-09-11T00:00:00Z'),
  });
  assert.equal(out['https://a.com/bad'].error, 'timeout');
  assert.equal(out['https://a.com/good'].title, 'Good');
});

test('collectLinkPreviews: 동시성 제한을 지킨다', async () => {
  let inFlight = 0, peak = 0;
  const fetchImpl = async () => {
    inFlight++; peak = Math.max(peak, inFlight);
    await new Promise((r) => setTimeout(r, 5));
    inFlight--;
    return okResponse('<title>x</title>');
  };
  const urls = Array.from({ length: 12 }, (_, i) => `https://a.com/${i}`);
  await collectLinkPreviews({ urls, cache: {}, fetchImpl, concurrency: 3 });
  assert.equal(peak, 3);
});

test('collectLinkPreviews: 캐시에만 있고 본문에 없는 URL은 버린다', async () => {
  const cache = { 'https://a.com/removed': { title: 'old', fetchedAt: '2026-01-01T00:00:00.000Z' } };
  const out = await collectLinkPreviews({ urls: [], cache, fetchImpl: async () => okResponse('') });
  assert.deepEqual(out, {});
});
