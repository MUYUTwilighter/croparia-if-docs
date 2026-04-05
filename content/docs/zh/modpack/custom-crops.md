---
title: 自定义作物
description: 介绍 Croparia IF 1.1.0a 中自定义果实作物与巨果作物的基本思路、指令生成方式、手写 JSON 字段，以及 KubeJS 扩展方案。
keywords:
  - Croparia IF
  - 1.1.0a
  - 整合包
  - 自定义作物
  - 果实作物
  - 巨果作物
  - crop
  - melon
  - JSON
  - KubeJS
  - 指令
modVersions:
  - 1.1.0a
---

# 自定义作物

Croparia IF 支持为整合包额外定义两类作物：

- `果实作物`：成熟后产出果实，对应 `Crop`
- `巨果作物`：像南瓜和甜瓜那样生成果实方块，对应 `Melon`

这两类自定义内容都会从配置的自定义目录中读取：

- 果实作物：`<filePath>/crops`
- 巨果作物：`<filePath>/melons`

这里的 `filePath` 就是[配置与指令](./configuration-command.md#config-file)里配置的自定义文件根目录。每个 JSON 文件都会被当作一个作物定义读取。

如果你只是想快速起步，最方便的方式是先用指令导出一个模板文件；如果你要长期维护整合包，还是建议直接手写 JSON。

<a id="command-create"></a>

## 用指令快速创建

指令创建适合做两件事：

- 快速生成一个可编辑的初始 JSON
- 根据你当前手上拿着的材料和 Croparia 等级，自动补出基础字段

它不适合做的事情也要先说明白：

- 指令本质上是把定义文件写到磁盘
- 它不会自动把新作物立即热加载到当前实例中
- 创建完成后，仍然应该把文件当成正式源文件继续手动检查和维护

### 果实作物

使用 `/cropariaServer crop create` 或客户端命令 `/croparia crop create`。

命令格式：

```text
/cropariaServer crop create <color>
/cropariaServer crop create <color> <type>
/cropariaServer crop create <color> <type> <id>
/cropariaServer crop create <color> <type> <id> force
```

创建时会读取两个上下文：

- 主手物品：作为 `material`
- 副手 Croparia：其阶级作为 `tier`

补全规则：

- `id` 不写时，默认使用主手物品的路径，并强制放在非 `minecraft` 命名空间下
- `type` 不写时，默认是 `crop`
- 如果同名定义已存在，默认不会覆盖，只有加上 `force` 才会覆写

### 巨果作物

使用 `/cropariaServer melon create` 或客户端命令 `/croparia melon create`。

命令格式：

```text
/cropariaServer melon create <color>
/cropariaServer melon create <color> <id>
/cropariaServer melon create <color> <id> force
```

它与果实作物的差别是：

- 不需要 `type`
- 主手物品必须是方块物品，因为它会被解析成巨果作物的方块材料

<a id="manual-files"></a>

## 手动编写文件

对整合包作者来说，手动编写 JSON 仍然是最推荐的方式。它的优点是：

- 字段最完整，便于版本管理
- 适合批量维护和审阅
- 后续也容易结合[运行时数据生成系统](./generator/index.md)做自动生成

Croparia IF 当前把果实作物和巨果作物都当作独立 JSON 定义读取。文件路径规则来自 `CropRegistry.dumpCrop`：

- `namespace:path` 会写成 `namespace/path.json`
- 因此 `kubejs:tin` 最终文件就是 `crops/kubejs/tin.json` 或 `melons/kubejs/tin.json`

<a id="crop-json"></a>

## 果实作物文件

果实作物定义对应源码中的 `Crop.CODEC`。最小示例：

```json
{
  "id": "kubejs:tin",
  "material": "#c:ingots/tin",
  "color": "#E3E3E0",
  "tier": 2
}
```

更完整的示例：

```json
{
  "id": "kubejs:tin",
  "material": {
    "name": "#c:ingots/tin",
    "count": 2
  },
  "color": "#E3E3E0",
  "tier": 2,
  "type": "crop",
  "translations": {
    "en_us": "Tin",
    "zh_cn": "锡"
  },
  "dependencies": {
    "techreborn": "item.techreborn.tin_ingot",
    "modern_industrialization": "item.modern_industrialization.tin_ingot"
  }
}
```

<a id="crop-fields"></a>

### 完整字段

- `id: string`
  - 作物的资源位置，例如 `kubejs:tin`
  - 会决定这株作物派生出来的种子、果实和作物方块 ID
- `material: string | ItemMaterial`
  - 这株作物对应的材料
  - 可写物品 ID，也可写标签，标签写法带 `#`
- `color: string | number`
  - 作物主色
  - 支持 `#RRGGBB`、`0xRRGGBB` 和十进制整数
- `tier: number`
  - Croparia 阶级
  - 会影响对应的 Croparia 魔种等级与部分生成内容
- `type: string`
  - 可选，默认是 `crop`
  - 主要用于决定果实贴图模板类型
  - 内置常用值包括 `animal`、`crop`、`food`、`monster`、`nature`
- `translations: Map<String, string>`
  - 可选，多语言名称
  - 至少建议补 `zh_cn`
- `dependencies: string | Map<String, string>`
  - 可选，依赖与翻译键映射
  - 用来表达“只有某个模组存在时，这个作物才应该加载，并使用哪个翻译键”

<a id="item-material"></a>

### `material` 的对象写法 `ItemMaterial`

`material` 除了直接写字符串，还可以写成对象：

```json
{
  "name": "#c:ingots/tin",
  "count": 2
}
```

字段如下：

- `name: string`
  - 物品 ID 或标签
  - 标签必须写成 `#namespace:path`
- `components: Map<String, T>`
  - 可选，物品组件补丁
- `count: number`
  - 可选，默认是 `2`

如果你只需要普通物品或标签，直接写字符串就够了；只有需要自定义组件或数量时，才需要对象写法。

<a id="crop-translations"></a>

### `translations`

`translations` 是直接写入作物名称表的内容，例如：

```json
{
  "translations": {
    "en_us": "Tin",
    "zh_cn": "锡"
  }
}
```

即使你完全不写它，Croparia IF 也会自动生成一个默认的英文名称。比如 `kubejs:tin_ingot` 会自动得到 `Tin Ingot`。

<a id="crop-dependencies"></a>

### `dependencies`

这是最容易误解的字段。它不只是“依赖列表”，而是“模组 ID 到翻译键”的映射。

简写：

```json
"item.create.zinc_ingot"
```

这等价于：

```json
{
  "croparia": "item.create.zinc_ingot"
}
```

完整写法示例：

```json
{
  "create": "item.create.zinc_ingot",
  "gtceu": "material.gtceu.zinc"
}
```

它的行为是：

- 运行时会从这些候选项里选择“当前已安装且未被配置屏蔽的模组”
- 取第一个可用项的翻译键作为实际翻译键
- 如果没有任何候选可用，这株作物就不会加载

如果你不写 `dependencies`，源码会自动为当前作物生成一个默认翻译键：

- 果实作物默认是 `crop.<namespace>.<path>`

<a id="melon-json"></a>

## 巨果作物文件

巨果作物定义对应源码中的 `Melon.CODEC`。最小示例：

```json
{
  "id": "kubejs:tin_block",
  "material": "#c:storage_blocks/tin",
  "color": "#E3E3E0",
  "tier": 2
}
```

更完整的示例：

```json
{
  "id": "kubejs:tin_block",
  "material": {
    "name": "#c:storage_blocks/tin",
    "count": 2
  },
  "color": "#E3E3E0",
  "tier": 2,
  "translations": {
    "en_us": "Tin Block",
    "zh_cn": "锡块"
  },
  "dependencies": {
    "modern_industrialization": "block.modern_industrialization.tin_block"
  }
}
```

<a id="melon-fields"></a>

### 完整字段

- `id: string`
  - 巨果作物的资源位置
  - 会派生出 `melon`、`melon_item`、`stem`、`attach`、`seed` 等对象
- `material: string | BlockMaterial`
  - 巨果作物对应的方块材料
  - 可写方块 ID，也可写方块标签
- `color: string | number`
  - 颜色写法与果实作物相同
- `tier: number`
  - 巨果作物阶级
- `translations: Map<String, string>`
  - 可选，多语言名称
- `dependencies: string | Map<String, string>`
  - 可选，依赖与翻译键映射

巨果作物没有 `type` 字段，这一点和果实作物不同。

<a id="block-material"></a>

### `material` 的对象写法 `BlockMaterial`

`BlockMaterial` 的对象写法更简单：

```json
{
  "name": "#c:storage_blocks/tin",
  "count": 2
}
```

字段如下：

- `name: string`
  - 方块 ID 或方块标签
- `count: number`
  - 可选，默认是 `2`

如果主手拿的是方块物品，用命令导出的巨果作物模板通常就已经足够作为起点。

如果你不写 `dependencies`，源码会自动为巨果作物生成默认翻译键：

- 巨果作物默认是 `melon.<namespace>.<path>`

<a id="kubejs"></a>

## KubeJS 方式

如果你希望在脚本里动态注册果实作物，也可以使用 KubeJS 扩展入口。

当前 `1.1.0a` 源码里提供的是 `CropUtil.create(...)`，对应果实作物，而不是巨果作物。也就是说：

- 果实作物可以走 KubeJS
- 巨果作物当前没有同级的 `MelonUtil.create(...)` 入口

源码签名大致如下：

```java
CropUtil.create(
  rawId,
  material,
  color,
  tier,
  type,
  rawDependencies,
  translations
)
```

参数含义与手写 JSON 基本一一对应：

- `rawId` 对应 `id`
- `material` 对应果实作物的 `material`
- `color` 是整数颜色值
- `tier` 对应阶级
- `type` 对应作物类型，可为 `null`
- `rawDependencies` 对应 `dependencies`
- `translations` 对应 `translations`

它更适合下面这些场景：

- 你已经在用 KubeJS 统一维护整合包数据
- 你希望按脚本批量派生大量相似作物
- 你想把作物定义和其他脚本逻辑放在同一个维护入口

如果你的目标只是稳定交付一个整合包，手写 JSON 通常仍然是更直观、更容易审阅的方案。

<a id="tips"></a>

## 使用建议

- 第一次做自定义作物时，先用指令导出一个模板，再改成正式 JSON。
- 需要兼容多个模组材料时，优先使用标签或 `dependencies` 映射，不要把翻译键写死到单一模组上。
- 果实作物与巨果作物虽然结构接近，但 `material` 类型和是否拥有 `type` 字段并不相同。
- 如果你准备批量生成大量作物定义，下一步可以继续看[创建数据生成器](./generator/create-generator.md)与[占位符解析器](./generator/placeholder.md)。
