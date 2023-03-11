import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Jua&family=Nanum+Gothic:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&family=Sunflower:wght@700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="naver-site-verification"
          content="5f8dbbc872022d2a4036eb1b82722c3002db84f0"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
