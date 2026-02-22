const fs = require('fs');
const path = require('path');
const Config = require('./config');
const ObsidianTransformer = require('./transform-obsidian');

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
    const posts = [];

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
    
    // 출력 파일명 생성
    const outputFilename = this.generateOutputFilename(filename, frontmatter.slug);
    const outputPath = path.join(this.config.contentPath, outputFilename);
    
    // 변환된 내용을 파일로 저장
    fs.writeFileSync(outputPath, transformedContent);
    
    // posts.json용 메타데이터 반환
    return {
      slug: frontmatter.slug,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags || [],
      filename: outputFilename,
      originalFilename: filename,
    };
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