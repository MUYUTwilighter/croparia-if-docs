import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import {
  mojInputToItemEntry,
  mojOutputToItemEntry,
  normalizeBlockEntry,
  normalizeItemEntry,
  normalizeTagName,
} from "@/src/lib/game/normalize";
import type {
  AnyNormalizedRecipe,
  InfusorRecipeInput,
  ItemData,
  ItemPayload,
  LocaleMap,
  NormalizedCraftingRecipe,
  NormalizedInfusorRecipe,
  NormalizedRitualRecipe,
  NormalizedRitualStructure,
  NormalizedSoakRecipe,
  RecipeBase,
  RitualRecipeInput,
  RitualStructureInput,
  ShapedCraftingRecipe,
  ShapelessCraftingRecipe,
  SoakRecipeInput,
} from "@/src/lib/game/types";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

const FALLBACK_SMALL_ICON =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjY2NjIi8+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjOTk5Ii8+PHJlY3QgeD0iNiIgeT0iNiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjYmJiIi8+PC9zdmc+";
const FALLBACK_LARGE_ICON = FALLBACK_SMALL_ICON;

const readPublicJson = cache(async <T>(publicPath: string): Promise<T> => {
  const normalizedPath = publicPath.replace(/^\/+/, "");
  const absolutePath = path.join(PUBLIC_ROOT, normalizedPath);
  const raw = await fs.readFile(absolutePath, "utf8");
  return JSON.parse(raw) as T;
});

function parseRegisterName(registerName: string): [string, string] {
  const [namespace, ...pathParts] = registerName.split(":");
  const resourcePath = pathParts.join(":");

  if (!namespace || !resourcePath) {
    throw new Error(`Invalid register name: ${registerName}`);
  }

  return [namespace, resourcePath];
}

function parseTagName(tagName: string): [string, string] {
  return parseRegisterName(normalizeTagName(tagName).slice(1));
}

function normalizeOredictList(list: string | string[] | undefined): string[] {
  if (Array.isArray(list)) {
    return list.map((entry) => entry.trim()).filter(Boolean);
  }

  if (typeof list !== "string") {
    return [];
  }

  const normalized = list.trim();
  if (!normalized || normalized === "[]") {
    return [];
  }

  return normalized
    .replace(/^\[/, "")
    .replace(/]$/, "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildItemIconUrl(registerName: string, size: "small" | "large") {
  const searchParams = new URLSearchParams({
    item: registerName,
    size,
  });

  return `/api/game/item-icon?${searchParams.toString()}`;
}

function decodeImageSource(source: string) {
  const fallback = {
    bytes: Buffer.from(source, "base64"),
    mimeType: "image/png",
  };

  if (!source) {
    return fallback;
  }

  if (!source.startsWith("data:")) {
    return {
      bytes: Buffer.from(source, "base64"),
      mimeType: "image/png",
    };
  }

  const match = source.match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    return fallback;
  }

  return {
    mimeType: match[1] || "image/png",
    bytes: Buffer.from(match[2] || "", "base64"),
  };
}

function fallbackLocaleMap(registerName: string): LocaleMap {
  return {
    zh: registerName,
    en: registerName,
    es: registerName,
  };
}

function normalizeItem(payload: ItemPayload, fallbackRegisterName = payload.registerName): ItemData {
  return {
    name: payload.name ?? fallbackLocaleMap(fallbackRegisterName),
    registerName: payload.registerName || fallbackRegisterName,
    OredictList: normalizeOredictList(payload.OredictList),
    smallIconSrc: buildItemIconUrl(payload.registerName || fallbackRegisterName, "small"),
    largeIconSrc: buildItemIconUrl(payload.registerName || fallbackRegisterName, "large"),
    maxStacksSize: payload.maxStacksSize ?? 64,
    minTool: payload.minTool,
    CreativeTabName: payload.CreativeTabName ?? fallbackLocaleMap("Unknown"),
  };
}

export function createFallbackItem(registerName: string, name?: LocaleMap): ItemData {
  return normalizeItem(
    {
      name: name ?? fallbackLocaleMap(registerName),
      registerName,
      OredictList: [],
      maxStacksSize: 99,
      smallIcon: FALLBACK_SMALL_ICON,
      largeIcon: FALLBACK_LARGE_ICON,
      CreativeTabName: {
        zh: "未知",
        en: "Unknown",
        es: "Unknown",
      },
    },
    registerName,
  );
}

export const getItemData = cache(async (id: string): Promise<ItemData> => {
  try {
    const [namespace, resourcePath] = parseRegisterName(id);
    const payload = await readPublicJson<ItemPayload>(`/data/item/${namespace}/${resourcePath}.json`);
    return normalizeItem(payload, id);
  } catch {
    return createFallbackItem(id);
  }
});

export const getItemIconBinary = cache(async (id: string, size: "small" | "large") => {
  try {
    const [namespace, resourcePath] = parseRegisterName(id);
    const payload = await readPublicJson<ItemPayload>(`/data/item/${namespace}/${resourcePath}.json`);
    const iconSource = size === "small" ? payload.smallIcon || FALLBACK_SMALL_ICON : payload.largeIcon || FALLBACK_LARGE_ICON;

    return decodeImageSource(iconSource);
  } catch {
    return decodeImageSource(size === "small" ? FALLBACK_SMALL_ICON : FALLBACK_LARGE_ICON);
  }
});

