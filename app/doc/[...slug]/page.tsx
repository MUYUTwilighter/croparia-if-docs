import { redirect } from "next/navigation";

import { buildShortRouteRedirect, normalizeSlug } from "@/src/lib/docs/routing";

interface DocsRootShortRoutePageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocsRootShortRoutePage({ params }: DocsRootShortRoutePageProps) {
  const { slug } = await params;

  redirect(buildShortRouteRedirect(normalizeSlug(slug)));
}
