<script setup lang="ts">
import { createFallbackItem, fetchItem, type ItemData } from "./Item.vue"

export interface Tag {
  replace: boolean
  values: string[]
}

function parseTagName(tagName: string): [string, string] {
  const normalizedTagName = tagName.startsWith('#') ? tagName.slice(1) : tagName
  const [namespace, ...pathParts] = normalizedTagName.split(':')
  const path = pathParts.join(':')
  if (!namespace || !path) throw new Error(`Invalid tag name: ${tagName}`)
  return [namespace, path]
}

function createFallbackTagItem(tagName: string): ItemData {
  return createFallbackItem(tagName, {
    zh: `任何属于 ${tagName} 的物品/方块`,
    en: `Any item/block of ${tagName}`,
    es: tagName
  })
}

export async function fetchItems(tagName: string): Promise<ItemData[]> {
  try {
    const [namespace, path] = parseTagName(tagName)
    const response = await fetch(`/tag/item/${namespace}/${path}.json`)
    if (!response.ok) throw new Error(`Failed to fetch tag ${tagName}`)

    const tag = await response.json() as Tag
    const nestedItems = await Promise.all(
      tag.values.map(async entry => {
        if (entry.startsWith('#')) return fetchItems(entry)
        return [await fetchItem(entry)]
      })
    )

    const items = nestedItems.flat()
    return items.length > 0 ? items : [createFallbackTagItem(tagName)]
  } catch {
    return [createFallbackTagItem(tagName)]
  }
}
</script>
