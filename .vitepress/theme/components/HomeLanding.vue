<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps<{
  locale: 'zh' | 'en'
}>()

type LinkAction = {
  label: string
  href: string
  accent: string
  external?: boolean
}

type NavCard = {
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
  introLabel: string
  introTitle: string
  introText: string
  downloadTitle: string
  downloadText: string
  downloadActions: LinkAction[]
  supportTitle: string
  supportText: string
  supportActions: LinkAction[]
  navTitle: string
  navText: string
  navCards: NavCard[]
  galleryTitle: string
  galleryText: string
  gallery: GalleryItem[]
}

const content = computed<LocalizedContent>(() =>
  props.locale === 'zh'
    ? {
        introLabel: 'Croparia IF',
        introTitle: '围绕资源作物、装置推进与强自定义能力展开的农业模组',
        introText:
          'Croparia IF 以资源作物、生长循环和装置推进为主要玩法，同时它最初也正是为了摆脱原版 Croparia 中大量难以修改的硬编码而诞生，因此作物、配方、装置与整体玩法循环都更容易扩展与调整。',
        downloadTitle: '下载模组',
        downloadText: '从常用发行平台获取 Croparia IF，然后继续阅读下方文档。',
        downloadActions: [
          { label: 'Modrinth', href: 'https://modrinth.com/mod/croparia-if', accent: 'brand', external: true },
          { label: 'CurseForge', href: 'https://www.curseforge.com/minecraft/mc-mods/croparia-if', accent: 'warm', external: true },
          { label: 'GitHub', href: 'https://github.com/MUYU-Twilighter/croparia-if', accent: 'dark', external: true }
        ],
        supportTitle: '社区与反馈',
        supportText: '如果你想查看模组主页、提交问题或加入交流社区，可以使用下面这些入口。',
        supportActions: [
          { label: 'MCMOD', href: 'https://www.mcmod.cn/class/13639.html', accent: 'warm', external: true },
          { label: 'Discord', href: 'https://discord.gg/JunKeKCJAY', accent: 'brand', external: true },
          { label: 'QQ 反馈群', href: 'https://qm.qq.com/q/OedneeO0Uw', accent: 'dark', external: true }
        ],
        navTitle: '文档导航',
        navText: '按你当前的目标进入对应栏目即可。',
        navCards: [
          {
            title: '通用',
            body: '查看核心概念、内容总览、方块物品和基础资料。',
            href: '/general/',
            cta: '进入通用文档'
          },
          {
            title: '玩家',
            body: '查看入门、推进、机器系统、自动化和常见问题。',
            href: '/player/',
            cta: '进入玩家文档'
          },
          {
            title: '整合包作者',
            body: '查看自定义能力、数据包、资源包、配方与工具。',
            href: '/modpack/',
            cta: '进入整合包文档'
          },
          {
            title: '开发者',
            body: '查看架构、注册体系、数据模型、API 与兼容层。',
            href: '/developer/',
            cta: '进入开发者文档'
          }
        ],
        galleryTitle: '玩法预览',
        galleryText: '这些画面展示了 Croparia IF 最有代表性的几个阶段。',
        gallery: [
          {
            title: '资源种植',
            body: '挖掘矿石，制作魔种，建立初步的农业资源循环。',
            image: '/home/feat-1.webp',
            alt: 'Resource farming screenshot'
          },
          {
            title: '装置与加工',
            body: '借助作物嬗变仪、高阶仪式实现自动化资源量产与道具的制作。',
            image: '/home/feat-2.webp',
            alt: 'Machines and processing screenshot'
          },
          {
            title: '整合包自定义',
            body: '配方生成器、Generator API 等工具帮助你丰富整合包的玩法。',
            image: '/home/feat-3.webp',
            alt: 'Modpack customization screenshot'
          }
        ]
      }
    : {
        introLabel: 'Croparia IF',
        introTitle: 'An agriculture mod built around resource crops, machine progression, and deep customization',
        introText:
          'Croparia IF is built around resource crops, growth loops, and machine-driven progression, while its strong customization comes from the fact that it was originally created to move beyond the hardcoded limits of the original Croparia. Crops, recipes, machines, and the overall progression loop are all easier to extend and adjust.',
        downloadTitle: 'Download the Mod',
        downloadText: 'Get Croparia IF from the main release platforms, then continue into the docs below.',
        downloadActions: [
          { label: 'Modrinth', href: 'https://modrinth.com/mod/croparia-if', accent: 'brand', external: true },
          { label: 'CurseForge', href: 'https://www.curseforge.com/minecraft/mc-mods/croparia-if', accent: 'warm', external: true },
          { label: 'GitHub', href: 'https://github.com/MUYU-Twilighter/croparia-if', accent: 'dark', external: true }
        ],
        supportTitle: 'Community and Feedback',
        supportText: 'Use these links to open the mod page, report issues, or join the community channels.',
        supportActions: [
          { label: 'MCMOD', href: 'https://www.mcmod.cn/class/13639.html', accent: 'warm', external: true },
          { label: 'Discord', href: 'https://discord.gg/JunKeKCJAY', accent: 'brand', external: true },
          { label: 'QQ Support', href: 'https://qm.qq.com/q/OedneeO0Uw', accent: 'dark', external: true }
        ],
        navTitle: 'Documentation Navigation',
        navText: 'Choose the section that matches your goal and jump straight into the relevant docs.',
        navCards: [
          {
            title: 'General',
            body: 'Read the core concepts, content overview, blocks and items, and other foundational references.',
            href: '/en/general/',
            cta: 'Open general docs'
          },
          {
            title: 'Player',
            body: 'Read getting started guides, progression paths, machines, automation, and common questions.',
            href: '/en/player/',
            cta: 'Open player docs'
          },
          {
            title: 'Modpack Authors',
            body: 'Read customization docs for datapacks, resource packs, crops, recipes, and tools.',
            href: '/en/modpack/',
            cta: 'Open modpack docs'
          },
          {
            title: 'Developer',
            body: 'Read architecture, registrations, data models, APIs, and compatibility notes.',
            href: '/en/developer/',
            cta: 'Open developer docs'
          }
        ],
        galleryTitle: 'Gameplay Preview',
        galleryText: 'These screenshots highlight a few of the most recognizable parts of Croparia IF.',
        gallery: [
          {
            title: 'Resource farming',
            body: 'Mine ores, craft magic seeds, and establish the first stage of the agricultural resource loop.',
            image: '/home/feat-1.webp',
            alt: 'Resource farming screenshot'
          },
          {
            title: 'Machines and processing',
            body: 'Use the Crop Transmuter and advanced rituals to automate large-scale resource production and item crafting.',
            image: '/home/feat-2.webp',
            alt: 'Machines and processing screenshot'
          },
          {
            title: 'Modpack customization',
            body: 'Tools like the recipe generator and Generator API help you expand and enrich modpack gameplay.',
            image: '/home/feat-3.webp',
            alt: 'Modpack customization screenshot'
          }
        ]
      }
)

