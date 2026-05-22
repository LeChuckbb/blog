# Google Analytics 4 연동 설계

## 배경

블로그 게시글의 조회수 및 방문자 데이터를 파악하기 위해 Google Analytics 4를 연동한다.
현재 프로젝트에는 어떠한 웹 분석 도구도 설정되어 있지 않다.
일단 개인 대시보드 확인용으로 시작하며, 추후 블로그 UI에 조회수 표시 기능을 확장할 수 있다.

## GA4 계정 생성 가이드

1. [Google Analytics](https://analytics.google.com/) 접속 → 계정 만들기
2. 계정 이름 입력 (예: "개인 블로그")
3. 속성 만들기 → 속성 이름 입력, 시간대/통화 설정 (한국/KRW)
4. 비즈니스 정보 입력 (개인 블로그 → "기타")
5. 데이터 스트림 추가 → "웹" 선택 → 블로그 URL 입력
6. **측정 ID** (`G-XXXXXXXXXX`) 복사 → 이것이 `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## 구현 설계

### 1. GoogleAnalytics 컴포넌트

**파일**: `src/app/_components/GoogleAnalytics.tsx`

- `next/script`의 `afterInteractive` 전략으로 gtag.js 로드
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` 환경변수에서 Measurement ID 읽기
- 환경변수가 없으면 아무것도 렌더링하지 않음 (개발 환경에서 자연스럽게 비활성화)

```tsx
// 핵심 구조
'use client'

import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
```

### 2. layout.tsx 수정

**파일**: `src/app/layout.tsx`

- `<GoogleAnalytics />` 컴포넌트를 `<body>` 태그 바로 안에 삽입
- 기존 레이아웃 구조를 변경하지 않음

### 3. 환경 변수

**로컬 개발**: `.env.local`에 추가
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Vercel 배포**: Vercel 대시보드 → Settings → Environment Variables에 동일 변수 추가

### 4. .env.local이 없는 환경 (개발/CI)

`NEXT_PUBLIC_GA_MEASUREMENT_ID`가 없으면 `GoogleAnalytics` 컴포넌트가 `null`을 반환하므로 스크립트가 로드되지 않는다. 별도 분기 처리 불필요.

## 변경 파일 목록

| 파일 | 변경 유형 |
|------|-----------|
| `src/app/_components/GoogleAnalytics.tsx` | 신규 생성 |
| `src/app/layout.tsx` | GoogleAnalytics 컴포넌트 삽입 |
| `.env.local` | 환경변수 추가 |

## 검증 방법

1. `.env.local`에 GA Measurement ID 설정
2. `npm run dev`로 개발 서버 실행
3. 브라우저 개발자 도구 → Network 탭에서 `gtag/js` 요청 확인
4. Google Analytics 실시간 보고서에서 방문 감지 확인
5. `.env.local`에서 환경변수 제거 후 스크립트가 로드되지 않는 것 확인
