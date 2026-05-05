import { GameBlockEntry } from "@/src/components/game/GameBlockEntry";
import { GameItemEntry } from "@/src/components/game/GameItemEntry";
import type { NormalizedRitualRecipe } from "@/src/lib/game/types";

export async function RitualRecipeDisplay({ recipe }: { recipe: NormalizedRitualRecipe }) {
  return (
    <div className="ritual-recipe">
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

      <GameBlockEntry props={recipe.block} />
      <img className="recipe-connector" src="/assets/gui/block_place.webp" alt="place block" />
      <GameBlockEntry props={recipe.ritual} />
      <img className="recipe-arrow" src="/assets/gui/recipe-arrow.webp" alt="recipe arrow" />
      <GameItemEntry props={recipe.result} />
    </div>
  );
}
