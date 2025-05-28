import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-red-700">{children}</h1>,
    img: (props) => (
      <Image
        sizes="100vw"
        width={600}
        height={300}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  };
}
