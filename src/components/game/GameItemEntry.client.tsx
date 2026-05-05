"use client";

import { useEffect, useMemo, useState } from "react";

import { GameItemDisplayView } from "@/src/components/game/GameItemDisplay.client";
import { GameText } from "@/src/components/game/GameText";
import { useGameLocale } from "@/src/components/game/use-game-locale";
import { normalizeTagName } from "@/src/lib/game/normalize";
import type { EntryHooks, ItemData, NormalizedItemEntry } from "@/src/lib/game/types";

interface GameItemEntryClientProps extends EntryHooks {
  entry: NormalizedItemEntry;
  items: ItemData[];
  link?: string;
}

export function GameItemEntryClient({ entry, items, link, ...hooks }: GameItemEntryClientProps) {
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
        zh: `任意属于 ${normalizeTagName(entry.tag)} 的物品`,
        en: `Any item of ${normalizeTagName(entry.tag)}`,
        es: `Any item of ${normalizeTagName(entry.tag)}`,
      }
    : null;

  return (
    <GameItemDisplayView {...hooks} item={currentItem} id={currentItem.registerName} count={entry.amount} link={link}>
      {Object.entries(entry.components).map(([key, value]) => (
        <GameText key={key}>{`${key}: ${String(value)}`}</GameText>
      ))}
      {tagLabel ? <GameText>{tagLabel[locale as keyof typeof tagLabel] || tagLabel.en}</GameText> : null}
    </GameItemDisplayView>
  );
}
