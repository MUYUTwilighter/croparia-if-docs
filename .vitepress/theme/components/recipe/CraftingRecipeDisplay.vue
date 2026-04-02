<script setup lang="ts">
import { withBase } from "vitepress";
import {NormalizedCraftingRecipe} from "../../type/CraftingRecipe";
import GameItemEntry from "../GameItemEntry.vue";
import GameItemDisplay from "../GameItemDisplay.vue";
import GameSlot from "../GameSlot.vue";

const {
  locale,
  recipe
} = defineProps<{
  locale: string,
  recipe: NormalizedCraftingRecipe
}>();

const recipeArrowSrc = withBase('/assets/gui/recipe-arrow.png');

</script>

<template>
  <div class="crafting-recipe">
    <GameItemDisplay class="workstation" :locale='locale' id="minecraft:crafting_table"></GameItemDisplay>
    <div class="input">
      <GameSlot v-for="i in 9">
        <GameItemEntry v-if="recipe.input[i - 1]" :props="recipe.input[i - 1]" :locale='locale'/>
        <div v-else class="empty"/>
      </GameSlot>
    </div>
    <img class="arrow" :src="recipeArrowSrc" alt="recipe arrow"/>
    <GameSlot class="output">
      <GameItemEntry :locale='locale' :props="recipe.output"/>
    </GameSlot>
  </div>
</template>

<style scoped>
.crafting-recipe {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.crafting-recipe .workstation {
  margin: calc(var(--vp-unit-size) * 7);
}

.crafting-recipe .input {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: calc(var(--vp-unit-size) * 18 * 3);
  height: calc(var(--vp-unit-size) * 18 * 3);
}

.crafting-recipe .input .empty {
  width: calc(var(--vp-unit-size) * 16);
  height: calc(var(--vp-unit-size) * 16);
  image-rendering: pixelated;
}

.crafting-recipe .arrow {
  width: calc(var(--vp-unit-size) * 22);
  height: calc(var(--vp-unit-size) * 15);
  margin: calc(var(--vp-unit-size) * 7);
}

.crafting-recipe .output {
  padding: calc(var(--vp-unit-size) * 4);
}
</style>
