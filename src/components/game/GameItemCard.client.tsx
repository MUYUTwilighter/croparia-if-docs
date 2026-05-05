"use client";

import { useMemo } from "react";

import { GameItemDisplayView } from "@/src/components/game/GameItemDisplay.client";
import { GameGuiFrame } from "@/src/components/game/GameGuiFrame";
import { GameSlot } from "@/src/components/game/GameSlot";
import { GameText } from "@/src/components/game/GameText";
import { useGameLocale } from "@/src/components/game/use-game-locale";
import type { ItemData } from "@/src/lib/game/types";

const attrLocales = {
  zh: {
    maxStacking: "最大堆叠数量",
    id: "ID",
    tag: "标签",
    minTool: "最低工具需求",
    category: "类别",
  },
  en: {
    maxStacking: "Max Stack Size",
    id: "ID",
    tag: "Tags",
    minTool: "Min Excavation Tool",
    category: "Category",
  },
} as const;

export function GameItemCardClient({
  item,
  minToolItem,
}: {
  item: ItemData;
  minToolItem?: ItemData | null;
}) {
  const locale = useGameLocale();
  const labels = useMemo(() => attrLocales[locale as keyof typeof attrLocales] ?? attrLocales.en, [locale]);

  return (
    <GameGuiFrame className="game-item-card">
      <div className="game-item-card__wrapper">
        <GameText className="game-item-card__name" color="#3F3F3F" fontWeight="bold" notFullLine noShadow>
          {item.name[locale] || item.name.en || item.registerName}
        </GameText>
        <GameItemDisplayView className="game-item-card__icon" item={item} id={item.registerName} size={64} noFloatBox />
        <GameSlot>
          <table className="game-item-card__table">
            <tbody>
              <tr>
                <td className="game-item-card__attr">
                  <GameText color="#3F3F3F" noShadow>
                    {labels.id}
                  </GameText>
                </td>
                <td className="game-item-card__value">
                  <GameText>{item.registerName}</GameText>
                </td>
              </tr>
              <tr>
                <td className="game-item-card__attr">
                  <GameText color="#3F3F3F" noShadow>
                    {labels.category}
                  </GameText>
                </td>
                <td className="game-item-card__value">
                  <GameText>{item.CreativeTabName[locale] || item.CreativeTabName.en || "Unknown"}</GameText>
                </td>
              </tr>
              {item.OredictList.length > 0 ? (
                <tr>
                  <td className="game-item-card__attr">
                    <GameText color="#3F3F3F" noShadow>
                      {labels.tag}
                    </GameText>
                  </td>
                  <td className="game-item-card__value">
                    {item.OredictList.map((tag) => (
                      <GameText key={tag}>#{tag}</GameText>
                    ))}
                  </td>
                </tr>
              ) : null}
              <tr>
                <td className="game-item-card__attr">
                  <GameText color="#3F3F3F" noShadow>
                    {labels.maxStacking}
                  </GameText>
                </td>
                <td className="game-item-card__value">
                  <GameText>{item.maxStacksSize.toString()}</GameText>
                </td>
              </tr>
              {item.minTool && minToolItem ? (
                <tr>
                  <td className="game-item-card__attr">
                    <GameText color="#3F3F3F" noShadow>
                      {labels.minTool}
                    </GameText>
                  </td>
                  <td className="game-item-card__value">
                    <GameItemDisplayView item={minToolItem} id={item.minTool} />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </GameSlot>
      </div>
    </GameGuiFrame>
  );
}
