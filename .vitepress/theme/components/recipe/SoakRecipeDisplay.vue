<script setup lang="ts">
import { withBase } from "vitepress";
import GameItemEntry from "../GameItemEntry.vue";
import GameItemDisplay from "../GameItemDisplay.vue";
import {NormalizedSoakRecipe} from "../../type/SoakRecipe";
import GameBlockEntry from "../GameBlockEntry.vue";

const {
  recipe
} = defineProps<{
  locale?: string,
  recipe: NormalizedSoakRecipe
}>();

const elementInfuseSrc = withBase('/assets/gui/elem_infuse.png');
const blockPlaceUponSrc = withBase('/assets/gui/block_place_upon.png');
const recipeArrowSrc = withBase('/assets/gui/recipe-arrow.png');

</script>

<template>
  <div class="soak-recipe">
    <GameItemEntry :props="recipe.element"/>
    <img class="connector" :src="elementInfuseSrc" alt="element infuse"/>
    <GameItemEntry props="croparia:infusor"/>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <img class="connector" :src="blockPlaceUponSrc" alt="item drop"/>
    <div></div>
    <div></div>

    <GameBlockEntry :props="recipe.input"/>
    <img class="connector" :src="elementInfuseSrc" alt="element infuse"/>
    <GameItemDisplay id="croparia:infusor"/>
    <img class="arrow" :src="recipeArrowSrc" alt="recipe arrow"/>
    <GameBlockEntry :props="recipe.output"/>
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

.soak-recipe .connector {
  width: calc(var(--vp-unit-size) * 16);
  height: calc(var(--vp-unit-size) * 16);
}

.soak-recipe .arrow {
  width: calc(var(--vp-unit-size) * 22);
  height: calc(var(--vp-unit-size) * 15);
}
</style>
