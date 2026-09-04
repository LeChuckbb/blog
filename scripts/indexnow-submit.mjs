#!/usr/bin/env node
/**
 * IndexNow로 sitemap의 모든 URL을 네이버·빙에 일괄 제출한다.
 *
 * 구글은 IndexNow를 지원하지 않아 GSC에서 한 건씩 손으로 요청할 수밖에 없지만,
 * 네이버(2023-07 지원)와 빙은 이 프로토콜로 한 번에 최대 10,000건을 밀어넣을 수 있다.
 *
 * 사전 조건: public/<key>.txt 가 배포되어 https://lechuck.blog/<key>.txt 로 접근 가능해야
 * 한다. 이 파일이 없으면 keyLocation 검증에 실패해 403이 난다.
 *
 * 사용법: node scripts/indexnow-submit.mjs [--dry]
 */
import { readdirSync } from "node:fs";

const HOST = "lechuck.blog";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINTS = [
  ["네이버", "https://api.searchadvisor.naver.com/indexnow"],
  ["빙/기타", "https://api.indexnow.org/indexnow"],
];
const dryRun = process.argv.includes("--dry");

// public/ 에 있는 32자 hex .txt 파일이 IndexNow 키다. 키를 코드에 박아두면
// 키 파일과 어긋날 수 있으므로 파일 이름을 단일 출처로 삼는다.
const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{8,128}\.txt$/.test(f));
if (!keyFile) {
  console.error("public/ 에서 IndexNow 키 파일을 찾지 못했습니다.");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");
const keyLocation = `https://${HOST}/${keyFile}`;

// 키 파일이 실제로 서빙되는지 먼저 확인한다. 배포 전에 제출하면 403만 받고 끝난다.
const keyRes = await fetch(keyLocation);
const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
if (!keyRes.ok || keyBody !== key) {
  console.error(`키 파일 검증 실패: ${keyLocation} (HTTP ${keyRes.status})`);
  console.error("public/ 의 키 파일이 아직 배포되지 않았습니다. 배포 후 다시 실행하세요.");
  process.exit(1);
}
console.log(`키 파일 확인: ${keyLocation}\n`);

const xml = await (await fetch(SITEMAP)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`제출 대상: ${urlList.length}개 URL`);

if (dryRun) {
  console.log("--dry 모드: 실제로 제출하지 않았습니다.");
  process.exit(0);
}

for (const [name, endpoint] of ENDPOINTS) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
  });
  const body = await res.text();
  // IndexNow는 200(수락)과 202(수락, 키 검증 대기) 모두 성공으로 본다.
  const ok = res.status === 200 || res.status === 202;
  console.log(`${ok ? "✅" : "❌"} ${name.padEnd(7)} HTTP ${res.status} ${body.slice(0, 120)}`);
}
