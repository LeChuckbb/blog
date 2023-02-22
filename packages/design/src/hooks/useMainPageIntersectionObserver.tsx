/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect, useState } from "react";

function useMainPageIntersectionObserver(
  targetRef: RefObject<Element>,
  options: IntersectionObserverInit = {
    threshold: 0, // target이 viewport와 0%만 겹처도 observer를 실행
    root: null, // null = viewport
    rootMargin: "0px",
  }
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const isIntersecting = entry?.isIntersecting;

  // callback 함수
  // 최초 등록시, 그리고 가시성에 변화가 생길시 콜백 함수가 호출됨
  const updateEntry = (entries: IntersectionObserverEntry[]): void => {
    const [entry] = entries;
    setEntry(entry);
  };

  useEffect(() => {
    const target = targetRef?.current;

    // 겹치는 부분이 있거나, 타겟이 없으면 return
    if (isIntersecting || !target) return;
    // 감시 중 스크롤링시 target이 발견되면, callback 함수 호출
    const observer = new IntersectionObserver(updateEntry, options);
    observer.observe(target); // 해당 target을 감시
    return () => {
      observer.disconnect();
    };
  }, [
    targetRef,
    options.root,
    options.rootMargin,
    options.threshold,
    isIntersecting,
  ]);

  return entry;
}

export default useMainPageIntersectionObserver;