function createFallbackTagItem(tagName: string) {
  return createFallbackItem(tagName, {
    zh: `任何属于 ${tagName} 的物品/方块`,
    en: `Any item/block of ${tagName}`,
    es: `Any item/block of ${tagName}`,
  });
}

interface TagPayload {
  values: string[];
}

export const getTagItems = cache(async (tagName: string): Promise<ItemData[]> => {
  try {
    const [namespace, resourcePath] = parseTagName(tagName);
    const tag = await readPublicJson<TagPayload>(`/data/tag/item/${namespace}/${resourcePath}.json`);
    const items = (
      await Promise.all(
        tag.values.map(async (entry) => {
          if (entry.startsWith("#")) {
            return getTagItems(entry);
          }

          return [await getItemData(entry)];
        }),
      )
    ).flat();

    return items.length > 0 ? items : [createFallbackTagItem(normalizeTagName(tagName))];
  } catch {
    return [createFallbackTagItem(normalizeTagName(tagName))];
  }
});

function normalizeCraftingRecipe(recipe: RecipeBase): NormalizedCraftingRecipe {
  if (recipe.type === "minecraft:crafting_shaped") {
    const shaped = recipe as ShapedCraftingRecipe;
    const input: Array<ReturnType<typeof mojInputToItemEntry> | undefined> = [];

    shaped.pattern.forEach((row) => {
      for (let index = 0; index < row.length; index += 1) {
        const char = row.charAt(index);
        if (char === " ") {
          input.push(undefined);
          continue;
        }

        const keyBinding = shaped.key[char];
        input.push(keyBinding ? mojInputToItemEntry(keyBinding) : undefined);
      }
    });

    return {
      type: recipe.type,
      input,
      output: mojOutputToItemEntry(shaped.result),
    };
  }

  if (recipe.type === "minecraft:crafting_shapeless") {
    const shapeless = recipe as ShapelessCraftingRecipe;
    return {
      type: recipe.type,
      input: shapeless.ingredients.map(mojInputToItemEntry),
      output: mojOutputToItemEntry(shapeless.result),
    };
  }

  throw new Error(`Unknown crafting recipe type: ${recipe.type}`);
}

function normalizeInfusorRecipe(recipe: RecipeBase): NormalizedInfusorRecipe {
  const infusor = recipe as InfusorRecipeInput;

  return {
    type: recipe.type,
    element: normalizeItemEntry(`croparia:potion_${infusor.element.toLowerCase()}`),
    ingredient: normalizeItemEntry(infusor.ingredient),
    result: normalizeItemEntry(infusor.result),
  };
}

function normalizeRitualRecipe(recipe: RecipeBase): NormalizedRitualRecipe {
  const ritual = recipe as RitualRecipeInput;

  return {
    type: recipe.type,
    ritual: normalizeBlockEntry(ritual.ritual),
    ingredient: normalizeItemEntry(ritual.ingredient),
    block: normalizeBlockEntry(ritual.block),
    result: normalizeItemEntry(ritual.result),
  };
}

function normalizeSoakRecipe(recipe: RecipeBase): NormalizedSoakRecipe {
  const soak = recipe as SoakRecipeInput;

  return {
    type: recipe.type,
    element: normalizeItemEntry(`croparia:potion_${soak.element.toLowerCase()}`),
    input: normalizeBlockEntry(soak.input),
    output: normalizeBlockEntry(soak.output),
    probability: soak.probability,
  };
}

function normalizeRitualStructure(recipe: RecipeBase): NormalizedRitualStructure {
  const structure = recipe as RitualStructureInput;
  const keys = Object.fromEntries(
    Object.entries(structure.keys).map(([key, value]) => [key, normalizeBlockEntry(value)]),
  );

  return {
    type: recipe.type,
    keys: {
      ...keys,
      "*": normalizeBlockEntry(structure.ritual),
      "$": { id: "croparia:placeholder", properties: {} },
      " ": { id: "minecraft:air", properties: {} },
      ".": { id: "minecraft:barrier", properties: {} },
    },
    pattern: structure.pattern,
  };
}

export const getRecipeData = cache(async <T extends AnyNormalizedRecipe>(id: string): Promise<T> => {
  const [namespace, resourcePath] = parseRegisterName(id);
  const recipe = await readPublicJson<RecipeBase>(`/data/recipe/${namespace}/${resourcePath}.json`);

  switch (recipe.type) {
    case "minecraft:crafting_shaped":
    case "minecraft:crafting_shapeless":
      return normalizeCraftingRecipe(recipe) as T;
    case "croparia:infusor":
      return normalizeInfusorRecipe(recipe) as T;
    case "croparia:ritual":
      return normalizeRitualRecipe(recipe) as T;
    case "croparia:soak":
      return normalizeSoakRecipe(recipe) as T;
    case "croparia:ritual_structure":
      return normalizeRitualStructure(recipe) as T;
    default:
      throw new Error(`Unknown recipe type: ${recipe.type}`);
  }
});
