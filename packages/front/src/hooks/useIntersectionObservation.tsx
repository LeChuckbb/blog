import { RefObject, useEffect, useRef, useState } from "react";

const useIntersectionObservation = (
  targetRef: RefObject<Element>,
  options: IntersectionObserverInit = {
    threshold: 0, // target이 viewport와 0%만 겹처도 observer를 실행
    root: null, // null = viewport
    rootMargin: "-5px 0px 0px",
  }
): IntersectionObserverEntry | undefined => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  let prevYPosition = 0;

  // scroll 방향 check function
  const checkScrollDirection = (prevY: number) => {
    prevYPosition = window.scrollY;

    if (window.scrollY === 0 && prevY === 0) return;
    else if (window.scrollY > prevY) return "down";
    else return "up";
  };

  // callback 함수
  const callback = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      const direction = checkScrollDirection(prevYPosition);
      const SCROLL_DOWN_AND_HEADER_ON_TOP =
        direction === "down" && !entry.isIntersecting;
      const SCROLL_UP_AND_HEADER_ON_BOTTOM =
        direction === "up" && entry.isIntersecting;

      if (SCROLL_DOWN_AND_HEADER_ON_TOP) {
        console.log(`DOWN : ${SCROLL_DOWN_AND_HEADER_ON_TOP}`);
        console.log(entry.target.id);
      }
      if (SCROLL_UP_AND_HEADER_ON_BOTTOM) {
        console.log(`UP : ${SCROLL_UP_AND_HEADER_ON_BOTTOM}`);
        console.log(entry.target.id);
      }

      if (SCROLL_DOWN_AND_HEADER_ON_TOP || SCROLL_UP_AND_HEADER_ON_BOTTOM)
        setEntry(entry);
    });
  };

  useEffect(() => {
    const target = targetRef?.current;
    const targets = target?.querySelectorAll("h1,h2,h3");
    const observer = new IntersectionObserver(callback, options);
    // observe -> 해당 target을 감시
    // 감시 중 스크롤링시 target이 발견되면, callback 함수 호출
    targets?.forEach((content) => {
      observer.observe(content);
    });
    return () => observer.disconnect();
  }, [targetRef, options.root, options.rootMargin, options.threshold]);

  return entry;
};

export default useIntersectionObservation;
