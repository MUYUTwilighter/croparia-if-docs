import { Fragment } from "react";

import { GameBlockEntry } from "@/src/components/game/GameBlockEntry";
import { GameSlot } from "@/src/components/game/GameSlot";
import { RitualStructureDisplayClient } from "@/src/components/game/recipe/RitualStructureDisplay.client";
import type { EntryDisplayOverrides, NormalizedRitualStructure } from "@/src/lib/game/types";

const specialNameLocales = {
  " ": {
    zh: "任意方块",
    en: "Any Block",
    es: "Any Block",
  },
  $: {
    zh: "输入方块",
    en: "Input Block",
    es: "Input Block",
  },
  ".": {
    zh: "仅空气方块",
    en: "Air Only",
    es: "Air Only",
  },
} as const;

function createSpecialOverrides(char: keyof typeof specialNameLocales): EntryDisplayOverrides {
  return {
    nameOverride: specialNameLocales[char],
    idOverride: "",
    categoryOverride: {
      zh: "",
      en: "",
      es: "",
    },
    tagsOverride: [],
  };
}

const anyBlockOverrides = createSpecialOverrides(" ");
const inputBlockOverrides = createSpecialOverrides("$");
const airOnlyOverrides = createSpecialOverrides(".");

function getOverridesForChar(char: string): EntryDisplayOverrides | undefined {
  if (char === " ") {
    return anyBlockOverrides;
  }

  if (char === "$") {
    return inputBlockOverrides;
  }

  if (char === ".") {
    return airOnlyOverrides;
  }

  return undefined;
}

export async function RitualStructureDisplay({ recipe }: { recipe: NormalizedRitualStructure }) {
  const maxColumns = Math.max(0, ...recipe.pattern.flatMap((layer) => layer.map((row) => row.length)));
  const maxRows = Math.max(0, ...recipe.pattern.map((layer) => layer.length));

  const layers = recipe.pattern.map((patternLayer, layerIndex) => (
    <Fragment key={`ritual-layer-${layerIndex}`}>
      {patternLayer.map((row, rowIndex) => (
        <div key={`ritual-row-${layerIndex}-${rowIndex}`} className="ritual-structure__row">
          {Array.from(row).map((char, columnIndex) => {
            const entry = recipe.keys[char];
            const displayOverrides = getOverridesForChar(char);

            return (
              <GameSlot key={`ritual-slot-${layerIndex}-${rowIndex}-${columnIndex}`}>
                {entry ? <GameBlockEntry props={entry} {...displayOverrides} /> : null}
              </GameSlot>
            );
          })}
        </div>
      ))}
    </Fragment>
  ));

  return <RitualStructureDisplayClient layers={layers} maxColumns={maxColumns} maxRows={maxRows} />;
}
