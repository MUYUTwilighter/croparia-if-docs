import { GameItemDisplayView } from "@/src/components/game/GameItemDisplay.client";
import { getItemData } from "@/src/lib/game/server-data";
import type { EntryDisplayOverrides } from "@/src/lib/game/types";

interface GameItemDisplayProps extends EntryDisplayOverrides {
  id: string;
  count?: number;
  link?: string;
  size?: number;
  noFloatBox?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export async function GameItemDisplay(props: GameItemDisplayProps) {
  const item = await getItemData(props.id);
  return <GameItemDisplayView {...props} item={item} />;
}
