---
title: 作物内容组织
description: 面向开发者介绍 Croparia IF 中 Crop 与 Melon 两类内置作物内容的组织方式、注册入口与落地流程，帮助读者理解模组自身是如何添加这些内容的。
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

# 作物内容组织

<a id="overview"></a>

这一页不打算把 `Crop` 或 `Element` 写成“完整开放 API”，因为当前对下游开发者真正有操作意义的部分，主要还是：

- Croparia IF 自己是怎么组织内置果实作物与巨果作物内容的
- 这些内容是怎么进入注册体系并落成方块、物品和语言条目的

所以这页更适合回答：

- 内置 `crop` / `melon` 是怎么添加的
- 构造一个 `Crop` 或 `Melon` 实际上会派生出哪些内容
- 如果你要参考模组自身的内容组织方式，应该先看哪些类

如果你要的是整合包层面的自定义方式，应该看 [自定义作物](../modpack/custom-crops.md)。

<a id="two-lines"></a>

## 两条内容线

Croparia IF 里和“作物内容”直接相关的内置内容，主要分成两条线：

- `Crop`
  - 果实作物
  - 典型产物是种子、果实和对应作物方块
- `Melon`
  - 巨果作物
  - 典型产物是种子、果实方块、藤蔓和连接藤蔓

它们虽然都属于作物体系，但在代码中不是同一个实现模板。

最重要的差异有：

- `Crop` 使用 `ItemMaterial`
- `Melon` 使用 `BlockMaterial`
- `Crop` 有 `type`
- `Melon` 没有 `type`
- `Crop` 派生的是“作物方块 + 种子 + 果实”
- `Melon` 派生的是“果实方块 + 种子 + 藤蔓 + 连接藤蔓 + 果实物品”

所以从开发者视角看，它们更像两类不同的内容族，而不是一个类只换了贴图。

<a id="crop-line"></a>

## `Crop` 这条线

### 数据模型

`Crop` 的核心字段包括：

- `Identifier id`
- `ItemMaterial material`
- `Color color`
- `int tier`
- `String type`
- `Map<String, String> translations`
- `CropDependencies dependencies`

这里最值得注意的是 `material` 和 `type`：

- `material`
  - 决定它最终产出的材料语义
  - 同时也会被别的系统继续复用
- `type`
  - 更接近资源和表现分类
  - 例如 `crop`、`animal`、`monster`、`nature` 这些预设类型

因此 `Crop` 不是一个只装“名字和颜色”的 DTO，它已经同时携带了内容生成与资源分类所需的关键信息。

### 派生内容

构造一个 `Crop` 之后，并不只是得到一个中间对象。

在构造函数里，它已经准备好了三类派生注册对象：

- `CropariaCropBlock`
- `CropSeed`
- `CropFruit`

它们分别通过 `HolderSupplier` 延迟持有，并在 `onRegister()` 中统一尝试注册。

这意味着从模组自己的实现角度看：

- `Crop` 本身是内容定义
- 真正进原版注册表的是它派生出来的方块和物品

也正因为如此，这个类更适合被理解成“作物内容定义对象”，而不是“运行时作物实例”。

### 内置内容如何添加

内置果实作物主要集中在 `registry/Crops.java`。

这里有三类帮助方法：

- `croparia(...)`
  - 给模组自身材料添加作物
- `vanilla(...)`
  - 给原版物品材料添加作物
- `compat(...)`
  - 给兼容模组材料或标签添加作物

这三类方法本质上都在做同一件事：

1. 构造一个 `Crop`
2. 把它注册进 `DgRegistries.CROPS`

差异只在于：

- `material` 的来源是什么
- 依赖和翻译键从哪来

因此如果你想理解“Croparia IF 自己是怎么批量组织大量内置作物内容的”，`Crops.java` 是第一入口。

<a id="melon-line"></a>

## `Melon` 这条线

### 数据模型

`Melon` 的核心字段相对更收敛：

- `Identifier id`
- `BlockMaterial material`
- `Color color`
- `int tier`
- `Map<String, String> translations`
- `CropDependencies dependencies`

这里没有 `type`，因为巨果作物的表现结构本身已经比普通果实作物更固定，它不像 `Crop` 那样需要用一个额外字段区分多种预设表现类型。

