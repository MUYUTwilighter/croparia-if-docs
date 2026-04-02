<script setup lang="ts">

import {NormalizedRitualStructure} from "../../type/RitualStructure";
import GameText from "../GameText.vue";
import GameBlockEntry from "../GameBlockEntry.vue";
import GameSlot from "../GameSlot.vue";
import GameArrowButton from "../GameArrowButton.vue";
import {computed, ref} from "vue";

const {
  locale,
  recipe,
} = defineProps<{
  locale: string,
  recipe: NormalizedRitualStructure,
}>();

const locales: {
  [k: string]: {
    [k: string]: string
  }
} = {
  ' ': {
    zh: '任意方块',
    en: 'Any Block',
    es: ''  // TODO
  },
  '$': {
    zh: '输入方块',
    en: 'Input Block',
    es: ''  // TODO
  },
  '.': {
    zh: '仅空气方块',
    en: 'Air Only',
    es: ''  // TODO
  },
  'layer': {
    zh: '第 %s 层',
    en: 'Layer %s',
    es: ''  // TODO
  }
}

function getLocale(c: string, lang: string): string {
  const locale = locales[c];
  if (locale) return locale[lang] || locale.en;
  throw new Error('Invalid character for special names: ' + c);
}

const layer = ref<number>(0);
const totalLayers = computed(() => recipe.pattern.length);
const maxColumns = computed(() => Math.max(0, ...recipe.pattern.flatMap(current => current.map(row => row.length))));
const maxRows = computed(() => Math.max(0, ...recipe.pattern.map(current => current.length)));
const anyBlockHooks = {
  nameHook: () => getLocale(' ', locale),
  idHook: () => '',
  categoryHook: () => '',
  tagHook: () => []
};
const inputBlockHooks = {
  nameHook: () => getLocale('$', locale),
  idHook: () => '',
  categoryHook: () => '',
  tagHook: () => []
};
const airOnlyHooks = {
  nameHook: () => getLocale('.', locale),
  idHook: () => '',
  categoryHook: () => '',
  tagHook: () => []
};

function getEntryAt(row: string, index: number) {
  return recipe.keys[row.charAt(index)];
}

function previousLayer() {
  if (totalLayers.value === 0) return;
  layer.value = (layer.value - 1 + totalLayers.value) % totalLayers.value;
}

function nextLayer() {
  if (totalLayers.value === 0) return;
  layer.value = (layer.value + 1) % totalLayers.value;
}

</script>

<template>
  <div class="ritual-structure">
    <div class="structure">
      <div
        v-for="(patternLayer, layerIndex) in recipe.pattern"
        :key="`layer-${layerIndex}`"
        class="layer"
        :class="{ 'layer--active': layerIndex === layer, 'layer--hidden': layerIndex !== layer }"
      >
        <div v-for="(row, rowIndex) in patternLayer" :key="`${layerIndex}-${rowIndex}`" class="row">
          <GameSlot v-for="(char, columnIndex) in row" :key="`${layerIndex}-${rowIndex}-${columnIndex}`">
            <GameBlockEntry v-if="char === ' '"
                            v-bind="anyBlockHooks" :locale="locale"
                            :props="getEntryAt(row, columnIndex)"></GameBlockEntry>
            <GameBlockEntry v-else-if="char === '$'"
                            v-bind="inputBlockHooks" :locale="locale"
                            :props="getEntryAt(row, columnIndex)"></GameBlockEntry>
            <GameBlockEntry v-else-if="char === '.'"
                            v-bind="airOnlyHooks" :locale="locale"
                            :props="getEntryAt(row, columnIndex)"></GameBlockEntry>
            <GameBlockEntry v-else :locale="locale" :props="getEntryAt(row, columnIndex)"></GameBlockEntry>
          </GameSlot>
        </div>
      </div>
    </div>
    <div class="buttons">
      <GameArrowButton direction="left" :onClick="previousLayer"></GameArrowButton>
      <GameText color="#3F3F3F" class="layer-number" noShadow>{{ getLocale('layer', locale).replace('%s', (layer + 1).toString()) }}</GameText>
      <GameArrowButton direction="right" :onClick="nextLayer"></GameArrowButton>
    </div>
  </div>
</template>

<style scoped>
.ritual-structure,
.ritual-structure .row,
.ritual-structure .buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.ritual-structure {
  flex-direction: column;
  gap: calc(var(--vp-unit-size) * 4);
}

.ritual-structure .layer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  transition: opacity 160ms ease;
}

.ritual-structure .structure {
  position: relative;
  width: calc(var(--vp-unit-size) * 18 * v-bind(maxColumns));
  min-height: calc(var(--vp-unit-size) * 18 * v-bind(maxRows));
}

.ritual-structure .layer--hidden {
  z-index: -1;
  pointer-events: none;
}

.ritual-structure .layer--active {
  z-index: 0;
  opacity: 1;
}

.ritual-structure .buttons {
  gap: calc(var(--vp-unit-size) * 3);
}
</style>
