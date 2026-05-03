import { DocProvider } from "@/src/components/docs/doc-context";
import { SpecialDocChrome } from "@/src/components/docs/special-doc-chrome";
import { renderMdxSource } from "@/src/lib/docs/render-mdx";
import { resolveSidebar } from "@/src/lib/docs/resolve-sidebar";
import { buildDocPath } from "@/src/lib/docs/routing";
import type { ResolvedDoc } from "@/src/lib/docs/types";

interface SpecialDocPageProps {
  doc: ResolvedDoc;
  requestedPath: string;
}

export async function SpecialDocPage({ doc, requestedPath }: SpecialDocPageProps) {
  const resolvedPath = buildDocPath(doc.resolvedLocale, doc.resolvedVersion, doc.resolvedSlug);
  const content = await renderMdxSource(doc.rawContent);
  const sidebar = resolveSidebar(doc.requestedLocale, doc.requestedVersion, []);

  return (
    <DocProvider
      value={{
        doc,
        sidebar,
        requestedPath,
        resolvedPath,
        canonicalPath: resolvedPath,
      }}
    >
      <SpecialDocChrome>{content}</SpecialDocChrome>
    </DocProvider>
  );
}
