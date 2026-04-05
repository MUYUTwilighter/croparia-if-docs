---
title: 创建数据生成器
description: 介绍 Croparia IF 1.1.0a Generator API 中数据生成器文件的目录位置、通用字段、生成器类型与编写示例。
keywords:
  - Croparia IF
  - 矿石魔种
  - 1.1.0a
  - 整合包
  - Generator API
  - 数据生成器
  - create generator
  - TOML
  - CDG
  - JSON
  - placeholder
  - template
modVersions:
  - 1.1.0a
---

# 创建数据生成器

此页面介绍如何在整合包中创建一个可运行的数据生成器文件。若你还没有阅读整体概念，建议先看[运行时数据生成系统](index.md)；如果你不熟悉模板里的字段读取方式，可以同时参考[占位符解析器](placeholder.md)。

## 放在哪里

数据生成器文件不是直接写进最终的 `assets/` 或 `data/`，而是放在对应生成包处理器的 `generator/` 目录下。

- 数据包处理器：`[游戏目录]/croparia/datapack/generator/`
- 资源包处理器：`[游戏目录]/croparia/resourcepack/generator/`

注意，这里源码中的目录名是 `generator`，不是 `generators`。

生成器触发后，真正的[生成产物](index.md#pack-handler)会被写入：

- 数据包：`[游戏目录]/croparia/datapack/data/`
- 资源包：`[游戏目录]/croparia/resourcepack/assets/`

通常你应该修改的是生成器文件，而不是这些生成产物本身。

<a id="file-format"></a>

## 支持的文件格式

当前生成器文件支持三种格式：

- `toml`
- `cdg`
- `json`

其中最推荐 `toml`，因为：

- 多行模板更容易写；
- 引号和转义更少；
- 结构更接近内置生成器示例。

下文都以 `toml` 为例。

<a id="minimal-example"></a>

## 最小可用示例

下面是一个最基础的普通数据生成器。它会为每个果实作物生成一个独立 JSON 文件：

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

这个文件表达的意思是：

- 遍历 `croparia:crops` 中的每一个果实作物；
- 对每个条目计算一次 `path`；
- 再用当前条目的数据填充 `template`；
- 最终生成多个独立文件。

<a id="common-fields"></a>

## 通用字段

无论你使用哪一种生成器类型，以下字段都是最核心的部分。

### `registry`

指定要遍历哪个[生成条目集](index.md)。

当前常见值包括：

- `croparia:crops`
- `croparia:melons`
- `croparia:elements`

这决定了模板里可用哪些字段。具体字段请看[占位符解析器](placeholder.md#common-entries)。

### `path`

生成产物的相对路径。它本身也是一个[模板](index.md#template)，因此可以使用占位符。

例如：

```toml
path = "${id.namespace}/models/item/${seed.path}.json"
```

对于数据包处理器，这个路径会写到 `data/` 下面；对于资源包处理器，则写到 `assets/` 下面。

### `template`

最终写入文件的内容模板。它也是模板字符串，因此同样支持 `${...}` 占位符。

例如：

```toml
template = """
{
  "parent": "croparia:item/template_seed"
}
"""
```

### `type`

指定生成器类型。

可选值：

- `croparia:generator`
- `croparia:aggregated`
- `croparia:lang`

如果不写，默认就是 `croparia:generator`。

### `startup`

是否在服务器完全启动前就参与生成。

- `true`：更接近内置静态内容的生成方式
- `false`：等服务器已启动后再生成

当前内置的大部分资源与标签生成器都显式写了 `startup = true`。

### `enabled`

是否启用该生成器。

通常不写，默认就是启用；如果你只是临时保留文件但不想让它生效，可以写：

```toml
enabled = false
```

### `whitelist`

只为指定的条目生成，而不是遍历整个 `registry`。

适合调试或只想覆盖少数条目时使用。

示例：

```toml
whitelist = ["croparia:coal", "croparia:iron"]
```

<a id="generator-types"></a>

## 生成器类型

### 普通数据生成器 `croparia:generator`

这是默认类型，也是最常用的类型。

它的行为是：

- 遍历 `registry` 中的每个条目；
- 对每个条目分别计算 `path` 和 `template`；
- 每个条目产出一个独立文件；
- 如果多个条目落到同一 `path`，后写入者会覆盖前者。

适合：

- 配方
- 模型
- 战利品表
- 方块状态
- 大部分“一条数据对应一个文件”的场景

示例：

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

### 聚合生成器 `croparia:aggregated`

聚合生成器不会直接让每个条目各写一个完整文件，而是先把每个条目生成出的 `content` 聚合到同一个目标路径，最后再由 `template` 统一包起来。

它比普通生成器多出一个字段：

### `content`

表示“每个条目各自产生的一段内容”。

最终 `template` 里通常会通过 `${content}` 把所有片段拼起来。

适合：

- 标签文件
- `variants` 集合
- 语言条目集合以外的“多条目合并成一个文件”的场景

示例：

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

你也可以像内置的 `infusor` 方块状态那样，把片段拼进对象内部：

```toml
registry = "croparia:elements"
type = "croparia:aggregated"
startup = true
path = "croparia/blockstates/infusor.json"
content = '        "element=${name}": { "model": "croparia:block/infusor_${name}" }'
template = """
{
  "variants": {
    "element=empty": { "model": "croparia:block/infusor" },
${content}
  }
}
"""
```

### 语言生成器 `croparia:lang`

语言生成器是专门给可翻译条目设计的特殊聚合生成器。它要求 `registry` 中的条目实现可翻译接口，也就是像 `Crop`、`Melon` 这种带 `translation_key` 与 `translations` 的条目。

它的特点是：

- 会自动按语言拆分输出文件；
- 在运行时注入一个可用占位符 `lang`；
- 模板中常配合 `${translations.get(_lang)}` 使用。

适合：

- 语言文件
- 按语言拆分输出的翻译资源

示例：

```toml
registry = "croparia:crops"
type = "croparia:lang"
startup = true
path = "${id.namespace}/lang/${lang}.json"
template = '"${translation_key}": "${translations.get(_lang)}"'
```

更具体的可用字段见[占位符解析器](placeholder.md#translatable-entry)。

<a id="workflow"></a>

## 推荐编写流程

### 1. 先决定放到数据包还是资源包

- 生成配方、标签、战利品表时，通常放数据包处理器
- 生成模型、方块状态、语言文件时，通常放资源包处理器

### 2. 先选 `registry`

决定你要对什么对象批量生成内容：

- 作物：`croparia:crops`
- 巨果作物：`croparia:melons`
- 元素：`croparia:elements`

### 3. 再选生成器类型

- 一条条目对应一个文件：`generator`
- 多条条目合成一个文件：`aggregated`
- 为翻译条目按语言生成：`lang`

### 4. 最后写 `path` 与 `template`

这一步最容易出错，建议：

- 先把 `path` 写死，确认目标位置正确
- 再逐步把固定值替换为占位符
- 拿不准字段时回查[占位符解析器](placeholder.md)

<a id="toml-notes"></a>

## TOML 编写建议

多行模板建议统一使用三引号：

```toml
template = """
{
  "replace": false,
  "values": [
    "${fruit}"
  ]
}
"""
```

短字符串内容可以直接单引号：

```toml
content = '    "${seed}"'
```

这样能减少转义，尤其适合写 JSON 片段。

<a id="cdg-notes"></a>

## CDG 简述

`cdg` 是一种更贴近“元信息 + 模板正文”的简写格式。根据源码，它通过 `@字段=值;` 的方式声明元字段，剩余正文会被视为 `template`。

例如，一个概念性的 `cdg` 文件可能长这样：

```text
@registry="croparia:crops";
@path="example/${id.path}.json";
@startup=true;
{
  "item": "${fruit}"
}
```

如果你不是特别需要这种格式，仍然推荐优先使用 `toml`。

<a id="debug"></a>

## 调试与验证

写好生成器后，最直接的验证方式是：

1. 启动游戏，让模组加载你的生成器；
2. 用 `/croparia generator query [pack] [generator]` 或服务端对应指令检查是否被识别；
3. 到对应处理器的 `data/` 或 `assets/` 目录查看生成产物；
4. 再进入游戏验证这些产物是否真的按预期生效。

如果指令没有补全、查询不到生成器，通常说明：

- 文件位置不对
- 语法有误
- `registry` 或 `type` 不合法
- 使用了当前条目并不存在的占位符字段

这时应优先看日志，再回头检查[占位符解析器](placeholder.md)和[运行时数据生成系统](index.md#workflow)。

<a id="tips"></a>

## 实用建议

- 普通生成器适合“一个条目一个文件”，不要勉强用它生成标签合集。
- 聚合生成器里真正逐条变化的是 `content`，不是 `template`。
- 写路径时优先使用 `${id.path}`、`${seed.path}` 这类稳定字段，少手写重复命名。
- 第一次写生成器时，建议先从抄一份内置示例开始，再逐项改字段。
- 如果你发现自己在模板里做了太多复杂逻辑，通常意味着你该调整条目结构，或拆成多个生成器。
