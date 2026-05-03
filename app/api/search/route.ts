import type { NextRequest } from "next/server";

import { isLocaleCode, isVersionSlug } from "@/src/lib/docs/config";
import { searchDocs } from "@/src/lib/docs/search";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const locale = request.nextUrl.searchParams.get("locale");
  const version = request.nextUrl.searchParams.get("version");
  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? "10");

  const results = searchDocs({
    query,
    locale: locale && isLocaleCode(locale) ? locale : undefined,
    version: version && isVersionSlug(version) ? version : undefined,
    limit: Number.isFinite(limitParam) ? limitParam : 10,
  });

  return Response.json({
    query,
    total: results.length,
    results,
  });
}
