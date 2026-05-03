import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { docsConfig, isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { DocsRootIndex } from "@/src/components/docs-root-index";
import { buildDocsHomeMetadata } from "@/src/lib/docs/metadata";
import { buildDocPath, buildShortRouteRedirect } from "@/src/lib/docs/routing";

interface DocsVersionHomePageProps {
  params: Promise<{
    locale: string;
    version: string;
  }>;
}

export async function generateMetadata({ params }: DocsVersionHomePageProps): Promise<Metadata> {
  const { locale, version } = await params;

  if (isLocaleCode(locale) && isVersionSlug(version)) {
    return buildDocsHomeMetadata(locale, version);
  }

  return {
    title: "文档主页",
  };
}

export default async function DocsVersionHomePage({ params }: DocsVersionHomePageProps) {
  const { locale, version } = await params;

  if (!isLocaleCode(locale)) {
    redirect(buildShortRouteRedirect([locale, version]));
  }

  if (!isVersionSlug(version)) {
    redirect(buildDocPath(locale, docsConfig.currentVersion, [version]));
  }

  return <DocsRootIndex locale={locale} version={version} />;
}
