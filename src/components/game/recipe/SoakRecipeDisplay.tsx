import { GameBlockEntry } from "@/src/components/game/GameBlockEntry";
import { GameItemDisplay } from "@/src/components/game/GameItemDisplay";
import { GameItemEntry } from "@/src/components/game/GameItemEntry";
import type { NormalizedSoakRecipe } from "@/src/lib/game/types";

export async function SoakRecipeDisplay({ recipe }: { recipe: NormalizedSoakRecipe }) {
  return (
    <div className="soak-recipe">
      <GameItemEntry props={recipe.element} />
      <img className="recipe-connector" src="/assets/gui/elem_infuse.webp" alt="element infuse" />
      <GameItemDisplay id="croparia:infusor" />
      <div />
      <div />

      <div />
      <div />
      <img className="recipe-connector" src="/assets/gui/block_place_upon.webp" alt="block place upon" />
      <div />
      <div />

      <GameBlockEntry props={recipe.input} />
      <img className="recipe-connector" src="/assets/gui/elem_infuse.webp" alt="element infuse" />
      <GameItemDisplay id="croparia:infusor" />
      <img className="recipe-arrow" src="/assets/gui/recipe-arrow.webp" alt="recipe arrow" />
      <GameBlockEntry props={recipe.output} />
    </div>
  );
}
