---
title: 包结构
description: 规划 Croparia IF 1.1.0a 开发者包结构页，帮助下游开发者快速定位源码入口。
keywords:
  - Croparia IF
  - 包结构
modVersions:
  - 1.1.0a
---

# 包结构

这一页比架构页更具体，目标是回答“我要找某类逻辑时，先去哪里看”。

## 计划覆盖的目录

- `cool.muyucloud.croparia.api`
- `cool.muyucloud.croparia.registry`
- `cool.muyucloud.croparia.client`
- `cool.muyucloud.croparia.compat`
- `cool.muyucloud.croparia.config`
- 其他辅助包，例如 `util`、`reflection`、`annotation`

## 页面重点

- 每个包一句职责说明。
- 标出适合作为阅读入口的类。
- 对可能不稳定的内部实现明确标注。
