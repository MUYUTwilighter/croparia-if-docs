---
title: 添加内置作物
description: 面向开发者介绍如何在 Croparia IF 中添加内置果实作物与巨果作物，包括应修改的注册入口、最小定义字段，以及添加后会自动派生出的内容。
keywords:
  - Croparia IF
  - 开发者文档
  - Crop
  - Melon
  - Crops
  - Melons
  - DgRegistries
  - ItemMaterial
  - BlockMaterial
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 添加内置作物

<a id="overview"></a>

如果你打开这页，是因为你想往 Croparia IF 里继续加一个内置作物，那么最重要的结论可以先放在前面：

- 果实作物主要去改 `registry/Crops.java`
- 巨果作物主要去改 `registry/Melons.java`
- 这两类内容都不是“只加一条注册表记录”就结束，而是会自动派生出对应方块和物品
- 真正决定“这条内容会不会出现”的，不只是你有没有 new 出对象，还包括 `shouldLoad()`、依赖和配置过滤

所以这页不再试图当一份泛化的作物系统总览，而是直接回答：

- 我应该在哪个文件里添加内置作物
- 添加一条 `Crop` 或 `Melon` 最少要提供什么
- 加进去之后，Croparia IF 会自动帮我派生出什么内容
- 如果某条内容没有生效，我应该先排查哪一层

如果你要的是整合包层面的自定义方式，应该看 [自定义作物](../modpack/custom-crops.md)。

<a id="two-lines"></a>

## 先区分两类内容

Croparia IF 里和“作物内容”直接相关的内置内容，主要分成两条线：

- `Crop`
  - 果实作物
  - 典型产物是种子、果实和对应作物方块
- `Melon`
  - 巨果作物
  - 典型产物是种子、果实方块、藤蔓和连接藤蔓

如果你只是想知道“我该改哪个文件”，可以先这样判断：

- 产物是普通果实、对应一株可收获作物
  - 看 `Crop`
- 产物是巨果、对应藤蔓和果实体结构
  - 看 `Melon`

它们虽然都属于作物体系，但在代码中不是同一个实现模板。

最重要的差异有：

- `Crop` 使用 `ItemMaterial`
- `Melon` 使用 `BlockMaterial`
- `Crop` 有 `type`
- `Melon` 没有 `type`
- `Crop` 派生的是“作物方块 + 种子 + 果实”
- `Melon` 派生的是“果实方块 + 种子 + 藤蔓 + 连接藤蔓 + 果实物品”

所以从开发者视角看，它们更像两类不同的内容模板，而不是一个类只换了贴图。

<a id="crop-line"></a>

## 如何添加一个内置 `Crop`

<a id="add-crop"></a>

### 第一步：去 `Crops.java`

内置果实作物的主入口就是 `registry/Crops.java`。

Croparia IF 自己目前就是在这里定义大部分内置果实作物，并通过字段初始化把它们注册进：

- `DgRegistries.CROPS`

如果你只是想新增一条内置内容，通常不需要先改更底层的 `Crop` 类，第一步就是在 `Crops.java` 增加一条定义。

### 第二步：选合适的帮助方法

当前最常见的入口有三类：

- `croparia(...)`
  - 适合材料本身就是 Croparia IF 自己提供的内容
- `vanilla(...)`
  - 适合材料直接对应原版物品
- `compat(...)`
  - 适合材料来自兼容模组，或者想按标签与依赖条件加载

如果你只是给原版物品加一条内置作物，通常直接照着 `vanilla(...)` 现有写法加一条新常量就够了。

### 第三步：准备最小字段

构造一条 `Crop` 定义时，最少要想清楚这些信息：

- `name`
  - 会进入最终的注册名
- `material`
  - 这条作物产出的材料语义
- `color`
  - 主要服务渲染与资源生成
- `tier`
  - 作物等级
- `type`
  - 资源表现类型，如 `crop`、`animal`、`monster`
- `dependencies`
  - 需要时控制是否加载，以及优先选哪个翻译键

这也是为什么我不建议把 `Crop` 只理解成“作物元数据对象”：它已经携带了内容落地所需的大部分信息。

### 第四步：注册后会自动得到什么

一条 `Crop` 被创建并注册后，不是只得到一个定义对象。

`Crop` 构造时会准备三类派生对象：

- `CropariaCropBlock`
- `CropSeed`
- `CropFruit`

而在 `onRegister()` 时，它们会被真正注册出去。

所以从“加一条内置作物”的开发体验来看，你通常做的是：

1. 在 `Crops.java` 增加一条定义
2. 让它进入 `DgRegistries.CROPS`
3. 剩下的方块/种子/果实派生注册由 `Crop` 自己完成

这也是这一套设计最方便的地方。

### 一个 `Crop` 真正代表什么

`Crop` 的核心字段包括：

- `Identifier id`
- `ItemMaterial material`
- `Color color`
- `int tier`
- `String type`
- `Map<String, String> translations`
- `CropDependencies dependencies`

在新增内置作物时，最值得开发者关心的是 `material` 和 `type`：

- `material`
  - 决定它最终产出的材料语义
  - 同时也会被别的系统继续复用
- `type`
  - 更接近资源和表现分类
  - 例如 `crop`、`animal`、`monster`、`nature` 这些预设类型

因此 `Crop` 更像“果实作物定义 + 派生注册模板”，而不是单纯的配置对象。

### 为什么有时加了定义却没有出现

如果你在 `Crops.java` 里加了一条定义，但游戏里没看到对应内容，优先排查这几层：

