#!/usr/bin/env node
/**
 * GSC URL Inspection API로 sitemap의 모든 URL 색인 상태를 일괄 조회한다.
 *
 * GSC UI에는 색인 생성 요청의 진행도를 보여주는 화면이 없다. 개별 URL을 URL 검사에
 * 다시 넣어 "최근 크롤링" 날짜를 보는 게 유일한 확인 수단인데, 63개를 손으로 할 수는
 * 없으므로 공식 API로 대신한다. 할당량은 속성당 하루 2000건이라 여유가 크다.
 *
 * 사용법:
 *   GSC_SA_KEY=~/.config/gsc-sa.json node scripts/gsc-index-status.mjs
 *
 * 사전 준비(1회):
 *   1. GCP 프로젝트에서 "Google Search Console API" 사용 설정
 *   2. 서비스 계정 생성 → JSON 키 다운로드
 *   3. GSC 속성 → 설정 → 사용자 및 권한 → 서비스 계정 이메일을 "전체" 권한으로 추가
 */
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";

const SITE_URL = "sc-domain:lechuck.blog"; // 도메인 속성
const SITEMAP = "https://lechuck.blog/sitemap.xml";
const KEY_PATH = (process.env.GSC_SA_KEY || "").replace(/^~/, process.env.HOME);

if (!KEY_PATH) {
  console.error("GSC_SA_KEY 환경변수에 서비스 계정 JSON 키 경로를 지정하세요.");
  process.exit(1);
}

const key = JSON.parse(readFileSync(KEY_PATH, "utf8"));

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** 서비스 계정 JWT로 액세스 토큰을 발급받는다(의존성 없이 RS256 직접 서명). */
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = b64url(signer.sign(key.private_key));

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`토큰 발급 실패: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function fetchSitemapUrls() {
  const xml = await (await fetch(SITEMAP)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function inspect(token, url) {
  const res = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    const msg = (() => {
      try { return JSON.parse(body).error?.message ?? body; } catch { return body; }
    })();
    return { error: `${res.status} ${msg}` };
  }
  const r = (await res.json()).inspectionResult?.indexStatusResult ?? {};
  return {
    verdict: r.verdict, // PASS = 색인됨
    coverage: r.coverageState, // "Submitted and indexed" / "Discovered - currently not indexed" ...
    lastCrawl: r.lastCrawlTime, // 없으면 한 번도 크롤링 안 됨
  };
}

const token = await getAccessToken();

// 63개를 다 돌고 나서야 권한 문제를 알게 되면 시간과 할당량이 낭비된다.
// 속성 접근 권한을 먼저 확인하고, 없으면 원인을 짚어 즉시 중단한다.
const sitesRes = await fetch(
  "https://searchconsole.googleapis.com/webmasters/v3/sites",
  { headers: { Authorization: `Bearer ${token}` } },
);
const sites = (await sitesRes.json()).siteEntry ?? [];
if (!sites.some((s) => s.siteUrl === SITE_URL)) {
  console.error(`이 서비스 계정(${key.client_email})이 접근할 수 있는 속성에 ${SITE_URL}가 없습니다.`);
  console.error(
    sites.length
      ? `접근 가능한 속성: ${sites.map((s) => s.siteUrl).join(", ")}`
      : "접근 가능한 속성이 하나도 없습니다. GSC → 설정 → 사용자 및 권한에서 위 이메일을 추가하세요.",
  );
  process.exit(1);
}

const urls = await fetchSitemapUrls();
console.log(`${urls.length}개 URL 조회 중...\n`);

const rows = [];
for (const url of urls) {
  const r = await inspect(token, url);
  rows.push({ url, ...r });
  const mark = r.error ? "❌" : r.verdict === "PASS" ? "✅" : r.lastCrawl ? "🟡" : "⬜";
  const crawled = r.error ? "조회실패" : r.lastCrawl ? r.lastCrawl.slice(0, 10) : "미크롤링";
  console.log(
    `${mark} ${crawled.padEnd(10)} ${(r.coverage || r.error || "?").padEnd(38)} ${url.replace("https://lechuck.blog", "")}`,
  );
  await new Promise((r) => setTimeout(r, 120)); // 분당 600건 제한 여유
}

const errored = rows.filter((r) => r.error);
const ok = rows.filter((r) => !r.error);
const indexed = ok.filter((r) => r.verdict === "PASS").length;
const crawled = ok.filter((r) => r.lastCrawl).length;
console.log(`\n── 요약 ──`);
console.log(`색인됨   ${indexed} / ${ok.length}`);
console.log(`크롤링됨 ${crawled} / ${ok.length}  (색인 대기 ${crawled - indexed})`);
console.log(`미크롤링 ${ok.length - crawled} / ${ok.length}`);
if (errored.length) console.log(`조회 실패 ${errored.length}건`);
