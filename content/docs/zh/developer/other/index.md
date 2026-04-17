---
title: 其他常用 API
description: 汇总 Croparia IF 中还未单独成组、但实际开发时经常会遇到的几个常用 API，包括 JSON 转换、配置、方块属性、物品放置接口与 Supplier 工具。
keywords:
  - Croparia IF
  - 开发者文档
  - 其他 API
  - JsonTransformer
  - Config
  - BlockProperties
  - ItemPlaceable
  - LazySupplier
  - OnLoadSupplier
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 其他常用 API

<a id="overview"></a>

这一组页面收拢了几类在 Croparia IF 中经常出现、但使用门槛并不高的辅助 API。

如果你在开发时遇到下面这些问题，可以从这里开始看：

- 需要把 `json`、`toml`、`cdg` 等文本格式统一接进 `Codec` 流程
- 需要组织一个可重载、可持久化的配置对象
- 需要读取、匹配或修改方块状态中的属性
- 需要让一个物品以“可放置对象”的形式参与逻辑
- 需要延迟计算、映射或在加载后再初始化一个值

当前这一组主要包括：

- [JSON 转换](json.md#overview)
- [配置系统](config.md#overview)
- [自定义物品组件](item-components.md#overview)
- [访问与修改方块属性](block-property.md#overview)
- [可放置物品接口](item-placeable.md#overview)
- [Supplier 工具](supplier.md#overview)
