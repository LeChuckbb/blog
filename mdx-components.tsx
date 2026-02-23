import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

let mdxImageIndex = 0;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  mdxImageIndex = 0;
  return {
    img: (props) => {
      const isFirst = mdxImageIndex === 0;
      mdxImageIndex++;
      return (
        <Image
          sizes="100vw"
          className="w-full h-auto rounded-lg"
          width={600}
          height={300}
          priority={isFirst}
          {...(props as ImageProps)}
        />
      );
    },
    pre: ({ children, ...rest }) => (
      <pre className="my-4 rounded-lg overflow-x-auto" {...rest}>
        {children}
      </pre>
    ),
    ...components,
  };
}
