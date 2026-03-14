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
  ...imageProps
}: AnimatedImageProps) {
  if (priority) {
    return (
      <span style={{ display: "block" }}>
        <Image
          width={_width ?? 1920}
          height={_height ?? 1080}
          className={`h-auto max-w-full rounded-lg${className ? ` ${className}` : ""}`}
          style={{ width: "100%", height: "auto" }}
          sizes="(max-width: 768px) 100vw, 768px"
          priority
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
        style={{ width: "100%", height: "auto" }}
        sizes="(max-width: 768px) 100vw, 768px"
        {...imageProps}
      />
    </motion.span>
  );
}
