<script setup lang="ts">
const props = withDefaults(
    defineProps<{
      content: string;
      color?: string;
      shadow?: boolean;
    }>(),
    {
      color: "#FCFCFC",
      shadow: false,
    }
);

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
</script>

<template>
  <span class="game-text" :style="{
    color: props.color,
    textShadow: props.shadow ? `0.8mm 0.8mm 0 ${getMcShadow(props.color)}` : 'none'
  }">
    {{ props.content }}
  </span>
</template>

<style scoped>
.game-text {
  font-family: "Noto Sans SC", monospace;
  font-size: calc(var(--vp-unit-size) * 7);
  font-weight: bold;
}
</style>