import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { docsConfig, isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { SpecialDocPage } from "@/src/components/special-doc-page";
import { buildDocMetadata } from "@/src/lib/docs/metadata";
import { resolveStandaloneRootDoc } from "@/src/lib/docs/root-docs";
import { buildDocPath, buildShortRouteRedirect, normalizeSlug } from "@/src/lib/docs/routing";

interface LocaleShortRoutePageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: LocaleShortRoutePageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocaleCode(locale)) {
    return {
      title: "文档跳转中",
    };
  }

  const normalizedSlug = normalizeSlug(slug);
  const doc = resolveStandaloneRootDoc(locale, docsConfig.currentVersion, normalizedSlug);

  return doc ? buildDocMetadata(doc) : { title: "文档跳转中" };
}

export default async function LocaleShortRoutePage({ params }: LocaleShortRoutePageProps) {
  const { locale, slug } = await params;

  if (!isLocaleCode(locale)) {
    redirect(buildShortRouteRedirect([locale, ...normalizeSlug(slug)]));
  }

  if (slug.length > 0 && isVersionSlug(slug[0])) {
    redirect(buildDocPath(locale, slug[0], normalizeSlug(slug.slice(1))));
  }

  const normalizedSlug = normalizeSlug(slug);
  const doc = resolveStandaloneRootDoc(locale, docsConfig.currentVersion, normalizedSlug);

  if (doc) {
    return <SpecialDocPage doc={doc} requestedPath={`/${locale}/${normalizedSlug.join("/")}`} />;
  }

  const nextLocale = isLocaleCode(locale) ? locale : docsConfig.defaultLocale;

  redirect(buildDocPath(nextLocale, docsConfig.currentVersion, normalizedSlug));
}
