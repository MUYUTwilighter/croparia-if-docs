<script setup lang="ts">
import GameItemEntry from "../GameItemEntry.vue";
import GameItemDisplay from "../GameItemDisplay.vue";
import {NormalizedSoakRecipe} from "../../type/SoakRecipe";
import GameBlockEntry from "../GameBlockEntry.vue";

const {
  locale,
  recipe
} = defineProps<{
  locale: string,
  recipe: NormalizedSoakRecipe
}>();

</script>

<template>
  <div class="soak-recipe">
    <GameItemEntry :locale="locale" :props="recipe.element"/>
    <img class="connector" src="assets/gui/elem_infuse.png" alt="element infuse"/>
    <GameItemEntry :locale="locale" props="croparia:infusor"/>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <img class="connector" src="assets/gui/block_place_upon.png" alt="item drop"/>
    <div></div>
    <div></div>

    <GameBlockEntry :locale="locale" :props="recipe.input"/>
    <img class="connector" src="assets/gui/elem_infuse.png" alt="element infuse"/>
    <GameItemDisplay :locale="locale" id="croparia:infusor"/>
    <img class="arrow" src='assets/gui/recipe-arrow.png' alt="recipe arrow"/>
    <GameBlockEntry :locale="locale" :props="recipe.output"/>
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