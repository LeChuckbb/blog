const matter = require('gray-matter');

/**
 * Obsidian 마크다운을 표준 마크다운으로 변환하는 클래스
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
  }

  /**
   * 메인 변환 함수
   * @param {string} content - Obsidian 마크다운 콘텐츠
   * @param {string} filename - 파일명 (slug 생성용)
   * @returns {object} { content, frontmatter }
   */
  transform(content, filename) {
    // frontmatter와 content 분리
    const parsed = matter(content);
    let transformedContent = parsed.content;
    let frontmatter = { ...parsed.data };

    // 각 변환 단계 실행
    if (this.options.removeComments) {
      transformedContent = this.removeObsidianComments(transformedContent);
    }

    if (this.options.convertWikilinks) {
      transformedContent = this.convertWikilinks(transformedContent);
    }

    if (this.options.processImages) {
      transformedContent = this.processImages(transformedContent);
    }

    if (this.options.cleanFrontmatter) {
      frontmatter = this.cleanFrontmatter(frontmatter, filename);
    }

    // frontmatter와 content 다시 결합
    const finalContent = matter.stringify(transformedContent, frontmatter);

    return {
      content: finalContent,
      frontmatter,
    };
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