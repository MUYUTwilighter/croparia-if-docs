<script setup lang="ts">
import { withBase } from "vitepress";
import {NormalizedInfusorRecipe} from "../../type/InfusorRecipe";
import GameItemEntry from "../GameItemEntry.vue";
import GameItemDisplay from "../GameItemDisplay.vue";

const {
  locale,
  recipe
} = defineProps<{
  locale: string,
  recipe: NormalizedInfusorRecipe
}>();

const itemDropSrc = withBase('/assets/gui/item_drop.png');
const elementInfuseSrc = withBase('/assets/gui/elem_infuse.png');
const recipeArrowSrc = withBase('/assets/gui/recipe-arrow.png');

</script>

<template>
  <div class="soak-recipe">
    <div></div>
    <div></div>
    <GameItemEntry :locale="locale" :props="recipe.ingredient"/>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <img class="connector" :src="itemDropSrc" alt="item drop"/>
    <div></div>
    <div></div>

    <GameItemEntry :locale="locale" :props="recipe.element"/>
    <img class="connector" :src="elementInfuseSrc" alt="element infuse"/>
    <GameItemDisplay :locale="locale" id="croparia:infusor"/>
    <img class="arrow" :src="recipeArrowSrc" alt="recipe arrow"/>
    <GameItemEntry :locale="locale" :props="recipe.result"/>
  </div>
</template>

<style scoped>
.soak-recipe {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
}

.soak-recipe img {
  image-rendering: pixelated;
}

.soak-recipe .connector,
.soak-recipe .connector {
  width: calc(var(--vp-unit-size) * 16);
  height: calc(var(--vp-unit-size) * 16);
}

.soak-recipe .arrow {
  width: calc(var(--vp-unit-size) * 22);
  height: calc(var(--vp-unit-size) * 15);
}
</style>
