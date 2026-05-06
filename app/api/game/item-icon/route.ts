import type { NextRequest } from "next/server";

import { getItemIconBinary } from "@/src/lib/game/server-data";

export async function GET(request: NextRequest) {
  const item = request.nextUrl.searchParams.get("item");
  const sizeParam = request.nextUrl.searchParams.get("size");
  const size = sizeParam === "small" ? "small" : "large";

  if (!item) {
    return new Response("Missing item query parameter.", { status: 400 });
  }

  const { bytes, mimeType } = await getItemIconBinary(item, size);

  return new Response(bytes, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
