import {NormalizedItemEntry} from "./ItemEntry";
import {Recipe} from "./Recipe";
import {MojItemInput} from "./MojItemInput";
import {MojItemOutput} from "./MojItemOutput";

export interface NormalizedCraftingRecipe extends Recipe {
  input: (NormalizedItemEntry | undefined)[];
  output: NormalizedItemEntry;
}

export interface ShapedCraftingRecipe extends Recipe {
  key: {
    [k: string]: MojItemInput
  },
  pattern: string[],
  result: MojItemOutput
}

export interface ShapelessCraftingRecipe extends Recipe {
  ingredients: MojItemInput[],
  result: MojItemOutput
}

export type CraftingRecipe = ShapedCraftingRecipe | ShapelessCraftingRecipe | NormalizedCraftingRecipe;

export const CraftingRecipe = {
  normalize(recipe: Recipe): NormalizedCraftingRecipe {
    if (recipe.type === 'minecraft:crafting_shaped') {
      const craftingRecipe = recipe as ShapedCraftingRecipe;
      const input: (NormalizedItemEntry | undefined)[] = [];
      craftingRecipe.pattern.forEach(row => {
        for (let i = 0; i < row.length; i++) {
          const c = row.charAt(i);
          // Empty slot
          if (c === ' ') {
            input.push(undefined);
            continue;
          }
          const mojItem = craftingRecipe.key[c];
          // No key binding
          if (!mojItem) {
            input.push(undefined);
            continue;
          }
          input.push(MojItemInput.toItemEntry(mojItem));
        }
      });
      return {
        type: recipe.type,
        output: MojItemOutput.toItemEntry(craftingRecipe.result),
        input
      }
    } else if (recipe.type === 'minecraft:crafting_shapeless') {
      const craftingRecipe = recipe as ShapelessCraftingRecipe;
      const input: NormalizedItemEntry[] = [];
      craftingRecipe.ingredients.forEach(ingredient => {
        input.push(MojItemInput.toItemEntry(ingredient));
      });
      return {
        type: recipe.type,
        input,
        output: MojItemOutput.toItemEntry(craftingRecipe.result)
      }
    }
    throw new Error(`Unknown recipe type: ${recipe.type}`);
  }
}