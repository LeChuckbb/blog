# Next.js Image 최적화 vs S3 CDN: 효능 분석 및 현재 상황 진단

> 작성 기준: 2026-03-02
> 대상 컴포넌트: `src/app/_components/AnimatedImage.tsx`
> Next.js 버전: 15.3.8

---

## 1. Next.js Image 최적화 (`next/image`) 기능 전체 정리

`next/image`는 단순한 `<img>` 래퍼가 아니라, `/_next/image` 프록시를 경유하는 서버사이드 이미지 파이프라인이다.

### 1.1 포맷 변환 (WebP / AVIF 자동 변환)

브라우저의 `Accept` 요청 헤더를 읽어 지원 여부를 판단한 뒤, 원본 JPG/PNG를 자동으로 더 효율적인 포맷으로 변환한다.

| 브라우저 지원 | 변환 결과 |
|---|---|
| AVIF 지원 (Chrome 85+, Firefox 113+) | 원본 → AVIF |
| WebP 지원 (대부분의 모던 브라우저) | 원본 → WebP |
| 미지원 (구형 브라우저) | 원본 포맷 유지 |

- AVIF: WebP 대비 약 20% 추가 압축 (동일 화질 기준)
- WebP: JPEG 대비 약 25–35% 용량 절감 (동일 화질 기준)
- 변환은 첫 요청 시 수행되고, 이후 캐시에서 제공된다

### 1.2 서버사이드 리사이징

`width` prop으로 지정한 크기에 맞게 서버에서 이미지를 축소한다.

- 4K 원본 이미지를 `width={800}`으로 요청하면, 서버에서 800px로 리사이징된 이미지를 전송
- 클라이언트가 전체 원본을 받아 CSS로 줄이는 방식보다 대역폭 소모가 훨씬 적다
- `sizes` prop과 결합하면 뷰포트 크기별로 최적 크기를 결정한다

### 1.3 srcset 자동 생성 (반응형 이미지)

단일 `<img>` 태그에 `srcset` 속성을 자동으로 생성한다. 예:

```html
<img
  srcset="
    /_next/image?url=...&w=640&q=75  640w,
    /_next/image?url=...&w=828&q=75  828w,
    /_next/image?url=...&w=1080&q=75 1080w,
    /_next/image?url=...&w=1920&q=75 1920w
  "
  sizes="100vw"
/>
```

브라우저가 실제 렌더링 크기에 맞는 가장 작은 후보를 자동으로 선택한다. `devicePixelRatio`(Retina 디스플레이)도 반영된다.

### 1.4 Lazy Loading

`priority` prop이 없는 이미지에 `loading="lazy"`가 기본 적용된다.

- 뷰포트 밖의 이미지는 네트워크 요청 자체를 하지 않는다
- 브라우저 네이티브 lazy loading을 활용하므로 JavaScript 없이도 동작한다
- LCP(Largest Contentful Paint) 이미지에는 반드시 `priority`를 지정해야 한다

### 1.5 Blur Placeholder

`placeholder="blur"` 설정 시, 이미지 로딩 중 저해상도 블러 프리뷰를 표시한다.

- 로컬 이미지: 빌드 타임에 자동 생성
- 원격 이미지: `blurDataURL` prop을 별도로 제공해야 한다

### 1.6 CLS(Cumulative Layout Shift) 방지

`width`/`height`를 지정하면, 브라우저가 이미지 로딩 전에 공간을 미리 예약한다.

- `aspect-ratio` CSS를 자동으로 계산하여 레이아웃 시프트를 방지한다
- Core Web Vitals의 CLS 점수에 직결된다

### 1.7 `/_next/image` 프록시 캐싱

Next.js 서버가 원격 이미지를 한 번 최적화한 뒤, 서버 디스크에 캐시한다.

- 동일한 URL + width + quality 조합의 두 번째 요청부터는 캐시에서 제공
- `Cache-Control` 헤더로 브라우저 캐싱도 제어 (`minimumCacheTTL` 설정 가능)
- 기본 캐시 TTL: 60초 (원본 이미지의 `Cache-Control`을 상속하거나 기본값 사용)

