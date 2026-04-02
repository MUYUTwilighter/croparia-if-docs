<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, ref, watchEffect} from 'vue'
import {ItemData} from "../type/ItemData";
import GameFloatBox from "./GameFloatBox.vue";
import GameText from "./GameText.vue";
import type EntryHook from "../type/EntryHook";

const {
  locale,
  id,
  count = 1,
  link,
  size = 16,
  noFloatBox = false,
  nameHook,
  idHook,
  categoryHook,
  tagHook,
} = defineProps<{
  locale: string,
  id: string,
  count?: number,
  link?: string,
  size?: number,
  noFloatBox?: boolean,
} & EntryHook>();

const item = ref<ItemData>(ItemData.createFallbackItem("tagOrId"));
const displayRef = ref<HTMLElement | null>(null);
const floatBoxRef = ref<InstanceType<typeof GameFloatBox> | null>(null);
const showFloatBox = ref(false);
const floatBoxTop = ref(0);
const floatBoxLeft = ref(0);
let animationFrame = 0;

watchEffect(async () => {
  item.value = await ItemData.fetch(id);
});

const hoverBgColor = link || !noFloatBox ? "rgba(255, 255, 255, 0.5)" : "transparent";
const floatBoxStyle = computed(() => ({
  position: "fixed",
  top: `${floatBoxTop.value}px`,
  left: `${floatBoxLeft.value}px`,
  zIndex: "999",
  pointerEvents: "none",
}));

function cancelPositionUpdate() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
}

function updateFloatBoxPosition() {
  cancelPositionUpdate();
  animationFrame = requestAnimationFrame(() => {
    const display = displayRef.value;
    const floatBox = floatBoxRef.value?.$el as HTMLElement | undefined;
    if (!display || !floatBox) {
      return;
    }

    const displayRect = display.getBoundingClientRect();
    const floatRect = floatBox.getBoundingClientRect();
    const gap = 4;
    const maxLeft = Math.max(gap, window.innerWidth - floatRect.width - gap);
    const maxTop = Math.max(gap, window.innerHeight - floatRect.height - gap);

    floatBoxLeft.value = Math.min(displayRect.left, maxLeft);
    floatBoxTop.value = Math.min(displayRect.bottom + gap, maxTop);
  });
}

async function openFloatBox() {
  if (noFloatBox) {
    return;
  }
  showFloatBox.value = true;
  bindViewportListeners();
  await nextTick();
  updateFloatBoxPosition();
}

function closeFloatBox() {
  showFloatBox.value = false;
  unbindViewportListeners();
  cancelPositionUpdate();
}

function handleViewportChange() {
  if (showFloatBox.value) {
    updateFloatBoxPosition();
  }
}

function bindViewportListeners() {
  if (typeof window === "undefined") {
    return;
  }
  window.addEventListener("scroll", handleViewportChange, true);
  window.addEventListener("resize", handleViewportChange);
}

function unbindViewportListeners() {
  if (typeof window === "undefined") {
    return;
  }
  window.removeEventListener("scroll", handleViewportChange, true);
  window.removeEventListener("resize", handleViewportChange);
}

onBeforeUnmount(() => {
  unbindViewportListeners();
  cancelPositionUpdate();
});

</script>

<template>
  <div ref="displayRef" class="game-item-display" @mouseenter="openFloatBox" @mouseleave="closeFloatBox">
    <img class="icon" :src="item.largeIconSrc" :alt="item.registerName"/>
    <GameText v-if="count !== 1" class="count">
      {{ count.toString() }}
    </GameText>
    <a v-if="!!link" class="link" :href="link"></a>
  </div>
  <Teleport to="body">
    <GameFloatBox ref="floatBoxRef" class="float-box" v-if="showFloatBox && !noFloatBox" :style="floatBoxStyle">
      <GameText v-if="nameHook" class="name">
        {{ nameHook(item.name[locale] || item.name.en) }}
      </GameText>
      <GameText v-else class="name">
        {{ item.name[locale] || item.name.en }}
      </GameText>

      <GameText v-if="categoryHook" class="creative-tab" color="#5454FC">
        {{ categoryHook(item.CreativeTabName[locale] || item.CreativeTabName.en) }}
      </GameText>
      <GameText v-else class="creative-tab" color="#5454FC">
        {{ item.CreativeTabName[locale] || item.CreativeTabName.en }}
      </GameText>

      <GameText v-if="idHook" class="id" color="#545454">
        {{ idHook(id) }}
      </GameText>
      <GameText v-else class="id" color="#545454">
        {{ id }}
      </GameText>

      <slot/>

      <GameText v-if="tagHook" v-for="tag in tagHook(item.OredictList)" class="tag" color="#A7A7A7" font-style="italic">
        {{ `#${tag}` }}
      </GameText>
      <GameText v-for="tag in item.OredictList" class="tag" color="#A7A7A7" font-style="italic">
        {{ `#${tag}` }}
      </GameText>
    </GameFloatBox>
  </Teleport>
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

.game-item-display .icon {
  image-rendering: pixelated;
  width: calc(var(--vp-unit-size) * v-bind(size));
  height: calc(var(--vp-unit-size) * v-bind(size));
}

.game-item-display:hover .icon {
  background-color: v-bind(hoverBgColor);
}

.float-box .name {
  padding-bottom: calc(var(--vp-unit-size) * 2);
}
</style>
