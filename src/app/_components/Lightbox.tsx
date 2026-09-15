"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/util";

// 줌·팬 엔진(react-zoom-pan-pinch)은 라이트박스가 열릴 때만 필요하다.
// 본문 초기 로딩에 실리지 않도록 열림 시점에 청크를 받는다.
const ZoomPane = dynamic(() => import("./ZoomPane").then((m) => m.ZoomPane), {
  ssr: false,
});

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  /** 상단 바에 표시할 짧은 제목. 없으면 상단 바는 닫기 버튼만 둔다. */
  title?: string;
  /** 확대 대상. 뷰포트에 contain으로 맞춰진 상태가 scale 1(=화면에 맞춤)이다. */
  children: React.ReactNode;
  className?: string;
}

/**
 * 전체 화면 확대 보기. native <dialog>를 써서 포커스 트랩·Esc·inert 처리를 브라우저에 맡긴다.
 * 닫힘은 세 경로 — Esc(dialog cancel), 배경 클릭, 닫기 버튼 — 모두 onClose 하나로 모인다.
 */
export function Lightbox({
  open,
  onClose,
  title,
  children,
  className,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // MDX는 이미지를 <p> 안에 렌더한다. <dialog>가 <p>의 자손이면 HTML 규칙 위반으로
  // hydration이 깨지므로 body로 포털한다. 포털은 클라이언트 마운트 후에만 그린다.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // showModal()은 뒤 페이지를 inert로 만들지만 스크롤까지 막지는 않는다.
  // 휠/터치가 라이트박스 밖으로 새지 않도록 열린 동안 문서 스크롤을 잠근다.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      // dialog 요소 자체는 뷰포트 전체를 덮는 배경이다. 자식이 아닌 dialog 자신이 클릭되면 배경 클릭.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      // Esc — 브라우저가 cancel → close 순으로 발생시킨다. close에서 상태를 동기화한다.
      onClose={onClose}
      aria-label={title ? `${title} 확대 보기` : "확대 보기"}
      className={cn(
        "fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none p-0",
        "bg-background/85 text-foreground backdrop-blur-sm",
        "backdrop:bg-transparent",
        className,
      )}
    >
      {open && (
        <div className="relative h-full w-full">
          <ZoomPane title={title} onClose={onClose}>
            {children}
          </ZoomPane>
        </div>
      )}
    </dialog>,
    document.body,
  );
}
