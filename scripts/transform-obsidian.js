const matter = require('gray-matter');

/**
 * Obsidian 마크다운을 MDX로 변환하는 클래스
 * @mdx-js/mdx 컴파일러를 사용하여 모든 MDX 호환성 문제를 자동으로 해결
 */
class ObsidianTransformer {
  constructor(options = {}) {
    this.options = {
      removeComments: true,
      convertWikilinks: true,
      cleanFrontmatter: true,
      processImages: true,
      ...options,
    };
    
    // MDX 컴파일러와 플러그인들을 dynamic import로 로드
    this.compile = null;
    this.remarkFrontmatter = null;
    this.remarkGfm = null;
  }

  async initializeCompiler() {
    if (!this.compile) {
      const [
        { compile },
        remarkFrontmatter,
        remarkGfm
      ] = await Promise.all([
        import('@mdx-js/mdx'),
        import('remark-frontmatter'),
        import('remark-gfm')
      ]);
      
      this.compile = compile;
      this.remarkFrontmatter = remarkFrontmatter.default;
      this.remarkGfm = remarkGfm.default;
    }
  }

  /**
   * 메인 변환 함수
   * @param {string} content - Obsidian 마크다운 콘텐츠
   * @param {string} filename - 파일명 (slug 생성용)
   * @returns {Promise<object>} { content, frontmatter }
   */
  async transform(content, filename) {
    // frontmatter와 content 분리
    const parsed = matter(content);
    let transformedContent = parsed.content;

    // 1단계: Obsidian 특수 문법 처리 (기존 로직 유지)
    if (this.options.removeComments) {
      transformedContent = this.removeObsidianComments(transformedContent);
    }

    // 블록 참조 ID(^xxxxxx) 제거 — 블로그에서는 의미 없는 앵커
    transformedContent = this.removeBlockIds(transformedContent);

    if (this.options.convertWikilinks) {
      transformedContent = this.convertWikilinks(transformedContent, this.options.existingSlugs);
    }

    if (this.options.processImages) {
      transformedContent = this.processImages(transformedContent);
    }

    // 코드 펜스 언어 태그 정규화 (``` mermaid → ```mermaid)
    transformedContent = this.normalizeCodeFenceLanguage(transformedContent);

    // MDX 특수문자 이스케이프 (코드 블록 바깥의 <, {}, <!-- --> 처리)
    transformedContent = this.escapeMdxSpecialChars(transformedContent);

    // 2단계: @mdx-js/mdx로 완전한 MDX 변환 (라이브러리가 모든 호환성 문제 해결)
    try {
      // MDX 컴파일러 초기화 확인
      await this.initializeCompiler();
      
      // MDX 컴파일 옵션
      const mdxOptions = {
        remarkPlugins: [this.remarkFrontmatter, this.remarkGfm],
        development: false,
        format: 'mdx'
      };
      
      await this.compile(transformedContent, mdxOptions); // 검증만 수행

      // frontmatter 처리
      const frontmatter = this.options.cleanFrontmatter
        ? this.cleanFrontmatter(parsed.data, filename)
        : parsed.data;

      // frontmatter와 content 다시 결합 (원본 마크다운 사용, JS 컴파일 결과 아님)
      const finalContent = matter.stringify(transformedContent, frontmatter);

      return {
        content: finalContent,
        frontmatter,
      };
    } catch (error) {
      console.error(`MDX 컴파일 오류 (${filename}):`, error.message);
      throw error;
    }
  }

  /**
   * Obsidian 주석 (%% ... %%) 제거
   * @param {string} content 
   * @returns {string}
   */
  removeObsidianComments(content) {
    // 여러 줄에 걸친 주석 제거
    content = content.replace(/%%[\s\S]*?%%/g, '');
    
    // 인라인 주석 제거
    content = content.replace(/%%.*?%%/g, '');
    
    // 빈 줄 정리
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    return content;
  }

