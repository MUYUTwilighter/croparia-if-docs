<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  locale: 'zh' | 'en'
}>()

type LinkAction = {
  label: string
  href: string
  accent: string
  external?: boolean
}

type DocCard = {
  title: string
  body: string
  href: string
  cta: string
}

type GalleryItem = {
  title: string
  body: string
  image: string
  alt: string
}

type LocalizedContent = {
  overviewLabel: string
  overviewTitle: string
  overviewText: string
  stats: Array<{ label: string; value: string }>
  gettingStartedTitle: string
  gettingStartedText: string
  primaryActions: LinkAction[]
  docsTitle: string
  docsText: string
  docsCards: DocCard[]
  galleryTitle: string
  galleryText: string
  gallery: GalleryItem[]
  helperTitle: string
  helperText: string
  helperChips: string[]
}

const content = computed<LocalizedContent>(() =>
  props.locale === 'zh'
    ? {
        overviewLabel: 'Croparia IF Docs',
        overviewTitle: '先找到你要看的文档，再开始探索模组内容',
        overviewText:
          '首页应该先把读者带到正确入口。这里保留旧站的视觉素材，但内容重心改回文档导航、快速开始和核心玩法预览。',
        stats: [
          { label: '当前维护版本', value: '1.1.0a' },
          { label: '文档主轴', value: 'Croparia IF' },
          { label: '语言入口', value: '简中 / EN' }
        ],
        gettingStartedTitle: '快速开始',
        gettingStartedText:
          '第一次进入站点时，先按读者身份进入对应分类；如果你只是确认模组版本、文档入口或下载地址，也可以直接从这里跳转。',
        primaryActions: [
          { label: '阅读指南', href: '/guide/', accent: 'brand' },
          { label: '版本策略', href: '/versions/', accent: 'soft' },
          { label: 'Modrinth', href: 'https://modrinth.com/mod/croparia-if', accent: 'brand', external: true },
          { label: 'CurseForge', href: 'https://www.curseforge.com/minecraft/mc-mods/croparia-if', accent: 'warm', external: true }
        ],
        docsTitle: '文档地图',
        docsText: '这些入口覆盖了当前站点最重要的几类内容，并按读者角色组织，适合从首页直接进入阅读。',
        docsCards: [
          {
            title: '通用',
            body: '先建立 Croparia IF 1.1.0a 的共同基础认识，包括核心概念、内容总览和清单页。',
            href: '/general/',
            cta: '进入通用文档'
          },
          {
            title: '玩家',
            body: '面向实际游玩的读者，承接入门、推进、机器系统、自动化和常见问题。',
            href: '/player/',
            cta: '进入玩家文档'
          },
          {
            title: '整合与开发',
            body: '面向整合包作者与下游开发者，覆盖自定义入口、架构、API 与调试信息。',
            href: '/modpack/',
            cta: '查看技术文档'
          }
        ],
        galleryTitle: '核心玩法预览',
        galleryText: '旧站最有辨识度的玩法画面仍然保留，用来帮助读者在进入正文前快速建立内容印象。',
        gallery: [
          {
            title: '种植与资源循环',
            body: 'Croparia IF 的核心不只是种田，而是围绕资源作物展开一整套成长与产出循环。',
            image: '/home/greenhouse-place.webp',
            alt: 'Greenhouse gameplay screenshot'
          },
          {
            title: 'Infusor 与加工推进',
            body: '装置玩法负责把资源农业推进到更完整的生产链，也是后续文档的重要主题。',
            image: '/home/place-infusor.webp',
            alt: 'Infusor placement screenshot'
          },
          {
            title: 'Ritual 与高阶目标',
            body: '仪式结构和高阶配方提供了更后期的玩法目标，也构成模组的重要识别点。',
            image: '/home/ritual-1-3.webp',
            alt: 'Ritual structure screenshot'
          }
        ],
        helperTitle: '常用信息',
        helperText: '如果你只是想先确认当前文档环境，下面这些信息通常已经够用。',
        helperChips: [
          '当前维护的 Croparia IF 版本：1.1.0a',
          '版本主轴：Croparia IF 模组版本',
          '支持语言：简体中文 / English',
          '下载平台：Modrinth / CurseForge'
        ]
      }
    : {
        overviewLabel: 'Croparia IF Docs',
        overviewTitle: 'Find the right page first, then dive into the mod',
        overviewText:
          'A docs homepage should guide readers into the right section quickly. This version keeps the old site visuals, but shifts the focus back to documentation entry points and gameplay overview.',
        stats: [
          { label: 'Current release', value: '1.1.0a' },
          { label: 'Version axis', value: 'Croparia IF' },
          { label: 'Locales', value: 'ZH / EN' }
        ],
        gettingStartedTitle: 'Quick Start',
        gettingStartedText:
          'Start with the audience section that matches your role. If you only need release context, doc entry points, or download links, the main shortcuts are right here.',
        primaryActions: [
          { label: 'Read the Guide', href: '/en/guide/', accent: 'brand' },
          { label: 'Versioning Policy', href: '/en/versions/', accent: 'soft' },
          { label: 'Modrinth', href: 'https://modrinth.com/mod/croparia-if', accent: 'brand', external: true },
          { label: 'CurseForge', href: 'https://www.curseforge.com/minecraft/mc-mods/croparia-if', accent: 'warm', external: true }
        ],
        docsTitle: 'Documentation Map',
        docsText: 'These entry points cover the most important sections of the current site and are organized around reader needs.',
        docsCards: [
          {
            title: 'General',
            body: 'Build a shared baseline for Croparia IF 1.1.0a through concepts, overviews, and searchable reference pages.',
            href: '/en/general/',
            cta: 'Open general docs'
          },
          {
            title: 'Player',
            body: 'Focused on practical play guidance, progression, machines, automation, and common gameplay questions.',
            href: '/en/player/',
            cta: 'Open player docs'
          },
          {
            title: 'Modpack and Developer',
            body: 'For pack authors and downstream developers who need customization entry points, architecture, APIs, and debugging notes.',
            href: '/en/modpack/',
            cta: 'Open technical docs'
          }
        ],
        galleryTitle: 'Gameplay Preview',
        galleryText: 'The strongest screenshots from the old site are still useful here as a quick visual introduction to the mod.',
        gallery: [
          {
            title: 'Farming and resource loops',
            body: 'The mod is not just about growing crops, but about building a broader progression loop around resource agriculture.',
            image: '/home/greenhouse-place.webp',
            alt: 'Greenhouse gameplay screenshot'
          },
          {
            title: 'Infusor and production steps',
            body: 'Machine-driven progression expands the farming loop into a fuller processing chain and becomes a major docs topic.',
            image: '/home/place-infusor.webp',
            alt: 'Infusor placement screenshot'
          },
          {
            title: 'Rituals and advanced progression',
            body: 'Ritual structures and higher-tier recipes frame the later goals of the mod and help define its identity.',
            image: '/home/ritual-1-3.webp',
            alt: 'Ritual structure screenshot'
          }
        ],
        helperTitle: 'Quick Facts',
        helperText: 'If you only need the current docs context before reading deeper, these are the key facts to keep in mind.',
        helperChips: [
          'Current Croparia IF release: 1.1.0a',
          'Primary version axis: Croparia IF mod version',
          'Locales: Simplified Chinese / English',
          'Downloads: Modrinth / CurseForge'
        ]
      }
)
</script>

