import { compile, run } from "@mdx-js/mdx";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "@/mdx-components";
import { contentSignal } from "@/src/lib/docs/content-signal";

function escapeTemplateExpressions(source: string) {
  const lines = source.split(/\r?\n/);
  let inFence = false;

  return lines
    .map((line) => {
      if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
        inFence = !inFence;
        return line;
      }

      if (inFence || !line.includes("${")) {
        return line;
      }

      const parts = line.split(/(`+)/);
      let inInlineCode = false;

      return parts
        .map((part) => {
          if (/^`+$/.test(part)) {
            if (part.length % 2 === 1) {
              inInlineCode = !inInlineCode;
            }
            return part;
          }

          if (inInlineCode) {
            return part;
          }

          return part.replace(/\$\{/g, "$\\{");
        })
        .join("");
    })
    .join("\n");
}

const compileMdxComponent = cache(async (source: string, signal: string) => {
  void signal;
  const compiled = await compile(escapeTemplateExpressions(source), {
    outputFormat: "function-body",
  });

  const evaluated = await run(compiled, runtime);
  return evaluated.default;
});

export async function renderMdxSource(source: string) {
  const MdxContent = await compileMdxComponent(source, contentSignal);
  return <MdxContent components={mdxComponents} />;
}
