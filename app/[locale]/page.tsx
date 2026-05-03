import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { docsConfig, isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { SpecialDocPage } from "@/src/components/special-doc-page";
import { buildDocMetadata, buildDocsHomeMetadata } from "@/src/lib/docs/metadata";
import { resolveDoc } from "@/src/lib/docs/resolve-doc";
import { buildDocPath } from "@/src/lib/docs/routing";

interface LocaleEntryPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LocaleEntryPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (isLocaleCode(locale)) {
    const doc = resolveDoc({
      locale,
      version: docsConfig.currentVersion,
      slug: [],
    });

    return doc ? buildDocMetadata(doc) : buildDocsHomeMetadata(locale, docsConfig.currentVersion);
  }

  return {
    title: "Croparia IF",
  };
}

export default async function LocaleEntryPage({ params }: LocaleEntryPageProps) {
  const { locale } = await params;

  if (isVersionSlug(locale)) {
    redirect(buildDocPath(docsConfig.defaultLocale, locale));
  }

  if (!isLocaleCode(locale)) {
    notFound();
  }

  const doc = resolveDoc({
    locale,
    version: docsConfig.currentVersion,
    slug: [],
  });

  if (!doc) {
    notFound();
  }

  return <SpecialDocPage doc={doc} requestedPath={`/${locale}`} />;
}
