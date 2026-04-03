<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, ref, toRef, useAttrs, watchEffect} from 'vue'
import {ItemData} from "../type/ItemData";
import GameFloatBox from "./GameFloatBox.vue";
import GameText from "./GameText.vue";
import type EntryHook from "../type/EntryHook";
import { useLocale } from "../composables/useLocale";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{
  locale?: string,
  id: string,
  count?: number,
  link?: string,
  size?: number,
  noFloatBox?: boolean,
} & EntryHook>(), {
  count: 1,
  size: 16,
  noFloatBox: false,
});

const item = ref<ItemData>(ItemData.createFallbackItem("tagOrId"));
const displayRef = ref<HTMLElement | null>(null);
const floatBoxRef = ref<InstanceType<typeof GameFloatBox> | null>(null);
const showFloatBox = ref(false);
const floatBoxTop = ref(0);
const floatBoxLeft = ref(0);
let animationFrame = 0;
const locale = useLocale(toRef(props, "locale"));
const attrs = useAttrs();

watchEffect(async () => {
  item.value = await ItemData.fetch(props.id);
});

const hoverBgColor = props.link || !props.noFloatBox ? "rgba(255, 255, 255, 0.5)" : "transparent";
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
  if (props.noFloatBox) {
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
  <div
    ref="displayRef"
    class="game-item-display"
    v-bind="attrs"
    @mouseenter="openFloatBox"
    @mouseleave="closeFloatBox"
  >
    <img class="icon" :src="item.largeIconSrc" :alt="item.registerName"/>
    <GameText v-if="props.count !== 1" class="count">
      {{ props.count.toString() }}
    </GameText>
    <a v-if="!!props.link" class="link" :href="props.link"></a>
  </div>
  <Teleport to="body">
    <GameFloatBox ref="floatBoxRef" class="float-box" v-if="showFloatBox && !props.noFloatBox" :style="floatBoxStyle">
      <GameText v-if="props.nameHook" class="name">
        {{ props.nameHook(item.name[locale] || item.name.en) }}
      </GameText>
      <GameText v-else class="name">
        {{ item.name[locale] || item.name.en }}
      </GameText>

      <GameText v-if="props.categoryHook" class="creative-tab" color="#5454FC">
        {{ props.categoryHook(item.CreativeTabName[locale] || item.CreativeTabName.en) }}
      </GameText>
      <GameText v-else class="creative-tab" color="#5454FC">
        {{ item.CreativeTabName[locale] || item.CreativeTabName.en }}
      </GameText>

      <GameText v-if="props.idHook" class="id" color="#545454">
        {{ props.idHook(props.id) }}
      </GameText>
      <GameText v-else class="id" color="#545454">
        {{ props.id }}
      </GameText>

      <slot/>

      <GameText v-if="props.tagHook" v-for="tag in props.tagHook(item.OredictList)" class="tag" color="#A7A7A7" font-style="italic">
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
  width: calc(var(--vp-unit-size) * v-bind('props.size'));
  height: calc(var(--vp-unit-size) * v-bind('props.size'));
}

.game-item-display:hover .icon {
  background-color: v-bind(hoverBgColor);
}

.float-box .name {
  padding-bottom: calc(var(--vp-unit-size) * 2);
}
</style>