<template>
  <div class="home-landing">
    <section class="home-landing__intro">
      <div class="home-landing__copy">
        <p class="home-landing__eyebrow">{{ content.overviewLabel }}</p>
        <h2>{{ content.overviewTitle }}</h2>
        <p class="home-landing__lead">{{ content.overviewText }}</p>
      </div>
      <dl class="home-landing__stats">
        <div v-for="stat in content.stats" :key="stat.label" class="home-landing__stat">
          <dt>{{ stat.label }}</dt>
          <dd>{{ stat.value }}</dd>
        </div>
      </dl>
    </section>

    <section class="home-landing__platforms">
      <div>
        <h2>{{ content.gettingStartedTitle }}</h2>
        <p>{{ content.gettingStartedText }}</p>
      </div>
      <div class="home-landing__platform-list">
        <a
          v-for="action in content.primaryActions"
          :key="action.label"
          :class="['home-landing__platform', `is-${action.accent}`]"
          :href="action.href"
          :target="action.external ? '_blank' : undefined"
          :rel="action.external ? 'noreferrer' : undefined"
        >
          {{ action.label }}
        </a>
      </div>
    </section>

    <section class="home-landing__section-copy">
      <p class="home-landing__eyebrow">{{ props.locale === 'zh' ? 'Documentation Map' : 'Documentation Map' }}</p>
      <h2>{{ content.docsTitle }}</h2>
      <p>{{ content.docsText }}</p>
    </section>

    <section class="home-landing__cards">
      <a
        v-for="card in content.docsCards"
        :key="card.title"
        class="home-landing__card home-landing__doc-card"
        :href="card.href"
      >
        <h3>{{ card.title }}</h3>
        <p>{{ card.body }}</p>
        <span>{{ card.cta }}</span>
      </a>
    </section>

    <section class="home-landing__section-copy">
      <p class="home-landing__eyebrow">{{ props.locale === 'zh' ? 'Gameplay Preview' : 'Gameplay Preview' }}</p>
      <h2>{{ content.galleryTitle }}</h2>
      <p>{{ content.galleryText }}</p>
    </section>

    <section class="home-landing__gallery">
      <article v-for="item in content.gallery" :key="item.title" class="home-landing__gallery-item">
        <div class="home-landing__image-frame">
          <img :src="item.image" :alt="item.alt" loading="lazy" />
        </div>
        <div class="home-landing__gallery-text">
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </div>
      </article>
    </section>

    <section class="home-landing__helper">
      <div class="home-landing__helper-copy">
        <p class="home-landing__eyebrow">{{ props.locale === 'zh' ? 'Quick Facts' : 'Quick Facts' }}</p>
        <h2>{{ content.helperTitle }}</h2>
        <p>{{ content.helperText }}</p>
        <div class="home-landing__chips">
          <span v-for="chip in content.helperChips" :key="chip" class="home-landing__chip">{{ chip }}</span>
        </div>
      </div>
      <div class="home-landing__helper-visual">
        <img src="/home/arch.webp" alt="Architectury logo" loading="lazy" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-landing {
  display: grid;
  gap: 32px;
  margin: 0 auto 72px;
}

