<script setup lang="ts">
</script>

<template>
  <div class="mc-box">
    <!-- 第一行 -->
    <div></div>
    <div class="outer h"></div>
    <div class="outer h"></div>
    <div class="outer h"></div>
    <div></div>

    <!-- 第二行 -->
    <div class="outer v"></div>
    <div class="inner h top"></div>
    <div class="inner h top"></div>
    <div class="inner h top"></div>
    <div class="outer v"></div>

    <!-- 第三行 -->
    <div class="outer v"></div>
    <div class="inner v"></div>
    <div class="content">
      <slot />
    </div>
    <div class="inner v"></div>
    <div class="outer v"></div>

    <!-- 第四行 -->
    <div class="outer v"></div>
    <div class="inner h bottom"></div>
    <div class="inner h bottom"></div>
    <div class="inner h bottom"></div>
    <div class="outer v"></div>

    <!-- 第五行 -->
    <div></div>
    <div class="outer h"></div>
    <div class="outer h"></div>
    <div class="outer h"></div>
    <div></div>
  </div>
</template>

<style scoped>
.mc-box {
  --outer: var(--vp-unit-size);
  --inner: var(--vp-unit-size);

  --outer-color: rgba(16, 0, 16, 0.94);
  --inner-top: rgba(37, 0, 94, 0.96);
  --inner-bottom: rgba(24, 0, 53, 0.96);
  --bg: rgba(16, 0, 16, 0.94);

  display: grid;

  /* 5×5 */
  grid-template-columns:
    var(--vp-unit-size)
    var(--vp-unit-size)
    auto
    var(--vp-unit-size)
    var(--vp-unit-size);

  grid-template-rows:
    var(--vp-unit-size)
    var(--vp-unit-size)
    auto
    var(--vp-unit-size)
    var(--vp-unit-size);

  width: fit-content;
}

/* ===== 外边框 ===== */

.outer.h {
  height: var(--vp-unit-size);
  background: var(--outer-color);
}

.outer.v {
  width: var(--vp-unit-size);
  background: var(--outer-color);
}

/* ===== 内边框 ===== */

.inner.h.top {
  height: var(--vp-unit-size);
  background: var(--inner-top);
}

.inner.h.bottom {
  height: var(--vp-unit-size);
  background: var(--inner-bottom);
}

.inner.v {
  width: var(--vp-unit-size);
  background: linear-gradient(
      to bottom,
      var(--inner-top),
      var(--inner-bottom)
  );
}

.content {
  padding: var(--vp-unit-size);
  background: var(--bg);
  display: flex;
  align-items: center;
}
</style>