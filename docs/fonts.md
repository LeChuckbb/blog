# 한글 폰트 선택 가이드

> 현재 폰트 구성: **Pretendard** (본문 산세리프) + **마루 부리** (인용문 세리프) + **D2Coding** (코드)
> 이 문서는 Pretendard를 다른 폰트로 교체하려 할 때 참고하는 가이드입니다.

---

## 1. 폰트 분류 체계

### 산세리프 (Sans-serif) — 본문에 적합
획 끝에 장식이 없고 깔끔한 폰트. 디지털 화면 가독성이 높아 본문 텍스트에 주로 사용.

| 특징 | 적합한 용도 |
|------|-------------|
| 획이 균일하고 깔끔 | 본문, UI 텍스트 |
| 화면 가독성 높음 | 긴 글 읽기 |
| 현대적이고 중립적 | 기술 블로그, 개발 문서 |

### 세리프 (Serif) — 제목·인용문에 적합
획 끝에 장식(세리프)이 있는 폰트. 전통적·문학적 느낌을 주며 인쇄물에 친숙.

| 특징 | 적합한 용도 |
|------|-------------|
| 고전적이고 격조 있는 느낌 | 제목, 인용문 |
| 글자 간 구분이 명확 | 독립적인 헤딩 |
| 한국 전통 서체와 친숙 | 에세이, 인문 콘텐츠 |

### 모노스페이스 (Monospace) — 코드에 적합
모든 글자가 동일한 너비를 차지. 코드 블록에서 정렬과 가독성이 중요할 때.

---

## 2. Google Fonts 한글 폰트 목록

> Google Fonts: https://fonts.google.com/?subset=korean

### 산세리프 계열

| 폰트명 | 특징 | 느낌 | 가중치 |
|--------|------|------|--------|
| **Noto Sans KR** | Google의 범용 한글 폰트, 가장 완성도 높음 | 중립적·안정적 | 100–900 |
| **IBM Plex Sans KR** | IBM 브랜드 폰트의 한글 버전 | 기술적·현대적 | 100–700 |
| **Gothic A1** | 가는 획, 둥근 느낌 | 가볍고 친근함 | 100–900 |
| **Nanum Gothic** | 네이버 나눔 시리즈, 익숙한 화면체 | 부드럽고 가독성 좋음 | 400, 700, 800 |
| **Nanum Barun Gothic** | 나눔 고딕의 개선판 | 깔끔·현대적 | 400, 700 |
| **Do Hyeon** | 독특한 개성, 제목용에 어울림 | 강렬하고 개성 있음 | 400 |
| **Jua** | 둥글고 귀여운 느낌 | 캐주얼·친근함 | 400 |
| **Black Han Sans** | 굵은 획, 제목 전용 | 강렬하고 임팩트 있음 | 400 |

### 세리프 계열

| 폰트명 | 특징 | 느낌 | 가중치 |
|--------|------|------|--------|
| **Noto Serif KR** | Noto 시리즈의 세리프, 범용성 높음 | 고전적·안정적 | 200–900 |
| **Nanum Myeongjo** | 네이버 명조, 한국 출판물에 가장 친숙 | 전통적·문학적 | 400, 700, 800 |
| **Nanum Myeongjo ExtraBold** | 굵은 명조, 제목에 임팩트 | 강렬하고 전통적 | 800 |
| **Hahmlet** | 현대적 감각의 명조 | 섬세하고 세련됨 | 100–900 |
| **Gowun Batang** | 얇고 우아한 명조 | 섬세·고급스러움 | 400, 700 |
| **Gowun Dodum** | 둥근 명조, 부드러운 느낌 | 따뜻하고 부드러움 | 400 |

### 핸드라이팅 / 디스플레이

| 폰트명 | 특징 | 느낌 |
|--------|------|------|
| **Gaegu** | 손글씨 느낌 | 캐주얼·개인적 |
| **Nanum Pen Script** | 펜 손글씨 스타일 | 따뜻하고 인간적 |
| **Single Day** | 깔끔한 손글씨 | 가볍고 친근함 |

---

## 3. 블로그 용도별 추천 조합

> **구성 원칙**: 제목과 본문은 같은 산세리프 폰트를 사용하고, 굵기·크기로 위계를 표현합니다.
> 한글 폰트는 무거우므로 추가 로드보다 3종 체계(산세리프 + 세리프 + 모노)가 최적입니다.

