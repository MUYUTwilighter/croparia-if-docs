---
title: 配方与结构
description: 介绍 Croparia IF 1.1.0a 中 Infusor、Ritual、Soak 与 Ritual Structure 的数据格式、字段语义与编写示例。
keywords:
  - Croparia IF
  - 矿石魔种
  - 1.1.0a
  - 整合包
  - 配方
  - 结构
  - infusor
  - ritual
  - soak
  - ritual_structure
  - 仪式结构
  - 注魔台
  - 元素仪式
  - 元素浸润
modVersions:
  - 1.1.0a
---

# 配方与结构

Croparia IF 目前和整合包作者最相关的核心数据类型主要有四种：

- `croparia:infusor`
- `croparia:ritual`
- `croparia:soak`
- `croparia:ritual_structure`

其中前三种是“配方”，最后一种是“结构定义”。如果你还没有梳理过生成器与目录关系，建议先看[运行时数据生成系统](./generator/index.md)；如果你需要批量生成这些数据，也可以进一步看[创建数据生成器](./generator/create-generator.md)。

<a id="difference"></a>

## 配方与结构的区别

- `InfusorRecipe`：描述注魔台如何把输入物品转成输出物品。
- `RitualRecipe`：描述仪式台在满足结构前提下，如何消耗输入方块与输入物品。
- `SoakRecipe`：描述元素浸润如何把一个方块转成另一个方块。
- `RitualStructure`：描述“某一级仪式台周围的结构应该长什么样”。

其中 `RitualRecipe` 与 `RitualStructure` 是配套关系：

- `RitualStructure` 决定多方块结构是否合法；
- `RitualRecipe` 决定在合法结构上放入什么方块和物品后会产出什么结果。

<a id="entry-shapes"></a>

## 通用输入输出写法

这几类配方内部大量复用了 `ItemInput`、`ItemOutput`、`BlockInput` 与 `BlockOutput`。它们通常都支持“简写”和“对象写法”两种形式。

<a id="item-input"></a>

### 物品输入 `ItemInput`

类型概览：

