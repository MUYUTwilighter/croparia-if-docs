import { redirect } from "next/navigation";

import { docsConfig, isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { buildDocPath } from "@/src/lib/docs/routing";

interface DocsLocaleEntryPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DocsLocaleEntryPage({ params }: DocsLocaleEntryPageProps) {
  const { locale } = await params;

  if (isVersionSlug(locale)) {
    redirect(buildDocPath(docsConfig.defaultLocale, locale));
  }

  const nextLocale = isLocaleCode(locale) ? locale : docsConfig.defaultLocale;

  redirect(`/doc/${nextLocale}/${docsConfig.currentVersion}`);
}
