import {Recipe} from "./Recipe";
import {ItemEntry, NormalizedItemEntry} from "./ItemEntry";
import {BlockEntry, NormalizedBlockEntry} from "./BlockEntry";

export interface NormalizedSoakRecipe extends Recipe {
  element: NormalizedItemEntry;
  input: NormalizedBlockEntry;
  output: NormalizedBlockEntry;
  probability: number;
}

export interface SoakRecipe extends Recipe {
  element: string;
  input: BlockEntry;
  output: BlockEntry;
  probability: number;
}

export const SoakRecipe = {
  normalize(recipe: Recipe) {
    if (recipe.type !== 'croparia:soak') throw new Error(`recipe ${recipe} is not a soak recipe`);
    const soakRecipe = recipe as SoakRecipe;
    return {
      type: recipe.type,
      element: ItemEntry.normalize(`croparia:potion_${soakRecipe.element.toLowerCase()}`),
      input: BlockEntry.normalize(soakRecipe.input),
      output: BlockEntry.normalize(soakRecipe.output),
      probability: soakRecipe.probability,
    }
  }
}