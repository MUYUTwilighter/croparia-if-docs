import type { MetadataRoute } from "next";

import { localeCodes, versionSlugs } from "@/src/lib/docs/config";
import { buildDocMetadata, resolveCanonicalPath } from "@/src/lib/docs/metadata";
import { buildDocPath, toAbsoluteUrl } from "@/src/lib/docs/routing";
import { listSourceDocuments, resolveDoc } from "@/src/lib/docs/resolve-doc";

export default function sitemap(): MetadataRoute.Sitemap {
  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const locale of localeCodes) {
    for (const version of versionSlugs) {
      const path = buildDocPath(locale, version);

      uniqueEntries.set(path, {
        url: toAbsoluteUrl(path),
        changeFrequency: "weekly",
        priority: 1,
      });
    }
  }

  for (const sourceDocument of listSourceDocuments()) {
    const doc = resolveDoc(sourceDocument);

    if (!doc || !doc.isSitemapIncluded) {
      continue;
    }

    const metadata = buildDocMetadata(doc);
    const canonicalPath = resolveCanonicalPath(doc);

    uniqueEntries.set(canonicalPath, {
      url: typeof metadata.alternates?.canonical === "string" ? metadata.alternates.canonical : toAbsoluteUrl(canonicalPath),
      changeFrequency: "weekly",
      priority: canonicalPath === `/${doc.requestedLocale}/${doc.requestedVersion}` ? 1 : 0.7,
    });
  }

  return [...uniqueEntries.values()];
}
