import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { docsConfig } from "@/src/lib/docs/config";
import { SpecialDocPage } from "@/src/components/special-doc-page";
import { buildDocMetadata } from "@/src/lib/docs/metadata";
import { resolveStandaloneRootDoc } from "@/src/lib/docs/root-docs";
import { buildShortRouteRedirect, normalizeSlug } from "@/src/lib/docs/routing";
import { resolvePreferredLocale } from "@/src/lib/docs/routing";

interface RootShortRoutePageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: RootShortRoutePageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const headersList = await headers();
  const locale = resolvePreferredLocale(headersList.get("accept-language"));
  const doc = resolveStandaloneRootDoc(locale, docsConfig.currentVersion, normalizedSlug);

  return doc ? buildDocMetadata(doc) : { title: "文档跳转中" };
}

export default async function RootShortRoutePage({ params }: RootShortRoutePageProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const headersList = await headers();
  const locale = resolvePreferredLocale(headersList.get("accept-language"));
  const doc = resolveStandaloneRootDoc(locale, docsConfig.currentVersion, normalizedSlug);

  if (doc) {
    return <SpecialDocPage doc={doc} requestedPath={`/${normalizedSlug.join("/")}`} />;
  }

  redirect(buildShortRouteRedirect(normalizedSlug));
}
