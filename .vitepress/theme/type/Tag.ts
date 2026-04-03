import {ItemData} from "./ItemData";
import {withBase} from "vitepress";

export interface Tag {
  values: string[]
}

const tagFetchCache = new Map<string, Promise<ItemData[]>>();

export const Tag = {
  async fetch(name: string): Promise<ItemData[]> {
    const cached = tagFetchCache.get(name);
    if (cached) {
      return cached;
    }

    const request = (async () => {
      try {
        const [namespace, path] = parseTagName(name);
        const response = await fetch(withBase(`/data/tag/item/${namespace}/${path}.json`));
        if (!response.ok) throw new Error(`Failed to fetch tag ${name}`);

        const tag = await response.json() as Tag;
        const nestedItems = await Promise.all(
          tag.values.map(async entry => {
            if (entry.startsWith('#')) return Tag.fetch(entry);
            return [await ItemData.fetch(entry)];
          })
        );

        const items = nestedItems.flat();
        return items.length > 0 ? items : [createFallbackTagItem(name)];
      } catch {
        console.error(`Failed to fetch tag ${name}`);
        return [createFallbackTagItem(name)];
      }
    })();

    tagFetchCache.set(name, request);
    return request;
  }
}

function parseTagName(tagName: string): [string, string] {
  const normalizedTagName = tagName.startsWith('#') ? tagName.slice(1) : tagName;
  const [namespace, ...pathParts] = normalizedTagName.split(':');
  const path = pathParts.join(':');
  if (!namespace || !path) throw new Error(`Invalid tag name: ${tagName}`);
  return [namespace, path];
}

function createFallbackTagItem(tagName: string): ItemData {
  return ItemData.createFallbackItem(tagName, {
    zh: `任何属于 ${tagName} 的物品/方块`,
    en: `Any item/block of ${tagName}`,
    es: `Cualquier objeto/bloque de ${tagName}`
  });
}
