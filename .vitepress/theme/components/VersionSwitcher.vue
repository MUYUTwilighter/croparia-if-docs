<script setup lang="ts">
import { computed } from 'vue'

import { useVersioning } from '../composables/useVersioning'

const { activeVersionSlug, navigateToVersion, versions } = useVersioning()

const selectedVersionSlug = computed(() => activeVersionSlug.value)

async function onVersionChange(event: Event) {
  const nextVersionSlug = (event.target as HTMLSelectElement).value

  if (!nextVersionSlug || nextVersionSlug === selectedVersionSlug.value) {
    return
  }

  await navigateToVersion(nextVersionSlug)
}
</script>

<template>
  <div
    v-if="versions.length > 1"
    class="version-switcher"
  >
    <label
      class="version-switcher__label"
      for="doc-version-switcher"
    >
      版本
    </label>
    <select
      id="doc-version-switcher"
      class="version-switcher__select"
      :value="selectedVersionSlug"
      @change="onVersionChange"
    >
      <option
        v-for="version in versions"
        :key="version.slug"
        :value="version.slug"
      >
        {{ version.label }}
      </option>
    </select>
  </div>
</template>
