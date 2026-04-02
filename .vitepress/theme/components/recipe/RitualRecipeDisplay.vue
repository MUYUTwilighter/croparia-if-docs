<script setup lang="ts">
import {} from "../../type/InfusorRecipe";
import GameItemEntry from "../GameItemEntry.vue";
import GameItemDisplay from "../GameItemDisplay.vue";
import {NormalizedRitualRecipe} from "../../type/RitualRecipe";
import GameBlockEntry from "../GameBlockEntry.vue";

const {
  locale,
  recipe
} = defineProps<{
  locale: string,
  recipe: NormalizedRitualRecipe
}>();

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
    <img class="connector" src="assets/gui/item_drop.png" alt="item drop"/>
    <div></div>
    <div></div>

    <GameBlockEntry :locale="locale" :props="recipe.block"/>
    <img class="connector" src="assets/gui/block_place.png" alt="place block"/>
    <GameBlockEntry :locale="locale" :props="recipe.ritual"/>
    <img class="arrow" src='assets/gui/recipe-arrow.png' alt="recipe arrow"/>
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