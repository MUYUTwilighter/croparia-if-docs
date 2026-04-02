<script setup lang="ts">
import {ref, watchEffect} from 'vue'
import {ItemData} from "../type/ItemData";
import GameFloatBox from "./GameFloatBox.vue";
import GameText from "./GameText.vue";

const {
  locale,
  id,
  count = 1,
  link,
  size = 16,
  noFloatBox = false,
} = defineProps<{
  locale: string,
  id: string,
  count?: number,
  link?: string,
  size?: number,
  noFloatBox?: boolean,
}>();

const item = ref<ItemData>(ItemData.createFallbackItem("tagOrId"));

watchEffect(async () => {
  item.value = await ItemData.fetch(id);
});

const hoverBgColor = link || !noFloatBox ? "rgba(255, 255, 255, 0.5)" : "transparent";

</script>

<template>
  <div class="game-item-display">
    <img class="icon" :src="item.largeIconSrc" :alt="item.registerName"/>
    <GameText v-if="count !== 1" class="count">
      {{ count.toString() }}
    </GameText>
    <a v-if="!!link" class="link" :href="link"></a>
    <GameFloatBox class="float-box" v-if="!noFloatBox">
      <GameText class="name">
        {{ item.name[locale] || item.name.en }}
      </GameText>
      <GameText class="creative-tab" color="#5454FC">
        {{ item.CreativeTabName[locale] || item.CreativeTabName.en }}
      </GameText>
      <GameText class="id" color="#545454">
        {{ id }}
      </GameText>
      <slot/>
      <GameText v-for="tag in item.OredictList" class="tag" color="#A7A7A7" font-style="italic">
        {{ `#${tag}` }}
      </GameText>
    </GameFloatBox>
  </div>
</template>

<style scoped>
.game-item-display {
  display: inline-flex;
  position: relative;
}

.game-item-display .count {
  position: absolute;
  right: 0;
  bottom: 0;
}

.game-item-display .link {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.game-item-display .float-box {
  display: none;
  z-index: 1;
}

.game-item-display:hover .float-box {
  display: grid;
  position: absolute;
  top: calc(var(--vp-unit-size) * v-bind(size));
  left: 0;
}

.game-item-display:hover .float-box:hover {
  display: none;
}

.game-item-display .icon {
  image-rendering: pixelated;
  width: calc(var(--vp-unit-size) * v-bind(size));
  height: calc(var(--vp-unit-size) * v-bind(size));
}

.game-item-display:hover .icon {
  background-color: v-bind(hoverBgColor);
}

.game-item-display .name {
  padding-bottom: calc(var(--vp-unit-size) * 2);
}
</style>