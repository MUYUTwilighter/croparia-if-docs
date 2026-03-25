---
layout: home
title: Croparia IF Docs
description: Croparia IF 的中文文档首页，提供下载入口、玩法概览、当前版本指南与站点维护入口。
keywords:
  - Croparia IF
  - Minecraft mod
  - 文档
  - VitePress
  - 1.21.1
modVersions:
  - 1.1.0a
---

hero:
  name: "Croparia IF"
  text: "耕作、装置与仪式的文档首页"
  tagline: 面向当前维护版本 1.1.0a（Minecraft 1.21.1）的使用、整合包定制与开发维护文档。
  image:
    src: /home/croparia-if-banner.webp
    alt: Croparia IF banner
  actions:
    - theme: brand
      text: 阅读指南
      link: /guide/
    - theme: alt
      text: 版本策略
      link: /versions/
    - theme: alt
      text: Modrinth
      link: https://modrinth.com/mod/croparia-if

features:
  - title: 旧站视觉重构
    details: 复用了横幅与玩法截图，但全部迁入当前仓库并重新适配 VitePress 首页布局。
  - title: 直接服务多类读者
    details: 首页同时照顾玩家、整合包作者与文档维护者，不再只是简单的目录跳转页。
  - title: 后续可持续扩展
    details: 复杂展示区改成了组件化实现，后续可以继续加公告、专题与版本入口。
---

<HomeLanding locale="zh" />
