import type { MDXComponents } from "mdx/types";
import { ImageProps } from "next/image";
import { AnimatedImage } from "./src/app/_components/AnimatedImage";
import { CodeBlock } from "./src/app/_components/CodeBlock";

let mdxImageIndex = 0;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  mdxImageIndex = 0;
  return {
    img: (props) => {
      const isFirst = mdxImageIndex === 0;
      mdxImageIndex++;
      return <AnimatedImage priority={isFirst} {...(props as ImageProps)} />;
    },
    pre: ({ children, ...rest }) => (
      <CodeBlock {...rest}>{children}</CodeBlock>
    ),
    table: ({ children, ...rest }) => (
      <div className="overflow-x-auto rounded-lg border my-6">
        <table {...rest}>{children}</table>
      </div>
    ),
    thead: ({ children, ...rest }) => (
      <thead className="bg-muted/50" {...rest}>
        {children}
      </thead>
    ),
    th: ({ children, ...rest }) => (
      <th
        className="px-4 py-2 text-left font-semibold border-b"
        {...rest}
      >
        {children}
      </th>
    ),
    td: ({ children, ...rest }) => (
      <td className="px-4 py-2 border-b border-border/50" {...rest}>
        {children}
      </td>
    ),
    a: ({ children, href, ...rest }) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...rest}
        >
          {children}
          {isExternal && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block ml-0.5 mb-0.5 w-3 h-3 opacity-60"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </a>
      );
    },
    hr: (props) => <hr className="my-8" {...props} />,
    ...components,
  };
}
