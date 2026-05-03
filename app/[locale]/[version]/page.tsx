import { redirect } from "next/navigation";

import { docsConfig, isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { buildDocPath, buildShortRouteRedirect } from "@/src/lib/docs/routing";

interface LegacyDocHomeRedirectProps {
  params: Promise<{
    locale: string;
    version: string;
  }>;
}

export default async function LegacyDocHomeRedirect({ params }: LegacyDocHomeRedirectProps) {
  const { locale, version } = await params;

  if (!isLocaleCode(locale)) {
    redirect(buildShortRouteRedirect([locale, version]));
  }

  if (!isVersionSlug(version)) {
    redirect(buildDocPath(locale, docsConfig.currentVersion, [version]));
  }

  redirect(buildDocPath(locale, version));
}
