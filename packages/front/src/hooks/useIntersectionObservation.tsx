import { RefObject, useEffect, useRef, useState } from "react";

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

const useIntersectionObservation = (
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
  let direction = "";

  // callback 함수
  const callback = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      const SCROLL_DOWN_AND_HEADER_ON_TOP =
        mouseWheelActiveRef.current === true &&
        direction === "down" &&
        !entry.isIntersecting;
      const SCROLL_UP_AND_HEADER_ON_BOTTOM =
        mouseWheelActiveRef.current === true &&
        direction === "up" &&
        entry.isIntersecting;

      if (SCROLL_DOWN_AND_HEADER_ON_TOP || SCROLL_UP_AND_HEADER_ON_BOTTOM) {
        setEntry(entry);
        console.log({
          if: "FIRST",
          id: entry.target.id,
          direction,
        });
      } else if (entry.isIntersecting) {
        console.log({
          if: "SECOND",
          id: entry.target.id,
        });
        // setEntry(entry);
      }
    });
  };

  // intersection observer 등록
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

  // 마우스 휠 이벤트 등록 (스크롤 방향 구분)
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      mouseWheelActiveRef.current = true;
      console.log("mouse wheel is active!");
      if (event.deltaY > 0) {
        direction = "down";
      } else {
        direction = "up";
      }
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      console.log("mouse wheel is inactive!");
      window.removeEventListener("wheel", handleWheel);
      mouseWheelActiveRef.current = false;
    };
  }, []);

  return { entry, anchorOnClickHandler, mouseWheelActiveRef, anchorClickedRef };
};

export default useIntersectionObservation;
