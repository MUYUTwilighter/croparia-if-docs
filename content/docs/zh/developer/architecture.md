---
title: 架构概览
description: 规划 Croparia IF 1.1.0a 开发者文档中的架构页，说明 common 层主要模块及协作关系。
keywords:
  - Croparia IF
  - 架构
modVersions:
  - 1.1.0a
---

# 架构概览

本页负责帮助开发者先建立全局地图，再进入具体实现。

## 计划覆盖内容

- `api`、`registry`、`compat`、`client`、`config`、`kubejs` 等主要包的职责。
- common 层如何承接平台无关逻辑。
- 内容注册、数据加载、客户端表现之间的大致流向。

## 建议呈现方式

- 先给一张模块关系图。
- 再按“启动注册 -> 运行时使用 -> 扩展入口”组织内容。
