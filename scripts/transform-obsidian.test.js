const { test } = require('node:test');
const assert = require('node:assert/strict');
const ObsidianTransformer = require('./transform-obsidian');

const t = new ObsidianTransformer();

test('본문의 Obsidian 주석 %% %%은 제거된다', () => {
  const out = t.removeObsidianComments('앞 %% 숨김 %% 뒤\n\n%%\n블록\n%%\n끝');
  assert.equal(out, '앞  뒤\n\n끝');
});

test('펜스 코드 블록 안의 %%는 건드리지 않는다 (mermaid 주석)', () => {
  const src = [
    '본문 %% 주석 %%',
    '```mermaid',
    'gitGraph',
    '    %% 0-1 init',
    '    commit id: "a"',
    '    %% 0-2 staging',
    '    branch staging',
    '```',
    '뒤 %% 주석2 %%',
  ].join('\n');
  const out = t.removeObsidianComments(src);
  assert.match(out, /    %% 0-1 init\n    commit id: "a"\n    %% 0-2 staging/);
  assert.doesNotMatch(out, /주석/);
});

test('인라인 코드 안의 %%는 건드리지 않는다', () => {
  const out = t.removeObsidianComments('`%%` 기호는 %% 진짜 주석 %% 주석이다 `a %% b`');
  assert.equal(out, '`%%` 기호는  주석이다 `a %% b`');
});

test('validate는 코드 블록 안의 %%를 잔여 주석으로 경고하지 않는다', () => {
  const warned = [];
  const orig = console.warn;
  console.warn = (...a) => warned.push(a.join(' '));
  try {
    assert.equal(t.validate('```mermaid\n%% c\n```'), true);
    assert.equal(warned.length, 0);
    assert.equal(t.validate('본문 %% 남음 %%'), false);
    assert.equal(warned.length, 1);
  } finally {
    console.warn = orig;
  }
});

// ── 같은 글 안의 헤딩 링크 → rehype-slug(github-slugger) 앵커 ──────────────
// 블로그는 rehype-slug가 헤딩 id를 만들므로(tocUtil.ts와 동일 알고리즘),
// Obsidian에서 쓰는 세 가지 헤딩 링크 표기를 모두 그 id로 맞춘다.

const H = '4. 문서와 실무 사이의 연결 고리, Jira Story';
const HSLUG = '4-문서와-실무-사이의-연결-고리-jira-story';

test('꺾쇠 마크다운 링크 [텍스트](<#헤딩>)은 slug 앵커로 바뀐다', () => {
  assert.equal(t.convertHeadingLinks(`[아래](<#${H}>)`), `[아래](#${HSLUG})`);
});

test('%20 인코딩된 [텍스트](#헤딩%20…)도 slug 앵커로 바뀐다', () => {
  const enc = '#' + encodeURIComponent(H).replace(/%2C/g, ',');
  assert.equal(t.convertHeadingLinks(`[아래](${enc})`), `[아래](#${HSLUG})`);
});

test('위키링크 [[#헤딩]] / [[#헤딩|표시]]도 slug 앵커로 바뀐다', () => {
  assert.equal(t.convertHeadingLinks(`[[#${H}]]`), `[${H}](#${HSLUG})`);
  assert.equal(t.convertHeadingLinks(`[[#${H}|아래]]`), `[아래](#${HSLUG})`);
});

test('convertWikilinks 경로에서도 [[#헤딩]]은 unresolved가 아니라 앵커가 된다', () => {
  const out = t.convertWikilinks(`[[#${H}]] 그리고 [[없는글]]`, new Set(['other']));
  assert.equal(out, `[${H}](#${HSLUG}) 그리고 [없는글](unresolved:없는글)`);
});

test('이미 slug 형태인 앵커와 코드 안의 헤딩 링크는 건드리지 않는다', () => {
  assert.equal(t.convertHeadingLinks(`[아래](#${HSLUG})`), `[아래](#${HSLUG})`);
  const code = '`[x](<#a b>)` 와 ```\n[[#c d]]\n```';
  assert.equal(t.convertHeadingLinks(code), code);
});

test('다른 글을 가리키는 [[글#헤딩]]은 헤딩 링크 규칙의 대상이 아니다', () => {
  assert.equal(t.convertHeadingLinks('[[다른 글#절]]'), '[[다른 글#절]]');
});
