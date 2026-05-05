import { GameItemDisplay } from "@/src/components/game/GameItemDisplay";
import { GameItemEntry } from "@/src/components/game/GameItemEntry";
import type { NormalizedInfusorRecipe } from "@/src/lib/game/types";

export async function InfusorRecipeDisplay({ recipe }: { recipe: NormalizedInfusorRecipe }) {
  return (
    <div className="infusor-recipe">
      <div />
      <div />
      <GameItemEntry props={recipe.ingredient} />
      <div />
      <div />

      <div />
      <div />
      <img className="recipe-connector" src="/assets/gui/item_drop.webp" alt="item drop" />
      <div />
      <div />

      <GameItemEntry props={recipe.element} />
      <img className="recipe-connector" src="/assets/gui/elem_infuse.webp" alt="element infuse" />
      <GameItemDisplay id="croparia:infusor" />
      <img className="recipe-arrow" src="/assets/gui/recipe-arrow.webp" alt="recipe arrow" />
      <GameItemEntry props={recipe.result} />
    </div>
  );
}
