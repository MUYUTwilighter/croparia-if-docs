# 其他

<a id='elematilius_ore'></a>

## 元素矿石

<RowGallery>
<GameItemCard id="croparia:elematilius_ore"></GameItemCard>
<GameItemCard id="croparia:deepslate_elematilius_ore"></GameItemCard>
</RowGallery>

元素宝石的最初来源，于 y = 80 及以下生成，y 值越低理论生成频率越高。挖掘后掉落 1 - 2 个[元素宝石](../concepts/element.md#gems)，受时运与精准采集影响。

<a id='croparia:activated_shrieker'></a>

## 活化尖啸体

<div class="doc-center">
<GameItemCard id="croparia:activated_shrieker"></GameItemCard>
</div>

与尖啸体类似，但是永远处于可召唤监守者的状态。

### 合成

<div class="doc-center">
<RecipeDisplay id="croparia:infusor/activated_shrieker"></RecipeDisplay>
</div>

<a id='croparia:recipe_wizard'></a>

## 配方生成器

<div class="doc-center">
<GameItemCard id="croparia:recipe_wizard"></GameItemCard>
</div>

创造模式调试工具，可以用于便捷生成配方文件。它主要服务于[注魔台](./workstations.md#croparia:infusor)、[元素石](./workstations.md#croparia:elemental_stone)与[仪式台](./workstations.md#croparia:ritual_stand)等系统。

### 使用方式

#### 生成配方

手持配方生成器右键目标方块即可触发一次配方生成。

配方生成器会读取玩家的状态（比如手持的物品）与目标方块的环境（比如方块状态），在输出路径生成一份配方文件（JSON 格式）。

参数对照：

- [注魔台](./workstations.md#croparia:infusor)
-
    - 注魔台放置的物品：输入物品
-
    - 副手手持物品：输出物品
-
    - 注魔台的元素灌注状态：元素种类
- [元素石](./workstations.md#croparia:elemental_stone)
-
    - 元素石上方的注魔台元素灌注状态：元素种类
-
    - 元素石周围的方块：输入方块
-
    - 元素石下方的方块：输出方块
- [仪式台](workstations.md#croparia:ritual_stand)
-
    - 仪式结构的输入方块位置的方块：输入方块
-
    - 仪式台上的物品：输入物品
-
    - 副手手持物品：输出物品

#### 特殊行为

潜行时手持配方生成器右键目标方块可以触发一些特殊行为。

- [注魔台](./workstations.md#croparia:infusor)：切换注魔台的元素灌注状态
- [元素石](./workstations.md#croparia:elemental_stone)
  ：在元素石的上方生成一个[注魔台](./workstations.md#croparia:infusor)
- [仪式台](workstations.md#croparia:ritual_stand)：以仪式台为中心，生成对应的仪式结构
