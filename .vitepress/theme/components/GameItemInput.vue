<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { ItemInput, normalizeItemInput } from "../type/ItemInput";
import { fetchItem, ItemData } from "../type/Item";
import { fetchItems } from "../type/Tag";
import GameItemDisplay from "./GameItemDisplay.vue";
import GameText from "./GameText.vue";

const componentProps = defineProps<{
  locale: string,
  link?: string,
  props: ItemInput
}>();

const normalized = computed(() => normalizeItemInput(componentProps.props));

const items = ref<ItemData[]>([]);
const currentIndex = ref(0);
let rotationTimer: ReturnType<typeof setInterval> | null = null;

function stopRotation() {
  if (rotationTimer) {
    clearInterval(rotationTimer);
    rotationTimer = null;
  }
}

function startRotation() {
  stopRotation();

  if (items.value.length <= 1) {
    currentIndex.value = 0;
    return;
  }

  rotationTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % items.value.length;
  }, 1000);
}

watch(normalized, async (current) => {
  const name = current.id || current.tag;
  if (name) {
    items.value = name.startsWith('#')
      ? await fetchItems(name)
      : [await fetchItem(name)];
  } else {
    items.value = [await fetchItem('croparia:placeholder')];
  }

  currentIndex.value = 0;
  startRotation();
}, { immediate: true });

const currentItem = computed(() => {
  if (items.value.length === 0) return null;
  return items.value[currentIndex.value] ?? items.value[0];
});

onBeforeUnmount(() => {
  stopRotation();
});

</script>

<template>
  <GameItemDisplay
    v-if="currentItem"
    :id="currentItem.registerName"
    :locale="componentProps.locale"
    :count="normalized.amount"
    :link="componentProps.link"
  >
    <GameText v-for="key in Object.keys(normalized.components)" :key="key">
      {{ `${key}: ${normalized.components[key]}` }}
    </GameText>
  </GameItemDisplay>
</template>

<style scoped>

</style>
