"use client";

import Image, { ImageProps } from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { Lightbox } from "./Lightbox";
import { trackEvent } from "@/src/app/lib/gtag";

type AnimatedImageProps = Omit<ImageProps, "width" | "height"> & {
  width?: ImageProps["width"];
  height?: ImageProps["height"];
};

export function AnimatedImage({
  priority,
  className,
  width: _width,
  height: _height,
  blurDataURL,
  ...imageProps
}: AnimatedImageProps) {
  // blurDataURL은 빌드 타임 rehype-image-size가 주입한다(원격 이미지라 자동 생성 불가).
  // 값이 있을 때만 placeholder="blur"를 켠다 — 없으면 next/image가 에러를 내므로.
  const placeholderProps = blurDataURL
    ? ({ placeholder: "blur", blurDataURL } as const)
    : {};

  // width:100%로 컨테이너에 맞추되, 원본 크기를 maxWidth 상한으로 둬 원본보다 확대되지 않게 한다.
  // (style에 width:"auto"를 쓰면 고DPR 환경에서 표시 크기가 1/DPR로 줄어드는 버그가 있어 금지)
  const numericWidth =
    typeof _width === "number" ? _width : _width ? Number(_width) : undefined;
  const maxWidth =
    numericWidth && Number.isFinite(numericWidth)
      ? `${numericWidth}px`
      : undefined;

  // 라이트박스에는 next/image의 768px 축소본이 아니라 원본 URL을 그대로 넣는다.
  // 열릴 때만 로드되므로 본문 로딩 비용은 그대로다.
  const [open, setOpen] = useState(false);
  const originalSrc =
    typeof imageProps.src === "string" ? imageProps.src : null;
  const openLightbox = () => {
    if (!originalSrc) return;
    setOpen(true);
    trackEvent("media_zoom", { kind: "image" });
  };
  const zoomable = originalSrc !== null;
  const wrapperProps = zoomable
    ? {
        role: "button" as const,
        tabIndex: 0,
        "aria-label": `${imageProps.alt || "이미지"} 크게 보기`,
        onClick: openLightbox,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox();
          }
        },
        className:
          "clickable cursor-zoom-in rounded-lg focus-visible:outline-2 focus-visible:outline-ring",
      }
    : {};
  const lightbox = zoomable && (
    <Lightbox open={open} onClose={() => setOpen(false)} title={imageProps.alt}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 원본 해상도가 목적이라 최적화를 거치지 않는다 */}
      <img src={originalSrc} alt={imageProps.alt ?? ""} draggable={false} />
    </Lightbox>
  );

  // 라이트박스는 클릭 래퍼의 형제로 둔다. 포털이어도 React 이벤트는 부모로 버블링되므로
  // 래퍼 안에 있으면 배경 클릭으로 닫힌 직후 래퍼 onClick이 다시 연다.
  if (priority) {
    return (
      <>
        <span style={{ display: "block" }} {...wrapperProps}>
          <Image
            width={_width ?? 1920}
            height={_height ?? 1080}
            className={`h-auto max-w-full rounded-lg${className ? ` ${className}` : ""}`}
            style={{ width: "100%", height: "auto", maxWidth }}
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            {...placeholderProps}
            {...imageProps}
          />
        </span>
        {lightbox}
      </>
    );
  }

  return (
    <>
      <motion.span
        style={{ display: "block" }}
        {...wrapperProps}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image
          width={_width ?? 1920}
          height={_height ?? 1080}
          className={`h-auto max-w-full rounded-lg${className ? ` ${className}` : ""}`}
          style={{ width: "100%", height: "auto", maxWidth }}
          sizes="(max-width: 768px) 100vw, 768px"
          {...placeholderProps}
          {...imageProps}
        />
      </motion.span>
      {lightbox}
    </>
  );
}
