---
title: 运行时数据生成系统
description: 面向 Croparia IF 下游开发者的运行时数据生成系统概览，介绍 DgEntry、DataGenerator 与 Placeholder 的扩展入口。
keywords:
  - Croparia IF
  - Generator API
  - 运行时数据生成系统
  - DataGenerator
  - DgEntry
  - DgRegistry
  - Placeholder
  - Template
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 运行时数据生成系统（开发者）

<a id="overview"></a>

**运行时数据生成系统 Generator API** 是 Croparia IF 中可以通过脚本批量地在游戏运行时动态地生成文本文件的系统。

如果你想先了解用户视角下的功能与工作流，可以参照[运行时数据生成系统（整合包作者）](../../modpack/generator/index.md#overview)。
此栏目主要介绍该 API 的扩展开发，包括如何扩展[生成条目](entry.md#create-entry)、[数据生成器](generator.md#create-generator-class)与[占位符解析器](placeholder.md#basic-creation)。

<a id="navigation"></a>

## 导航

- [添加生成条目](entry.md#create-entry)
- [自定义数据生成器](generator.md#create-generator-class)
- [创建占位符解析器](placeholder.md#basic-creation)

