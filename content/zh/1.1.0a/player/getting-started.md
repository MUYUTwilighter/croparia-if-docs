---
title: 快速入门
description: Croparia IF 1.1.0a 玩家快速入门，涵盖安装、元素矿石、注魔台、魔种升级与早期游玩路线。
navOrder: 1
keywords:
  - Croparia IF
  - 矿石魔种
  - 1.1.0a
  - 玩家
  - 入门
  - 新手教程
  - 快速入门
  - 安装
  - 开荒
  - 元素矿石
  - 元素宝石
  - 元素药水
  - 注魔台
  - 仪式台
  - 魔种
  - 一阶魔种
  - 二阶魔种
  - 巨果作物
  - 配方生成器
---

# 快速入门

此页面将帮助你安装并初步入门本模组。

## 安装

1. 确认你要安装的游戏版本与模组加载器，你可以在[通用文档](../general/index.md)查看本模组支持信息；
2. 在 [CurseForge](https://www.curseforge.com/minecraft/mc-mods/croparia-if)、
   [Modrinth](https://modrinth.com/mod/croparia-if)，或是支持内置下载的启动器中下载并安装**本模组**、
   [**Architectury API**](https://modrinth.com/mod/architectury-api/versions)
   以及 [**Fabric API**](https://modrinth.com/mod/fabric-api/versions)（如果你使用的是 Fabric）；
3. 如果你是从网页上手动下载的，将下载的 `.jar` 文件放在 `[游戏目录]/mods` （或 `[游戏目录]/versions/[实例名称]/mods`
   ，若开启了版本隔离） 中。
4. 启动游戏，进入存档即可开始游戏。

- **注 1**：强烈推荐安装 [REI](https://modrinth.com/mod/rei/versions)，[JEI](https://modrinth.com/mod/jei/versions)
  等物品管理器，以方便配方查看。
- **注 2**：本模组添加了一些在主世界中生成的矿石，它们至关重要。如果你进入了之前未加入本模组的存档，你需要重新生成区块才能获得这些矿物。

## 游玩入门

本模组添加的新概念、机制较多，强烈推荐安装 [REI](https://modrinth.com/mod/rei/versions)，[JEI](https://modrinth.com/mod/jei/versions)
等物品管理器。

本模组内置兼容了原版的进度系统，跟随进度进行游戏也是一个不错的选择！

### 1. 挖掘元素宝石

首先，我们需要准备进入矿洞，挖掘[元素矿石](../general/blocks-and-items/others.md#elematilius_ore)。

你可以在高度 `Y <= 80` 的地方找到它，高度值越低，理论生成频率越高。

<RowGallery>
<GameItemCard id="croparia:elematilius_ore"></GameItemCard>
<GameItemCard id="croparia:deepslate_elematilius_ore"></GameItemCard>
</RowGallery>

![矿洞中的元素矿石](/assets/elematilius_in_cave.webp)

挖掘后可获得[元素宝石](../general/concepts/element.md#gems)。我们需要大约 10-20 个即可。

<RowGallery>
<GameItemCard id="croparia:gem_elemental"></GameItemCard>
</RowGallery>

### 2. 制作魔种

回到地面，我们开始准备制作果实作物种子。

作物的种子需要以**魔种**为核心材料；我们从[**一阶魔种**](../general/blocks-and-items/croparia.md#croparia:croparia)开始，制作它需要用到[**注魔台**](../general/blocks-and-items/workstations.md#croparia:infusor)、[**元素药水**](../general/concepts/element.md#potion)（一个元素宝石 +
一个玻璃瓶）与 4 个任意的种子。

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/infusor"></RecipeDisplay>
</div>

准备好后，即可开始制作[**一阶魔种**](../general/blocks-and-items/croparia.md#croparia:croparia)，这是它的配方表：

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/croparia"></RecipeDisplay>
</div>

配方表中，左侧[元素药水](../general/concepts/element.md#potion)表示需要灌注的元素类型。将[**注魔台**](../general/blocks-and-items/workstations.md#croparia:infusor)放在地上，手持**元素药水**对其右键使用，即可给**注魔台**填充元素。

<RowGallery>
<img src="/assets/place_infusor.webp" alt="放置注魔台" style={{ height: "300px" }} />
<img src="/assets/infuse_infusor.webp" alt="填充元素" style={{ height: "300px" }} />
</RowGallery>

上方的种子即为会被消耗的输入物品。将其丢出或是手持右键**注魔台**即可触发元素灌注，合成[**一阶魔种**](../general/blocks-and-items/croparia.md#croparia:croparia)。输出物品会自动放置在你的物品栏中。

![放置物品](/assets/infusor_place_item.webp)

之后，你可以在物品管理器查阅关于**一阶魔种**的用途，用它合成果实种子后即可开始种植你想要的材料了。

![种植种子](/assets/plant_seeds.webp)

**技巧 1**：用来合成**魔种**的[**元素宝石**](../general/concepts/element.md#gems)也有着对应的作物！用它配合骨粉，就能大量制作新的种子；
**技巧 2**：你可以用一系列红石器具来实现元素灌注的自动化，详见[注魔台](../general/blocks-and-items/workstations.md#croparia:infusor)。

### 3. 升级魔种

越高级的**魔种**能够合成更稀有的材料的果实种子，想要升级魔种就需要用到**一阶元素仪式**。

元素仪式是以仪式台为核心的一类多方块结构，你可以在物品管理器中查询它的结构：

<RowGallery>
<RecipeDisplay id="croparia:ritual_stand"></RecipeDisplay>
</RowGallery>

_如果物品管理器中的仪式结构过于晦涩，你可以新建一个创造模式存档，手持[配方生成器](../general/blocks-and-items/others.md#croparia:recipe_wizard)对着仪式台右键，即可原地生成一个对应的仪式结构。_

配方中的 "输入方块" 用于标记我们之后要放置方块的位置，搭建时留空即可。

![搭建好的一阶元素仪式](/assets/ritual_structure-1.webp)

我们来看一下合成**二阶魔种**所需要的**土元素宝石**的合成表：

<RowGallery>
<RecipeDisplay id="croparia:ritual/gem/earth"></RecipeDisplay>
</RowGallery>

中间的仪式台表示配方可使用的最低仪式等级。左侧的砂土表示输入方块，我们放置在刚刚配方中标记的输入方块位置即可。

![放置输入方块](/assets/ritual-place-input-block.webp)

上方的输入物品和注魔台类似，丢在或右键一阶仪式台即可触发元素仪式。

![丢出输入物品](/assets/ritual-drop-item.webp)

_如果仪式搭建不正确，会提示 "魔素并未响应祭坛的召唤"；如果仪式搭建正确而输入方块/物品不正确，会提示 "魔素拒绝了你的供品"。_

之后，我们就获得了**土元素宝石**。用它与玻璃瓶合成[**土元素药水**](../general/concepts/element.md#potion)（土元素瓶），即可在[注魔台](../general/blocks-and-items/workstations.md#croparia:infusor)上升级魔种。

<RowGallery>
<RecipeDisplay id="croparia:infusor/croparia2"></RecipeDisplay>
</RowGallery>

- **注 1**：搭建好仪式台后，你可以合成用于生产方块材料的[**巨果作物**](../general/concepts/crop.md#melon)。详见你的物品管理器；
- **注 2**：元素仪式除了用来合成新物品外，还可以进行附魔与生物召唤，详见[仪式台](../general/blocks-and-items/workstations.md#croparia:ritual_stand)

## 下一步

- 除了作物外，本模组还添加了一些有趣的道具，详见[遗物](../general/blocks-and-items/relic.md)；
- 一些材料获取困难怎么办？可以来看看[元素浸润](../general/blocks-and-items/workstations.md#croparia:elemental_stone)；
- 准备好开始自动化量产了？来看一看[矿石魔种的自动化示例](automation.md)
- 如果遇到了一些问题，可以来看一看[常见问题与解答](faq.md)
