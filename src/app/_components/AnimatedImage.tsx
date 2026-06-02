"use client";

import Image, { ImageProps } from "next/image";
import { motion } from "motion/react";

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

  if (priority) {
    return (
      <span style={{ display: "block" }}>
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
    );
  }

  return (
    <motion.span
      style={{ display: "block" }}
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
  );
}
