---
title: 遗物
desc: 收录 Croparia IF 1.1.0a 中的实用遗物道具，包括魔力绳、丰饶号角、点金之手与无尽苹果。
keywords:
  - Croparia IF
  - 遗物
  - 魔力绳
  - 丰饶号角
  - 点金之手
  - 无尽苹果
  - 实用道具
  - 传送
  - 经验消耗
  - 仪式召唤
  - 1.1.0a
navOrder: 30
---

# 遗物

遗物是一系列实用道具，它们的功能多种多样。

<a id='croparia:magic_rope'></a>

## 魔力绳

<div class="doc-center">
<GameItemCard id='croparia:magic_rope'></GameItemCard>
</div>

魔力绳可以将玩家传送至记录的坐标。

手持魔力绳，潜行并右键地面即可记录坐标。手持已记录坐标的魔力绳对地面右键即可触发传送。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/horn_plenty"></RecipeDisplay>
</div>

<a id='croparia:horn_plenty'></a>

## 丰饶号角

<div class="doc-center">
<GameItemCard id='croparia:horn_plenty'></GameItemCard>
</div>

长按右键可以消耗经验召唤任意食物。消耗的经验数量与召唤出的食物的饱食度相等。

不可召唤出的食物通过标签 `#croparia:horn_plenty_blacklist` 指定。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/magic_rope"></RecipeDisplay>
</div>

<a id='croparia:midas_hand'></a>

## 点金之手

<div class="doc-center">
<GameItemCard id='croparia:midas_hand'></GameItemCard>
</div>

点金之手可以将方块转换为金锭，或是将实体变为金块。

当作用在方块上时，消耗 10 点经验，破坏方块生成 1 个金锭掉落物，并根据方块的硬度决定冷却时间。不可起效的方块通过标签
`#croparia:midas_hand_immune`
指定，作用在这些方块时会对玩家生成一道闪电。

当作用在生物上时，会清除该生物，在其位置生成一个金块。若为敌对生物，则消耗 2 倍于其生命值的经验，并添加 400
游戏刻的冷却时间；若为其他生物，则消耗与其生命值等值的经验，并添加 200 游戏刻的冷却时间。不可起效的实体通过标签
`#croparia:midas_hand_immune` 指定，作用在这些实体时会在这些实体上生成一道闪电。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/midas_hand"></RecipeDisplay>
</div>

<a id='croparia:infinite_apple'></a>

## 无尽苹果

<div class="doc-center">
<GameItemCard id='croparia:infinite_apple'></GameItemCard>
</div>

不会消耗的一种食物。每次食用会给予 5 秒与附魔金苹果等效的药水效果，冷却时间为 200 游戏刻。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:ritual/relic/infinite_apple"></RecipeDisplay>
</div>

