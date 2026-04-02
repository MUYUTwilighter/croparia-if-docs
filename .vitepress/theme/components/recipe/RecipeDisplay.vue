<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {Recipe} from "../../type/Recipe";
import CraftingRecipeDisplay from "./CraftingRecipeDisplay.vue";
import GameGuiFrame from "../GameGuiFrame.vue";
import {NormalizedCraftingRecipe} from "../../type/CraftingRecipe";
import GameText from "../GameText.vue";
import InfusorRecipeDisplay from "./InfusorRecipeDisplay.vue";
import {NormalizedInfusorRecipe} from "../../type/InfusorRecipe";
import RitualRecipeDisplay from "./RitualRecipeDisplay.vue";
import {NormalizedRitualRecipe} from "../../type/RitualRecipe";

const {
  locale,
  id
} = defineProps<{
  locale: string,
  id: string
}>();
const recipe = ref<Recipe | undefined>();

watchEffect(async () => {
  recipe.value = await Recipe.fetch(id);
});
</script>

<template>
  <GameGuiFrame class="recipe-frame" v-if="recipe">
    <div class="recipe-wrapper">
      <GameText class="recipe-id" color="#3F3F3F" noShadow>{{ id }}</GameText>
      <CraftingRecipeDisplay class="recipe-content"
                             v-if="recipe.type === 'minecraft:crafting_shaped' || recipe.type === 'minecraft:crafting_shapeless'"
                             :locale="locale" :recipe="recipe as NormalizedCraftingRecipe"/>
      <InfusorRecipeDisplay class="recipe-content" v-if="recipe.type=== 'croparia:infusor'" :locale="locale"
                            :recipe="recipe as NormalizedInfusorRecipe"/>
      <RitualRecipeDisplay class="recipe-content" v-if="recipe.type === 'croparia:ritual'" :locale="locale"
                           :recipe="recipe as NormalizedRitualRecipe"/>
    </div>
  </GameGuiFrame>
</template>

<style scoped>
.recipe-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-content {
  margin: calc(var(--vp-unit-size) * 4);
}

.recipe-id {
  margin: calc(var(--vp-unit-size) * 2);
}
</style>