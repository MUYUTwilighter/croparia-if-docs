---
title: 创建自定义配方生成器
description: 介绍 Croparia IF 1.1.1a 中 Recipe Wizard 自定义生成器的目录、字段、扩展占位符与实际编写方式。
keywords:
  - Croparia IF
  - 1.1.1a
  - 配方生成器
  - Recipe Wizard
  - 自定义配方生成器
  - recipe_wizard
  - generator
  - 占位符
  - 模板
  - TOML
  - CDG
modVersions:
  - 1.1.1a
---

# 创建自定义配方生成器

配方生成器的自定义，本质上是给 `Recipe Wizard` 添加新的“右键目标方块后，如何从现场上下文生成文件”的规则。

它和[运行时数据生成系统](../generator/index.md)很接近：

- 目标方块匹配条件相当于“什么时候触发”
- `path` 决定生成文件写到哪里
- `template` 决定文件内容长什么样
- 占位符负责从当前点击上下文中取值

和普通[数据生成器](../generator/create-generator.md)的区别是：这里的输入不是一组静态[生成条目](../generator/index.md#entry-registry)，而是“玩家本次右键时的 `UseOnContext`”。

<a id="location"></a>

## 放置位置

配方生成器文件位于：

```text
<filePath>/recipe_wizard/generators
```

其中 `filePath` 就是[配置与指令](../configuration-command.md#config-file)中的自定义文件根目录。

这一路径是源码硬编码的，注意目录名是 `generators`，不是 `generator`。

此外，配方生成器物品在首次读取时，还会把内置模板导出到这个目录下，作为可修改的起点。

<a id="format"></a>

## 文件格式

`RecipeWizardGenerator.read(...)` 最终通过 `DgReader` 读取文件，因此它和普通生成器一样，支持这些格式：

- `toml`
- `json`
- `cdg`

在当前内置模板里，官方使用的是 `toml`，也是最适合手写的格式。

最小示例：

```toml
block = "croparia:infusor"
path = "example/infusor_${datetime}.json"
extensions = "croparia:infusor"
template = """
{
  "type": "croparia:infusor",
  "element": "${infusor_element}",
  "ingredient": ${item._qis},
  "result": ${off_hand._qis}
}
"""
```

<a id="fields"></a>

## 完整字段

`RecipeWizardGenerator` 的字段来自源码中的 `CODEC`，完整如下：

- `enabled: boolean`
- `dependencies: Dependencies`
- `block: BlockInput`
- `path: Template`
- `extensions: ResourceLocation | ResourceLocation[]`
- `template: Template`

下面分别说明。

<a id="enabled"></a>

### `enabled`

- 类型：`boolean`
- 可选，默认值是 `true`

用于控制这个配方生成器是否启用。禁用后，文件会被读取，但不会加入可用的模板列表。

<a id="dependencies"></a>

### `dependencies`

- 类型：依赖对象
- 可选，默认值为空

它的作用和其他文档中的“依赖判断”类似：只有依赖满足时，这个生成器文件才会被加载。

如果依赖不满足，源码会直接跳过这个文件，而不是报错继续使用。

<a id="block"></a>

### `block`

- 类型：[BlockInput](../recipe-structure.md#block-input)
- 必填

用于决定“这个生成器会对哪种目标方块生效”。

只有当玩家右键的方块状态能被 `block` 匹配时，这个生成器才会触发。

示例：

```toml
block = "croparia:infusor"
block = "#croparia:ritual_stands"
```

<a id="path"></a>

### `path`

- 类型：`Template`
- 必填

表示生成结果相对于 `recipeWizard` 输出目录的相对路径。

例如：

```toml
path = "croparia/ritual_${datetime}.json"
```

如果配置中的 `recipeWizard` 目录是 `D:/packs/croparia/recipe_wizard/output`，最终就会写到：

```text
D:/packs/croparia/recipe_wizard/output/croparia/ritual_2026-04-06_12.30.00.json
```

`path` 本身也是模板，所以可以使用本页后面介绍的各种占位符。

<a id="extensions"></a>

### `extensions`

- 类型：`string` 或 `string[]`
- 可选，默认值为空列表

这里填的不是普通文本，而是一组“扩展占位符分组 ID”。源码目前注册了以下几组：

- `croparia:infusor`
- `croparia:ritual`
- `croparia:soak`
- `minecraft:furnace`

`default` 组会始终自动启用，不需要手写。

如果你要使用某一组扩展提供的占位符，就必须把它写进 `extensions`。例如：

```toml
extensions = "croparia:ritual"
```

或：

```toml
extensions = [
  "croparia:ritual",
  "minecraft:furnace"
]
```

<a id="template"></a>

### `template`

- 类型：`Template`
- 必填

表示最终要写出的文件内容，通常就是一段 JSON 模板。

它会在点击时解析占位符，并把结果写入磁盘。

示例：

```toml
template = """
{
  "type": "croparia:soak",
  "element": "${soak_element}",
  "input": ${neighbor._qis},
  "output": ${below._qis},
  "probability": 1.0
}
"""
```

模板语法本身与[占位符解析器](../generator/placeholder.md)一致。

<a id="default-placeholders"></a>

## 默认占位符

无论是否填写 `extensions`，`default` 组占位符都会自动启用。

这些占位符都来自点击时的 `UseOnContext`。

- `${datetime}`
  - 当前时间戳，格式是 `yyyy-MM-dd_HH.mm.ss`
- `${main_hand}`
  - 主手物品，类型相当于 `ItemOutput`
- `${off_hand}`
  - 副手物品，类型相当于 `ItemOutput`
- `${item}`
  - 点击位置上的掉落物，类型相当于 `ItemOutput`
- `${block}`
  - 当前点击的方块，类型相当于 `BlockOutput`
- `${neighbor}`
  - 四周任意一个非空气方块，类型相当于 `BlockOutput`
- `${below}`
  - 下方方块，类型相当于 `BlockOutput`

其中 `block` 还有几个常用子路径：

- `${block.facing}`：点击面前方的方块
- `${block.opposite}`：点击面反方向的方块
- `${block.left}`：点击面顺时针方向一侧的方块
- `${block.right}`：点击面逆时针方向一侧的方块
- `${block.offset(x,y,z)}`：相对点击位置偏移的方块

这些值大多是结构化类型，所以通常要像内置模板一样配合 `_qis` 使用，例如：

```toml
${item._qis}
${block._qis}
${neighbor._qis}
```

如果缺少所需上下文，例如主手没有物品、目标位置没有掉落物，源码会直接弹出覆盖提示并中止生成。

<a id="extension-placeholders"></a>

## 扩展占位符

`extensions` 会决定额外启用哪些领域相关的占位符。

### `croparia:infusor`

- `${infusor_element}`

要求点击目标是已经注入元素的[注魔台](../../general/blocks-and-items/workstations.md)。如果元素为空，会提示玩家先给注魔台注入元素。

### `croparia:ritual`

- `${ritual_input}`

要求点击目标是[仪式台](../../general/blocks-and-items/workstations.md)，并且当前结构能正确识别出输入方块位置。这个占位符会返回仪式结构中 `$` 位置的输入方块。

### `croparia:soak`

- `${soak_element}`

要求点击的是元素石，且其上方存在带元素状态的注魔台。返回值是当前浸润使用的元素名。

### `minecraft:furnace`

- `${furnace_input}`
- `${furnace_time}`

这组扩展面向熔炉类方块：

- `furnace_input` 读取输入槽的物品
- `furnace_time` 读取当前燃料总燃烧时长

如果目标不是熔炉，或输入/燃料槽为空，也会直接弹出提示并终止生成。

<a id="builtin-examples"></a>

## 内置模板示例

当前 `1.1.1a` 内置了三份模板，正好也反映了最典型的写法。

### 注魔台配方

```toml
path = "croparia/infusor_${datetime}.json"
extensions = "croparia:infusor"
block = "croparia:infusor"
template = """
{
  "type": "croparia:infusor",
  "element": "${infusor_element}",
  "ingredient": ${item._qis},
  "result": ${off_hand._qis}
}
"""
```

### 仪式配方

```toml
path = "croparia/ritual_${datetime}.json"
extensions = "croparia:ritual"
block = "#croparia:ritual_stands"
template = """
{
  "type": "croparia:ritual",
  "ritual": ${block._qis},
  "ingredient": ${item._qis},
  "block": ${ritual_input._qis},
  "result": ${off_hand._qis}
}
"""
```

### 浸润配方

```toml
path = "croparia/soak_${datetime}.json"
extensions = "croparia:soak"
block = "croparia:elemental_stone"
template = """
{
  "type": "croparia:soak",
  "element": "${soak_element}",
  "input": ${neighbor._qis},
  "output": ${below._qis},
  "probability": 1.0
}
"""
```

这些例子里最值得注意的是两点：

- `block` 负责决定“什么时候触发”，不是决定生成结果中的输入方块
- 生成 JSON 时，`ItemOutput` / `BlockOutput` 这类结构通常都要用 `_qis` 转成可直接嵌入 JSON 的文本

<a id="tips"></a>

## 使用建议

- 第一次自定义时，先复制内置模板改一份，比从零写更稳。
- `path` 最好带上 `${datetime}`，避免重复点击时覆盖旧文件。
- 如果一个模板需要多个特殊上下文，一定先确认对应的 `extensions` 都已经写上。
- 目标方块匹配只看 `block`，而不是看模板里用了哪些占位符。
- 生成出来的内容通常还是 JSON 配方文件，后续可以继续结合[配方与结构](../recipe-structure.md)检查字段是否符合预期。
