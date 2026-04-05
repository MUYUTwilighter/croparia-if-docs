<script setup lang="ts">
import {withBase} from "vitepress";

const {
  direction = 'up',
  size = 12,
  onHover = () => {},
  onClick = () => {}
} = defineProps<{
  direction?: 'up' | 'down' | 'left' | 'right',
  size?: number,
  onHover?: (event: Event) => void,
  onClick?: (event: Event) => void
}>();

const darkImg = `url(${withBase(`/assets/gui/arrow-button/${direction}-dark.webp`)})`;
const whiteImg = `url(${withBase(`/assets/gui/arrow-button/${direction}-white.webp`)})`;
</script>

<template>
  <div class="game-arrow-button" @mouseover="onHover" @click="onClick"/>
</template>

<style scoped>
.game-arrow-button {
  background-image: v-bind(darkImg);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: auto 100%;
  image-rendering: pixelated;
  width: calc(var(--vp-unit-size) * v-bind(size));
  height: calc(var(--vp-unit-size) * v-bind(size));
}

.game-arrow-button:hover {
  background-image: v-bind(whiteImg);
}
</style>
