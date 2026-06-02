const fs = require('fs');
const path = require('path');
const Config = require('./config');
const ObsidianTransformer = require('./transform-obsidian');
const { calculateReadingTime } = require('./reading-time');

/**
 * 블로그 콘텐츠 동기화 클래스
 */
class ContentSyncer {
  constructor() {
    this.config = new Config();
    this.transformer = new ObsidianTransformer(
      this.config.getSyncOptions().transformOptions
    );
    this.syncOptions = this.config.getSyncOptions();
  }

  /**
   * 메인 동기화 실행
   */
  async sync() {
    try {
      console.log('🚀 블로그 콘텐츠 동기화 시작...\n');
      
      // 설정 검증
      this.config.validate();
      this.config.printInfo();
      
      // 필요한 디렉토리 생성
      this.config.ensureDirectories();
      
      // Google Drive 동기화 대기
      await this.waitForGoogleDriveSync();
      
      // 기존 content 폴더 정리
      this.cleanupContentFolder();
      
      // published 폴더에서 파일들 처리
      const posts = await this.processPublishedFiles();
      
      // posts.json 업데이트
      await this.updatePostsJson(posts);
      
      console.log(`✅ 동기화 완료! ${posts.length}개의 게시글을 처리했습니다.\n`);
      
      // 처리된 파일 목록 출력
      this.printProcessedFiles(posts);
      
    } catch (error) {
      console.error('❌ 동기화 실패:', error.message);
      process.exit(1);
    }
  }

  /**
   * Google Drive 동기화 대기
   */
  async waitForGoogleDriveSync() {
    console.log('⏳ Google Drive 동기화 확인 중...');
    
    // 간단한 대기 시간 (2초)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // published 폴더 존재 확인
    if (!fs.existsSync(this.config.publishedPath)) {
      throw new Error(`Published 폴더를 찾을 수 없습니다: ${this.config.publishedPath}\nObsidian Vault에서 blog-content/published 폴더를 생성해주세요.`);
    }
    
    console.log('✓ Google Drive 동기화 확인 완료\n');
  }

  /**
   * 기존 content 폴더 정리
   */
  cleanupContentFolder() {
    if (fs.existsSync(this.config.contentPath)) {
      console.log('🧹 기존 content 폴더 정리 중...');
      
      const files = fs.readdirSync(this.config.contentPath);
      files.forEach(file => {
        if (file.endsWith('.mdx')) {
          fs.unlinkSync(path.join(this.config.contentPath, file));
        }
      });
    }
  }

  /**
   * published 폴더의 파일들 처리
   */
  async processPublishedFiles() {
    console.log('📝 Published 폴더 처리 중...');

    const publishedFiles = this.getPublishedFiles();

    // 1차 패스: 블로그에 실제 존재하게 될 글들의 slug 집합 수집
    // (위키링크 변환 시 볼트 전용 글을 가리키는 깨진 링크를 제거하기 위함)
    const existingSlugs = this.collectExistingSlugs(publishedFiles);
    this.transformer.options.existingSlugs = existingSlugs;

    const posts = [];

    // 2차 패스: 실제 변환 (위키링크는 existingSlugs 기준으로 처리)
    for (const file of publishedFiles) {
      try {
        const post = await this.processFile(file);
        if (post) {
          posts.push(post);
        }
      } catch (error) {
        console.error(`⚠️  파일 처리 실패 (${file}):`, error.message);
      }
    }

    return posts;
  }

  /**
   * published 파일들의 frontmatter slug(없으면 파일명 기반 slug)를 미리 수집
   * @param {string[]} publishedFiles
   * @returns {Set<string>} 블로그에 존재하게 될 글들의 slug 집합
   */
  collectExistingSlugs(publishedFiles) {
    const matter = require('gray-matter');
    const slugs = new Set();

    for (const file of publishedFiles) {
      try {
        const sourcePath = path.join(this.config.publishedPath, file);
        const raw = fs.readFileSync(sourcePath, 'utf-8');
        const { data } = matter(raw);
        // cleanFrontmatter와 동일한 규칙으로 실제 게시 slug 결정:
        // frontmatter에 slug가 있으면 그대로(가공 X), 없으면 파일명에서 생성
        slugs.add(data.slug ? String(data.slug) : this.transformer.generateSlug(file));
        // 위키링크는 항상 파일명을 generateSlug한 값으로 링크를 만든다.
        // frontmatter slug가 파일명과 다른 경우에도 위키링크가 매칭되도록
        // 파일명 기반 slug도 존재 집합에 함께 등록한다.
        slugs.add(this.transformer.generateSlug(file));
      } catch (error) {
        console.error(`⚠️  slug 수집 실패 (${file}):`, error.message);
      }
    }

    return slugs;
  }

  /**
   * published 폴더에서 처리 가능한 파일 목록 가져오기
   */
  getPublishedFiles() {
    const files = fs.readdirSync(this.config.publishedPath);
    
    return files.filter(file => {
      // 확장자 체크
      const hasValidExtension = this.syncOptions.sourceExtensions.some(ext => 
        file.toLowerCase().endsWith(ext)
      );
      
      // 무시할 패턴 체크
      const shouldIgnore = this.syncOptions.ignorePatterns.some(pattern => 
        pattern.test(file)
      );
      
      return hasValidExtension && !shouldIgnore;
    });
  }

