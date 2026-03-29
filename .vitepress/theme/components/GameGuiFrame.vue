<script setup lang="ts">
</script>

<template>
  <div class="game-gui-frame">
    <div class="border corner left-top"></div>
    <div class="border horizontal top"></div>
    <div class="border corner right-top"></div>

    <div class="border vertical left"></div>
    <div class="content">
      <slot />
    </div>
    <div class="border vertical right"></div>

    <div class="border corner left-bottom"></div>
    <div class="border horizontal bottom"></div>
    <div class="border corner right-bottom"></div>
  </div>
</template>

<style scoped>
.game-gui-frame {
  --frame-size: calc(var(--vp-unit-size) * 4);

  display: inline-grid;
  grid-template-columns: var(--frame-size) auto var(--frame-size);
  grid-template-rows: var(--frame-size) auto var(--frame-size);

  width: fit-content;
  height: fit-content;

  image-rendering: pixelated;
}

/* ===== 通用 ===== */
.game-gui-frame .border {
  background-repeat: no-repeat;
  background-position: center;
  image-rendering: pixelated;
}

/* ===== 四角 ===== */
.game-gui-frame .border.corner {
  width: var(--frame-size);
  height: var(--frame-size);
  background-size: 100% 100%;
}

.left-top {
  background-image: url('public/assets/gui/left-top.png');
}

.right-top {
  background-image: url('public/assets/gui/right-top.png');
}

.left-bottom {
  background-image: url('public/assets/gui/left-bottom.png');
}

.right-bottom {
  background-image: url('public/assets/gui/right-bottom.png');
}

/* ===== 横边 ===== */
.game-gui-frame .border.horizontal {
  height: var(--frame-size);

  background-repeat: repeat-x;
  background-size: auto 100%;

  /* 防止出现偏移缝 */
  background-position: left center;
}

.top {
  background-image: url('public/assets/gui/border-top.png');
}

.bottom {
  background-image: url('public/assets/gui/border-bottom.png');
}

/* ===== 竖边 ===== */
.game-gui-frame .border.vertical {
  width: var(--frame-size);

  background-repeat: repeat-y;
  background-size: 100% auto;

  background-position: center top;
}

.left {
  background-image: url('public/assets/gui/border-left.png');
}

.right {
  background-image: url('public/assets/gui/border-right.png');
}

/* ===== 内容 ===== */
.game-gui-frame .content {
  background-color: #C6C6C6;

  display: flex;
  flex-direction: column;
}
</style>