- 简写：[`string`](./generator/placeholder.md#string)
- 对象：[`Map<String, T>`](./generator/placeholder.md#map)

可写成：

- 物品 ID 字符串
- 标签字符串，前缀为 `#`
- 对象写法

示例：

```json
"minecraft:comparator"
"#croparia:seed_ingredient"
{
  "tag": "croparia:seed_ingredient",
  "amount": 4
}
```

对象写法中常用字段：

- `id: string`
- `tag: string`
- `components: Map<String, T>`
- `amount: number`

<a id="item-output"></a>

### 物品输出 `ItemOutput`

类型概览：

- 简写：[`string`](./generator/placeholder.md#string)
- 对象：[`Map<String, T>`](./generator/placeholder.md#map)

可写成：

- 物品 ID 字符串
- 对象写法

示例：

```json
"croparia:croparia"
{
  "id": "croparia:croparia",
  "amount": 1
}
```

对象写法中常用字段：

- `id: string`
- `components: Map<String, T>`
- `amount: number`

<a id="block-input"></a>

### 方块输入 `BlockInput`

类型概览：

- 简写：[`string`](./generator/placeholder.md#string)
- 对象：[`Map<String, T>`](./generator/placeholder.md#map)

可写成：

- 方块 ID 字符串
- 标签字符串，前缀为 `#`
- 对象写法

示例：

```json
"minecraft:sculk"
"#croparia:ritual_stands"
{
  "id": "croparia:block_crop_coal",
  "properties": {
    "age": "7"
  }
}
```

对象写法中常用字段：

- `id: string`
- `tag: string`
- `properties: Map<String, string>`

<a id="block-output"></a>

### 方块输出 `BlockOutput`

类型概览：

- 简写：[`string`](./generator/placeholder.md#string)
- 对象：[`Map<String, T>`](./generator/placeholder.md#map)

可写成：

- 方块 ID 字符串
- 对象写法

示例：

```json
"minecraft:end_stone"
{
  "id": "minecraft:oak_log",
  "properties": {
    "axis": "y"
  }
}
```

对象写法中常用字段：

- `id: string`
- `properties: Map<String, string>`

<a id="infusor"></a>

## 注魔台配方 `croparia:infusor`

`InfusorRecipe` 的字段非常直接：

- `element: string`
- `ingredient: [ItemInput](#item-input)`
- `result: [ItemOutput](#item-output)`

最简示例：

```json
{
  "type": "croparia:infusor",
  "element": "elemental",
  "ingredient": {
    "tag": "croparia:seed_ingredient",
    "amount": 4
  },
  "result": {
    "id": "croparia:croparia",
    "amount": 1
  }
}
```

字段说明：

- `element: string`：要求注魔台当前填充的元素类型，不能为 `empty`
- `ingredient: ItemInput`：要丢入或右键放入注魔台的物品输入
- `result: ItemOutput`：成功后产出的物品输出

如果你要批量生成这类配方，通常最适合用普通[数据生成器](./generator/create-generator.md#generator-types)。

<a id="ritual"></a>

## 元素仪式配方 `croparia:ritual`

`RitualRecipe` 的字段包括：

- `ritual: string`
- `block: [BlockInput](#block-input)`
- `ingredient: [ItemInput](#item-input)`
- `result: [ItemOutput](#item-output)`

最简示例：

```json
{
  "type": "croparia:ritual",
  "ritual": "#croparia:ritual_stands",
  "ingredient": "minecraft:comparator",
  "block": "minecraft:sculk",
  "result": "minecraft:sculk_sensor"
}
```

字段说明：

- `ritual: string`：要求中心仪式台满足的等级或标签
- `block: BlockInput`：结构中 `$` 标记位置必须放置的输入方块
- `ingredient: ItemInput`：要丢在或右键仪式台的输入物品
- `result: ItemOutput`：配方成功后的结果物品

需要特别注意的是：

- `ritual` 并不描述整个结构，只描述中心仪式台本身
- 真正的多方块形状由[仪式结构](#ritual-structure)决定

也就是说，一个 `RitualRecipe` 只有在对应 `RitualStructure` 验证通过时才可能生效。

<a id="soak"></a>

## 元素浸润配方 `croparia:soak`

`SoakRecipe` 的字段包括：

- `element: string`
- `probability: [number](./generator/placeholder.md#number)`
- `input: [BlockInput](#block-input)`
- `output: [BlockOutput](#block-output)`

最简示例：

```json
{
  "type": "croparia:soak",
  "element": "air",
  "input": "minecraft:stone",
  "output": "minecraft:end_stone",
  "probability": 1.0
}
```

字段说明：

- `element: string`：上方注魔台当前的元素类型，不能为 `empty`
- `probability: number`：本次浸润成功的概率
- `input: BlockInput`：被浸润的输入方块
- `output: BlockOutput`：成功时要变成的输出方块

其中 `probability` 是 `float`，源码匹配逻辑会把当前随机值与这个概率比较，因此：

- `1.0` 表示必定成功
- 小于 `1.0` 时表示概率触发

另外，真正的尝试次数还会受配置中的 `soakAttempts` 影响，可结合[配置与指令](./configuration-command.md#config-file)一起调整。

<a id="ritual-structure"></a>

## 仪式结构 `croparia:ritual_structure`

`RitualStructure` 不是配方，而是仪式台的多方块结构定义。其字段包括：

- `ritual: string`
- `keys: [Map<String, BlockInput>](./generator/placeholder.md#map)`
- `pattern: [string[]](./generator/placeholder.md#list)`

内置示例：

```json
{
  "type": "croparia:ritual_structure",
  "ritual": "croparia:ritual_stand",
  "keys": {
    "A": "minecraft:andesite",
    "D": "minecraft:diorite",
    "I": {
      "id": "croparia:block_crop_coal",
      "properties": {
        "age": "7"
      }
    }
  },
  "pattern": [
    [
      "         ",
      "    $    ",
      "   $ $   ",
      "    $    ",
      "         "
    ],
    [
      "   D D   ",
      "D  I I  D",
      " G  *  G ",
      "D  I I  D",
      "   D D   "
    ]
  ]
}
```

<a id="ritual-structure-ritual"></a>

### `ritual`

表示这个结构对应的中心仪式台类型。

<a id="ritual-structure-keys"></a>

### `keys`

类型为 `Map<String, BlockInput>`，定义 `pattern` 中各字符代表什么方块输入。保留字符不能写进 `keys`：

- `*`
- `$`
- `.`
- 空格

<a id="ritual-structure-pattern"></a>

### `pattern`

类型为 `string[][]`，是一个三维字符结构。

- 最外层：从下到上的层列表
- 每层内部：按行排列的二维字符图案
- 每个字符：表示当前位置的方块要求

<a id="ritual-structure-marks"></a>

## 仪式结构标记字符

`pattern` 中几个特殊字符的含义是源码硬编码的：

- `*`：中心仪式台位置，必须与当前 `ritual` 匹配
- `$`：输入方块位置，运行仪式时会检查这里放的方块，并在成功后销毁
- `.`：必须为空气
- 空格：任意方块，不参与检查
- 其他字符：在 `keys` 中查对应的 `BlockInput`

还有两个额外约束：

- `pattern` 中必须至少包含一个 `*`
- `pattern` 中必须至少包含一个 `$`

如果缺少任一者，结构定义本身就会被判定为非法。

<a id="ritual-levels"></a>

## 仪式台等级与标签

当前内置仪式台等级是通过标签逐级包含实现的：

- `#croparia:ritual_stands`
- `#croparia:ritual_stands_2`
- `#croparia:ritual_stands_3`

因此在 `RitualRecipe` 里：

- 写 `croparia:ritual_stand` 表示只接受一阶仪式台
- 写 `#croparia:ritual_stands_2` 表示接受二阶及更高
- 写 `#croparia:ritual_stands_3` 表示只接受三阶

这也是为什么很多高阶遗物或附魔仪式配方会直接写 `#croparia:ritual_stands_2` 或 `#croparia:ritual_stands_3`。

<a id="debug"></a>

## 调试建议

- 先用简单字符串写法确认配方能被识别，再逐步切换到对象写法。
- 仪式不生效时，先区分是结构问题还是配方问题：
  - 结构问题优先检查 `ritual_structure`
  - 配方问题优先检查 `ritual / block / ingredient / result`
- 需要可视化确认结构时，可以结合配方生成器与相关指令辅助排查。
- 如果你准备批量生成这些 JSON，优先把单个 JSON 手写跑通，再迁移到[数据生成器](./generator/create-generator.md)。

<a id="tips"></a>

## 实用建议

- `RitualRecipe` 和 `RitualStructure` 最好成对理解，不要只改其中一边。
- `SoakRecipe` 看起来简单，但它的结果还会受到概率和 `soakAttempts` 共同影响。
- `BlockInput` 与 `ItemInput` 的对象写法非常适合需要附加 `properties`、`components` 或 `amount` 的场景。
- 如果你要为大量作物、元素或仪式批量生成配方，优先考虑结合[占位符解析器](./generator/placeholder.md)和[创建数据生成器](./generator/create-generator.md)来做自动生成。
