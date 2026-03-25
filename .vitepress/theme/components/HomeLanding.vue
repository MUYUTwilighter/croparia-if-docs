<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  locale: 'zh' | 'en'
}>()

type LocalizedContent = {
  overviewLabel: string
  overviewTitle: string
  overviewText: string
  stats: Array<{ label: string; value: string }>
  platformsTitle: string
  platformsText: string
  platforms: Array<{ label: string; href: string; accent: string }>
  cards: Array<{ title: string; body: string }>
  galleryTitle: string
  galleryText: string
  gallery: Array<{ title: string; body: string; image: string; alt: string }>
  stackTitle: string
  stackText: string
  stackPoints: string[]
}

const content = computed<LocalizedContent>(() =>
  props.locale === 'zh'
    ? {
        overviewLabel: 'Croparia IF Docs',
        overviewTitle: '从入门到扩展创作，文档首页先带你看清整个玩法版图',
        overviewText:
          '新首页沿用旧站的品牌横幅、下载入口和玩法展示，但改成更适合 VitePress 的模块化布局，方便后续继续叠加功能页、版本页和自定义组件。',
        stats: [
          { label: '当前维护版本', value: '1.1.0a' },
          { label: 'Minecraft', value: '1.21.1' },
          { label: '文档语言', value: '简中 / EN' }
        ],
        platformsTitle: '快速获取模组与文档入口',
        platformsText:
          '如果你是第一次接触 Croparia IF，可以先安装模组，再从指南页进入核心机制。如果你在维护整合包或二次开发，版本策略和架构页会更适合作为起点。',
        platforms: [
          { label: 'Modrinth', href: 'https://modrinth.com/mod/croparia-if', accent: 'brand' },
          { label: 'CurseForge', href: 'https://www.curseforge.com/minecraft/mc-mods/croparia-if', accent: 'warm' },
          { label: 'GitHub', href: 'https://github.com/MUYU-Twilighter/croparia-if', accent: 'dark' }
        ],
        cards: [
          {
            title: '面向玩家',
            body: '从种植、灌注到仪式，多条玩法线都能在首页直接看到入口和视觉预览。'
          },
          {
            title: '面向整合包作者',
            body: '保留旧站强调的高可定制性，把版本策略、标签分发和文档结构放到更靠前的位置。'
          },
          {
            title: '面向开发维护',
            body: '首页模块设计成可复用组件，后续扩展新版本、新栏目或专题页面时不需要重写整套样式。'
          }
        ],
        galleryTitle: '三条最能代表 Croparia IF 的体验路径',
        galleryText:
          '旧站首页的视觉重心是“种植 + 装置 + 仪式”。这里把它们整理成连续的引导区块，让首次访问也能快速理解模组的节奏。',
        gallery: [
          {
            title: '搭建温室，开始资源种植',
            body: '作物并不是简单替代原版农田，而是围绕资源产出、成长节奏和后续加工形成完整循环。',
            image: '/home/greenhouse-place.webp',
            alt: 'Greenhouse gameplay screenshot'
          },
          {
            title: '放置 Infusor，推进加工链',
            body: '灌注相关装置承担了中期玩法的效率提升与配方拓展，也是文档中最常被检索的核心主题之一。',
            image: '/home/place-infusor.webp',
            alt: 'Infusor placement screenshot'
          },
          {
            title: '完成 Ritual，进入更高阶目标',
            body: '仪式结构、材料消耗和结果产物共同构成后期进阶内容，适合作为首页的压轴展示。',
            image: '/home/ritual-1-3.webp',
            alt: 'Ritual structure screenshot'
          }
        ],
        stackTitle: '兼顾内容表达与站点维护成本',
        stackText:
          '当前站点基于 VitePress，多语言、多版本与 SEO 元数据都已经接入。首页实现也尽量保持这个方向，不把样式和内容绑死在单页里。',
        stackPoints: [
          '视觉素材来自旧站，但资产已经复制到当前文档仓库并统一走本地公共目录。',
          '首页正文使用组件承载复杂结构，Markdown 仍然负责中英文入口和版本分发。',
          '后续如果需要追加截图轮播、公告带或更复杂的下载区，可以直接扩展这个组件。'
        ]
      }
    : {
        overviewLabel: 'Croparia IF Docs',
        overviewTitle: 'A landing page that introduces the mod before the reader dives into the manual',
        overviewText:
          'This homepage keeps the old site banner, platform links, and gameplay previews, then reshapes them into a VitePress-friendly layout that is easier to maintain and extend.',
        stats: [
          { label: 'Current release', value: '1.1.0a' },
          { label: 'Minecraft', value: '1.21.1' },
          { label: 'Locales', value: 'ZH / EN' }
        ],
        platformsTitle: 'Start from the right entry point',
        platformsText:
          'New players can install the mod and jump into the guide. Pack makers and maintainers can move straight to the versioning and architecture pages to understand how this docs site is organized.',
        platforms: [
          { label: 'Modrinth', href: 'https://modrinth.com/mod/croparia-if', accent: 'brand' },
          { label: 'CurseForge', href: 'https://www.curseforge.com/minecraft/mc-mods/croparia-if', accent: 'warm' },
          { label: 'GitHub', href: 'https://github.com/MUYU-Twilighter/croparia-if', accent: 'dark' }
        ],
        cards: [
          {
            title: 'For players',
            body: 'The homepage now previews the core play loop directly, from farming to processing and ritual progression.'
          },
          {
            title: 'For pack creators',
            body: 'The old emphasis on customization remains, but the structure now highlights version policy and docs generation earlier.'
          },
          {
            title: 'For maintainers',
            body: 'The landing area is implemented as a reusable component so later updates do not require rebuilding the entire page.'
          }
        ],
        galleryTitle: 'Three routes that define the Croparia IF experience',
        galleryText:
          'The old site focused on farming, machines, and rituals. This version turns those beats into a clearer progression story for first-time visitors.',
        gallery: [
          {
            title: 'Build the farm and begin resource growth',
            body: 'Crop progression is presented as a full gameplay loop rather than a simple reskin of vanilla agriculture.',
            image: '/home/greenhouse-place.webp',
            alt: 'Greenhouse gameplay screenshot'
          },
          {
            title: 'Place the Infusor and expand production',
            body: 'Infusion-related devices are one of the most important topics in the docs, so they deserve a visible place on the homepage.',
            image: '/home/place-infusor.webp',
            alt: 'Infusor placement screenshot'
          },
          {
            title: 'Finish rituals and push into endgame goals',
            body: 'Ritual structures, inputs, and outputs define the higher-tier progression and work well as the final showcase block.',
            image: '/home/ritual-1-3.webp',
            alt: 'Ritual structure screenshot'
          }
        ],
        stackTitle: 'Built to look better without becoming harder to maintain',
        stackText:
          'The site already has locale routing, version-aware generation, and SEO metadata. The homepage follows the same philosophy by separating reusable presentation from authored page content.',
        stackPoints: [
          'Visual assets come from the old site, but are copied into this repository and served locally.',
          'The complex landing layout lives in a component while Markdown still owns localized page entry and version tagging.',
          'Future additions like a news strip, richer download block, or rotating screenshots can be added on top of this foundation.'
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
        <h2>{{ content.platformsTitle }}</h2>
        <p>{{ content.platformsText }}</p>
      </div>
      <div class="home-landing__platform-list">
        <a
          v-for="platform in content.platforms"
          :key="platform.label"
          :class="['home-landing__platform', `is-${platform.accent}`]"
          :href="platform.href"
          target="_blank"
          rel="noreferrer"
        >
          {{ platform.label }}
        </a>
      </div>
    </section>

    <section class="home-landing__cards">
      <article v-for="card in content.cards" :key="card.title" class="home-landing__card">
        <h3>{{ card.title }}</h3>
        <p>{{ card.body }}</p>
      </article>
    </section>

    <section class="home-landing__gallery-copy">
      <p class="home-landing__eyebrow">{{ props.locale === 'zh' ? 'Gameplay Highlights' : 'Gameplay Highlights' }}</p>
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

    <section class="home-landing__stack">
      <div class="home-landing__stack-copy">
        <p class="home-landing__eyebrow">Architectury</p>
        <h2>{{ content.stackTitle }}</h2>
        <p>{{ content.stackText }}</p>
        <ul>
          <li v-for="point in content.stackPoints" :key="point">{{ point }}</li>
        </ul>
      </div>
      <div class="home-landing__stack-visual">
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
.home-landing__stack {
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
.home-landing__gallery-copy,
.home-landing__stack {
  border: 1px solid rgba(129, 168, 87, 0.18);
  background:
    linear-gradient(180deg, rgba(253, 252, 247, 0.96), rgba(248, 245, 235, 0.93));
  border-radius: 28px;
  box-shadow: 0 26px 60px rgba(37, 53, 33, 0.08);
}

.dark .home-landing__copy,
.dark .home-landing__platforms,
.dark .home-landing__cards,
.dark .home-landing__gallery-copy,
.dark .home-landing__stack {
  background: linear-gradient(180deg, rgba(31, 41, 31, 0.9), rgba(22, 29, 23, 0.9));
  border-color: rgba(164, 202, 124, 0.2);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.3);
}

.home-landing__copy,
.home-landing__platforms,
.home-landing__gallery-copy,
.home-landing__stack {
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
.home-landing dl,
.home-landing ul {
  margin: 0;
}

.home-landing__lead,
.home-landing__platforms p,
.home-landing__gallery-copy p:last-child,
.home-landing__gallery-text p,
.home-landing__stack-copy p:last-of-type,
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
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
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

.home-landing__card h3,
.home-landing__gallery-text h3,
.home-landing__stack-copy h2,
.home-landing__gallery-copy h2,
.home-landing__copy h2,
.home-landing__platforms h2 {
  margin-bottom: 10px;
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

.home-landing__stack {
  grid-template-columns: minmax(0, 1.3fr) minmax(220px, 0.7fr);
}

.home-landing__stack-copy ul {
  margin-top: 16px;
  padding-left: 18px;
  color: var(--vp-c-text-2);
}

.home-landing__stack-copy li + li {
  margin-top: 10px;
}

.home-landing__stack-visual {
  display: grid;
  place-items: center;
  padding: 30px;
  border-radius: 24px;
  background: radial-gradient(circle at center, rgba(173, 219, 130, 0.26), rgba(173, 219, 130, 0));
}

.home-landing__stack-visual img {
  width: min(180px, 100%);
  height: auto;
}

@media (max-width: 960px) {
  .home-landing__intro,
  .home-landing__stack,
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
  .home-landing__gallery-copy,
  .home-landing__stack,
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
