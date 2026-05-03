import { compile, run } from "@mdx-js/mdx";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "@/mdx-components";
import { contentSignal } from "@/src/lib/docs/content-signal";

const compileMdxComponent = cache(async (source: string, signal: string) => {
  void signal;
  const compiled = await compile(source, {
    outputFormat: "function-body",
  });

  const evaluated = await run(compiled, runtime);
  return evaluated.default;
});

export async function renderMdxSource(source: string) {
  const MdxContent = await compileMdxComponent(source, contentSignal);
  return <MdxContent components={mdxComponents} />;
}
