import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => <h1 className="text-4xl font-semibold tracking-tight text-stone-950">{children}</h1>,
  h2: ({ children }) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight text-stone-900">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight text-stone-900">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4 text-base leading-8 text-stone-700">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-stone-700">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-stone-700">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  code: ({ children }) => (
    <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[0.92em] text-stone-900">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-2xl bg-stone-950 p-5 text-sm leading-7 text-stone-100">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 rounded-r-2xl border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-stone-700">
      {children}
    </blockquote>
  ),
};

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
