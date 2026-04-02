import {ItemEntry, NormalizedItemEntry} from "./ItemEntry";
import {Recipe} from "./Recipe";
import {MojItemInput} from "./MojItemInput";
import {MojItemOutput} from "./MojItemOutput";

export interface NormalizedInfusorRecipe extends Recipe {
  element: NormalizedItemEntry;
  ingredient: NormalizedItemEntry;
  result: NormalizedItemEntry;
}

export interface InfusorRecipe extends Recipe {
  element: string;
  ingredient: ItemEntry;
  result: ItemEntry;
}

export const InfusorRecipe = {
  normalize(recipe: Recipe): NormalizedInfusorRecipe {
    if (recipe.type !== `croparia:infusor`) throw new Error(`${recipe.type} is not infusor recipe`);
    const infusorRecipe = recipe as InfusorRecipe;
    return {
      type: recipe.type,
      element: {
        id: `croparia:potion_${infusorRecipe.element.toLowerCase()}`,
        amount: 1,
        components: {}
      },
      ingredient: ItemEntry.normalize(infusorRecipe.ingredient),
      result: ItemEntry.normalize(infusorRecipe.result)
    }
  }
}