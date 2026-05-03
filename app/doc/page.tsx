import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { docsConfig } from "@/src/lib/docs/config";
import { resolvePreferredLocale } from "@/src/lib/docs/routing";

export default async function DocsHomePage() {
  const headersList = await headers();
  const locale = resolvePreferredLocale(headersList.get("accept-language"));

  redirect(`/doc/${locale}/${docsConfig.currentVersion}`);
}
