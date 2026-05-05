import { Fragment } from "react";

import { GameBlockEntry } from "@/src/components/game/GameBlockEntry";
import { GameSlot } from "@/src/components/game/GameSlot";
import { RitualStructureDisplayClient } from "@/src/components/game/recipe/RitualStructureDisplay.client";
import type { EntryHooks, NormalizedRitualStructure } from "@/src/lib/game/types";

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

function createSpecialHooks(char: keyof typeof specialNameLocales): EntryHooks {
  return {
    nameHook: (_title, locale) =>
      specialNameLocales[char][locale as keyof (typeof specialNameLocales)[typeof char]] ?? specialNameLocales[char].en,
    idHook: () => "",
    categoryHook: () => "",
    tagHook: () => [],
  };
}

const anyBlockHooks = createSpecialHooks(" ");
const inputBlockHooks = createSpecialHooks("$");
const airOnlyHooks = createSpecialHooks(".");

function getHooksForChar(char: string): EntryHooks | undefined {
  if (char === " ") {
    return anyBlockHooks;
  }

  if (char === "$") {
    return inputBlockHooks;
  }

  if (char === ".") {
    return airOnlyHooks;
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
            const hooks = getHooksForChar(char);

            return (
              <GameSlot key={`ritual-slot-${layerIndex}-${rowIndex}-${columnIndex}`}>
                {entry ? <GameBlockEntry props={entry} {...hooks} /> : null}
              </GameSlot>
            );
          })}
        </div>
      ))}
    </Fragment>
  ));

  return <RitualStructureDisplayClient layers={layers} maxColumns={maxColumns} maxRows={maxRows} />;
}
