"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  activeId: string;
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

const TocItemComponent: React.FC<TocItemProps> = ({
  item,
  activeId,
  onItemClick,
}) => {
  const isActive = activeId === item.id;

  return (
    <div>
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          onItemClick(item.id);
        }}
        className={cn(
          "block py-1 px-2  text-sm transition-colors duration-200 rounded",
          isActive
            ? "text-blue-600 bg-blue-50 font-medium"
            : "text-white hover:text-gray-900 hover:bg-gray-50",
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
              activeId={activeId}
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
  const [activeId, setActiveId] = useState("");
  const [headingTops, setHeadingTops] = useState<IHeadingTops[]>([]);

  // 헤딩 요소들의 위치 계산
  const settingHeadingTops = useCallback(() => {
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

    const headingTops = flatItems.map(({ id }) => {
      const el = document.getElementById(id);
      const top = el ? el.getBoundingClientRect().top + scrollTop : 0;
      return { id, top };
    });

    setHeadingTops(headingTops);
  }, [items]);

  // 초기 헤딩 위치 설정 및 주기적 업데이트
  useEffect(() => {
    settingHeadingTops();

    let prevScrollHeight = document.body.scrollHeight;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // 0.25초마다 스크롤 높이 변화 감지하여 위치 재계산
    const trackScrollHeight = () => {
      const scrollHeight = document.body.scrollHeight;
      if (prevScrollHeight !== scrollHeight) {
        settingHeadingTops();
      }
      prevScrollHeight = scrollHeight;
      timeoutId = setTimeout(trackScrollHeight, 250);
    };

    timeoutId = setTimeout(trackScrollHeight, 250);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [settingHeadingTops]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = getScrollTop();
      if (!headingTops.length) return;

      // 현재 스크롤 위치에서 가장 가까운 헤딩 찾기
      // 배열을 역순으로 돌면서 스크롤 위치보다 위에 있는 마지막 헤딩을 찾음
      const currentHeading = headingTops
        .slice()
        .reverse()
        .find((headingTop) => scrollTop >= headingTop.top - 4);

      if (currentHeading) {
        setActiveId(currentHeading.id);
      } else {
        setActiveId("");
      }
    };

    // 초기 실행
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [headingTops]);

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
            activeId={activeId}
            onItemClick={handleItemClick}
          />
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
