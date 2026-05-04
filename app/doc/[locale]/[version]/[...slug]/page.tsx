import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DocChrome } from "@/src/components/docs/doc-chrome";
import { DocProvider } from "@/src/components/docs/doc-context";
import { docsConfig, isLocaleCode, isVersionSlug, localeCodes, siteConfig, versionSlugs } from "@/src/lib/docs/config";
import { buildDocMetadata } from "@/src/lib/docs/metadata";
import { renderMdxSource } from "@/src/lib/docs/render-mdx";
import { listDocumentSlugs, resolveDoc } from "@/src/lib/docs/resolve-doc";
import { resolveSidebar } from "@/src/lib/docs/resolve-sidebar";
import { buildDocPath, buildShortRouteRedirect, normalizeSlug } from "@/src/lib/docs/routing";

interface DocPageProps {
  params: Promise<{
    locale: string;
    version: string;
    slug: string[];
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = listDocumentSlugs().filter((slug) => slug.length > 0);

  return localeCodes.flatMap((locale) =>
    versionSlugs.flatMap((version) =>
      slugs.map((slug) => ({
        locale,
        version,
        slug,
      })),
    ),
  );
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  if (!isLocaleCode(resolvedParams.locale) || !isVersionSlug(resolvedParams.version)) {
    return {
      title: "文档跳转中",
    };
  }

  const doc = resolveDoc(resolvedParams);

  if (!doc) {
    return {
      title: "文档不存在",
    };
  }

  return buildDocMetadata(doc);
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;

  if (!isLocaleCode(resolvedParams.locale)) {
    redirect(buildShortRouteRedirect([resolvedParams.locale, resolvedParams.version, ...normalizeSlug(resolvedParams.slug)]));
  }

  if (!isVersionSlug(resolvedParams.version)) {
    redirect(buildDocPath(resolvedParams.locale, docsConfig.currentVersion, [resolvedParams.version, ...normalizeSlug(resolvedParams.slug)]));
  }

  const doc = resolveDoc(resolvedParams);

  if (!doc) {
    notFound();
  }

  const requestedPath = buildDocPath(doc.requestedLocale, doc.requestedVersion, doc.requestedSlug);
  const resolvedPath = buildDocPath(doc.resolvedLocale, doc.resolvedVersion, doc.resolvedSlug);
  const content = await renderMdxSource(doc.body);
  const sidebar = resolveSidebar(doc.requestedLocale, doc.requestedVersion, doc.requestedSlug);
  const pageMetadata = buildDocMetadata(doc);
  const canonicalPath =
    typeof pageMetadata.alternates?.canonical === "string"
      ? pageMetadata.alternates.canonical
      : `${siteConfig.siteOrigin}${resolvedPath}`;

  return (
    <DocProvider value={{ doc, sidebar, requestedPath, resolvedPath, canonicalPath }}>
      <DocChrome>{content}</DocChrome>
    </DocProvider>
  );
}