### 1.8 Quality 조절

압축 품질 설정. 기본값 75 (0–100 범위).

```jsx
<Image quality={85} ... />
```

포맷마다 압축 알고리즘이 다르므로, AVIF/WebP는 같은 quality 값에서 JPEG보다 시각적 품질이 높다.

---

## 2. S3 CDN이 현재 제공하는 것

### 2.1 현재 사용 도메인

```
https://my-personal-image-bucket.s3.ap-northeast-2.amazonaws.com
```

이는 **S3 직접 접근(S3 Direct Access)** URL이다. CloudFront 등의 CDN 레이어가 없다.

### 2.2 S3 직접 접근이 제공하는 것

| 기능 | 제공 여부 | 비고 |
|---|---|---|
| 파일 저장 및 서빙 | ✅ | 기본 기능 |
| HTTPS | ✅ | S3 기본 제공 |
| 지역 엣지 캐싱 | ❌ | CloudFront 없음 |
| 포맷 변환 | ❌ | 저장된 그대로 전송 |
| 리사이징 | ❌ | 저장된 크기 그대로 전송 |
| 이미지 압축 최적화 | ❌ | 업로드 시 저장된 상태 유지 |
| Gzip/Brotli 압축 | ❌ | 이미지 파일에는 적용 안 됨 |

### 2.3 S3 vs CloudFront 차이

| 항목 | S3 Direct | S3 + CloudFront |
|---|---|---|
| 서빙 위치 | 서울 리전 단일 | 전 세계 엣지 로케이션 |
| 캐싱 | S3 자체 없음 | 엣지 캐싱 |
| 지연 시간 | 리전 거리에 비례 | 사용자 근접 엣지 |
| 포맷 최적화 | 없음 | Lambda@Edge로 구현 가능 |

**현재 블로그는 S3 Direct를 사용하므로, CDN의 핵심 이점인 엣지 캐싱과 지역 분산이 없다.**

---

## 3. `unoptimized` 적용 시 실질적 영향 분석

### 3.1 현재 이미지 현황

- **전체 이미지**: 252개 (마크다운 이미지 기준)
- **S3 도메인 이미지**: 244개 (96.8%)
- **비-S3 이미지**: 8개 (3.2%)

**파일 형식 분포** (S3 기준):

| 확장자 | 개수 | 비율 |
|---|---|---|
| JPG/JPEG | 128개 | 52.0% |
| PNG | 112개 | 45.5% |
| GIF | 4개 | 1.6% |
| 기타 | 0개 | — |

WebP/AVIF 이미지는 **0개**다. 현재 S3에 저장된 이미지는 모두 레거시 포맷이다.

### 3.2 포맷 변환 없음의 실질적 영향

`unoptimized` 적용 전 `next/image`가 했을 일:
- Chrome/Edge 사용자: AVIF 변환 → JPG 대비 약 40–50% 용량 절감
- Firefox 사용자: WebP 변환 → JPG 대비 약 25–35% 용량 절감

**예시 계산**:
- 평균 JPG 300KB, 128개 = 38.4MB (전체 JPG 총량 추정)
- WebP 변환 시: 약 25MB (38% 절감)
- AVIF 변환 시: 약 19MB (50% 절감)

그러나 이 손실은 **페이지당 로드되는 이미지 수**에 비례한다. 포스트 1개를 읽을 때 모든 252개 이미지가 로드되는 것이 아니다.

### 3.3 리사이징 없음의 영향

현재 `AnimatedImage.tsx`의 구현:

```tsx
<Image
  unoptimized
  width={0}
  height={0}
  style={{ width: "auto" }}
  ...
/>
```

`width={0}`은 Next.js Image에서 리사이징 힌트를 주지 않는 방식이다.
`unoptimized`와 함께 사용되므로 원본 크기 그대로 다운로드된다.

