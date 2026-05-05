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
---

# 自定义作物

Croparia IF 支持为整合包额外定义两类作物：

- `果实作物`：成熟后产出果实，对应 `Crop`
- `巨果作物`：像南瓜和甜瓜那样生成果实方块，对应 `Melon`

这两类自定义内容都会从配置的自定义目录中读取：

- 果实作物：`<filePath>/crops`
- 巨果作物：`<filePath>/melons`

这里的 `filePath` 就是[配置与指令](./configuration-command.md#config-file)里配置的自定义文件根目录。每个 JSON 文件都会被当作一个作物定义读取。

作物只会在游戏启动时完成注册，所以你对作物定义的修改需要重启游戏才能生效。

如果你只是想快速起步，最方便的方式是先用指令导出一个模板文件；如果你要长期维护整合包，还是建议直接手写 JSON。

<a id="command-create"></a>

## 用指令快速创建

指令创建适合快速生成一个可编辑的初始 JSON，它的本质上是把定义文件写到磁盘，不会自动把新作物立即热加载到当前实例中。

### 果实作物

命令格式：

```text
/croparia|cropariaServer crop create <color> [type] [id] [force]
```

- `id` 不写时，默认使用主手物品的路径，并强制放在非 `minecraft` 命名空间下
- `type` 不写时，默认是 `crop`
- 如果同名定义已存在，默认不会覆盖，只有加上 `force` 才会覆写

创建时会读取两个上下文：

- 主手物品：作为 `material`
- 副手 Croparia：其阶级作为 `tier`

### 巨果作物

命令格式：

```text
/croparia|cropariaServer melon create <color> [id] [force]
```

它与果实作物的差别是：

- 不需要 `type`
- 主手物品必须是方块物品，因为它会被解析成巨果作物的方块材料

<a id="manual-files"></a>

## 手动编写文件

如果你需要更细致的调控，那么就需要手动编写作物定义文件。

<a id="crop-json"></a>

## 果实作物文件

完整的示例：

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

- `id`: `string`
  - 作物的资源位置，例如 `kubejs:tin`
  - 会决定这株作物派生出来的种子、果实和作物方块 ID
- `material`: `ItemMaterial`
  - 这株作物对应的材料
  - 可写物品 ID，也可写标签，标签写法带 `#`
  - 数量可选，默认为 2
- `color`: `Color`
  - 作物主色
  - 支持 `#RRGGBB`、`0xRRGGBB` 和十进制整数
- `tier`: `number`
  - Croparia 等阶
- `type`: `string`
  - 可选，默认是 `crop`
  - 主要用于决定果实贴图模板类型
  - 内置常用值包括 `animal`、`crop`、`food`、`monster`、`nature`
- `translations`: `Map<String, string>`
  - 可选，多语言名称
  - 至少建议补 `zh_cn`
- `dependencies`: `string | Map<String, string>`
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

如果你只需要普通物品或标签，直接写字符串就够了；只有需要自定义组件或数量时，才需要对象写法。

<a id="melon-json"></a>

## 巨果作物文件

完整的示例：

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

- `id`: `string`
  - 巨果作物的资源位置
  - 会派生出 `melon`、`melon_item`、`stem`、`attach`、`seed` 等对象
- `material`: `BlockMaterial`
  - 巨果作物对应的方块材料
  - 可写方块 ID，也可写方块标签
  - 数量可选，默认为 2
- `color`: `Color`
  - 颜色写法与果实作物相同
- `tier`: `number`
  - Croparia 等阶
- `translations`: `Map<String, string>`
  - 可选，多语言名称
- `dependencies: string | Map<String, string>`
  - 可选，依赖与翻译键映射

<a id="kubejs"></a>

## KubeJS 方式

如果你希望在脚本里动态注册果实作物，也可以使用 KubeJS 扩展入口。

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

<a id="tips"></a>

## 使用建议

- 第一次做自定义作物时，先用指令导出一个模板，再改成正式 JSON。
- 需要兼容多个模组材料时，优先使用标签或 `dependencies` 映射，不要把翻译键写死到单一模组上。
- 果实作物与巨果作物虽然结构接近，但 `material` 类型和是否拥有 `type` 字段并不相同。

