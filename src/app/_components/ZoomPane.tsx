"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { Minus, Plus, Maximize2, X } from "lucide-react";

interface ZoomPaneProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const MIN_SCALE = 1; // 화면에 맞춤보다 더 작게는 의미가 없다
const MAX_SCALE = 6;

/**
 * 라이트박스 내부의 줌·팬 영역 + 컨트롤.
 * 콘텐츠는 뷰포트에 contain으로 맞춰 두고 그 상태를 scale 1로 삼는다.
 * 그래서 resetTransform()이 곧 "화면에 맞춤"이고, 표시 배율도 맞춤 기준 %다.
 */
export function ZoomPane({ title, onClose, children }: ZoomPaneProps) {
  const [scale, setScale] = useState(1);

  return (
    <TransformWrapper
      minScale={MIN_SCALE}
      maxScale={MAX_SCALE}
      centerOnInit
      centerZoomedOut
      doubleClick={{ mode: "toggle", step: 1.5 }}
      wheel={{ step: 0.15 }}
      pinch={{ step: 5 }}
      onTransform={(_, state) => setScale(state.scale)}
    >
      <motion.div
        className="relative h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* touch-action: none — 핀치가 브라우저 페이지 줌으로 새지 않게 (모바일 필수) */}
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%", touchAction: "none" }}
          contentStyle={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(56px, 8vh, 96px) 16px clamp(96px, 14vh, 128px)",
            boxSizing: "border-box",
          }}
        >
          <div className="lightbox-content flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing">
            {children}
          </div>
        </TransformComponent>

        <TopBar title={title} onClose={onClose} />
        <Controls scale={scale} />
      </motion.div>
    </TransformWrapper>
  );
}

function TopBar({ title, onClose }: { title?: string; onClose: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
      <span className="truncate text-sm text-muted-foreground">{title}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="clickable press-icon pointer-events-auto flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-border bg-card/90 text-foreground hover:bg-muted sm:h-10 sm:w-10"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

function Controls({ scale }: { scale: number }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const percent = Math.round(scale * 100);

  const iconButton =
    "clickable press-icon flex h-11 w-11 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-[9px] text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-default";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex items-center gap-1 rounded-[14px] border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={() => zoomOut()}
          disabled={scale <= MIN_SCALE}
          aria-label="축소"
          className={iconButton}
        >
          <Minus className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <span
          className="min-w-14 text-center text-[13px] font-semibold tabular-nums text-foreground"
          aria-live="polite"
        >
          {percent}%
        </span>
        <button
          type="button"
          onClick={() => zoomIn()}
          disabled={scale >= MAX_SCALE}
          aria-label="확대"
          className={iconButton}
        >
          <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <span className="mx-1 h-[22px] w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          onClick={() => resetTransform()}
          className="clickable press-chip flex h-11 sm:h-10 cursor-pointer items-center gap-1.5 rounded-[9px] px-3 text-[13px] font-medium text-foreground hover:bg-muted"
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
          <span>화면에 맞춤</span>
        </button>
        <span
          className="mx-1 hidden h-[22px] w-px bg-border sm:block"
          aria-hidden="true"
        />
        <span className="hidden pr-3 pl-1 text-xs text-muted-foreground sm:block">
          휠·핀치로 확대 · 드래그로 이동 · Esc 닫기
        </span>
      </div>
    </div>
  );
}
