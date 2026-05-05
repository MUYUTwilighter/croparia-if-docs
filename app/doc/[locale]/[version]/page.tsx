import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { docsConfig, isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { SpecialDocPage } from "@/src/components/special-doc-page";
import { buildDocMetadata, buildDocsHomeMetadata } from "@/src/lib/docs/metadata";
import { buildDocPath, buildShortRouteRedirect } from "@/src/lib/docs/routing";
import { resolveDoc } from "@/src/lib/docs/resolve-doc";

interface DocsVersionHomePageProps {
  params: Promise<{
    locale: string;
    version: string;
  }>;
}

export async function generateMetadata({ params }: DocsVersionHomePageProps): Promise<Metadata> {
  const { locale, version } = await params;

  if (isLocaleCode(locale) && isVersionSlug(version)) {
    const doc = resolveDoc({
      locale,
      version,
      slug: [],
    });

    return doc ? buildDocMetadata(doc) : buildDocsHomeMetadata(locale, version);
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

  const doc = resolveDoc({
    locale,
    version,
    slug: [],
  });

  if (!doc) {
    notFound();
  }

  return <SpecialDocPage doc={doc} requestedPath={buildDocPath(locale, version)} />;
}
