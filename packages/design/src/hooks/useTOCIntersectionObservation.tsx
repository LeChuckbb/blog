import { RefObject, useEffect, useRef, useState } from "react";
import useScrollDirection from "./useScrollDirection";

interface Output {
  entry?: IntersectionObserverEntry;
  anchorOnClickHandler: any;
  mouseWheelActiveRef: any;
  anchorClickedRef: any;
}

const anchorOnClickHandler = (
  event: React.MouseEvent,
  anchorRef: any,
  mouswWheelRef: any
) => {
  console.log("앵커 클릭");
  // anchorRef.current = true;
  // mouswWheelRef.current = false;
};

const useTOCIntersectionObservation = (
  targetRef: RefObject<Element> | null,
  options: IntersectionObserverInit = {
    threshold: 0, // target이 viewport와 0%만 겹처도 observer를 실행
    root: null, // null = viewport
    rootMargin: "-20px 0px 0px",
  }
): Output => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const mouseWheelActiveRef = useRef(false);
  const anchorClickedRef = useRef(false);
  const { scrollDirection } = useScrollDirection();
  const direction = useRef(scrollDirection);

  // callback 함수
  const callback = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      const SCROLL_DOWN_AND_HEADER_ON_TOP =
        direction.current === "down" && !entry.isIntersecting;
      const SCROLL_UP_AND_HEADER_ON_BOTTOM =
        direction.current === "up" && entry.isIntersecting;

      if (SCROLL_DOWN_AND_HEADER_ON_TOP || SCROLL_UP_AND_HEADER_ON_BOTTOM) {
        setEntry(entry);
        console.log({
          if: "FIRST",
          id: entry.target.id,
          scrollDirection,
        });
      }
    });
  };

  // 스크롤 디렉션을 갱신하여 callback에 반영
  useEffect(() => {
    direction.current = scrollDirection;
  }, [scrollDirection]);

  // intersection observer 등록
  useEffect(() => {
    const target = targetRef?.current;
    const targets = target?.querySelectorAll("h1,h2,h3");
    const observer = new IntersectionObserver(
      (entries) => callback(entries),
      options
    );
    // observe -> 해당 target을 감시
    // 감시 중 스크롤링시 target이 발견되면, callback 함수 호출
    targets?.forEach((content) => {
      observer.observe(content);
    });
    return () => observer.disconnect();
  }, [targetRef, options.root, options.rootMargin, options.threshold]);

  return { entry, anchorOnClickHandler, mouseWheelActiveRef, anchorClickedRef };
};

export default useTOCIntersectionObservation;
