import type { Metadata } from "next";
import { headers } from "next/headers";

import { docsConfig } from "@/src/lib/docs/config";
import { SpecialDocPage } from "@/src/components/special-doc-page";
import { buildDocMetadata, buildDocsHomeMetadata } from "@/src/lib/docs/metadata";
import { resolveDoc } from "@/src/lib/docs/resolve-doc";
import { resolvePreferredLocale } from "@/src/lib/docs/routing";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = resolvePreferredLocale(headersList.get("accept-language"));

  const doc = resolveDoc({
    locale,
    version: docsConfig.currentVersion,
    slug: [],
  });

  return doc ? buildDocMetadata(doc) : buildDocsHomeMetadata(locale, docsConfig.currentVersion);
}

export default async function Home() {
  const headersList = await headers();
  const locale = resolvePreferredLocale(headersList.get("accept-language"));
  const doc = resolveDoc({
    locale,
    version: docsConfig.currentVersion,
    slug: [],
  });

  if (!doc) {
    return null;
  }

  return <SpecialDocPage doc={doc} requestedPath="/" />;
}
