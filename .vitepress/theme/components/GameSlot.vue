<script setup lang="ts">
</script>

<template>
  <div class="game-item-slot">
    <slot/>
  </div>
</template>

<style scoped>
.game-item-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  border-left-color: #373737;
  border-top-color: #373737;
  border-right-color: #FFFFFF;
  border-bottom-color: #FFFFFF;
  background-color: #8B8B8B;
  width: fit-content;
  height: fit-content;
  border-width: var(--vp-unit-size);
  border-style: solid;
  box-sizing: border-box;
}
</style>