- Obsidian에서 업로드된 스크린샷은 Retina 디스플레이 기준 2배 해상도로 저장되는 경우가 많다
- 예: 실제 렌더링 너비 800px인데 원본이 2560px이면 → 불필요한 데이터 전송 발생
- `next/image`의 `sizes` + `srcset`이 있었다면 브라우저가 최적 크기를 선택했을 것이다

### 3.4 Lazy Loading 처리

`unoptimized`를 사용해도 `loading="lazy"`는 HTML 속성으로 별도 적용 가능하다.
현재 `AnimatedImage.tsx`는 이를 명시하지 않으므로 기본값(`loading="eager"`)이 적용된다.

단, `motion/react`의 `whileInView`가 시각적으로 지연 렌더링을 구현하고 있다.
**네트워크 요청은 지연되지 않고**, 애니메이션만 지연된다는 점이 차이다.

### 3.5 CLS 영향

`width={0}`, `height={0}`, `style={{ width: "auto" }}`로 인해 브라우저는 이미지 크기를 미리 알 수 없다.
이미지 로드 전까지 공간이 예약되지 않아 레이아웃 시프트가 발생한다.

블로그 포스트 특성상 이미지가 하단에 순차적으로 배치되므로 실제 사용자 경험 영향은 제한적이지만,
Lighthouse CLS 점수에는 반영될 수 있다.

---

## 4. 결론 및 권장사항

### 4.1 `unoptimized`를 선택한 배경

`next/image`는 `width`/`height`를 반드시 지정해야 한다. MDX 콘텐츠의 마크다운 이미지는 치수 정보가 없으므로, 이를 우회하기 위해 `width={0}`, `height={0}`, `unoptimized`를 조합했다.

이 방식은 Next.js 공식 문서에서 권장하는 방법 중 하나다 (`fill` prop 또는 `unoptimized` 사용).

### 4.2 실질적 손실 요약

| 손실 항목 | 심각도 | 비고 |
|---|---|---|
| WebP/AVIF 자동 변환 없음 | 중간 | 페이지당 2–5개 이미지 기준 300–1000KB 추가 전송 |
| 리사이징 없음 | 낮음–중간 | 원본이 큰 경우에만 영향 |
| srcset 없음 | 낮음 | Retina 디스플레이에서 오히려 원본이 선명 |
| CLS 방지 없음 | 낮음 | 블로그 포스트 읽기 패턴상 영향 제한적 |
| Lazy Loading 미적용 | 낮음 | motion whileInView와 시각적 효과는 있음 |

### 4.3 개선 가능한 방향 (참고)

1. **`loading="lazy"` 명시적 추가**: `unoptimized`와 무관하게 HTML 표준 속성으로 적용 가능

2. **S3에 CloudFront 추가**: 포맷 변환은 어렵지만, 엣지 캐싱으로 응답속도 개선 가능

3. **Cloudflare Images 마이그레이션**: `imagedelivery.net`이 이미 `remotePatterns`에 있다.
   Cloudflare Images는 WebP/AVIF 자동 변환, 리사이징, 글로벌 CDN을 모두 제공하므로
   `unoptimized`로 인한 손실을 CDN 레이어에서 보완할 수 있다.

4. **현재 상태 유지**: 개인 블로그 규모에서 포맷 미변환으로 인한 실질적 비용은
   사용자당 세션에서 수 MB 수준이다. 이는 허용 가능한 수준일 수 있다.

### 4.4 핵심 판단

S3 Direct를 사용하는 현재 구조에서 `next/image`의 최적화 프록시는 **서버 부하**를 발생시킨다.
개인 블로그의 Next.js 서버가 외부 S3 이미지를 매번 가져와 변환하고 캐시하는 구조는
트래픽이 낮을 때는 캐시 미스가 빈번하여 오히려 응답이 느릴 수 있다.

`unoptimized`로 S3 Direct 서빙을 유지하는 현재 결정은,
**서버 최적화 부담 없이 이미지를 직접 제공**한다는 관점에서 개인 블로그 규모에 적합한 트레이드오프다.
