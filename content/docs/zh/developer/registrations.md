---
title: 注册体系
description: 规划 Croparia IF 1.1.0a 开发者文档中的注册说明页，覆盖方块、物品、配方、菜单等注册入口。
keywords:
  - Croparia IF
  - 注册
modVersions:
  - 1.1.0a
---

# 注册体系

本页计划解释 Croparia IF 如何组织运行期需要的主要注册内容。

## 计划覆盖的注册对象

- Blocks
- Items
- Fluids
- Block Entities
- Menu Types
- Recipes
- Components
- Tabs
- Pack Handlers
- Network Handlers

## 写作重点

- 说明各注册入口分别位于哪里。
- 解释 Architectury `DeferredRegister` 与模组内部辅助封装的使用方式。
- 帮助开发者判断扩展时应该依赖哪一层。
