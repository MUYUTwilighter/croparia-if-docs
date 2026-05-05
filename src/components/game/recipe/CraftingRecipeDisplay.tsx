import { GameItemDisplay } from "@/src/components/game/GameItemDisplay";
import { GameItemEntry } from "@/src/components/game/GameItemEntry";
import { GameSlot } from "@/src/components/game/GameSlot";
import type { NormalizedCraftingRecipe } from "@/src/lib/game/types";

export async function CraftingRecipeDisplay({ recipe }: { recipe: NormalizedCraftingRecipe }) {
  return (
    <div className="crafting-recipe">
      <GameItemDisplay className="crafting-recipe__workstation" id="minecraft:crafting_table" />
      <div className="crafting-recipe__input">
        {Array.from({ length: 9 }, (_, index) => {
          const input = recipe.input[index];
          return (
            <GameSlot key={`crafting-input-${index}`}>
              {input ? <GameItemEntry props={input} /> : <div className="crafting-recipe__empty" />}
            </GameSlot>
          );
        })}
      </div>
      <img className="recipe-arrow crafting-recipe__arrow" src="/assets/gui/recipe-arrow.webp" alt="recipe arrow" />
      <GameSlot className="crafting-recipe__output">
        <GameItemEntry props={recipe.output} />
      </GameSlot>
    </div>
  );
}
