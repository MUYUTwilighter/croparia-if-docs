<script setup lang="ts">
const {
  color = '#FCFCFC',
  noShadow = false,
  notFullLine = false,
  fontStyle = 'normal',
  fontWeight = 'normal',
} = defineProps<{
  color?: string;
  noShadow?: boolean;
  notFullLine?: boolean;
  fontStyle?: string;
  fontWeight?: string;
}>();

function getMcShadow(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const factor = 0.25;

  const sr = Math.round(r * factor);
  const sg = Math.round(g * factor);
  const sb = Math.round(b * factor);

  return `rgb(${sr}, ${sg}, ${sb})`;
}

const display = notFullLine ? 'inline' : 'block';
const width = notFullLine ? 'fit-content' : 'auto';
</script>

<template>
  <span class="game-text" :style="{
    color,
    textShadow: noShadow ? 'none' : `var(--vp-unit-size) var(--vp-unit-size) 0 ${getMcShadow(color)}`
  }">
    <slot/>
  </span>
</template>

<style scoped>
.game-text {
  display: v-bind(display);
  width: v-bind(width);
  font-family: "Noto Sans SC", monospace;
  font-size: calc(var(--vp-unit-size) * 7);
  font-weight: v-bind(fontWeight);
  font-style: v-bind(fontStyle);
  word-break: keep-all;
}
</style>
