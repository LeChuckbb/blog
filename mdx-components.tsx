import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-4xl font-bold group">
        <div className="flex items-center">
          {children}
          <span className="ml-2 text-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
            #
          </span>
        </div>
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-3xl font-bold group">
        <div className="flex items-center">
          {children}
          <span className="ml-2 text-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
            #
          </span>
        </div>
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-4 text-2xl font-semibold group">
        <div className="flex items-center">
          {children}
          <span className="ml-2 text-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
            #
          </span>
        </div>
      </h3>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        width={600}
        height={300}
        {...(props as ImageProps)}
      />
    ),
    pre: ({ children }) => (
      <pre className="my-4 rounded-2xl p-4 bg-[#1F2028]">{children}</pre>
    ),
    ...components,
  };
}
