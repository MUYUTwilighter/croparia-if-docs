<script setup lang="ts">
import {computed, onBeforeUnmount, ref, toRef, watch} from "vue";
import {ItemData} from "../type/ItemData";
import {Tag} from "../type/Tag";
import GameItemDisplay from "./GameItemDisplay.vue";
import GameText from "./GameText.vue";
import {BlockEntry} from "../type/BlockEntry";
import type EntryHook from "../type/EntryHook";
import { useLocale } from "../composables/useLocale";

const componentProps = defineProps<{
  locale?: string,
  link?: string,
  props: BlockEntry,
} & EntryHook>();
const locale = useLocale(toRef(componentProps, "locale"));

const normalized = computed(() => BlockEntry.normalize(componentProps.props));

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
        ? await Tag.fetch(name)
        : [await ItemData.fetch(name)];
  } else {
    items.value = [await ItemData.fetch('croparia:placeholder_block')];
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
  zh: `任意属于 ${normalized.value.tag} 的方块`,
  en: `Any block of ${normalized.value.tag}`,
  es: `Cualquier bloque de ${normalized.value.tag}`
};

</script>

<template>
  <GameItemDisplay
      v-if="currentItem"
      :id="currentItem.registerName"
      :link="componentProps.link"
      :nameHook="nameHook"
      :idHook="idHook"
      :categoryHook="categoryHook"
      :tagHook="tagHook"
  >
    <GameText v-for="[key, value] in Object.entries(normalized.properties)" :key="key">
      {{ `${key}: ${value}` }}
    </GameText>
    <GameText v-if="normalized.tag">
      {{ `${tagLocale[locale] || tagLocale.en}` }}
    </GameText>
  </GameItemDisplay>
</template>

<style scoped>

</style>
