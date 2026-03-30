<script setup lang="ts">

import GameSlot from "./GameSlot.vue";
import GameItemDisplay from "./GameItemDisplay.vue";
import {ref, watchEffect} from "vue";
import {createFallbackItem, fetchItem, ItemData} from "../type/Item";
import GameText from "./GameText.vue";
import GameGuiFrame from "./GameGuiFrame.vue";

const {
  locale,
  id,
} = defineProps<{
  locale: string,
  id: string,
}>()=

const item = ref<ItemData>(createFallbackItem("tagOrId"));

watchEffect(async () => {
  item.value = await fetchItem(id);
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
const attrLocale = attrLocales[locale] || attrLocales.en;

</script>

<template>
  <GameGuiFrame class="game-item-card">
    <div class="wrapper">
      <GameText class="name" :content="(item.name[locale] || item.name.en)" color="#3F3F3F" fontWeight="bold"
                notFullLine noShadow/>
      <GameItemDisplay class="icon" :id=id :locale=locale :size=64 noFloatBox/>
      <GameSlot>
        <table><tbody>
          <tr>
            <td class="attr"><GameText :content=attrLocale.id color="#3F3F3F" noShadow/></td>
            <td class="value"><GameText :content=item.registerName /></td>
          </tr>
          <tr>
            <td class="attr"><GameText :content=attrLocale.category color="#3F3F3F" noShadow/></td>
            <td class="value"><GameText :content="(item.CreativeTabName[locale] || item.CreativeTabName.en)"/></td>
          </tr>
          <tr v-if="item.OredictList.length > 0">
            <td class="attr"><GameText :content=attrLocale.tag color="#3F3F3F" noShadow/></td>
            <td class="value"><GameText v-for="tag in item.OredictList" :content="`#${tag}`"/></td>
          </tr>
          <tr>
            <td class="attr"><GameText :content=attrLocale.maxStacking color="#3F3F3F" noShadow/></td>
            <td class="value"><GameText :content=item.maxStacksSize.toString() /></td>
          </tr>
          <tr v-if="item.minTool">
            <td class="attr"><GameText :content=attrLocale.minTool color="#3F3F3F" noShadow/></td>
            <td class="value"><GameItemDisplay :id=item.minTool :locale=locale /></td>
          </tr>
        </tbody></table>
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