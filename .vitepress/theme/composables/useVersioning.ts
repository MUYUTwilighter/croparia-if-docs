import { computed, onMounted, ref, watch } from 'vue'
import { useData, useRoute, useRouter } from 'vitepress'

const STORAGE_KEY = 'croparia-docs-preferred-version'

type VersionStatus = 'current' | 'sts' | 'lts'

interface VersionNavItem {
  slug: string
  label: string
  status: VersionStatus
}

interface VersioningThemeConfig {
  currentVersionSlug: string
  versions: VersionNavItem[]
  archivedRouteManifest: Record<string, string[]>
  versionFallbackChains: Record<string, string[]>
}

function isClient() {
  return typeof window !== 'undefined'
}

function readStoredVersion() {
  if (!isClient()) {
    return null
  }

  return window.localStorage.getItem(STORAGE_KEY)
}

function writeStoredVersion(versionSlug: string) {
  if (!isClient()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, versionSlug)
}

function stripVersionPrefix(routePath: string) {
  const match = routePath.match(/^\/versions\/[^/]+(\/.*)?$/)

  if (!match) {
    return routePath
  }

  return match[1] || '/'
}

function versionRouteRoot(versionSlug: string) {
  return `/versions/${versionSlug}`
}

function buildArchivedVersionPath(versionSlug: string, routePath: string) {
  const versionRoot = versionRouteRoot(versionSlug)
  return routePath === '/' ? `${versionRoot}/` : `${versionRoot}${routePath}`
}

export function useVersioning() {
  const { theme } = useData()
  const route = useRoute()
  const router = useRouter()
  const preferredVersionSlug = ref<string | null>(null)
  const isSynchronizing = ref(false)

  const versioning = computed(() => theme.value.versioning as VersioningThemeConfig | undefined)
  const versions = computed(() => versioning.value?.versions ?? [])
  const currentVersionSlug = computed(() => versioning.value?.currentVersionSlug ?? '')
  const archivedRouteManifest = computed(() => versioning.value?.archivedRouteManifest ?? {})
  const versionFallbackChains = computed(() => versioning.value?.versionFallbackChains ?? {})
  const explicitVersionSlug = computed(() => route.path.match(/^\/versions\/([^/]+)(?:\/|$)/)?.[1] ?? null)
  const baseRoutePath = computed(() => stripVersionPrefix(route.path))

  const activeVersionSlug = computed(() => {
    if (
      preferredVersionSlug.value &&
      resolvePathForVersion(preferredVersionSlug.value, baseRoutePath.value) === route.path
    ) {
      return preferredVersionSlug.value
    }

    if (explicitVersionSlug.value) {
      return explicitVersionSlug.value
    }

    return preferredVersionSlug.value ?? currentVersionSlug.value
  })

  function versionExists(versionSlug: string) {
    return versions.value.some((version) => version.slug === versionSlug)
  }

  function hasArchivedOverride(versionSlug: string, routePath: string) {
    return archivedRouteManifest.value[versionSlug]?.includes(routePath) ?? false
  }

  function getVersionFallbackChain(versionSlug: string) {
    return versionFallbackChains.value[versionSlug] ?? [versionSlug]
  }

  function resolvePathForVersion(versionSlug: string, routePath: string) {
    if (versionSlug === currentVersionSlug.value) {
      const fallbackChain = getVersionFallbackChain(versionSlug).slice(1)

      for (const fallbackVersionSlug of fallbackChain) {
        if (hasArchivedOverride(fallbackVersionSlug, routePath)) {
          return buildArchivedVersionPath(fallbackVersionSlug, routePath)
        }
      }

      return routePath
    }

    for (const fallbackVersionSlug of getVersionFallbackChain(versionSlug)) {
      if (hasArchivedOverride(fallbackVersionSlug, routePath)) {
        return buildArchivedVersionPath(fallbackVersionSlug, routePath)
      }
    }

    return routePath
  }

  async function navigateToVersion(versionSlug: string) {
    writeStoredVersion(versionSlug)
    preferredVersionSlug.value = versionSlug

    const targetPath = resolvePathForVersion(versionSlug, baseRoutePath.value)

    if (targetPath === route.path) {
      return
    }

    await router.go(targetPath)
  }

  async function syncPreferredVersionRoute() {
    const preferredVersion = preferredVersionSlug.value

    if (
      isSynchronizing.value ||
      !preferredVersion ||
      explicitVersionSlug.value
    ) {
      return
    }

    const targetPath = resolvePathForVersion(preferredVersion, baseRoutePath.value)

    if (targetPath === route.path || !targetPath.startsWith('/versions/')) {
      return
    }

    isSynchronizing.value = true

    try {
      await router.go(targetPath)
    } finally {
      isSynchronizing.value = false
    }
  }

  onMounted(() => {
    const storedVersion = readStoredVersion()

    if (storedVersion && versionExists(storedVersion)) {
      preferredVersionSlug.value = storedVersion
    } else {
      preferredVersionSlug.value = currentVersionSlug.value
    }
  })

  watch(
    () => route.path,
    async () => {
      if (explicitVersionSlug.value) {
        const preferredVersion = preferredVersionSlug.value

        if (
          preferredVersion &&
          resolvePathForVersion(preferredVersion, baseRoutePath.value) === route.path
        ) {
          writeStoredVersion(preferredVersion)
          return
        }

        writeStoredVersion(explicitVersionSlug.value)
        preferredVersionSlug.value = explicitVersionSlug.value
        return
      }

      await syncPreferredVersionRoute()
    },
    { immediate: true }
  )

  watch(preferredVersionSlug, async () => {
    await syncPreferredVersionRoute()
  })

  return {
    activeVersionSlug,
    baseRoutePath,
    currentVersionSlug,
    navigateToVersion,
    resolvePathForVersion,
    versions
  }
}
