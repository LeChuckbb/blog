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

    if (this.options.convertWikilinks) {
      transformedContent = this.convertWikilinks(transformedContent);
    }

    if (this.options.processImages) {
      transformedContent = this.processImages(transformedContent);
    }

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
   * Obsidian 위키링크 ([[링크]]) 변환
   * @param {string} content 
   * @returns {string}
   */
  convertWikilinks(content) {
    // [[파일명|표시텍스트]] → [표시텍스트](/posts/slug)
    content = content.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (match, filename, displayText) => {
      const slug = this.generateSlug(filename);
      return `[${displayText}](/posts/${slug})`;
    });

    // [[파일명]] → [파일명](/posts/slug)
    content = content.replace(/\[\[([^\]]+)\]\]/g, (match, filename) => {
      const slug = this.generateSlug(filename);
      return `[${filename}](/posts/${slug})`;
    });

    return content;
  }

  /**
   * 이미지 경로 처리
   * @param {string} content 
   * @returns {string}
   */
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
    // MDX는 유효한 HTML 태그도 JSX 규칙으로 파싱하므로, 속성이 있거나 닫히지 않는 태그는
    // 에러를 일으킨다. 가장 안전한 전략: 모든 < 를 이스케이프하되, 마크다운 링크와
    // 이미지([text](url), ![alt](src))의 URL 부분은 이미 처리됨.
    // 단, 닫는 태그(</tag>)의 </ 도 이스케이프.
    content = content.replace(/</g, '\\<');

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