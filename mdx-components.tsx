import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { cn } from "@/src/app/util";

const textAnchor =
  "[&_a]:after:content-['#'] [&_a]:after:text-white [&_a]:after:ml-2 [&_a]:after:invisible hover:[&_a]:after:visible [&_a]:after:text-2xl";

let mdxImageIndex = 0;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  mdxImageIndex = 0;
  return {
    h1: ({ children, ...rest }) => (
      <h1 className={cn("mt-8 mb-4 text-4xl font-bold", textAnchor)} {...rest}>
        {children}
      </h1>
    ),
    h2: ({ children, ...rest }) => (
      <h2 className={cn("mt-8 mb-4 text-3xl font-bold", textAnchor)} {...rest}>
        {children}
      </h2>
    ),
    h3: ({ children, ...rest }) => (
      <h3
        className={cn("mt-8 mb-4 text-2xl font-semibold", textAnchor)}
        {...rest}
      >
        {children}
      </h3>
    ),
    img: (props) => {
      const isFirst = mdxImageIndex === 0;
      mdxImageIndex++;
      return (
        <Image
          sizes="100vw"
          className="w-full h-auto"
          width={600}
          height={300}
          priority={isFirst}
          {...(props as ImageProps)}
        />
      );
    },
    pre: ({ children, ...rest }) => (
      <pre className="my-4 rounded-2xl p-4 bg-[#1F2028]" {...rest}>
        {children}
      </pre>
    ),
    ...components,
  };
}