  /**
   * Obsidian 블록 참조 ID(^xxxxxx) 제거
   *
   * `[[노트#^블록id]]`로 특정 문단을 참조할 때 그 문단 끝에 자동으로 붙는 앵커다.
   * 블로그에서는 의미가 없으므로 제거한다. 두 가지 형태를 처리한다.
   *  - 문단 끝에 붙은 경우: `...문장.  ^34f66c` → ID만 제거하고 문장은 유지
   *  - ID만 단독으로 있는 줄: ` ^21b72b ` → 줄 전체 제거
   * 코드블록(``` ... ```) 내부는 보호하여 건드리지 않는다.
   * @param {string} content
   * @returns {string}
   */
  removeBlockIds(content) {
    // 코드블록 보호
    const codeBlocks = [];
    content = content.replace(/```[\s\S]*?```/g, (match) => {
      const ph = `\x00BLOCKIDCODE${codeBlocks.length}\x00`;
      codeBlocks.push(match);
      return ph;
    });

    // ID만 단독으로 있는 줄 제거 (앞뒤 공백/탭 허용)
    content = content.replace(/^[ \t]*\^[a-zA-Z0-9]+[ \t]*$\n?/gm, '');

    // 문단 끝에 붙은 ID 제거 (앞의 공백째 제거, 줄바꿈은 유지)
    content = content.replace(/[ \t]+\^[a-zA-Z0-9]+[ \t]*$/gm, '');

    // 코드블록 복원
    content = content.replace(/\x00BLOCKIDCODE(\d+)\x00/g, (_, i) => codeBlocks[Number(i)]);

    // 블록 ID 제거로 생긴 3줄 이상 연속 빈 줄 정리
    content = content.replace(/\n{3,}/g, '\n\n');

    return content;
  }

  /**
   * Obsidian 위키링크 ([[링크]]) 변환
   *
   * 블로그에 실제 존재하는 글(existingSlugs에 포함)만 /posts/slug 내부 링크로
   * 변환한다. 볼트에만 있어 블로그에 없는 글을 가리키는 위키링크는 깨진 링크가
   * 되므로 깨진 링크가 된다. 이 경우 링크를 제거하지 않고 표시 텍스트는 유지하되,
   * href를 `unresolved:` 스킴으로 바꿔 렌더링 단계(mdx-components)에서 클릭 불가능한
   * 비활성 텍스트(위키의 red link 패턴)로 표현하도록 표식만 남긴다.
   *
   * @param {string} content
   * @param {Set<string>} [existingSlugs] - 블로그에 존재하는 글의 slug 집합.
   *   전달되지 않으면(undefined) 기존 동작대로 모든 위키링크를 링크로 변환한다.
   * @returns {string}
   */
  convertWikilinks(content, existingSlugs) {
    const resolve = (filename, displayText) => {
      const slug = this.generateSlug(filename);
      // existingSlugs가 주어졌고 그 안에 없으면 → 볼트 전용(아직 미게시) 글
      if (existingSlugs && !existingSlugs.has(slug)) {
        return `[${displayText}](unresolved:${slug})`;
      }
      return `[${displayText}](/posts/${slug})`;
    };

    // [[파일명|표시텍스트]] → [표시텍스트](/posts/slug) 또는 unresolved 링크
    content = content.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (match, filename, displayText) => {
      return resolve(filename, displayText);
    });

