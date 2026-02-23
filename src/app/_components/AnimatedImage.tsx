"use client";

import Image, { ImageProps } from "next/image";
import { motion } from "motion/react";

export function AnimatedImage({ priority, className, ...props }: ImageProps) {
  if (priority) {
    return (
      <Image
        sizes="100vw"
        className={`w-full h-auto rounded-lg${className ? ` ${className}` : ""}`}
        width={600}
        height={300}
        priority
        {...props}
      />
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
        sizes="100vw"
        className={`w-full h-auto rounded-lg${className ? ` ${className}` : ""}`}
        width={600}
        height={300}
        {...props}
      />
    </motion.span>
  );
}