function resolveImage(path: string): string {
  return withBase(path)
}
</script>

<template>
  <div class="home-landing">
    <section id="home-downloads" class="home-landing__downloads">
      <div class="home-landing__download-block">
        <div>
          <p class="home-landing__eyebrow">{{ props.locale === 'zh' ? 'Downloads' : 'Downloads' }}</p>
          <h3>{{ content.downloadTitle }}</h3>
          <p>{{ content.downloadText }}</p>
        </div>
        <div class="home-landing__platform-list">
          <a
            v-for="action in content.downloadActions"
            :key="action.label"
            :class="['home-landing__platform', `is-${action.accent}`]"
            :href="action.href"
            :target="action.external ? '_blank' : undefined"
            :rel="action.external ? 'noreferrer' : undefined"
          >
            {{ action.label }}
          </a>
        </div>
      </div>
    </section>

    <section class="home-landing__panel">
      <div class="home-landing__section-head">
        <p class="home-landing__eyebrow">{{ props.locale === 'zh' ? 'Community' : 'Community' }}</p>
        <h2>{{ content.supportTitle }}</h2>
        <p>{{ content.supportText }}</p>
      </div>
      <div class="home-landing__platform-list">
        <a
          v-for="action in content.supportActions"
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

    <section id="home-navigation" class="home-landing__panel">
      <div class="home-landing__section-head">
        <p class="home-landing__eyebrow">{{ props.locale === 'zh' ? 'Navigation' : 'Navigation' }}</p>
        <h2>{{ content.navTitle }}</h2>
        <p>{{ content.navText }}</p>
      </div>
      <div class="home-landing__cards">
        <a
          v-for="card in content.navCards"
          :key="card.title"
          class="home-landing__card home-landing__doc-card"
          :href="card.href"
        >
          <h3>{{ card.title }}</h3>
          <p>{{ card.body }}</p>
          <span>{{ card.cta }}</span>
        </a>
      </div>
    </section>

    <section class="home-landing__panel">
      <div class="home-landing__section-head">
        <p class="home-landing__eyebrow">{{ props.locale === 'zh' ? 'Gameplay Preview' : 'Gameplay Preview' }}</p>
        <h2>{{ content.galleryTitle }}</h2>
        <p>{{ content.galleryText }}</p>
      </div>
      <div class="home-landing__gallery">
        <article v-for="item in content.gallery" :key="item.title" class="home-landing__gallery-item">
          <div class="home-landing__image-frame">
            <img :src="resolveImage(item.image)" :alt="item.alt" loading="lazy" />
          </div>
          <div class="home-landing__gallery-text">
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-landing {
  display: grid;
  gap: 28px;
  margin: 0 auto 72px;
}