### 派生内容

`Melon` 在构造时会准备五类派生注册对象：

- `MelonStem`
- `MelonAttach`
- `MelonSeed`
- `MelonBlock`
- `MelonItem`

这些对象同样通过 `HolderSupplier` 延迟持有，并在 `onRegister()` 中统一注册。

换句话说，一个 `Melon` 定义最终会落成：

- 一套可生长的巨果结构方块
- 对应种子
- 对应可持有的果实物品

所以从内容组织角度看，`Melon` 的派生面甚至比 `Crop` 更大。

### 内置内容如何添加

内置巨果内容集中在 `registry/Melons.java`。

当前这里主要提供的是：

- `vanilla(...)`

它会：

1. 用一个原版方块构造 `BlockMaterial`
2. 创建 `Melon`
3. 注册到 `DgRegistries.MELONS`

相比 `Crops.java`，`Melons.java` 目前更像一组“围绕原版方块材料构造巨果内容”的清单，而不是一个带大量兼容帮助函数的扩展入口。

这也侧面说明了你前面那个判断是对的：

- `Crop` 这条线更值得开发者理解一点
- `Melon` 这条线目前更偏内置内容组织，而不是公开扩展面

<a id="registries"></a>

## 为什么都会先注册到 `DgRegistries`

无论是 `Crop` 还是 `Melon`，内置内容都不是直接在 `Crops` / `Melons` 里往原版注册表塞方块物品，而是先进入：

- `DgRegistries.CROPS`
- `DgRegistries.MELONS`

这么做的好处是：

- 内容定义可以先以统一对象形式收集起来
- 后续资源生成、语言生成、注册派生对象时，都可以围绕这批中间定义工作

所以这两类类文件与其说是“直接注册器”，不如说更像“内置内容定义清单”。

<a id="dependencies"></a>

## `dependencies` 与翻译选择

`Crop` 和 `Melon` 都带有 `CropDependencies`。

这一层的意义不只是“记录依赖模组名”，更重要的是：

- 决定当前内容是否应该加载
- 决定应当使用哪一个翻译键

因此在模组自己的内容组织里，依赖关系不是注册层外部附加的注释，而是内容定义对象的一部分。

这也是 `compat(...)` 这类帮助方法存在的原因之一：

- 同一条内容定义
- 可以根据当前环境选择不同的翻译与加载结果

<a id="load-and-register"></a>

## `shouldLoad()` 与 `onRegister()`

`Crop` 和 `Melon` 这两类定义对象都实现了两件很关键的事：

- `shouldLoad()`
- `onRegister()`

`shouldLoad()` 主要看：

- 依赖条件是否满足
- 配置是否允许该作物加载

`onRegister()` 则负责真正把派生对象注册出去。

这意味着内容定义、加载判定和派生注册在这套体系里是同一层上的连续流程，而不是散落在多个不相干的辅助类里。

对于开发者来说，这一点很值得记住：

- 如果你在看“为什么某个作物没有出现”
- 不要只盯着原版注册表
- 还要回头看定义对象的 `shouldLoad()` 和依赖条件

<a id="what-to-learn"></a>

## 这页真正值得开发者学什么

对下游开发者来说，这一块最有价值的不是“如何扩展一个稳定作物 API”，而是下面这些经验：

- 如何把一类游戏内容先组织成中间定义对象
- 如何让一个定义对象在注册时派生出多种方块和物品
- 如何把依赖判定、翻译选择和注册流程放在同一条内容链里
- 如何通过中间注册表把“内容定义”和“最终注册产物”解耦

所以这页更像是：

- 对 Croparia IF 自身内容组织方式的开发参考

而不是：

- 一个面向下游的完整作物扩展 API 文档

<a id="where-next"></a>

## 下一步该看哪里

- 如果你想看这套内容定义如何进入数据生成系统，看 [Generator API](generator/index.md#overview)
- 如果你想看整合包层面的自定义写法，看 [自定义作物](../modpack/custom-crops.md)
- 如果你想看这些作物内容最终如何被核心模块消费，通常可以从 [Crop Transmuter](core/crop-transmuter.md#overview) 开始
