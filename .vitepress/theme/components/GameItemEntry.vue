<script setup lang="ts">
import {computed, onBeforeUnmount, ref, toRef, watch} from "vue";
import {ItemEntry} from "../type/ItemEntry";
import {ItemData} from "../type/ItemData";
import GameItemDisplay from "./GameItemDisplay.vue";
import GameText from "./GameText.vue";
import {Tag} from "../type/Tag";
import type EntryHook from "../type/EntryHook";
import { useLocale } from "../composables/useLocale";

const componentProps = defineProps<{
  locale?: string,
  link?: string,
  props: ItemEntry
} & EntryHook>();
const locale = useLocale(toRef(componentProps, "locale"));

const normalized = computed(() => ItemEntry.normalize(componentProps.props));

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
  if (current.id) items.value = [await ItemData.fetch(current.id)];
  else if (current.tag) {
    items.value = await Tag.fetch('#' + current.tag);
  } else {
    items.value = [await ItemData.fetch('croparia:placeholder')]
  }

  currentIndex.value = 0;
  startRotation();
}, {immediate: true});

const currentItem = computed(() => {
  if (items.value.length === 0) return null;
  return items.value[currentIndex.value] ?? items.value[0];
});

onBeforeUnmount(() => {
  stopRotation();
});

const tagLocale: Record<string, string> = {
  zh: `任意属于 #${normalized.value.tag} 的物品`,
  en: `Any item of #${normalized.value.tag}`,
  es: `Cualquier objeto de #${normalized.value.tag}`
};

</script>

<template>
  <GameItemDisplay
      v-if="currentItem"
      :id="currentItem.registerName"
      :count="normalized.amount"
      :link="componentProps.link"
      :nameHook="nameHook"
      :idHook="idHook"
      :categoryHook="categoryHook"
      :tagHook="tagHook"
  >
    <GameText v-for="[key, value] in Object.entries(normalized.components)" :key="key">
      {{ `${key}: ${value}` }}
    </GameText>
    <GameText v-if="normalized.tag">
      {{ `${tagLocale[locale] || tagLocale.en}` }}
    </GameText>
  </GameItemDisplay>
</template>

<style scoped>

</style>
