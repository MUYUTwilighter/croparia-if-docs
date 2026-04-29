---
title: 配方与结构
description: 介绍 Croparia IF 1.1.1a 中 Infusor、Ritual、Soak 与 Ritual Structure 的数据格式、字段语义与编写示例。
keywords:
  - Croparia IF
  - 矿石魔种
  - 1.1.1a
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
  - 1.1.1a
---

# 配方与结构

Croparia IF 目前和整合包作者最相关的核心数据类型主要有四种：

- `croparia:infusor`
- `croparia:ritual`
- `croparia:soak`
- `croparia:ritual_structure`

此页面将介绍这几种配方与结构的写法。如果你需要批量生成数据，请参照[运行时数据生成系统](./generator/index.md)与[创建数据生成器](./generator/create-generator.md)。

<a id="entry-shapes"></a>

## 通用输入输出写法

这几类配方内部大量复用了 `ItemInput`、`ItemOutput`、`BlockInput` 与 `BlockOutput`。它们通常都支持“简写”和“对象写法”两种形式。

<a id="item-input"></a>

### 物品输入 `ItemInput`

简写：

- 物品 ID 字符串：`"minecraft:comparator"`
- 标签字符串：`"#croparia:seed_ingredient"`

对象写法：

```json
{
  "id": "minecraft:comparator",
  "amount": 1,
  "components": {}
}
```

- `id: string` 匹配唯一物品 ID
- `tag: string` 匹配物品标签
- `components: Map<String, T>` 可选，物品组件
- `amount: number` 可选，物品数量，默认为 1

`id` 与 `tag` 不能同时指定。

<a id="item-output"></a>

### 物品输出 `ItemOutput`

简写：

- 物品 ID 字符串：`"croparia:croparia"`

对象写法：

```json
{
  "id": "croparia:croparia",
  "amount": 1,
  "components": {}
}
```

- `id: string` 匹配唯一物品 ID
- `components: Map<String, T>` 可选，物品组件
- `amount: number` 可选，物品数量，默认为 1

<a id="block-input"></a>

### 方块输入 `BlockInput`

简写：

- 方块 ID 字符串：`"minecraft:sculk"`
- 标签字符串：`"#croparia:ritual_stands"`

对象写法：

```json
{
  "id": "croparia:block_crop_coal",
  "properties": {
    "age": "7"
  }
}
```

- `id: string` 匹配唯一方块 ID
- `tag: string` 匹配方块标签
- `properties: Map<String, string>` 可选，限制方块状态

`id` 与 `tag` 不能同时指定。

<a id="block-output"></a>

### 方块输出 `BlockOutput`

简写：

- 方块 ID 字符串：`"minecraft:end_stone"`

对象写法：

```json
{
  "id": "minecraft:oak_log",
  "properties": {
    "axis": "y"
  }
}
```

- `id: string` 匹配唯一方块 ID
- `properties: Map<String, string>` 可选，输出方块状态

<a id="infusor"></a>

## 注魔台配方 `croparia:infusor`

- `element`: `string` 要求注魔台当前填充的元素类型，不能为 `empty`
- `ingredient`: [`ItemInput`](#item-input) 要丢入或右键放入注魔台的物品输入
- `result`: [`ItemOutput`](#item-output) 成功后产出的物品输出

示例：

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

<a id="ritual"></a>

## 元素仪式配方 `croparia:ritual`

- `ritual: string`：要求中心仪式台满足的等级或标签
- `block: [BlockInput](#block-input)`：结构中 `$` 标记位置必须放置的输入方块
- `ingredient: [ItemInput](#item-input)`：要丢在或右键仪式台的输入物品
- `result: [ItemOutput](#item-output)`：配方成功后的结果物品

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

需要特别注意的是：

- `ritual` 并不描述整个结构，只描述中心仪式台本身
- 真正的多方块形状由[仪式结构](#ritual-structure)决定

也就是说，一个 `RitualRecipe` 只有在对应 `RitualStructure` 验证通过时才可能生效。

<a id="soak"></a>

## 元素浸润配方 `croparia:soak`

- `element: string`：上方注魔台当前的元素类型，不能为 `empty`
- `probability: [number](./generator/placeholder.md#number)`：本次浸润成功的概率，0 - 1 的小数
- `input: [BlockInput](#block-input)`：被浸润的输入方块
- `output: [BlockOutput](#block-output)`：成功时要变成的输出方块

示例：

```json
{
  "type": "croparia:soak",
  "element": "air",
  "input": "minecraft:stone",
  "output": "minecraft:end_stone",
  "probability": 1.0
}
```

另外，真正的尝试次数还会受配置中的 `soakAttempts` 影响，可结合[配置与指令](./configuration-command.md#config-file)一起调整。

<a id="ritual-structure"></a>

## 仪式结构 `croparia:ritual_structure`

`RitualStructure` 不是配方，而是仪式台的多方块结构定义。其字段包括：

- `ritual: string` 表示这个结构对应的中心仪式台类型
- `keys: Map<String, BlockInput>` 定义 `pattern` 中各字符代表什么方块输入
- `pattern: string[][]` 三维字符结构，需要至少包含一个 `*` 和 `$`

`keys` 的保留字符不能直接写入映射：

- `*`：中心仪式台位置，必须与当前 `ritual` 匹配
- `$`：输入方块位置，运行仪式时会检查这里放的方块，并在成功后销毁
- `.`：表示仅空气方块
- ` `：表示任意方块

`pattern` 的层级结构如下：

- 最外层：从下到上的层列表
- 每层内部：按行排列的二维字符图案
- 每个字符：表示当前位置的方块要求

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
