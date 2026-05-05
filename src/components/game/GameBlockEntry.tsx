import { GameBlockEntryClient } from "@/src/components/game/GameBlockEntry.client";
import { createFallbackItem, getItemData, getTagItems } from "@/src/lib/game/server-data";
import { normalizeBlockEntry, normalizeTagName } from "@/src/lib/game/normalize";
import type { BlockEntryInput, EntryDisplayOverrides } from "@/src/lib/game/types";

interface GameBlockEntryProps extends EntryDisplayOverrides {
  props: BlockEntryInput;
  link?: string;
}

export async function GameBlockEntry({ props, link, ...displayOverrides }: GameBlockEntryProps) {
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

  return <GameBlockEntryClient {...displayOverrides} entry={entry} items={items} link={link} />;
}
