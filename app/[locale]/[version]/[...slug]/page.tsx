import { redirect } from "next/navigation";

import { docsConfig, isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { buildDocPath, buildShortRouteRedirect, normalizeSlug } from "@/src/lib/docs/routing";

interface LegacyDocPageRedirectProps {
  params: Promise<{
    locale: string;
    version: string;
    slug: string[];
  }>;
}

export default async function LegacyDocPageRedirect({ params }: LegacyDocPageRedirectProps) {
  const { locale, version, slug } = await params;

  if (!isLocaleCode(locale)) {
    redirect(buildShortRouteRedirect([locale, version, ...normalizeSlug(slug)]));
  }

  if (!isVersionSlug(version)) {
    redirect(buildDocPath(locale, docsConfig.currentVersion, [version, ...normalizeSlug(slug)]));
  }

  redirect(buildDocPath(locale, version, normalizeSlug(slug)));
}
