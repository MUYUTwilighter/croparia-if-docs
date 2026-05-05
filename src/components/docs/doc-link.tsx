"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { useOptionalDocContext } from "@/src/components/docs/doc-context";
import { resolveRelativeDocHref } from "@/src/lib/docs/routing";

type AnchorProps = ComponentPropsWithoutRef<"a">;

export function DocLink({ href, ...props }: AnchorProps) {
  const docContext = useOptionalDocContext();
  const rawHref = typeof href === "string" ? href : undefined;
  const rewrittenHref =
    docContext && rawHref
      ? resolveRelativeDocHref(
          {
            requestedLocale: docContext.doc.requestedLocale,
            requestedVersion: docContext.doc.requestedVersion,
            requestedSlug: docContext.doc.requestedSlug,
            relativeSourcePath: docContext.doc.relativeSourcePath,
          },
          rawHref,
        )
      : null;

  if (rewrittenHref) {
    return <Link href={rewrittenHref} {...props} />;
  }

  return <a href={href} {...props} />;
}
