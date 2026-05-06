import { RitualStructureDisplayClient } from "@/src/components/game/recipe/RitualStructureDisplay.client";
import { createFallbackItem, getItemData, getTagItems } from "@/src/lib/game/server-data";
import { normalizeTagName } from "@/src/lib/game/normalize";
import type {
  LocaleMap,
  NormalizedBlockEntry,
  NormalizedRitualStructure,
  RitualStructureLayerData,
  RitualStructureSlotData,
} from "@/src/lib/game/types";

const specialNameLocales: Record<string, LocaleMap> = {
  " ": {
    zh: "任意方块",
    en: "Any Block",
    es: "Any Block",
  },
  $: {
    zh: "输入方块",
    en: "Input Block",
    es: "Input Block",
  },
  ".": {
    zh: "仅空气方块",
    en: "Air Only",
    es: "Air Only",
  },
} as const;

function getSpecialSlotData(char: string): RitualStructureSlotData | null {
  const label = specialNameLocales[char];

  if (!label) {
    return null;
  }

  return {
    kind: "special",
    char,
    label,
  };
}

async function resolveEntryItems(entry: NormalizedBlockEntry) {
  const resolvedName = entry.id || entry.tag;

  if (!resolvedName) {
    return [createFallbackItem("croparia:placeholder_block")];
  }

  return resolvedName.startsWith("#")
    ? await getTagItems(normalizeTagName(resolvedName))
    : [await getItemData(resolvedName)];
}

async function resolveSlotData(char: string, entry: NormalizedBlockEntry | undefined): Promise<RitualStructureSlotData> {
  const specialSlotData = getSpecialSlotData(char);

  if (specialSlotData) {
    return specialSlotData;
  }

  if (!entry) {
    return { kind: "empty" };
  }

  return {
    kind: "entry",
    entry,
    items: await resolveEntryItems(entry),
  };
}

export async function RitualStructureDisplay({ recipe }: { recipe: NormalizedRitualStructure }) {
  const maxColumns = Math.max(0, ...recipe.pattern.flatMap((layer) => layer.map((row) => row.length)));
  const maxRows = Math.max(0, ...recipe.pattern.map((layer) => layer.length));

  const layers: RitualStructureLayerData[] = await Promise.all(
    recipe.pattern.map(async (patternLayer) => ({
      rows: await Promise.all(
        patternLayer.map(async (row) =>
          Promise.all(
            Array.from(row).map((char) => {
              const entry = recipe.keys[char];
              return resolveSlotData(char, entry);
            }),
          ),
        ),
      ),
    })),
  );

  return <RitualStructureDisplayClient layers={layers} maxColumns={maxColumns} maxRows={maxRows} />;
}
