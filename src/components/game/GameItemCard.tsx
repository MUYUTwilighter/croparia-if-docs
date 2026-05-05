import { GameItemCardClient } from "@/src/components/game/GameItemCard.client";
import { getItemData } from "@/src/lib/game/server-data";

export async function GameItemCard({ id }: { id: string }) {
  const item = await getItemData(id);
  const minToolItem = item.minTool ? await getItemData(item.minTool) : null;

  return <GameItemCardClient item={item} minToolItem={minToolItem} />;
}
