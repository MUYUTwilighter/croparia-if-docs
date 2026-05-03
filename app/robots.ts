import type { MetadataRoute } from "next";

import { siteConfig } from "@/src/lib/docs/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.siteOrigin}/sitemap.xml`,
    host: siteConfig.siteOrigin,
  };
}
