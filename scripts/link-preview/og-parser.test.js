const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseOpenGraph } = require('./og-parser');

test('og:* 메타를 읽는다', () => {
  const html = `<html><head>
    <meta property="og:title" content="History - Web API">
    <meta property="og:description" content="브라우저 세션 기록">
    <meta property="og:image" content="https://mdn.dev/share.png">
    <meta property="og:site_name" content="MDN">
    <title>무시될 title</title>
  </head></html>`;
  assert.deepEqual(parseOpenGraph(html, 'https://mdn.dev/x'), {
    title: 'History - Web API',
    description: '브라우저 세션 기록',
    image: 'https://mdn.dev/share.png',
    siteName: 'MDN',
  });
});

test('og:title이 없으면 <title>, description은 meta name=description으로 폴백', () => {
  const html = `<head><title>  Plain  Page </title>
    <meta name="description" content="일반 설명"></head>`;
  const r = parseOpenGraph(html, 'https://a.com');
  assert.equal(r.title, 'Plain Page');
  assert.equal(r.description, '일반 설명');
  assert.equal(r.image, null);
  assert.equal(r.siteName, null);
});

test('content가 property보다 앞에 와도 읽는다', () => {
  const html = `<meta content="역순" property="og:title">`;
  assert.equal(parseOpenGraph(html, 'https://a.com').title, '역순');
});

test('상대 경로 og:image는 페이지 URL 기준 절대 URL로', () => {
  const html = `<meta property="og:image" content="/img/og.png">`;
  assert.equal(parseOpenGraph(html, 'https://a.com/posts/1').image, 'https://a.com/img/og.png');
});

test('HTML 엔티티를 디코드한다', () => {
  const html = `<meta property="og:title" content="A &amp; B &#39;C&#39; &quot;D&quot; &lt;E&gt;">`;
  assert.equal(parseOpenGraph(html, 'https://a.com').title, `A & B 'C' "D" <E>`);
});

test('아무것도 없으면 전부 null', () => {
  assert.deepEqual(parseOpenGraph('<p>hi</p>', 'https://a.com'), {
    title: null, description: null, image: null, siteName: null,
  });
});

test('<head>가 크더라도(200KB 초과 인라인 스크립트) </head> 앞의 메타는 읽는다', () => {
  const bigScript = `<script>${'x'.repeat(300 * 1024)}</script>`;
  const html = `<html><head>${bigScript}<meta property="og:title" content="Late"></head><body></body></html>`;
  assert.equal(parseOpenGraph(html, 'https://a.com').title, 'Late');
});

test('</head>가 없으면 앞 200KB만 본다', () => {
  const html = `${'y'.repeat(250 * 1024)}<meta property="og:title" content="TooLate">`;
  assert.equal(parseOpenGraph(html, 'https://a.com').title, null);
});