    // [[파일명]] → [파일명](/posts/slug) 또는 unresolved 링크
    content = content.replace(/\[\[([^\]]+)\]\]/g, (match, filename) => {
      return resolve(filename, filename);
    });

    return content;
  }

  /**
   * 이미지 경로 처리
   * @param {string} content 
   * @returns {string}
   */
  /**
   * 코드 블록 언어 태그 정규화 (공백 제거)
   * Obsidian이 ``` mermaid 형태로 쓰는 경우를 ```mermaid로 정규화
   *
   * 주의: 같은 줄 안의 공백/탭([ \t]+)만 매칭한다. \s+를 쓰면 개행까지 포함되어
   * 닫는 펜스(```) 다음 줄의 텍스트가 펜스에 들러붙어(예: ```\n\n4. ... → ```4. ...)
   * 코드블록이 닫히지 않고 이후 본문 전체가 코드로 먹히는 버그가 발생한다.
   * @param {string} content
   * @returns {string}
   */
  normalizeCodeFenceLanguage(content) {
    return content.replace(/^(```)[ \t]+(\w)/gm, '$1$2');
  }

  processImages(content) {
    // Obsidian 이미지 경로를 Next.js public 경로로 변환
    // ![alt](Attached file/image.png) → ![alt](/images/image.png)
    content = content.replace(/!\[([^\]]*)\]\(Attached file\/([^)]+)\)/g, '![$1](/images/$2)');
    
    // 상대 경로 이미지를 public 경로로 변환
    content = content.replace(/!\[([^\]]*)\]\((?!http|\/|#)([^)]+)\)/g, '![$1](/images/$2)');
    
    return content;
  }

  /**
   * frontmatter 정리
   * @param {object} frontmatter 
   * @param {string} filename 
   * @returns {object}
   */
  cleanFrontmatter(frontmatter, filename) {
    const cleaned = { ...frontmatter };

    // 중복된 frontmatter 제거 (현재 파일에서 발견된 패턴)
    if (cleaned.publish_date && !cleaned.date) {
      cleaned.date = cleaned.publish_date;
    }
    delete cleaned.publish_date;

    // slug가 없으면 자동 생성
    if (!cleaned.slug) {
      cleaned.slug = this.generateSlug(filename);
    }

    // 날짜 형식 통일
    if (cleaned.date) {
      cleaned.date = this.formatDate(cleaned.date);
    }

    // 태그 배열 정리
    if (cleaned.tags) {
      if (typeof cleaned.tags === 'string') {
        cleaned.tags = cleaned.tags.split(',').map(tag => tag.trim());
      }
      // 중복 제거
      cleaned.tags = [...new Set(cleaned.tags)];
    }

    // 제목이 없으면 파일명에서 생성
    if (!cleaned.title) {
      cleaned.title = this.generateTitle(filename);
    }

    return cleaned;
  }

  /**
   * 파일명에서 slug 생성
   * @param {string} filename 
   * @returns {string}
   */
  generateSlug(filename) {
    return filename
      .replace(/\.(md|mdx)$/i, '') // 확장자 제거
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // 공백을 하이픈으로
      .replace(/[^\w가-힣\-]+/g, '') // 영문, 숫자, 한글, 하이픈만 유지
      .replace(/\-\-+/g, '-') // 연속 하이픈을 하나로
      .replace(/^-+/, '') // 앞쪽 하이픈 제거
      .replace(/-+$/, ''); // 뒤쪽 하이픈 제거
  }

  /**
   * 파일명에서 제목 생성
   * @param {string} filename 
   * @returns {string}
   */
  generateTitle(filename) {
    return filename
      .replace(/\.(md|mdx)$/i, '') // 확장자 제거
      .trim();
  }

  /**
   * 날짜 형식 통일 (YYYY-MM-DD)
   * @param {string|Date} date 
   * @returns {string}
   */
  formatDate(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return date; // 유효하지 않은 날짜면 원본 반환
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Obsidian 콜아웃 블록을 HTML div로 변환
   * > [!type] 제목
   * > 내용...
   * @param {string} content
   * @returns {string}
   */
  convertCallouts(content) {
    const calloutTypes = [
      'info', 'warning', 'note', 'tip', 'caution', 'important',
      'danger', 'bug', 'example', 'quote', 'abstract', 'todo',
      'success', 'question', 'failure',
    ];

    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      caution: '⚠️',
      note: '📝',
      tip: '💡',
      important: '💡',
      danger: '🐛',
      bug: '🐛',
      example: '📋',
      quote: '💬',
      abstract: '💬',
      todo: '✅',
      success: '✅',
      question: '❓',
      failure: '❌',
    };

    const typePattern = calloutTypes.join('|');
    // 콜아웃 블록 전체 매칭: > [!type] 제목\n 으로 시작하는 연속된 > 라인들
    const calloutRegex = new RegExp(
      `^([ \\t]*>[ \\t]*\\[!(${typePattern})\\]([^\\n]*)\\n)((?:[ \\t]*>[ \\t]*[^\\n]*\\n?)*)`,
      'gim'
    );

    return content.replace(calloutRegex, (match, firstLine, type, titleRest, bodyLines) => {
      const lowerType = type.toLowerCase();
      const icon = icons[lowerType] || '📌';
      const title = titleRest.trim() || type.charAt(0).toUpperCase() + type.slice(1);

      // > 접두사 제거하여 본문 추출
      const body = bodyLines
        .split('\n')
        .map(line => line.replace(/^[ \t]*>[ \t]?/, ''))
        .join('\n')
        .trimEnd();

      return `<div data-callout="${lowerType}" className="callout callout-${lowerType}">
<div className="callout-title">${icon} ${title}</div>
<div className="callout-content">

${body}

</div>
</div>

`;
    });
  }

  /**
   * 코드 보호 구간 바깥의 < 를 선택적으로 이스케이프한다.
   *
   * 표준 HTML 태그(여는/닫는/self-closing) 형태의 < 는 보존하여 MDX가 JSX 엘리먼트로
   * 렌더하게 두고, 그 외의 < (부등호, 책 제목 `<...>`, URL, 커스텀 컴포넌트명 등)는
   * `\<` 로 이스케이프하여 JSX 파싱 에러와 의도치 않은 태그 해석을 막는다.
   *
   * 보존 판정: KNOWN_HTML_TAGS 화이트리스트에 속한 태그명으로 시작하고, 유효한 태그
   * 문법(여는: `<tag>` / `<tag ...속성>` / `<tag/>`, 닫는: `</tag>`)을 따를 때만 보존.
   * @param {string} content
   * @returns {string}
   */
  escapeAngleBrackets(content) {
    // 본문에서 의도적으로 쓰일 수 있는 표준 HTML 태그 화이트리스트.
    // 화이트리스트 밖(예: 한글 태그명, 커스텀 컴포넌트 <Suspense>, <https://...>)은
    // 보존하지 않고 이스케이프되어 안전하게 텍스트로 남는다.
    const KNOWN_HTML_TAGS = [
      'a', 'abbr', 'b', 'br', 'code', 'del', 'div', 'em', 'i', 'img',
      'ins', 'kbd', 'mark', 'p', 'pre', 'q', 's', 'small', 'span',
      'strong', 'sub', 'sup', 'u', 'wbr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'blockquote', 'figure', 'figcaption', 'hr', 'details', 'summary',
    ];
    // void 요소(자식·닫는 태그가 없는 요소)는 닫는 태그 `</br>`, `</hr>` 등이
    // 문법적으로 무효하다(MDX/JSX가 "open tag 없는 closing slash" 에러를 냄).
    // 따라서 void 요소의 닫는 태그는 보존하지 않고 이스케이프되도록 닫는 태그
    // 화이트리스트에서 제외한다.
    const VOID_HTML_TAGS = new Set(['br', 'hr', 'img', 'wbr']);
    const tagAlternation = KNOWN_HTML_TAGS.join('|');
    const closeTagAlternation = KNOWN_HTML_TAGS
      .filter((tag) => !VOID_HTML_TAGS.has(tag))
      .join('|');

    // 여는/self-closing 태그: <tag>, <tag/>, <tag 속성...>, <tag 속성... />
    //   - 태그명 뒤는 즉시 >, /> 이거나, 공백으로 시작하는 속성부([^<>]* 로 단순 매칭)
    //   - 속성부에서 < 와 > 는 허용하지 않아 인접한 다른 토큰을 삼키지 않게 한다.
    const openTagRe = new RegExp(
      `^<(?:${tagAlternation})(?:\\s[^<>]*?)?/?>`,
      'i'
    );
    // 닫는 태그: </tag> (void 요소 제외)
    const closeTagRe = new RegExp(`^</(?:${closeTagAlternation})\\s*>`, 'i');

    let result = '';
    for (let i = 0; i < content.length; i++) {
      if (content[i] !== '<') {
        result += content[i];
        continue;
      }
      const rest = content.slice(i);
      const m = rest.match(openTagRe) || rest.match(closeTagRe);
      if (m) {
        // 유효한 표준 HTML 태그 → 그대로 보존
        result += m[0];
        i += m[0].length - 1;
      } else {
        // 태그가 아닌 < → 이스케이프
        result += '\\<';
      }
    }
    return result;
  }

  /**
   * MDX 특수문자 이스케이프 처리
   * 코드 블록/인라인 코드 바깥의 <, {}, <!-- --> 를 이스케이프한다.
   * @param {string} content
   * @returns {string}
   */
  escapeMdxSpecialChars(content) {
    const codeBlocks = [];
    const inlineCodes = [];

    // 1단계: 펜스 코드 블록 보호 (``` ... ```)
    content = content.replace(/```[\s\S]*?```/g, (match) => {
      const placeholder = `\x00CODEBLOCK${codeBlocks.length}\x00`;
      codeBlocks.push(match);
      return placeholder;
    });

    // 2단계: 인라인 코드 보호 (` ... `)
    content = content.replace(/`[^`\n]+`/g, (match) => {
      const placeholder = `\x00INLINE${inlineCodes.length}\x00`;
      inlineCodes.push(match);
      return placeholder;
    });

    // 3단계: HTML 주석 제거 (<!-- ... -->)
    content = content.replace(/<!--[\s\S]*?-->/g, '');

    // 4단계: < 이스케이프
    // MDX는 < 를 JSX 태그 시작으로 파싱하므로, 태그가 아닌 < (부등호 `a < b`,
    // 책 제목 `<소년이 온다>`, 제네릭 `List<String>` 등)는 이스케이프해야 컴파일이
    // 깨지지 않는다. 반면 사용자가 의도적으로 작성한 표준 HTML 태그(<p>, <a>, <br/>,
    // </p> 등)는 MDX가 JSX 엘리먼트로 정상 렌더하므로 이스케이프하면 안 된다(안 그러면
    // \<p ...> 같은 리터럴 텍스트로 노출됨).
    //
    // 전략: 표준 HTML 태그 형태로 인식되는 < 만 보존하고 나머지 < 는 모두 이스케이프.
    // 태그 판별은 화이트리스트(KNOWN_HTML_TAGS)로 제한한다. <소년이 온다>(한글 태그명),
    // <Suspense>(커스텀 컴포넌트명), <https://...>(URL)처럼 화이트리스트에 없는 형태는
    // 그대로 이스케이프되어 안전하게 텍스트로 남는다.
    content = this.escapeAngleBrackets(content);

    // 5단계: { } 이스케이프
    content = content.replace(/\{/g, '\\{');
    content = content.replace(/\}/g, '\\}');

    // 6단계: 인라인 코드 복원
    content = content.replace(/\x00INLINE(\d+)\x00/g, (_, i) => inlineCodes[Number(i)]);

    // 7단계: 펜스 코드 블록 복원
    content = content.replace(/\x00CODEBLOCK(\d+)\x00/g, (_, i) => codeBlocks[Number(i)]);

    return content;
  }

  /**
   * 변환된 콘텐츠 검증
   * @param {string} content
   * @returns {boolean}
   */
  validate(content) {
    const warnings = [];

    // 남은 Obsidian 문법 체크
    if (content.includes('%%')) {
      warnings.push('Obsidian 주석이 남아있습니다: %%');
    }

    if (content.includes('[[') && content.includes(']]')) {
      warnings.push('위키링크가 남아있습니다: [[ ]]');
    }

    if (warnings.length > 0) {
      console.warn('변환 경고:', warnings.join(', '));
    }

    return warnings.length === 0;
  }
}

module.exports = ObsidianTransformer;