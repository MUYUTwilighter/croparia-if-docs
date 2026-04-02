<script setup lang="ts">
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

</script>

<template>
  <div class="infusor-recipe">
    <div></div>
    <div></div>
    <GameItemEntry :locale="locale" :props="recipe.ingredient"/>
    <div></div>
    <div></div>

    <div></div>
    <div></div>
    <img class="item-drop" src="assets/gui/item_drop.png" alt="item drop"/>
    <div></div>
    <div></div>

    <GameItemEntry :locale="locale" :props="recipe.element"/>
    <img class="infuse" src="assets/gui/elem_infuse.png" alt="element infuse"/>
    <GameItemDisplay :locale="locale" id="croparia:infusor"/>
    <img class="arrow" src='assets/gui/recipe-arrow.png' alt="recipe arrow"/>
    <GameItemEntry :locale="locale" :props="recipe.result"/>
  </div>
</template>

<style scoped>
.infusor-recipe {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
}

.infusor-recipe img {
  image-rendering: pixelated;
}

.infusor-recipe .item-drop,
.infusor-recipe .infuse {
  width: calc(var(--vp-unit-size) * 16);
  height: calc(var(--vp-unit-size) * 16);
}

.infusor-recipe .arrow {
  width: calc(var(--vp-unit-size) * 22);
  height: calc(var(--vp-unit-size) * 15);
}
</style>