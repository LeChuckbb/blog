'use strict';

const CJK_WPM = 500; // 한글/CJK 분당 글자 수
const LATIN_WPM = 200; // 영어 분당 단어 수
const CODE_LINES_PER_MIN = 30; // 코드 블록 분당 줄 수

/**
 * CJK(한글, 한자, 일본어) 문자인지 판별
 */
function isCJK(char) {
  const code = char.codePointAt(0);
  return (
    (code >= 0x1100 && code <= 0x11ff) || // 한글 자모
    (code >= 0x3040 && code <= 0x309f) || // 히라가나
    (code >= 0x30a0 && code <= 0x30ff) || // 가타카나
    (code >= 0x3400 && code <= 0x4dbf) || // CJK 통합 한자 확장 A
    (code >= 0x4e00 && code <= 0x9fff) || // CJK 통합 한자
    (code >= 0xac00 && code <= 0xd7af) || // 한글 음절
    (code >= 0xf900 && code <= 0xfaff) || // CJK 호환 한자
    (code >= 0x20000 && code <= 0x2a6df)  // CJK 통합 한자 확장 B
  );
}

/**
 * 마크다운/MDX 본문에서 frontmatter와 코드 블록을 제거한 순수 텍스트 추출
 * @returns {{ text: string, codeLines: number }}
 */
function extractPlainText(content) {
  // frontmatter 제거 (--- ... --- 블록)
  let text = content.replace(/^---[\s\S]*?---\n?/, '');

  // 코드 블록 줄 수 카운트 후 제거
  let codeLines = 0;
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    const lines = match.split('\n');
    codeLines += Math.max(0, lines.length - 2); // ``` 열고 닫는 줄 제외
    return '';
  });

  // 인라인 코드 제거 (`...`)
  text = text.replace(/`[^`]+`/g, '');

  // MDX/HTML 태그 제거
  text = text.replace(/<[^>]+>/g, '');

  // 마크다운 링크 텍스트만 남김 ([text](url) → text)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 마크다운 이미지 제거
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '');

  // 헤딩 # 기호 제거
  text = text.replace(/^#{1,6}\s+/gm, '');

  // blockquote > 접두사 제거
  text = text.replace(/^>\s?/gm, '');

  // callout 메타 [!type] 제거
  text = text.replace(/\[![^\]]+\]/g, '');

  // 강조 기호 제거 (**bold**, *italic*, ~~strikethrough~~)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/~~([^~]+)~~/g, '$1');

  return { text, codeLines };
}

/**
 * CJK/비CJK 분리 계산으로 읽기 시간(분) 반환
 *
 * - CJK 글자 수 → CJK_WPM(500) 기준
 * - 비CJK 단어 수 → LATIN_WPM(200) 기준
 * - 최소 1분 반환
 *
 * @param {string} content - 원본 마크다운/MDX 콘텐츠
 * @returns {number} 읽기 시간 (분, 최소 1)
 */
function calculateReadingTime(content) {
  const { text, codeLines } = extractPlainText(content);

  let cjkCount = 0;
  let nonCjkText = '';

  for (const char of text) {
    if (isCJK(char)) {
      cjkCount++;
    } else {
      nonCjkText += char;
    }
  }

  // 비CJK 단어 수 (공백으로 분리)
  const latinWords = nonCjkText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  const cjkMinutes = cjkCount / CJK_WPM;
  const latinMinutes = latinWords / LATIN_WPM;
  const codeMinutes = codeLines / CODE_LINES_PER_MIN;

  return Math.max(1, Math.ceil(cjkMinutes + latinMinutes + codeMinutes));
}

module.exports = { calculateReadingTime };
