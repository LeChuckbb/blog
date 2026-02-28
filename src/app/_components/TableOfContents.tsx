"use client";
import React, { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

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
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          "data-[active=true]:text-primary data-[active=true]:font-medium data-[active=true]:bg-muted",
          item.level === 1 && "font-medium",
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
  const normalizeId = useCallback((id: string): string => {
    return id;
  }, []);

  const settingHeadingTops = useCallback((): IHeadingTops[] => {
    const scrollTop = getScrollTop();

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
          return { id, top: 0 };
        }

        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollTop;

        return { id, top };
      })
      .filter(({ top }) => top >= 0);
  }, [items, normalizeId]);

  const updateActiveStates = useCallback((headingTops: IHeadingTops[]) => {
    const scrollTop = getScrollTop();

    document.querySelectorAll("[data-toc-id]").forEach((link) => {
      link.setAttribute("data-active", "false");
    });

    if (!headingTops.length) return;

    const validHeadingTops = headingTops.filter(({ top, id }) => {
      return top > 0 || document.getElementById(id);
    });

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
      }
    }
  }, []);

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      let headingTops = settingHeadingTops();
      updateActiveStates(headingTops);
      let prevScrollHeight = document.body.scrollHeight;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const onScroll = () => {
        updateActiveStates(headingTops);
      };

      const trackScrollHeight = () => {
        const scrollHeight = document.body.scrollHeight;
        if (prevScrollHeight !== scrollHeight) {
          headingTops = settingHeadingTops();
          updateActiveStates(headingTops);
        }
        prevScrollHeight = scrollHeight;
        timeoutId = setTimeout(trackScrollHeight, 250);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      timeoutId = setTimeout(trackScrollHeight, 250);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener("scroll", onScroll);
      };
    }, 100);

    return () => {
      clearTimeout(initialTimeout);
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
    <div className={cn("py-2", className)}>
      <nav className="space-y-0.5">
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
