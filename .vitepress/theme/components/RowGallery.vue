<template>
  <div class="row-gallery">
    <div class="row-gallery__track">
      <slot/>
    </div>
  </div>
</template>

<style>
.row-gallery {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
}

.row-gallery__track {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1em;
  width: max-content;
  min-width: 100%;
}

.row-gallery__track > * {
  flex: 0 0 auto;
}
</style>