- `dependencies`
  - 当前环境里这条内容是否应当加载
- `shouldLoad()`
  - 依赖与配置过滤是否通过
- `CropariaIf.CONFIG.isCropValid(...)`
  - 当前配置是否允许这条作物
- `onRegister()`
  - 派生方块和物品是否真的被触发注册

也就是说，“定义存在” 和 “最终内容出现” 中间还隔着一层加载判定。

<a id="melon-line"></a>

## 如何添加一个内置 `Melon`

<a id="add-melon"></a>

### 第一步：去 `Melons.java`

内置巨果内容的主入口是 `registry/Melons.java`。

和 `Crops.java` 一样，这里的每一条定义最终都会先进入：

- `DgRegistries.MELONS`

所以如果你的目标是“新增一个内置巨果”，第一步也是先在 `Melons.java` 新增定义。

### 第二步：准备最小字段

`Melon` 这条线比 `Crop` 更固定，当前最常见的是 `vanilla(...)` 这种写法。

你至少需要提供：

- `name`
- `material`
  - 这里是 `BlockMaterial`
- `color`
- `tier`

相比 `Crop`，它没有 `type`，因为巨果结构的表现模板本来就更固定。

### 第三步：它会自动派生什么

一条 `Melon` 定义在构造时会准备五类派生对象：

- `MelonStem`
- `MelonAttach`
- `MelonSeed`
- `MelonBlock`
- `MelonItem`

然后在 `onRegister()` 时统一注册出去。

所以对开发者来说，添加内置巨果的体验也是类似的：

1. 在 `Melons.java` 增加一条定义
2. 注册到 `DgRegistries.MELONS`
3. 由 `Melon` 自己派生出藤蔓、连接藤蔓、果实方块、果实物品和种子

### `Melon` 真正适合怎么理解

`Melon` 的核心字段相对更收敛：

- `Identifier id`
- `BlockMaterial material`
- `Color color`
- `int tier`
- `Map<String, String> translations`
- `CropDependencies dependencies`

这里最值得记住的是：

- `Melon` 不是普通果实作物的简化版
- 它是“巨果作物结构定义 + 派生注册模板”

如果你要新增一条内置巨果，重点通常不是改很多运行时逻辑，而是把这条定义本身写正确。

<a id="registries"></a>

## 补充：为什么会先经过 `DgRegistries`

无论是 `Crop` 还是 `Melon`，内置内容都不是直接在 `Crops` / `Melons` 里往原版注册表塞方块物品，而是先进入：

- `DgRegistries.CROPS`
- `DgRegistries.MELONS`

对维护内置内容的开发者来说，只要先记住这条顺序就够了：

1. `Crops.java` / `Melons.java` 写入内容定义
2. `DgRegistries` 收集这批定义
3. `Crop` / `Melon` 在注册阶段派生真正的方块和物品

之所以这样设计，是因为后续资源生成、语言生成和派生注册都可以围绕同一批定义对象工作。

<a id="dependencies"></a>

## 兼容、翻译和加载控制

`Crop` 和 `Melon` 都带有 `CropDependencies`。

这一层的意义不只是“记录依赖模组名”，更重要的是：

- 决定当前内容是否应该加载
- 决定应当使用哪一个翻译键

因此如果你在做内置兼容内容，不要把依赖处理理解成“最后再补点判断”。

在这套设计里：

- 依赖条件本来就是内容定义的一部分
- 翻译键选择也跟着定义一起走

这也是 `compat(...)` 这类帮助方法存在的原因之一：

- 同一条内容定义
- 可以根据当前环境选择不同的翻译与加载结果

<a id="load-and-register"></a>

## 排查链：定义进入游戏的大致顺序

`Crop` 和 `Melon` 这两类定义对象都实现了两件很关键的事：

- `shouldLoad()`
- `onRegister()`

`shouldLoad()` 主要看：

- 依赖条件是否满足
- 配置是否允许该作物加载

`onRegister()` 则负责真正把派生对象注册出去。

如果你想 debug 一条新加内容为什么没有落地，最值得沿着看的顺序通常是：

1. 在 `Crops.java` 或 `Melons.java` 中创建定义
2. 注册到对应的 `DgRegistries`
3. 调用 `shouldLoad()` 判断是否应当加载
4. 通过后执行 `onRegister()`
5. 派生出的方块和物品进入真正注册流程

也就是说，如果你在看“为什么某个作物没有出现”，不要只盯着原版注册表，还要回头看定义对象的 `shouldLoad()`、依赖条件和 `onRegister()` 是否真的走到。

<a id="what-to-learn"></a>

## 最值得开发者记住的事

如果你的目标是继续维护或扩展 Croparia IF 自己的内置作物内容，这页最重要的结论其实就这几条：

- 加内置果实作物：先看 `Crops.java`
- 加内置巨果：先看 `Melons.java`
- `Crop` / `Melon` 本身不是最终注册产物，而是会派生出整套方块和物品
- 内容有没有真正出现，要同时看定义、依赖、配置过滤和注册链
- 这一块更适合当“模组自身内容维护参考”，而不是“完整开放扩展 API”

<a id="where-next"></a>

## 下一步该看哪里

- 如果你想看这套内容定义如何进入数据生成系统，看 [运行时数据生成系统](generator/index.md#overview)
- 如果你想看整合包层面的自定义写法，看 [自定义作物](../modpack/custom-crops.md)
- 如果你想看这些作物内容最终如何被核心模块消费，通常可以从 [Crop Transmuter](core/crop-transmuter.md#overview) 开始
