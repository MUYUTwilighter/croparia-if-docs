import { notFound, redirect } from "next/navigation";

import { docsConfig, isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { buildDocPath, buildShortRouteRedirect, normalizeSlug } from "@/src/lib/docs/routing";

interface DocsLocaleShortRoutePageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

export default async function DocsLocaleShortRoutePage({ params }: DocsLocaleShortRoutePageProps) {
  const { locale, slug } = await params;

  if (!isLocaleCode(locale)) {
    redirect(buildShortRouteRedirect([locale, ...normalizeSlug(slug)]));
  }

  if (slug.length > 0 && isVersionSlug(slug[0])) {
    notFound();
  }

  const nextLocale = isLocaleCode(locale) ? locale : docsConfig.defaultLocale;

  redirect(buildDocPath(nextLocale, docsConfig.currentVersion, normalizeSlug(slug)));
}
