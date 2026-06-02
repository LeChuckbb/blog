---
name: obsidian-safe-delete
description: Obsidian Vault 내 파일을 삭제할 때 반드시 이 스킬을 사용한다. `rm` 명령어는 절대 사용 금지. Obsidian Vault 경로의 파일을 지우거나 없애거나 삭제하는 모든 작업에 적용된다. "파일 삭제", "파일 제거", "파일 정리", "불필요한 파일 없애기" 등 Vault 내 파일을 없애는 모든 요청에 반드시 이 스킬을 트리거한다.
---

# Obsidian 파일 안전 삭제

## 핵심 규칙

Obsidian Vault 내 파일을 삭제할 때는 **반드시 macOS 휴지통으로 이동**한다. `rm` 명령어는 영구 삭제라 복구 불가능하다.

## 삭제 방법

```bash
# 단일 파일 삭제
osascript -e 'tell application "Finder" to delete POSIX file "/전체/경로/파일명.md"'

# 여러 파일 삭제
osascript -e 'tell application "Finder" to delete POSIX file "/경로/파일1.md"'
osascript -e 'tell application "Finder" to delete POSIX file "/경로/파일2.md"'
```

## 절대 금지

```bash
# 이것은 절대 사용하지 않는다
rm "파일경로"
rm -f "파일경로"
rm -rf "디렉토리경로"
```

## 확인

삭제 전 반드시 경로를 한 번 더 확인한다. 삭제 후 `ls`로 파일이 사라졌는지 확인한다.