  /**
   * 개별 파일 처리
   */
  async processFile(filename) {
    const sourcePath = path.join(this.config.publishedPath, filename);
    const content = fs.readFileSync(sourcePath, 'utf-8');
    
    console.log(`  📄 처리 중: ${filename}`);

    // Obsidian → MDX 변환 (async 처리)
    const { content: transformedContent, frontmatter } = await this.transformer.transform(content, filename);

    // 읽기 시간 계산 (변환 전 원본 content 기준)
    const readingTime = calculateReadingTime(content);

    // 출력 파일명 생성
    const outputFilename = this.generateOutputFilename(filename, frontmatter.slug);
    const outputPath = path.join(this.config.contentPath, outputFilename);

    // 변환된 내용을 파일로 저장
    fs.writeFileSync(outputPath, transformedContent);

    // description: frontmatter에 있으면 사용, 없으면 본문에서 자동 추출
    const description = frontmatter.description || this.extractDescription(transformedContent);

    // posts.json용 메타데이터 반환
    return {
      slug: frontmatter.slug,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags || [],
      description,
      readingTime,
      filename: outputFilename,
      originalFilename: filename,
      series: frontmatter.series || undefined,
    };
  }

  /**
   * MDX 본문에서 첫 번째 의미 있는 텍스트 단락 추출 (최대 155자)
   */
  extractDescription(mdxContent) {
    const lines = mdxContent.split('\n');
    const skipPatterns = [
      /^---/, // frontmatter 구분자
      /^```/, // 코드블록
      /^#+\s/, // 헤딩
      /^>\s/, // blockquote
      /^[-*+]\s/, // 리스트
      /^\d+\.\s/, // 순서 있는 리스트
      /^import\s/, // import 구문
      /^export\s/, // export 구문
      /^\s*$/, // 빈 줄
      /^!?\[/, // 이미지/링크로 시작하는 줄
    ];

    let inFrontmatter = false;
    let inCodeBlock = false;
    let frontmatterCount = 0;

    for (const line of lines) {
      // frontmatter 처리
      if (line.trim() === '---') {
        frontmatterCount++;
        inFrontmatter = frontmatterCount < 2;
        continue;
      }
      if (inFrontmatter) continue;

      // 코드블록 처리
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      // 비텍스트 요소 건너뛰기
      if (skipPatterns.some(p => p.test(line.trim()))) continue;

      // 인라인 마크다운 제거 후 텍스트 추출
      const text = line
        .replace(/\*\*(.+?)\*\*/g, '$1') // bold
        .replace(/\*(.+?)\*/g, '$1') // italic
        .replace(/`(.+?)`/g, '$1') // inline code
        .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
        .trim();

      if (text.length > 20) {
        return text.length > 155 ? text.slice(0, 152) + '...' : text;
      }
    }
    return '';
  }

  /**
   * 출력 파일명 생성
   */
  generateOutputFilename(originalFilename, slug) {
    // 확장자를 .mdx로 변경
    const name = originalFilename.replace(/\.(md|mdx)$/i, '');
    return `${name}${this.syncOptions.outputExtension}`;
  }

  /**
   * posts.json 업데이트
   */
  async updatePostsJson(posts) {
    console.log('📋 posts.json 업데이트 중...');
    
    // 날짜순 정렬 (최신순)
    posts.sort((a, b) => {
      const dateA = new Date(a.date || '1900-01-01');
      const dateB = new Date(b.date || '1900-01-01');
      return dateB - dateA;
    });

    // posts.json 생성
    const postsData = {
      posts: posts.map(post => ({
        slug: post.slug,
        date: post.date,
        title: post.title,
        tags: post.tags,
        description: post.description || "",
        readingTime: post.readingTime,
        ...(post.series && { series: post.series }),
      }))
    };

    fs.writeFileSync(this.config.postsJsonPath, JSON.stringify(postsData, null, 2));
    console.log(`✓ posts.json 업데이트 완료 (${posts.length}개 게시글)`);
  }

  /**
   * 처리된 파일 목록 출력
   */
  printProcessedFiles(posts) {
    console.log('📊 처리된 파일들:');
    posts.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title} (${post.slug})`);
      console.log(`     📅 ${post.date} | 📁 ${post.originalFilename} → ${post.filename}`);
    });
  }

  /**
   * watch 모드 실행
   */
  async watch() {
    console.log('👀 Watch 모드 시작 - published 폴더 변경 감지 중...\n');
    
    // 초기 동기화
    await this.sync();
    
    // 파일 변경 감지
    fs.watch(this.config.publishedPath, { recursive: true }, async (eventType, filename) => {
      if (filename && (filename.endsWith('.md') || filename.endsWith('.mdx'))) {
        console.log(`\n🔄 파일 변경 감지: ${filename}`);
        
        // 짧은 대기 후 동기화 (연속 변경 방지)
        setTimeout(async () => {
          try {
            await this.sync();
          } catch (error) {
            console.error('Watch 모드 동기화 실패:', error.message);
          }
        }, 1000);
      }
    });
    
    console.log('✅ Watch 모드 활성화됨. Ctrl+C로 종료하세요.');
  }
}

// CLI 실행
async function main() {
  const args = process.argv.slice(2);
  const syncer = new ContentSyncer();

  if (args.includes('--watch') || args.includes('-w')) {
    await syncer.watch();
  } else {
    await syncer.sync();
  }
}

// 직접 실행시에만 main 함수 호출
if (require.main === module) {
  main().catch(error => {
    console.error('실행 오류:', error);
    process.exit(1);
  });
}

module.exports = ContentSyncer;