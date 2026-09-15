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
