import {CraftingRecipe} from "./CraftingRecipe";
import {InfusorRecipe} from "./InfusorRecipe";
import {RitualRecipe} from "./RitualRecipe";
import {SoakRecipe} from "./SoakRecipe";
import {RitualStructure} from "./RitualStructure";
import { loadPublicJson } from "../util/dataLoader";

export interface Recipe {
  type: string;
}

export const TYPE_MAP: {
  [k: string]: ((recipe: Recipe) => Recipe) | undefined;
} = {
  'minecraft:crafting_shaped': CraftingRecipe.normalize,
  'minecraft:crafting_shapeless': CraftingRecipe.normalize,
  'croparia:infusor': InfusorRecipe.normalize,
  'croparia:ritual': RitualRecipe.normalize,
  'croparia:soak': SoakRecipe.normalize,
  'croparia:ritual_structure': RitualStructure.normalize,
}

export const Recipe = {
  async fetch<T>(id: string): Promise<T | undefined> {
    const [namespace, path] = id.split(':');
    return await loadPublicJson<Recipe>(`/data/recipe/${namespace}/${path}.json`).then((recipe: Recipe) => {
      const normalizer = TYPE_MAP[recipe.type];
      if (!normalizer) {
        throw new Error(`Unknown recipe type: ${recipe.type}`);
      }
      return normalizer(recipe) as T;
    }).catch(e => {
      throw new Error(`Error in fetching recipe ${id}: ${e}`);
    });
  }
}
