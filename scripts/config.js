const fs = require('fs');
const path = require('path');

/**
 * 블로그 동기화 설정
 */
class Config {
  constructor() {
    this.loadEnvVars();
    this.initializePaths();
  }

  /**
   * 환경 변수 로드
   */
  loadEnvVars() {
    try {
      require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
    } catch (error) {
      console.warn('dotenv 패키지를 찾을 수 없습니다. 환경 변수를 직접 설정하세요.');
    }
  }

  /**
   * 경로 초기화
   */
  initializePaths() {
    // 현재 프로젝트 루트 경로
    this.projectRoot = path.join(__dirname, '..');
    
    // Obsidian Vault 경로 (환경 변수 또는 자동 감지)
    this.obsidianVaultPath = this.getObsidianVaultPath();
    
    // 블로그 콘텐츠 경로
    this.blogContentPath = path.join(this.obsidianVaultPath, 'blog-content');
    this.publishedPath = path.join(this.blogContentPath, 'published');
    this.draftsPath = path.join(this.blogContentPath, 'drafts');
    
    // Next.js 콘텐츠 경로
    this.contentPath = path.join(this.projectRoot, 'content');
    this.postsJsonPath = path.join(this.projectRoot, 'src/app/posts.json');
  }

  /**
   * Obsidian Vault 경로 감지
   */
  getObsidianVaultPath() {
    // 환경 변수에서 우선 확인
    if (process.env.OBSIDIAN_VAULT_PATH && fs.existsSync(process.env.OBSIDIAN_VAULT_PATH)) {
      return process.env.OBSIDIAN_VAULT_PATH;
    }

    // 플랫폼별 기본 경로들
    const possiblePaths = [
      // macOS
      `/Users/${process.env.USER || 'mac'}/Library/CloudStorage/GoogleDrive-pjwts9412@gmail.com/My Drive/DriveSyncFiles/Obsidian Vault`,
      
      // Windows
      `C:\\Users\\${process.env.USERNAME || 'user'}\\Google Drive\\DriveSyncFiles\\Obsidian Vault`,
      `${process.env.USERPROFILE}\\Google Drive\\DriveSyncFiles\\Obsidian Vault`,
      
      // 현재 프로젝트의 상위 디렉토리 (기존 구조)
      path.join(this.projectRoot, '..'),
    ];

    // 존재하는 경로 찾기
    for (const vaultPath of possiblePaths) {
      if (fs.existsSync(vaultPath)) {
        console.log(`Obsidian Vault 경로 자동 감지: ${vaultPath}`);
        return vaultPath;
      }
    }

    throw new Error('Obsidian Vault 경로를 찾을 수 없습니다. .env.local에서 OBSIDIAN_VAULT_PATH를 설정하세요.');
  }

  /**
   * 필요한 디렉토리 생성
   */
  ensureDirectories() {
    const directories = [
      this.contentPath,
      path.dirname(this.postsJsonPath),
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`디렉토리 생성: ${dir}`);
      }
    });
  }

  /**
   * 동기화 옵션
   */
  getSyncOptions() {
    return {
      // 처리할 파일 확장자
      sourceExtensions: ['.md', '.mdx'],
      
      // 출력 파일 확장자
      outputExtension: '.mdx',
      
      // 무시할 파일 패턴
      ignorePatterns: [
        /^_/, // _로 시작하는 파일
        /\.draft\./i, // .draft. 포함 파일
        /\.temp\./i, // .temp. 포함 파일
      ],

      // Obsidian 문법 변환 옵션
      transformOptions: {
        removeComments: true, // %% ... %% 주석 제거
        convertWikilinks: true, // [[링크]] 변환
        cleanFrontmatter: true, // frontmatter 정리
        processImages: true, // 이미지 경로 처리
      },

      // 메타데이터 옵션
      metadataOptions: {
        autoGenerateSlug: true, // 자동 slug 생성
        sortBy: 'date', // 정렬 기준
        sortOrder: 'desc', // 정렬 순서
      },
    };
  }

  /**
   * 설정 검증
   */
  validate() {
    const errors = [];

    if (!fs.existsSync(this.obsidianVaultPath)) {
      errors.push(`Obsidian Vault 경로가 존재하지 않습니다: ${this.obsidianVaultPath}`);
    }

    if (!fs.existsSync(this.publishedPath)) {
      console.warn(`published 폴더가 존재하지 않습니다: ${this.publishedPath}`);
      console.warn('Obsidian Vault에서 blog-content/published 폴더를 생성해주세요.');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return true;
  }

  /**
   * 설정 정보 출력
   */
  printInfo() {
    console.log('\n=== 블로그 동기화 설정 ===');
    console.log(`프로젝트 루트: ${this.projectRoot}`);
    console.log(`Obsidian Vault: ${this.obsidianVaultPath}`);
    console.log(`Published 폴더: ${this.publishedPath}`);
    console.log(`Content 폴더: ${this.contentPath}`);
    console.log('=======================\n');
  }
}

module.exports = Config;