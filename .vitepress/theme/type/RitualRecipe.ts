import {BlockEntry, NormalizedBlockEntry} from "./BlockEntry";
import {ItemEntry, NormalizedItemEntry} from "./ItemEntry";
import {Recipe} from "./Recipe";

export interface NormalizedRitualRecipe extends Recipe {
  ritual: NormalizedBlockEntry;
  ingredient: NormalizedItemEntry;
  block: NormalizedBlockEntry;
  result: NormalizedItemEntry;
}

export interface RitualRecipe extends Recipe {
  ritual: BlockEntry;
  ingredient: ItemEntry;
  block: BlockEntry;
  result: ItemEntry;
}

export const RitualRecipe = {
  normalize(recipe: Recipe): NormalizedRitualRecipe {
    if (recipe.type !== 'croparia:ritual') throw new Error(`${recipe.type} is not ritual recipe`);
    const ritualRecipe = recipe as RitualRecipe;

    return {
      type: recipe.type,
      ritual: BlockEntry.normalize(ritualRecipe.ritual),
      ingredient: ItemEntry.normalize(ritualRecipe.ingredient),
      block: BlockEntry.normalize(ritualRecipe.block),
      result: ItemEntry.normalize(ritualRecipe.result),
    };
  }
}