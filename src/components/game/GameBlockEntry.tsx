import { GameBlockEntryClient } from "@/src/components/game/GameBlockEntry.client";
import { createFallbackItem, getItemData, getTagItems } from "@/src/lib/game/server-data";
import { normalizeBlockEntry, normalizeTagName } from "@/src/lib/game/normalize";
import type { BlockEntryInput, EntryHooks } from "@/src/lib/game/types";

interface GameBlockEntryProps extends EntryHooks {
  props: BlockEntryInput;
  link?: string;
}

export async function GameBlockEntry({ props, link, ...hooks }: GameBlockEntryProps) {
  const entry = normalizeBlockEntry(props);

  let items;
  const resolvedName = entry.id || entry.tag;
  if (resolvedName) {
    items = resolvedName.startsWith("#")
      ? await getTagItems(normalizeTagName(resolvedName))
      : [await getItemData(resolvedName)];
  } else {
    items = [createFallbackItem("croparia:placeholder_block")];
  }

  return <GameBlockEntryClient {...hooks} entry={entry} items={items} link={link} />;
}
