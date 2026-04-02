import {Recipe} from "./Recipe";
import {BlockEntry, NormalizedBlockEntry} from "./BlockEntry";

export interface NormalizedRitualStructure extends Recipe {
  keys: {
    [k: string]: NormalizedBlockEntry;
  };
  pattern: string[][];
}

export interface RitualStructure extends Recipe {
  ritual: BlockEntry;
  keys: {
    [k: string]: BlockEntry;
  };
  pattern: string[][];
}

export const RitualStructure = {
  normalize(recipe: Recipe): NormalizedRitualStructure {
    if (recipe.type !== 'croparia:ritual_structure') throw new Error(`recipe ${recipe} is not a ritual structure`);
    const ritualStructure = recipe as RitualStructure;
    // Converting Keys
    const nKeys = Object.fromEntries(
      Object.entries(ritualStructure.keys).map(([k, v]) => {
        return [k, BlockEntry.normalize(v)]
      })
    );
    return {
      type: recipe.type,
      keys: {
        ...nKeys,
        '*': BlockEntry.normalize(ritualStructure.ritual),
        '$': {
          id: 'croparia:placeholder',
          properties: {}
        },
        ' ': {
          id: 'minecraft:air',
          properties: {}
        },
        '.': {
          id: 'minecraft:barrier',
          properties: {}
        }
      },
      pattern: ritualStructure.pattern
    }
  }
}