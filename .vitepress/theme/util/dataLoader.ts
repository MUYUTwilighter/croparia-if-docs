import { withBase } from "vitepress";

const publicJsonModules = import.meta.glob("../../../content/public/data/**/*.json", {
  import: "default",
});

function normalizePublicPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function resolvePublicJsonModule(path: string) {
  return publicJsonModules[`../../../content/public${path}`];
}

export async function loadPublicJson<T>(path: string): Promise<T> {
  const normalizedPath = normalizePublicPath(path);

  if (import.meta.env.SSR) {
    const loader = resolvePublicJsonModule(normalizedPath);
    if (!loader) {
      throw new Error(`Missing public JSON module for ${normalizedPath}`);
    }
    return await loader() as T;
  }

  const response = await fetch(withBase(normalizedPath));
  if (!response.ok) {
    throw new Error(`Failed to fetch ${normalizedPath}`);
  }
  return await response.json() as T;
}
