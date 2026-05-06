"use client";

import { useMemo, useState } from "react";

import { GameArrowButton } from "@/src/components/game/GameArrowButton";
import { GameBlockEntryClient } from "@/src/components/game/GameBlockEntry.client";
import { GameSlot } from "@/src/components/game/GameSlot";
import { GameText } from "@/src/components/game/GameText";
import { useGameLocale } from "@/src/components/game/use-game-locale";
import type { RitualStructureLayerData, RitualStructureSlotData } from "@/src/lib/game/types";

const specialLocales = {
  layer: {
    zh: "第 %s 层",
    en: "Layer %s",
    es: "Layer %s",
  },
} as const;

function getLayerLabel(locale: string, layer: number) {
  const template = specialLocales.layer[locale as keyof typeof specialLocales.layer] ?? specialLocales.layer.en;
  return template.replace("%s", (layer + 1).toString());
}

interface RitualStructureDisplayClientProps {
  layers: RitualStructureLayerData[];
  maxColumns: number;
  maxRows: number;
}

function RitualStructureSpecialSlot({ slot }: { slot: Extract<RitualStructureSlotData, { kind: "special" }> }) {
  const locale = useGameLocale();
  const label = slot.label[locale] || slot.label.en || slot.char;
  const displayChar = slot.char === " " ? "*" : slot.char;

  return (
    <GameSlot>
      <div className="ritual-structure__special-slot" title={label} aria-label={label}>
        <GameText color="#3F3F3F" noShadow>
          {displayChar}
        </GameText>
      </div>
    </GameSlot>
  );
}

function RitualStructureRow({ row, rowIndex }: { row: RitualStructureSlotData[]; rowIndex: number }) {
  return (
    <div className="ritual-structure__row">
      {row.map((slot, columnIndex) => {
        const key = `ritual-slot-${rowIndex}-${columnIndex}`;

        if (slot.kind === "empty") {
          return <GameSlot key={key} />;
        }

        if (slot.kind === "special") {
          return <RitualStructureSpecialSlot key={key} slot={slot} />;
        }

        return (
          <GameSlot key={key}>
            <GameBlockEntryClient entry={slot.entry} items={slot.items} />
          </GameSlot>
        );
      })}
    </div>
  );
}

export function RitualStructureDisplayClient({
  layers,
  maxColumns,
  maxRows,
}: RitualStructureDisplayClientProps) {
  const locale = useGameLocale();
  const [layer, setLayer] = useState(0);

  const structureStyle = useMemo(
    () => ({
      width: `calc(var(--vp-unit-size) * 18 * ${maxColumns})`,
      minHeight: `calc(var(--vp-unit-size) * 18 * ${maxRows})`,
    }),
    [maxColumns, maxRows],
  );

  const totalLayers = layers.length;

  return (
    <div className="ritual-structure">
      <div className="ritual-structure__structure" style={structureStyle}>
        <div className="ritual-structure__layer ritual-structure__layer--active">
          {(layers[layer]?.rows ?? []).map((row, rowIndex) => (
            <RitualStructureRow key={`ritual-row-${layer}-${rowIndex}`} row={row} rowIndex={rowIndex} />
          ))}
        </div>
      </div>
      <div className="ritual-structure__buttons">
        <GameArrowButton
          direction="left"
          onClick={() => {
            if (totalLayers === 0) {
              return;
            }

            setLayer((current) => (current - 1 + totalLayers) % totalLayers);
          }}
        />
        <GameText className="ritual-structure__layer-number" color="#3F3F3F" noShadow>
          {getLayerLabel(locale, layer)}
        </GameText>
        <GameArrowButton
          direction="right"
          onClick={() => {
            if (totalLayers === 0) {
              return;
            }

            setLayer((current) => (current + 1) % totalLayers);
          }}
        />
      </div>
    </div>
  );
}
