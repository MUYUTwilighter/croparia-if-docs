import { GameItemEntryClient } from "@/src/components/game/GameItemEntry.client";
import { createFallbackItem, getItemData, getTagItems } from "@/src/lib/game/server-data";
import { normalizeItemEntry, normalizeTagName } from "@/src/lib/game/normalize";
import type { EntryDisplayOverrides, ItemEntryInput } from "@/src/lib/game/types";

interface GameItemEntryProps extends EntryDisplayOverrides {
  props: ItemEntryInput;
  link?: string;
}

export async function GameItemEntry({ props, link, ...displayOverrides }: GameItemEntryProps) {
  const entry = normalizeItemEntry(props);

  let items;
  if (entry.id) {
    items = [await getItemData(entry.id)];
  } else if (entry.tag) {
    items = await getTagItems(normalizeTagName(entry.tag));
  } else {
    items = [createFallbackItem("croparia:placeholder")];
  }

  return <GameItemEntryClient {...displayOverrides} entry={entry} items={items} link={link} />;
}
