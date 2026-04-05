---
title: 创建数据生成器
description: 介绍 Croparia IF 1.1.0a Generator API 中数据生成器文件的放置位置、核心字段、生成器类型与最小示例。
keywords:
  - Croparia IF
  - 矿石魔种
  - 1.1.0a
  - 整合包
  - Generator API
  - 数据生成器
  - TOML
  - CDG
  - JSON
  - placeholder
  - template
modVersions:
  - 1.1.0a
---

# 创建数据生成器

这页只回答一件事：如何写出一个可运行的数据生成器文件。整体概念见[运行时数据生成系统](index.md)，字段取值方式见[占位符解析器](placeholder.md)。

<a id="file-format"></a>

## 放在哪里

生成器文件写在对应处理器的 `generator/` 目录下，而不是直接改 `assets/` 或 `data/`：

- 数据包：`[游戏目录]/croparia/datapack/generator/`
- 资源包：`[游戏目录]/croparia/resourcepack/generator/`

生成后的[生成产物](index.md#pack-handler)会分别落到：

- 数据包：`[游戏目录]/croparia/datapack/data/`
- 资源包：`[游戏目录]/croparia/resourcepack/assets/`

支持格式：

- `toml`
- `cdg`
- `json`

推荐优先使用 `toml`。

<a id="minimal-example"></a>

## 最小示例

```toml
registry = "croparia:crops"
path = "example/recipes/${id.path}.json"
template = """
{
  "type": "minecraft:crafting_shapeless",
  "ingredients": [
    { "item": "${fruit}" }
  ],
  "result": {
    "id": "${seed}",
    "count": 1
  }
}
"""
```

它表示：

- 遍历 `croparia:crops`
- 为每个条目计算一次 `path`
- 用当前条目填充 `template`
- 生成多个独立文件

<a id="common-fields"></a>

## 核心字段

- `registry`：指定要遍历哪个[生成条目集](index.md#entry-registry)
  - 常见值：
    - `croparia:crops`
    - `croparia:melons`
    - `croparia:elements`
- `path`：指定生成产物的相对路径，本身也是一个[模板](index.md#template)
  - 示例：

```toml
path = "${id.namespace}/models/item/${seed.path}.json"
```

- `template`：指定最终写入的文件内容，本身也是模板字符串
  - 示例：

```toml
template = """
{
  "parent": "croparia:item/template_seed"
}
"""
```

- `type`：指定生成器类型
  - 可选值：
    - [`croparia:generator`](#type-generator)（默认）
    - [`croparia:aggregated`](#type-aggregated)
    - [`croparia:lang`](#type-lang)

- `startup`：控制是否在服务器完全启动前参与生成

- `enabled`：控制生成器是否启用，可临时停用但保留文件
  - 示例：

```toml
enabled = false
```

- `whitelist`
  - 用途：只为指定条目生成，而不是遍历整个 `registry`
  - 常见场景：调试、局部覆盖
  - 示例：

```toml
whitelist = ["croparia:coal", "croparia:iron"]
```

<a id="generator-types"></a>

## 生成器类型

<a id="type-generator"></a>

### 普通生成器 `croparia:generator`

默认类型。一个条目通常生成一个文件；若目标路径重复，后写入者覆盖前者。

适合：

- 配方
- 模型
- 战利品表
- 方块状态

```toml
registry = "croparia:crops"
startup = true
path = "${id.namespace}/models/item/${seed.path}.json"
template = """
{
  "parent": "croparia:item/template_seed"
}
"""
```

<a id="type-aggregated"></a>

### 聚合生成器 `croparia:aggregated`

先让每个条目生成一段 `content`，再统一塞进一个 `template`。适合标签文件等多条目合并成一个文件的场景

额外字段：

- `content`

```toml
registry = "croparia:crops"
type = "croparia:aggregated"
startup = true
path = "croparia/tags/item/seeds/crops.json"
content = '    "${seed}"'
template = """
{
  "replace": false,
  "values": [
${content}
  ]
}
"""
```

<a id="type-lang"></a>

### 语言生成器 `croparia:lang`

面向可翻译条目，会按语言拆分输出，并注入可用占位符 `_lang`。

适合：

- 语言文件

```toml
registry = "croparia:crops"
type = "croparia:lang"
startup = true
path = "${id.namespace}/lang/${lang}.json"
template = '"${translation_key}": "${translations.get(_lang)}"'
```

语言字段详见[占位符解析器](placeholder.md#translatable-entry)。
