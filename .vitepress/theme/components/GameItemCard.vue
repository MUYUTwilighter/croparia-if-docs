<script setup lang="ts">

import GameSlot from "./GameSlot.vue";
import GameItemDisplay from "./GameItemDisplay.vue";
import {computed, ref, toRef, watchEffect} from "vue";
import {ItemData} from "../type/ItemData";
import GameText from "./GameText.vue";
import GameGuiFrame from "./GameGuiFrame.vue";
import { useLocale } from "../composables/useLocale";

const props = defineProps<{
  locale?: string,
  id: string,
}>();
const locale = useLocale(toRef(props, "locale"));

const item = ref<ItemData>(ItemData.createFallbackItem("loading"));

watchEffect(async () => {
  item.value = await ItemData.fetch(props.id);
});

const attrLocales: Record<string, {
  maxStacking: string,
  id: string,
  tag: string,
  minTool: string,
  category: string
}> = {
  zh: {
    maxStacking: "最大堆叠数量",
    id: "ID",
    tag: "标签",
    minTool: "最低工具需求",
    category: "类别"
  },
  en: {
    maxStacking: "Max Stack Size",
    id: "ID",
    tag: "Tags",
    minTool: "Min Excavation Tool",
    category: "Category"
  },
  es: {
    maxStacking: "Cantidad máxima por pila",
    id: "ID",
    tag: "Etiquetas",
    minTool: "Herramienta mínima requerida",
    category: "Categoría"
  }
}
const attrLocale = computed(() => attrLocales[locale.value] || attrLocales.en);

</script>

<template>
  <GameGuiFrame class="game-item-card">
    <div class="wrapper">
      <GameText class="name" color="#3F3F3F" fontWeight="bold"
                notFullLine noShadow>{{ item.name[locale] || item.name.en }}
      </GameText>
      <GameItemDisplay class="icon" :id="props.id" :size="64" noFloatBox/>
      <GameSlot>
        <table>
          <tbody>
          <tr>
            <td class="attr">
              <GameText color="#3F3F3F" noShadow>{{ attrLocale.id }}</GameText>
            </td>
            <td class="value">
              <GameText>{{ item.registerName }}</GameText>
            </td>
          </tr>
          <tr>
            <td class="attr">
              <GameText color="#3F3F3F" noShadow>{{ attrLocale.category }}</GameText>
            </td>
            <td class="value">
              <GameText>{{ item.CreativeTabName[locale] || item.CreativeTabName.en }}</GameText>
            </td>
          </tr>
          <tr v-if="item.OredictList.length > 0">
            <td class="attr">
              <GameText color="#3F3F3F" noShadow>{{ attrLocale.tag }}</GameText>
            </td>
            <td class="value">
              <GameText v-for="tag in item.OredictList">{{ `#${tag}` }}</GameText>
            </td>
          </tr>
          <tr>
            <td class="attr">
              <GameText color="#3F3F3F" noShadow>{{ attrLocale.maxStacking }}</GameText>
            </td>
            <td class="value">
              <GameText>{{ item.maxStacksSize.toString() }}</GameText>
            </td>
          </tr>
          <tr v-if="item.minTool">
            <td class="attr">
              <GameText color="#3F3F3F" noShadow>{{ attrLocale.minTool }}</GameText>
            </td>
            <td class="value">
              <GameItemDisplay :id='item.minTool'/>
            </td>
          </tr>
          </tbody>
        </table>
      </GameSlot>
    </div>
  </GameGuiFrame>
</template>

<style scoped>
.game-item-card div.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-item-card .attr {
  margin: calc(var(--vp-unit-size) * 2);
  text-align: right;
}

.game-item-card .value {
  margin: calc(var(--vp-unit-size));
}

.game-item-card table,
.game-item-card table tr,
.game-item-card table td {
  background-color: transparent;
  border: none;
  overflow: visible;
  margin: 0;
}

.game-item-card table tr {
  border-bottom: #373737 var(--vp-unit-size) solid;
}

.game-item-card table td {
  border-right: #373737 var(--vp-unit-size) solid;;
}
</style>