각 조합은 **Pretendard 자리에 넣을 산세리프 1개**를 기준으로 구성합니다.
인용(마루 부리)과 코드(D2Coding)는 모든 조합에서 유지됩니다.

---

### 조합 A: 기술 블로그 — 읽기 쉽고 현대적

```
본문(=제목):   IBM Plex Sans KR  (기술적·현대적)
인용:          마루 부리          (현재 유지)
코드:          D2Coding          (현재 유지)
```

**IBM Plex Sans KR**: IBM이 개발한 브랜드 폰트의 한글 버전. 균일하고 기계적인 획이 개발 문서 같은 신뢰감을 주며, 기술 콘텐츠에 잘 어울립니다. 영문 IBM Plex Sans와 함께 쓰면 코드-글 혼용 글에서 자연스러운 통일감이 생깁니다.

---

### 조합 B: 에세이 블로그 — 안정적이고 편안한

```
본문(=제목):   Noto Sans KR      (중립적·안정적)
인용:          마루 부리          (현재 유지)
코드:          D2Coding          (현재 유지)
```

**Noto Sans KR**: Google의 범용 한글 폰트로 완성도가 가장 높습니다. 중립적이고 읽기 편해 긴 글에서 피로감이 없으며, 어떤 주제에도 무난하게 어울립니다. 현재 Pretendard와 가장 유사한 선택지입니다.

---

### 조합 C: 개성 있는 블로그 — 가볍고 친근한

```
본문(=제목):   Gothic A1         (가볍고 친근함)
인용:          마루 부리          (현재 유지)
코드:          D2Coding          (현재 유지)
```

**Gothic A1**: 가는 획과 둥근 끝처리가 특징인 산세리프. 가볍고 친근한 인상을 주며, 개인 블로그나 일상 기록에 잘 어울립니다. 가는 굵기(100–300)는 우아하고, 중간 굵기(400–500)는 읽기 편합니다.

---

### 조합 D: 최소주의 — 깔끔하고 군더더기 없는

```
본문(=제목):   Nanum Barun Gothic (깔끔·현대적)
인용:          마루 부리           (현재 유지)
코드:          D2Coding           (현재 유지)
```

**Nanum Barun Gothic**: 네이버 나눔 고딕의 개선판으로, 획이 정돈되고 균형감이 뛰어납니다. 군더더기 없는 인상이 미니멀한 디자인과 잘 맞으며, 콘텐츠 자체에 집중하게 만드는 폰트입니다.

---

## 4. 한글 타이포그래피 CSS 권장값

```css
body {
  /* 행간: 한글은 영문보다 넓게 */
  line-height: 1.7;          /* 본문: 1.6–1.8 권장 */

  /* 자간: 한글 산세리프는 약간 좁게 */
  letter-spacing: -0.01em;   /* -0.01 ~ -0.02em */

  /* 단어 줄바꿈: 한글 어절 단위 유지 */
  word-break: keep-all;

  /* 한글 커닝 최적화 */
  font-feature-settings: "kern" 1;
  -webkit-font-smoothing: antialiased;
}

/* 제목용 — 자간 좁게, 행간 좁게 */
h1, h2, h3 {
  line-height: 1.3;
  letter-spacing: -0.02em;
}

/* 인용문용 — 명조는 행간 넓게 */
blockquote {
  line-height: 1.8;
  letter-spacing: 0em;       /* 명조는 0 또는 약간 넓게 */
}

/* 코드 — 모노스페이스는 자간 0 */
code, pre {
  letter-spacing: 0;
  line-height: 1.75;
}
```

### 폰트 크기 권장값

| 요소 | 크기 | 비고 |
|------|------|------|
| 본문 | 16px (1rem) | 모바일에서는 15px도 가능 |
| 소제목 (h3) | 1.25rem | |
| 중제목 (h2) | 1.5rem | |
| 대제목 (h1) | 2rem | |
| 코드 | 0.875rem | 14px |
| 캡션/메타 | 0.75–0.875rem | |

---

## 5. Next.js 적용 가이드

### 현재 프로젝트 구조 이해

현재 `src/app/layout.tsx`는 `localFont`로 로컬 폰트를 불러옵니다:

```tsx
// 현재 방식 (로컬 폰트)
import localFont from "next/font/local";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});
```

