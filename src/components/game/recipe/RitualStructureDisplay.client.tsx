"use client";

import { useMemo, useState } from "react";

import { GameArrowButton } from "@/src/components/game/GameArrowButton";
import { GameText } from "@/src/components/game/GameText";
import { useGameLocale } from "@/src/components/game/use-game-locale";

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
  layers: React.ReactNode[];
  maxColumns: number;
  maxRows: number;
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
        {layers.map((currentLayer, index) => (
          <div
            key={`ritual-structure-layer-${index}`}
            className={[
              "ritual-structure__layer",
              index === layer ? "ritual-structure__layer--active" : "ritual-structure__layer--hidden",
            ].join(" ")}
          >
            {currentLayer}
          </div>
        ))}
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
