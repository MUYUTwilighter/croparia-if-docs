import { withBase } from "vitepress";

function normalizePublicPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export async function loadPublicJson<T>(path: string): Promise<T> {
  const normalizedPath = normalizePublicPath(path);

  if (import.meta.env.SSR) {
    const [{ readFile }, { resolve }] = await Promise.all([
      import("node:fs/promises"),
      import("node:path"),
    ]);
    const filePath = resolve(process.cwd(), "content", "public", normalizedPath.slice(1));
    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  }

  const response = await fetch(withBase(normalizedPath));
  if (!response.ok) {
    throw new Error(`Failed to fetch ${normalizedPath}`);
  }
  return await response.json() as T;
}
