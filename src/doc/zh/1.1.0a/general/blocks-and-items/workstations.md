---
title: 工作方块
desc: 介绍 Croparia IF 1.1.0a 中的主要工作方块，包括温室、注魔台、元素石、作物嬗变仪与仪式台。
keywords:
  - Croparia IF
  - 工作方块
  - 温室
  - 注魔台
  - 元素石
  - 作物嬗变仪
  - 仪式台
  - 自动收获
  - 元素灌注
  - 元素浸润
  - 仪式召唤
  - 红石模式
  - 1.1.0a
navOrder: 20
---

# 工作方块

<a id='croparia:greenhouse'></a>

## 温室

<div class="doc-center">
<GameItemCard id='croparia:greenhouse'></GameItemCard>
</div>

具有 8 级亮度；右键可打开其 3x3 的存储空间；支持各类存储交互。

温室应放置在一格高的各种作物上，在检测到方块更新后就会自动收获一次。收获会自动**消耗 1 个种子**。收获后的物品将存放至温室的存储空间中。

可以自动收获南瓜、西瓜等藤蔓作物，但是藤蔓作物方块附近仍然需要保留 1 格生长空间。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/greenhouse"></RecipeDisplay>
</div>

<a id='croparia:infusor'></a>

## 注魔台

<div class="doc-center">
<GameItemCard id='croparia:infusor'></GameItemCard>
</div>

将元素灌注在放置其上的物品来合成物品的工作方块。

手持任意[元素药水](../concepts/element.md#potion)右键空的注魔台即可完成元素灌注，用空瓶右键已灌注的注魔台可以收回元素。对准注魔台的发射器也可以在被激活时完成上述过程。

手持物品右键注魔台，可以将 1 个物品放置在注魔台上；若注魔台被弱充能，就会将一整格物品放置上去。对准注魔台的投掷器也可以在激活时向注魔台放置
1 个物品。

当合成被触发后，注魔台会依次尝试向丢出输入物品的玩家、注魔台下方的容器方块存入输出物品。若以上对象都不存在，则注魔台会在其上方生成掉落物。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/infusor"></RecipeDisplay>
</div>

### 使用方式

用[元素药水](../concepts/element.md#potion)（配方左侧）右键注魔台完成元素灌注，然后将物品丢在注魔台上，合成就会被触发。

可通过物品管理器查看配方。例如：

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/croparia"></RecipeDisplay>
</div>

### 调试

在潜行时使用[配方生成器](./others.md#croparia:recipe_wizard)右键注魔台可以切换灌注元素状态。

<a id='croparia:elemental_stone'></a>

## 元素石

<div class="doc-center">
<GameItemCard id='croparia:elemental_stone'></GameItemCard>
</div>

一个可合成的装饰方块。可以与[注魔台](#croparia:infusor)组合实现元素浸润。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/elemental_stone"></RecipeDisplay>
</div>

### 使用方式（元素浸润）

将[注魔台](#croparia:infusor)放置在元素石的上方，并灌注元素，元素浸润就会作用在以元素石为中心，同水平面下 3 x 3 区域的方块上。

可通过物品管理器查看配方。例如：

<div class="doc-center">
<RecipeDisplay id="croparia:soak/soul_sand"></RecipeDisplay>
</div>

### 调试

在潜行时使用[配方生成器](./others.md#croparia:recipe_wizard)右键元素石可以在其上方生成一个[注魔台](#croparia:infusor)。

<a id='croparia:crop_transmuter'></a>

## 作物嬗变仪

<div class="doc-center">
<GameItemCard id='croparia:crop_transmuter'></GameItemCard>
</div>

作物嬗变仪是一个将作物果实转换为**指定材料物品**的工作方块。它具有方块实体存储，右键即可打开它的 GUI。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:crafting/crop_transmuter"></RecipeDisplay>
</div>

### 使用方式

![作物嬗变仪界面](/assets/crop_transmuter_example.webp)

右键打开 GUI，在左侧放入作物果实，中间即可选择要输出的材料物品，右侧为输出物品槽。转换速度为 1 次/游戏刻。

右上角的 `R+` 表示仅在**有红石信号时**工作；点击一下即可切换为仅在**没有红石信号时**工作 (`R-`)。

<a id='croparia:ritual_stand'></a>

## 仪式台

<RowGallery>
<GameItemCard id='croparia:ritual_stand'></GameItemCard>
<GameItemCard id='croparia:ritual_stand_2'></GameItemCard>
<GameItemCard id='croparia:ritual_stand_3'></GameItemCard>
</RowGallery>

仪式台是**元素仪式**的核心方块。搭建仪式结构后，在正确的位置放上输入方块，并向仪式台丢出输入物品后触发**仪式召唤**
。仪式召唤可以合成新物品、附魔物品或是召唤生物。

手持物品右键仪式台，可以将 1 个物品放置在仪式台上；若仪式台被弱充能，就会将一整格物品放置上去。对准仪式台的投掷器也可以在激活时向仪式台放置
1 个物品。

### 合成

<RowGallery>
<RecipeDisplay id="croparia:crafting/ritual_stand"></RecipeDisplay>
<RecipeDisplay id="croparia:crafting/ritual_stand_2"></RecipeDisplay>
<RecipeDisplay id="croparia:crafting/ritual_stand_3"></RecipeDisplay>
</RowGallery>

### 使用方式

首先，你需要搭建对应仪式台的仪式结构。高阶的仪式结构可以用于低阶仪式召唤。你可以在**物品管理器**中查看仪式结构：

<RowGallery>
<RecipeDisplay id="croparia:ritual_stand"></RecipeDisplay>
<RecipeDisplay id="croparia:ritual_stand_2"></RecipeDisplay>
<RecipeDisplay id="croparia:ritual_stand_3"></RecipeDisplay>
</RowGallery>

上面的结构示意图中，`输入方块`表示仪式召唤中放置输入方块的位置。根据要准备制作的物品配方，放置输入方块，并将输入物品丢在仪式台上即可触发仪式召唤。

若输出物品为附魔书，则表示为输入物品进行附魔。附魔书的附魔种类/等级表示该仪式召唤可添加的附魔种类与最大等级，附魔书的数量表示一次仪式召唤升级的等级数。

若输出物品为刷怪蛋，则表示生成出对应生物。

### 调试

在潜行时使用[配方生成器](./others.md#croparia:recipe_wizard)右键仪式台可以以其为中心，生成对应的仪式结构。