.home-landing__intro,
.home-landing__platforms,
.home-landing__helper {
  display: grid;
  gap: 24px;
  align-items: start;
}

.home-landing__intro {
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
}

.home-landing__copy,
.home-landing__platforms,
.home-landing__cards,
.home-landing__section-copy,
.home-landing__helper {
  border: 1px solid rgba(129, 168, 87, 0.18);
  background: linear-gradient(180deg, rgba(253, 252, 247, 0.96), rgba(248, 245, 235, 0.93));
  border-radius: 28px;
  box-shadow: 0 26px 60px rgba(37, 53, 33, 0.08);
}

.dark .home-landing__copy,
.dark .home-landing__platforms,
.dark .home-landing__cards,
.dark .home-landing__section-copy,
.dark .home-landing__helper {
  background: linear-gradient(180deg, rgba(31, 41, 31, 0.9), rgba(22, 29, 23, 0.9));
  border-color: rgba(164, 202, 124, 0.2);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.3);
}

.home-landing__copy,
.home-landing__platforms,
.home-landing__section-copy,
.home-landing__helper {
  padding: 30px;
}

.home-landing__eyebrow {
  margin: 0 0 10px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.home-landing h2,
.home-landing h3,
.home-landing p,
.home-landing dl {
  margin: 0;
}

.home-landing__lead,
.home-landing__platforms p,
.home-landing__section-copy p:last-child,
.home-landing__gallery-text p,
.home-landing__helper-copy p:last-of-type,
.home-landing__card p {
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.home-landing__stats {
  display: grid;
  gap: 14px;
}

.home-landing__stat {
  padding: 18px 20px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(129, 168, 87, 0.16);
}

.dark .home-landing__stat {
  background: rgba(255, 255, 255, 0.04);
}

.home-landing__stat dt {
  margin-bottom: 6px;
  font-size: 0.84rem;
  color: var(--vp-c-text-2);
}

.home-landing__stat dd {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.home-landing__platform-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.home-landing__platform {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 132px;
  padding: 12px 18px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.home-landing__platform:hover {
  transform: translateY(-2px);
}

.home-landing__platform.is-brand {
  color: #14311a;
  background: linear-gradient(135deg, #b8e986, #81c784);
  box-shadow: 0 12px 30px rgba(129, 199, 132, 0.28);
}

.home-landing__platform.is-soft {
  color: #23361d;
  background: linear-gradient(135deg, #edf2d8, #dce8c1);
  box-shadow: 0 12px 30px rgba(198, 214, 165, 0.22);
}

.home-landing__platform.is-warm {
  color: #48210d;
  background: linear-gradient(135deg, #ffd484, #ffb36c);
  box-shadow: 0 12px 30px rgba(255, 179, 108, 0.28);
}

.home-landing__cards {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 16px;
}

.home-landing__card {
  padding: 24px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(129, 168, 87, 0.15);
}

.dark .home-landing__card {
  background: rgba(255, 255, 255, 0.03);
}

.home-landing__doc-card {
  display: block;
  color: inherit;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.home-landing__doc-card:hover {
  transform: translateY(-4px);
  border-color: rgba(111, 152, 82, 0.4);
  box-shadow: 0 24px 48px rgba(37, 53, 33, 0.12);
}

.home-landing__card h3,
.home-landing__gallery-text h3,
.home-landing__helper-copy h2,
.home-landing__section-copy h2,
.home-landing__copy h2,
.home-landing__platforms h2 {
  margin-bottom: 10px;
}

.home-landing__doc-card span {
  display: inline-flex;
  margin-top: 14px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.home-landing__gallery {
  display: grid;
  gap: 22px;
}

.home-landing__gallery-item {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 22px;
  align-items: center;
}

.home-landing__gallery-item:nth-child(even) {
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
}

.home-landing__gallery-item:nth-child(even) .home-landing__image-frame {
  order: 2;
}

.home-landing__gallery-item:nth-child(even) .home-landing__gallery-text {
  order: 1;
}

.home-landing__image-frame,
.home-landing__gallery-text {
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(129, 168, 87, 0.18);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(246, 241, 227, 0.82));
  box-shadow: 0 24px 50px rgba(37, 53, 33, 0.08);
}

.dark .home-landing__image-frame,
.dark .home-landing__gallery-text {
  background: linear-gradient(180deg, rgba(31, 41, 31, 0.92), rgba(22, 29, 23, 0.9));
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28);
}

.home-landing__image-frame img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
}

.home-landing__gallery-text {
  padding: 26px;
}

.home-landing__helper {
  grid-template-columns: minmax(0, 1.3fr) minmax(220px, 0.7fr);
}

.home-landing__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.home-landing__chip {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(129, 168, 87, 0.18);
  color: var(--vp-c-text-2);
}

.dark .home-landing__chip {
  background: rgba(255, 255, 255, 0.04);
}

.home-landing__helper-visual {
  display: grid;
  place-items: center;
  padding: 30px;
  border-radius: 24px;
  background: radial-gradient(circle at center, rgba(173, 219, 130, 0.26), rgba(173, 219, 130, 0));
}

.home-landing__helper-visual img {
  width: min(180px, 100%);
  height: auto;
}

@media (max-width: 960px) {
  .home-landing__intro,
  .home-landing__helper,
  .home-landing__gallery-item,
  .home-landing__gallery-item:nth-child(even) {
    grid-template-columns: 1fr;
  }

  .home-landing__gallery-item:nth-child(even) .home-landing__image-frame,
  .home-landing__gallery-item:nth-child(even) .home-landing__gallery-text {
    order: initial;
  }

  .home-landing__cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .home-landing {
    gap: 22px;
    margin-bottom: 52px;
  }

  .home-landing__copy,
  .home-landing__platforms,
  .home-landing__section-copy,
  .home-landing__helper,
  .home-landing__gallery-text {
    padding: 22px;
  }

  .home-landing__cards {
    padding: 12px;
  }

  .home-landing__card {
    padding: 20px;
  }

  .home-landing__image-frame img {
    min-height: 220px;
  }
}
</style>
