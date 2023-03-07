## ✏️ Blog

여러 가지 기술 스택을 실험하고 오랫동안 유지보수 해 볼 요량으로 만든 개인 블로그입니다.

<table>
  <tr>
    <td width="350px">
        <img src="./public/static/readme/responsive.gif" style="width: 100%; height: auto;" alt="반응형"/>
    </td>
    <td width="350px">
        <img src="./public/static/readme/read.gif" style="width: 100%; height: auto;" alt="게시글 조회"/>
    </td>
  </tr>
  <tr>
    <td rowspan="1" align="center">
        <b>반응형</b>
    </td>
    <td rowspan="1" align="center">
        <b>게시글 조회</b>
    </td>
  </tr>
  <tr>
    <td width="350px">
        <img src="./public/static/readme/create.gif" style="width: 100%; height: auto;" alt="게시글 작성"/>
    </td>
    <td width="350px">
        <img src="./public/static/readme/tag.gif" style="width: 100%; height: auto;" alt="태그별 조회"/>
    </td>
  </tr>
  <tr>
    <td rowspan="1" align="center">
        <b>게시글 작성</b>
    </td>
    <td rowspan="1" align="center">
        <b>태그별 조회</b>
    </td>
  </tr>
</table>

## 작업 방식

- `Material Design 3` 가이드라인을 참고하여 유의미한 디자인 작업에 힘썼습니다.

- `Storybook`, `Swagger`를 활용한 문서화 및 재사용 가능한 컴포넌트 방식을 고민했습니다.

- 코드 가독성을 위해 `Error Boundary`, `Suspense`를 이용한 선언형 프로그래밍을 적용해 보았습니다.

- `toast-ui/editor`를 사용하여 게시글 작성/수정 UX를 향상시켰습니다.

- `jwt` 방식의 인증/인가를 적용했습니다. 어디서든 디바이스에 구애받지 않고 글을 작성할 수 있습니다.

- `Next.js`, `MongoDB Atlas`, `CloudFlare images CDN`, `vercel`을 활용하여 `serverless` 환경을 구축했습니다.

- `LightHouse` 지표를 살펴보며 성능을 끌어올리기 위한 렌더링 방식과 API 호출 시기, 캐싱을 고민했습니다.

## 이외 기술 스택

- `Typescript`: 컴파일 단계에서의 사전 에러 색출을 위하여 사용했습니다.

- `Recoil`: Redux-Toolikt에 비하여 간편하고 경량화된 전역 상태 관리 라이브러리라고 판단하였습니다.

- `Emotion`: CSS-in-JS 중 비교적 가볍고 범용적이고 SSR 호환에도 무리가 없다고 판단하여 사용했습니다.

- `react-query`: 데이터 페칭시 유용한 여러가지 옵션들을 활용했습니다.
