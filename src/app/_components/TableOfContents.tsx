"use client";
import React, { useEffect, useCallback } from "react";
import { cn } from "@/src/app/util";

interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

interface TocItemProps {
  item: TocItem;
  onItemClick: (id: string) => void;
}

interface IHeadingTops {
  id: string;
  top: number;
}

// 크로스 브라우저 호환 스크롤 위치 가져오기
const getScrollTop = (): number => {
  if (!document.body) return 0;
  if (document.documentElement && "scrollTop" in document.documentElement) {
    return document.documentElement.scrollTop || document.body.scrollTop;
  } else {
    return document.body.scrollTop;
  }
};

const TocItemComponent: React.FC<TocItemProps> = ({ item, onItemClick }) => {
  return (
    <div>
      <a
        href={`#${item.id}`}
        data-toc-id={item.id}
        onClick={(e) => {
          e.preventDefault();
          onItemClick(item.id);
        }}
        className={cn(
          "block py-1 px-2 text-sm transition-colors duration-200 rounded",
          // 기본 스타일
          "text-white hover:text-gray-900 hover:bg-gray-50",
          // 활성 상태 (data-attribute 기반)
          "data-[active=true]:text-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:font-medium",
          // 레벨별 들여쓰기
          item.level === 1 && "font-semibold",
          item.level === 2 && "ml-2",
          item.level === 3 && "ml-4",
          item.level === 4 && "ml-6",
          item.level === 5 && "ml-8",
          item.level === 6 && "ml-10",
        )}
      >
        {item.text}
      </a>

      {item.children && item.children.length > 0 && (
        <div className="ml-2">
          {item.children.map((child) => (
            <TocItemComponent
              key={child.id}
              item={child}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  className = "",
}) => {
  // ID 정규화 함수 (마크다운 파서와 동일한 규칙 적용)
  const normalizeId = useCallback((id: string): string => {
    // 실제 HTML ID 변환 규칙 적용
    const normalizedId = id
      .replace(/&/g, "--") // & 를 -- 로 변환
      // .replace(/\s+/g, "-") // 공백을 - 로 변환
      .toLowerCase();

    // 정규화된 ID로 요소 찾기
    const el = document.getElementById(normalizedId);
    if (el) {
      return normalizedId;
    }

    // 원본 ID로도 시도
    const originalEl = document.getElementById(id);
    if (originalEl) {
      return id;
    }

    // 디버깅: 변환 과정 로그
    console.warn(
      `ToC: Element not found. Original: "${id}", Normalized: "${normalizedId}"`,
    );

    return normalizedId; // 정규화된 ID 반환 (요소가 없더라도)
  }, []);

  // 헤딩 요소들의 위치 계산
  const settingHeadingTops = useCallback((): IHeadingTops[] => {
    const scrollTop = getScrollTop();

    // 평면화: 중첩된 items를 평면 배열로 변환
    const flattenItems = (items: TocItem[]): TocItem[] => {
      const result: TocItem[] = [];
      for (const item of items) {
        result.push(item);
        if (item.children) {
          result.push(...flattenItems(item.children));
        }
      }
      return result;
    };

    const flatItems = flattenItems(items);

    return flatItems
      .map(({ id }) => {
        const normalizedId = normalizeId(id);
        const el = document.getElementById(normalizedId);

        if (!el) {
          console.warn(
            `ToC: Element not found. Original: "${id}", Normalized: "${normalizedId}"`,
          );
          // 모든 가능한 ID들을 로그에 출력해서 디버깅 도움
          const allIds = Array.from(document.querySelectorAll("[id]")).map(
            (el) => el.id,
          );
          const similarIds = allIds.filter(
            (existingId) =>
              existingId.includes(id.replace(/-/g, "")) ||
              id.replace(/-/g, "").includes(existingId),
          );
          if (similarIds.length > 0) {
            console.log(`ToC: Similar IDs found:`, similarIds);
          }
          return { id, top: 0 };
        }

        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollTop;

        // 디버깅을 위한 로그
        if (id.includes("search") && id.includes("pagination")) {
          console.log(`Debug ${id}:`, {
            originalId: id,
            normalizedId: normalizedId,
            rect: rect,
            scrollTop: scrollTop,
            calculatedTop: top,
            elementExists: !!el,
          });
        }

        return { id, top };
      })
      .filter(({ top }) => top >= 0); // 유효하지 않은 위치값 필터링
  }, [items, normalizeId]);

  // 활성 상태 업데이트 함수
  const updateActiveStates = useCallback((headingTops: IHeadingTops[]) => {
    const scrollTop = getScrollTop();

    // 모든 ToC 링크의 active 상태 초기화
    document.querySelectorAll("[data-toc-id]").forEach((link) => {
      link.setAttribute("data-active", "false");
    });

    if (!headingTops.length) return;

    // 유효한 headingTops만 필터링 (top이 0이 아닌 것들)
    const validHeadingTops = headingTops.filter(({ top, id }) => {
      const isValid = top > 0 || document.getElementById(id);
      if (!isValid) {
        console.warn(`ToC: Invalid heading top for "${id}": ${top}`);
      }
      return isValid;
    });

    // 현재 스크롤 위치에서 가장 가까운 헤딩 찾기
    // offset을 10px로 늘려서 더 정확한 감지
    const currentHeading = validHeadingTops
      .slice()
      .reverse()
      .find((headingTop) => scrollTop >= headingTop.top - 10);

    if (currentHeading) {
      const activeLink = document.querySelector(
        `[data-toc-id="${currentHeading.id}"]`,
      );
      if (activeLink) {
        activeLink.setAttribute("data-active", "true");

        // 디버깅 로그
        console.log(
          `ToC: Active heading set to "${currentHeading.id}" (top: ${currentHeading.top}, scroll: ${scrollTop})`,
        );
      }
    }
  }, []);

  // 헤딩 위치 추적 및 스크롤 이벤트 처리
  useEffect(() => {
    // 초기 계산을 약간 지연시켜서 DOM이 완전히 렌더링된 후 실행
    const initializeHeadings = () => {
      const headingTops = settingHeadingTops();
      updateActiveStates(headingTops);
      return headingTops;
    };

    // 100ms 지연 후 초기화 (이미지나 동적 콘텐츠 로딩 고려)
    const initialTimeout = setTimeout(() => {
      let headingTops = initializeHeadings();
      let prevScrollHeight = document.body.scrollHeight;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const onScroll = () => {
        updateActiveStates(headingTops);
      };

      // 0.25초마다 스크롤 높이 변화 감지하여 위치 재계산
      const trackScrollHeight = () => {
        const scrollHeight = document.body.scrollHeight;
        if (prevScrollHeight !== scrollHeight) {
          console.log("ToC: Page height changed, recalculating positions");
          headingTops = settingHeadingTops();
          updateActiveStates(headingTops);
        }
        prevScrollHeight = scrollHeight;
        timeoutId = setTimeout(trackScrollHeight, 250);
      };

      // 스크롤 이벤트 리스너 등록
      window.addEventListener("scroll", onScroll, { passive: true });

      // 주기적 업데이트 시작
      timeoutId = setTimeout(trackScrollHeight, 250);

      // cleanup 함수를 전역으로 저장
      (window as any).__tocCleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener("scroll", onScroll);
      };
    }, 100);

    return () => {
      clearTimeout(initialTimeout);
      if ((window as any).__tocCleanup) {
        (window as any).__tocCleanup();
        delete (window as any).__tocCleanup;
      }
    };
  }, [settingHeadingTops, updateActiveStates]);

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={cn("p-4", className)}>
      <h3 className="font-semibold text-white mb-3">목차</h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <TocItemComponent
            key={item.id}
            item={item}
            onItemClick={handleItemClick}
          />
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