.home-landing__downloads,
.home-landing__panel {
  border: 1px solid rgba(129, 168, 87, 0.18);
  background: linear-gradient(180deg, rgba(253, 252, 247, 0.96), rgba(248, 245, 235, 0.93));
  border-radius: 28px;
  box-shadow: 0 26px 60px rgba(37, 53, 33, 0.08);
}

.dark .home-landing__downloads,
.dark .home-landing__panel {
  background: linear-gradient(180deg, rgba(31, 41, 31, 0.9), rgba(22, 29, 23, 0.9));
  border-color: rgba(164, 202, 124, 0.2);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.3);
}

.home-landing__downloads,
.home-landing__panel {
  padding: 30px;
}

.home-landing__section-head {
  margin-bottom: 20px;
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
.home-landing p {
  margin: 0;
}

.home-landing__lead,
.home-landing__download-block p,
.home-landing__section-head p:last-child,
.home-landing__gallery-text p,
.home-landing__card p {
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.home-landing__download-block {
  display: grid;
  gap: 18px;
  padding-top: 20px;
  border-top: 1px solid rgba(129, 168, 87, 0.16);
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

.home-landing__platform.is-warm {
  color: #48210d;
  background: linear-gradient(135deg, #ffd484, #ffb36c);
  box-shadow: 0 12px 30px rgba(255, 179, 108, 0.28);
}

.home-landing__platform.is-dark {
  color: #f6f2df;
  background: linear-gradient(135deg, #36412f, #242d21);
  box-shadow: 0 12px 30px rgba(36, 45, 33, 0.28);
}

.home-landing__cards {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
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
.home-landing__gallery-text h3 {
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
  min-height: 280px;
  object-fit: cover;
}

.home-landing__gallery-text {
  padding: 26px;
}

@media (max-width: 1100px) {
  .home-landing__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .home-landing__gallery-item,
  .home-landing__gallery-item:nth-child(even) {
    grid-template-columns: 1fr;
  }

  .home-landing__gallery-item:nth-child(even) .home-landing__image-frame,
  .home-landing__gallery-item:nth-child(even) .home-landing__gallery-text {
    order: initial;
  }
}

@media (max-width: 640px) {
  .home-landing {
    gap: 22px;
    margin-bottom: 52px;
  }

  .home-landing__downloads,
  .home-landing__panel,
  .home-landing__gallery-text {
    padding: 22px;
  }

  .home-landing__cards {
    grid-template-columns: 1fr;
  }

  .home-landing__card {
    padding: 20px;
  }

  .home-landing__image-frame img {
    min-height: 220px;
  }
}
</style>
