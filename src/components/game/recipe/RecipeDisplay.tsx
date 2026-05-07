import { GameGuiFrame } from "@/src/components/game/GameGuiFrame";
import { GameText } from "@/src/components/game/GameText";
import { CraftingRecipeDisplay } from "@/src/components/game/recipe/CraftingRecipeDisplay";
import { InfusorRecipeDisplay } from "@/src/components/game/recipe/InfusorRecipeDisplay";
import { RitualRecipeDisplay } from "@/src/components/game/recipe/RitualRecipeDisplay";
import { RitualStructureDisplay } from "@/src/components/game/recipe/RitualStructureDisplay";
import { SoakRecipeDisplay } from "@/src/components/game/recipe/SoakRecipeDisplay";
import { getRecipeData } from "@/src/lib/game/server-data";
import type {
  NormalizedCraftingRecipe,
  NormalizedInfusorRecipe,
  NormalizedRitualRecipe,
  NormalizedRitualStructure,
  NormalizedSoakRecipe,
} from "@/src/lib/game/types";

export async function RecipeDisplay({ id }: { id: string }) {
  try {
    const recipe = await getRecipeData(id);

    return (
      <div className="game-inline-overflow">
        <GameGuiFrame className="recipe-frame">
          <div className="recipe-frame__wrapper">
            <GameText className="recipe-frame__id" color="#3F3F3F" noShadow>
              {id}
            </GameText>
            <div className="recipe-frame__content">
              {recipe.type === "minecraft:crafting_shaped" || recipe.type === "minecraft:crafting_shapeless" ? (
                <CraftingRecipeDisplay recipe={recipe as NormalizedCraftingRecipe} />
              ) : null}
              {recipe.type === "croparia:infusor" ? <InfusorRecipeDisplay recipe={recipe as NormalizedInfusorRecipe} /> : null}
              {recipe.type === "croparia:ritual" ? <RitualRecipeDisplay recipe={recipe as NormalizedRitualRecipe} /> : null}
              {recipe.type === "croparia:soak" ? <SoakRecipeDisplay recipe={recipe as NormalizedSoakRecipe} /> : null}
              {recipe.type === "croparia:ritual_structure" ? (
                <RitualStructureDisplay recipe={recipe as NormalizedRitualStructure} />
              ) : null}
            </div>
          </div>
        </GameGuiFrame>
      </div>
    );
  } catch {
    return (
      <div className="game-inline-overflow">
        <GameGuiFrame className="recipe-frame">
          <div className="recipe-frame__wrapper">
            <GameText className="recipe-frame__id" color="#3F3F3F" noShadow>
              {id}
            </GameText>
            <GameText className="recipe-frame__error" color="#AA0000" noShadow>
              Recipe unavailable.
            </GameText>
          </div>
        </GameGuiFrame>
      </div>
    );
  }
}
