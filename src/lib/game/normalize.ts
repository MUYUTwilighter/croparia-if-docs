import type {
  BlockEntryInput,
  MojItemInput,
  MojItemOutput,
  NormalizedBlockEntry,
  NormalizedItemEntry,
  ItemEntryInput,
} from "@/src/lib/game/types";

export function normalizeItemEntry(input: ItemEntryInput): NormalizedItemEntry {
  if (typeof input === "string") {
    return input.startsWith("#")
      ? { tag: input, components: {}, amount: 1 }
      : { id: input, components: {}, amount: 1 };
  }

  if (input.id && input.tag) {
    throw new Error("Tag and ID cannot both be set on an item entry.");
  }

  return {
    id: input.id,
    tag: input.tag,
    components: input.components ?? {},
    amount: input.amount ?? 1,
  };
}

export function normalizeBlockEntry(input: BlockEntryInput): NormalizedBlockEntry {
  if (typeof input === "string") {
    return input.startsWith("#")
      ? { tag: input, properties: {} }
      : { id: input, properties: {} };
  }

  if (input.id && input.tag) {
    throw new Error("Tag and ID cannot both be set on a block entry.");
  }

  return {
    id: input.id,
    tag: input.tag,
    properties: input.properties ?? {},
  };
}

export function mojInputToItemEntry(input: MojItemInput): NormalizedItemEntry {
  return normalizeItemEntry({
    id: input.item,
    tag: input.tag,
    components: input.components,
  });
}

export function mojOutputToItemEntry(output: MojItemOutput): NormalizedItemEntry {
  return normalizeItemEntry({
    id: output.id,
    amount: output.count,
    components: output.components,
  });
}

export function normalizeTagName(tagName: string) {
  return tagName.startsWith("#") ? tagName : `#${tagName}`;
}
