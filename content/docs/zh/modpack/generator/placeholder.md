---
title: 占位符解析器
description: 介绍 Croparia IF Generator API 中 Placeholder 的语法、类型操作，以及 crop、melon、element 等常用生成条目的可用字段。
keywords:
  - Croparia IF
  - 矿石魔种
  - 1.1.0a
  - 整合包
  - Generator API
  - Placeholder
  - 占位符解析器
  - 模板
  - 数据生成器
  - crop
  - melon
  - element
modVersions:
  - 1.1.0a
---

# 占位符解析器（Placeholder API）

占位符解析器是模板真正读取数据的接口。模板中的 `${...}` 表达式在运行时会交给对应的 `Placeholder` 解析，再替换成最终的文本或 JSON 片段。

对于整合包作者来说，可以把它理解为：

- `Template` 决定文件长什么样；
- `Placeholder` 决定模板里能读哪些值、这些值怎么继续往下取。

## 基本语法

最基础的占位符写法如下：

```text
${字段}
${字段.子字段}
${字段.get(key)}
${字段.get(0)}
```

例如：

```json
{
  "item": "${fruit}",
  "tier": ${tier},
  "translation_key": ${translation_key._qis}
}
```

这里有两个要点：

- 占位符总是写在 `${...}` 中；
- 点号 `.` 表示继续访问子字段或调用内置查询方法。

## 字符串与引号

`Placeholder` 返回的值本质上是 JSON 值。若结果本身是字符串，直接放进 JSON 字符串字面量时要注意引号。

常用写法：

- `${name}`：直接输出值
- `${name._qis}`：如果结果是字符串，则自动补双引号
- `${name._q}`：无论结果是否为字符串，都强制转成带双引号的字符串

推荐规则：

- 你在模板里已经手写了 JSON 引号时，用 `${name}`
- 你希望占位符自己决定是否补引号时，用 `${name._qis}`

示例：

```json
{
  "raw_name": "${name}",
  "safe_name": ${name._qis}
}
```

## 基本类型

### 字符串 `string`

可直接输出，也可继续使用 `_qis` 与 `_q`。

```text
${id}
${id.namespace}
${id.path}
${type._qis}
```

### 数字 `number`

数字通常直接嵌入 JSON：

```text
${tier}
${color.dec}
```

### 布尔 `boolean`

源码中存在布尔占位符支持，但当前常用生成条目里很少直接暴露布尔字段。若某个条目提供了布尔值，可以像数字一样直接使用。

## 复合类型

`Placeholder` 最实用的能力在于处理列表与字典。

### 列表 `T[]`

列表支持以下操作：

- `_size`：查询长度
- `get(n)`：按索引取值
- `getOr(n, fallback)`：按索引取值，越界时返回默认值
- `map(expr)`：把列表中“能成功解析 `expr` 的项”转成一个 JSON 对象，键为索引
- `mapi(expr)`：把列表中“能成功解析 `expr` 的项”筛出来，返回一个键为索引的字典，值仍是原对象

示例：

```text
${translations.keys()._size}
${translations.keys().get(0)}
${translations.keys().getOr(0, en_us)}
```

### 字典 `Map<String, T>`

字典支持以下操作：

- `_size`：查询键值对数量
- `get(key)`：按键取值
- `getOr(key, fallback)`：按键取值，不存在时返回默认值
- `keys()`：返回键列表
- `values()`：返回值列表
- `mapValue(expr)`：筛出值中能成功解析 `expr` 的项
- `mapKey(expr)`：用值解析出的结果重映射键名

示例：

```text
${translations.get(en_us)}
${translations.getOr(zh_cn, 未翻译)}
${translations.keys().get(0)}
```

## 常用内置类型

以下类型在很多条目里都会出现。

### `id`

资源位置类型支持：

- `${id}`：完整 ID
- `${id.namespace}`：命名空间
- `${id.path}`：路径

示例：

```text
${fruit}
${fruit.namespace}
${fruit.path}
```

### `color`

颜色类型支持：

- `${color}`：标准颜色字符串，如 `#00FFAA`
- `${color.hex}`：不带前缀的十六进制
- `${color.dec}`：十进制整数

### `material`

`Material` 及其子类支持：

- `${material.type}`：`item` 或 `tag`
- `${material.name}`：原始名称，标签会保留 `#`
- `${material.count}`：数量
- `${material.id}`：去掉 `#` 后的 ID

对 `ItemMaterial` 还额外支持：

- `${material.result}`：作为配方输出条目读取
- `${material.components}`：组件补丁

## 当前常用生成条目的可用字段

下面这些字段来自当前 `1.1.0a` 源码中的 `Placeholder` 定义，适合直接在整合包文档里引用。

## 果实作物 `croparia:crops`

果实作物条目实现于 `Crop`，并继承了通用的可翻译条目字段。

可直接使用的核心字段：

- `${id}`
- `${color}`
- `${color.hex}`
- `${type}`
- `${material}`
- `${material.name}`
- `${material.result}`
- `${tier}`
- `${seed}`
- `${fruit}`
- `${crop_block}`
- `${croparia}`
- `${translation_key}`
- `${translations}`
- `${translations.get(en_us)}`

示例：

```toml
path = "data/example/recipe/${id.path}.json"
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

## 巨果作物 `croparia:melons`

巨果作物条目实现于 `Melon`。

可直接使用的核心字段：

- `${id}`
- `${color}`
- `${color.hex}`
- `${tier}`
- `${croparia}`
- `${material}`
- `${material.name}`
- `${melon}`
- `${stem}`
- `${attach}`
- `${seed}`
- `${translation_key}`
- `${translations}`

示例：

```toml
path = "assets/example/models/item/${seed.path}.json"
template = """
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "${seed.namespace}:item/${seed.path}"
  }
}
"""
```

## 元素 `croparia:elements`

元素条目实现于 `Element`。

可直接使用的核心字段：

- `${id}`
- `${name}`
- `${color}`
- `${color.hex}`
- `${fluid_source}`
- `${fluid_flowing}`
- `${liquid_block}`
- `${bucket}`
- `${potion}`
- `${gem}`

示例：

```toml
path = "data/example/tags/items/${name}.json"
template = """
{
  "replace": false,
  "values": [
    "${gem}",
    "${potion}",
    "${bucket}"
  ]
}
"""
```

## 可翻译条目通用字段

`Crop` 与 `Melon` 都继承了 `TranslatableEntry`，因此都支持：

- `${translation_key}`
- `${translations}`
- `${translations.get(en_us)}`
- `${translations.keys()}`
- `${translations.values()}`

这类字段最常用于语言文件生成器。

例如：

```toml
template = '"${translation_key}": "${translations.get(_lang)}"'
```

## 使用建议

- 先确定当前条目的类型，再查它暴露了哪些字段；不要假设不同条目拥有同名字段。
- 需要拼接文件路径时，优先使用 `${id.path}`、`${seed.path}`、`${fruit.path}` 这类子字段。
- 写 JSON 时，字符串值的引号问题最容易出错；拿不准时优先考虑 `${...._qis}`。
- 如果模板逻辑已经开始依赖大量 `get()`、`map()`、`keys()` 之类的组合，说明你可能需要先重构条目结构，而不是继续堆模板技巧。
