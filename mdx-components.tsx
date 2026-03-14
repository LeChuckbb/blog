import type { MDXComponents } from "mdx/types";
import { ImageProps } from "next/image";
import { AnimatedImage } from "./src/app/_components/AnimatedImage";
import { CodeBlock } from "./src/app/_components/CodeBlock";
import { Mermaid } from "./src/app/_components/Mermaid";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText(
      (node as React.ReactElement<{ children?: React.ReactNode }>).props
        .children
    );
  }
  return "";
}

let mdxImageIndex = 0;

function createHeading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const Heading = ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Tag
      className="group/heading scroll-mt-[calc(var(--nav-height)+1.5rem)]"
      {...rest}
    >
      {children}
    </Tag>
  );
  Heading.displayName = Tag;
  return Heading;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  mdxImageIndex = 0;
  return {
    img: (props) => {
      const isFirst = mdxImageIndex === 0;
      mdxImageIndex++;
      return <AnimatedImage priority={isFirst} {...(props as ImageProps)} />;
    },
    pre: ({ children, ...rest }) => {
      const child = Array.isArray(children) ? children[0] : children;
      if (
        child &&
        typeof child === "object" &&
        "props" in child &&
        (child as React.ReactElement<{ "data-language"?: string }>).props[
          "data-language"
        ] === "mermaid"
      ) {
        const chart = extractText(
          (child as React.ReactElement<{ children: React.ReactNode }>).props
            .children
        );
        return <Mermaid chart={chart} />;
      }
      return <CodeBlock {...rest}>{children}</CodeBlock>;
    },
    code: ({ children, className, ...rest }) => {
      // rehype-pretty-code가 처리한 코드 블록 내부 code는 그대로 패스
      if (
        "data-language" in rest ||
        "data-theme" in rest ||
        className?.includes("language-")
      ) {
        return (
          <code className={className} {...rest}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="bg-muted px-[0.35em] py-[0.2em] rounded text-[0.875em] font-normal before:content-none after:content-none"
          {...rest}
        >
          {children}
        </code>
      );
    },
    blockquote: ({ children, ...rest }) => (
      <blockquote
        className="font-serif border-0 border-l-4 border-primary bg-transparent py-2 pl-5 rounded-none not-italic text-muted-foreground [&>p]:my-0"
        {...rest}
      >
        {children}
      </blockquote>
    ),
    mark: ({ children, ...rest }) => (
      <mark
        className="bg-[oklch(0.9_0.12_90/60%)] dark:bg-[oklch(0.4_0.12_90/50%)] text-inherit px-[0.2em] py-[0.1em] rounded-sm"
        {...rest}
      >
        {children}
      </mark>
    ),
    table: ({ children, ...rest }) => (
      <div className="overflow-x-auto rounded-lg border border-border my-7">
        <table className="border-spacing-0" {...rest}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...rest }) => (
      <thead className="bg-muted/50" {...rest}>
        {children}
      </thead>
    ),
    th: ({ children, ...rest }) => (
      <th className="px-4 py-2.5 text-left font-semibold border-b border-border" {...rest}>
        {children}
      </th>
    ),
    td: ({ children, ...rest }) => (
      <td className="px-4 py-2 border-b border-border/50 last:border-none" {...rest}>
        {children}
      </td>
    ),
    a: ({
      children,
      href,
      className,
      ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={className}
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
    h1: createHeading("h1"),
    h2: createHeading("h2"),
    h3: createHeading("h3"),
    h4: createHeading("h4"),
    h5: createHeading("h5"),
    h6: createHeading("h6"),
    ...components,
  };
}