`globals.css`에서 CSS 변수로 연동:
```css
@theme inline {
  --font-sans: var(--font-pretendard);  /* ← 이 줄만 바꾸면 됨 */
}
```

---

### Google Fonts로 교체하는 방법

#### Step 1: `layout.tsx`에서 `next/font/google` import 추가

```tsx
import { Noto_Sans_KR } from "next/font/google";
// 또는
import { IBM_Plex_Sans_KR } from "next/font/google";
// 또는
import { Gothic_A1 } from "next/font/google";
```

#### Step 2: 폰트 설정 객체 생성

```tsx
// 예시: Noto Sans KR
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],        // 한글 자동 포함 (subsets에 "korean"은 없음)
  weight: ["400", "500", "700"],  // 필요한 굵기만
  variable: "--font-sans",   // CSS 변수명 (globals.css와 일치)
  display: "swap",
  preload: false,            // Google Fonts는 preload: false 권장
});

// 예시: IBM Plex Sans KR
const ibmPlexSansKR = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});
```

> **주의**: Google Fonts 한글 폰트는 `subsets: ["korean"]`이 없습니다.
> `subsets: ["latin"]`만 지정해도 한글이 자동으로 포함됩니다.

#### Step 3: `body`에 className 추가

```tsx
// 기존 코드 (Pretendard 포함)
<body className={`${pretendard.variable} ${maruBuri.variable} ${d2Coding.variable} ...`}>

// 교체 후 (예: Noto Sans KR)
<body className={`${notoSansKR.variable} ${maruBuri.variable} ${d2Coding.variable} ...`}>
```

#### Step 4: `globals.css` — CSS 변수 연동 확인

`globals.css`의 `@theme inline` 블록은 이미 올바르게 설정되어 있습니다:

```css
@theme inline {
  --font-sans: var(--font-pretendard);  /* ← 폰트 변수명이 바뀌면 여기도 수정 */
}
```

만약 CSS 변수명을 `--font-sans`로 통일하면 `globals.css`는 수정 불필요.

---

### 실제 교체 예시 코드

```tsx
// src/app/layout.tsx (Noto Sans KR로 교체 예시)
import { Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-pretendard",  // 변수명 그대로 유지 (globals.css 수정 불필요)
  display: "swap",
  preload: false,
});

// maruBuri, d2Coding은 그대로 유지...
```

---

### 성능 고려사항

| 항목 | 로컬 폰트 | Google Fonts |
|------|-----------|--------------|
| 초기 로드 | 빠름 (번들 내 포함) | 외부 요청 필요 |
| 캐싱 | 빌드 시 최적화 | CDN 캐시 활용 |
| 폰트 크기 | 가변 폰트 1개면 충분 | 굵기별 파일 분리 |
| 유지보수 | 파일 직접 관리 | 자동 업데이트 |

> **권장**: Next.js의 `next/font/google`은 빌드 시 자동으로 폰트를 다운로드하고 최적화하므로 성능 차이가 거의 없습니다.

---

## 6. 주요 한국 서비스 폰트 현황

참고용 벤치마크입니다.

| 서비스 | 본문 폰트 | 비고 |
|--------|-----------|------|
| **Naver** | Nanum Gothic / Noto Sans | 환경에 따라 다름 |
| **Kakao** | Kakao (사내 폰트) | - |
| **Toss** | Toss Product Sans (사내) | 대외 비공개 |
| **Velog** | Noto Sans KR | 개발 블로그 플랫폼 |
| **Brunch** | Nanum Myeongjo | 에세이 플랫폼 |
| **Medium KR** | Noto Sans KR | - |
| **당근마켓** | Karrot (사내) | - |
| **Notion** | ui-sans-serif, Pretendard (한국판) | 시스템 폰트 우선 |

---

## 부록: 빠른 교체 체크리스트

사용자가 폰트를 결정하면 아래 순서로 교체합니다:

- [ ] `layout.tsx`: `import` 구문 교체 (localFont → google font 또는 다른 localFont)
- [ ] `layout.tsx`: 폰트 설정 객체 교체
- [ ] `layout.tsx`: `body` className에서 변수 교체
- [ ] `globals.css`: `--font-sans` CSS 변수 참조 확인 (보통 수정 불필요)
- [ ] `globals.css`: `body` font-family fallback 스택 업데이트
- [ ] `npm run dev`로 로컬 확인
- [ ] 모바일/데스크톱 양쪽에서 가독성 확인
