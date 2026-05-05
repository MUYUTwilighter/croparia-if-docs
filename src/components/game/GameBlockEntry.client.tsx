"use client";

import { useEffect, useMemo, useState } from "react";

import { GameItemDisplayView } from "@/src/components/game/GameItemDisplay.client";
import { GameText } from "@/src/components/game/GameText";
import { useGameLocale } from "@/src/components/game/use-game-locale";
import { normalizeTagName } from "@/src/lib/game/normalize";
import type { EntryDisplayOverrides, ItemData, NormalizedBlockEntry } from "@/src/lib/game/types";

interface GameBlockEntryClientProps extends EntryDisplayOverrides {
  entry: NormalizedBlockEntry;
  items: ItemData[];
  link?: string;
}

export function GameBlockEntryClient({ entry, items, link, ...displayOverrides }: GameBlockEntryClientProps) {
  const locale = useGameLocale();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) {
      setCurrentIndex(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((value) => (value + 1) % items.length);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [items]);

  const currentItem = useMemo(() => items[currentIndex] ?? items[0], [currentIndex, items]);

  if (!currentItem) {
    return null;
  }

  const tagLabel = entry.tag
    ? {
        zh: `任意属于 ${normalizeTagName(entry.tag)} 的方块`,
        en: `Any block of ${normalizeTagName(entry.tag)}`,
        es: `Any block of ${normalizeTagName(entry.tag)}`,
      }
    : null;

  return (
    <GameItemDisplayView {...displayOverrides} item={currentItem} id={currentItem.registerName} link={link}>
      {Object.entries(entry.properties).map(([key, value]) => (
        <GameText key={key}>{`${key}: ${value}`}</GameText>
      ))}
      {tagLabel ? <GameText>{tagLabel[locale as keyof typeof tagLabel] || tagLabel.en}</GameText> : null}
    </GameItemDisplayView>
  );
}
