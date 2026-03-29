<script setup lang="ts">

import {ItemData} from "../type/Item";

const props = defineProps<{
  locale: 'zh' | 'en',
  ref: string,
}>()

const items: ItemData[] = [];
// TODO: fetch items based on props.ref (e.g. minecraft:dirt, #c:seeds)

const locale = {
  'zh': {},
  'en': {},
  'es': {}
}
const content = locale[props.locale];

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
  border-style: solid;
  box-sizing: border-box;
}
</style>