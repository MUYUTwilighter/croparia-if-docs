---
title: MultiCodec
description: 介绍 Croparia IF 的 MultiCodec，它如何按顺序尝试多个 codec，以支持同一数据类型的多种序列化格式。
keywords:
  - Croparia IF
  - Codec API
  - MultiCodec
  - TestedCodec
  - CodecUtil
  - listOf
  - 多格式
  - 联合 codec
  - 开发者文档
  - 1.1.1a
---

# MultiCodec

<a id="overview"></a>

`MultiCodec<T>` 用于让一个数据类型支持多种不同的存储格式。它会按顺序尝试内部保存的多个 codec，并返回第一个成功的结果。

这个能力在原版 `Codec` 体系里非常常见，但 Mojang 并没有直接提供一个“多候选顺序 codec”。Croparia IF 的 `MultiCodec` 正好把这件事做成了一个通用工具。

<a id="core-idea"></a>

## 核心思路

`MultiCodec<T>` 本质上是一个 `ArrayList<TestedCodec<? extends T>>`，同时自己也实现了 `Codec<T>`。

它的行为可以概括成：

1. 按顺序尝试第一个 codec
2. 如果失败，记录错误信息
3. 再尝试下一个 codec
4. 直到某个 codec 成功
5. 如果全都失败，合并错误信息并返回

所以它最重要的不是“能装多个 codec”，而是“候选顺序是有意义的”。

前面的 codec 会优先吃掉输入，因此你在设计时必须清楚：

- 哪个格式更具体
- 哪个格式更宽泛
- 失败信息是否足够帮助调试

<a id="when-to-use"></a>

## 什么时候该用

最常见的场景包括：

- 同一个值允许写成单值或列表
- 同一个对象允许写成简写形式或完整对象形式
- 旧版本配置与新版本配置需要同时兼容

例如，一个字段既可以写成：

```json
"minecraft:stone"
```

也可以写成：

```json
["minecraft:stone", "minecraft:dirt"]
```

这类情况就很适合用 `MultiCodec`。

<a id="basic-usage"></a>

## 基本用法

最常见的构造入口是 `CodecUtil.of(...)`：

```java
MultiCodec<List<String>> codec = CodecUtil.of(
    Codec.STRING.listOf(),
    Codec.STRING.xmap(List::of, List::getFirst)
);
```

这段代码表示：

- 先尝试把输入当成列表
- 如果不行，再尝试把输入当成单个字符串
- 最终统一映射成 `List<String>`

不过在实际使用里，更推荐直接使用 `CodecUtil.listOf(...)`，因为它已经帮你把“单项或列表”这个高频模式封装好了。

<a id="with-tested-codec"></a>

## 与 TestedCodec 的关系

`MultiCodec` 自己只负责“顺序尝试”。至于“某个 codec 在当前输入下是否值得尝试”，则由 [TestedCodec](tested-codec.md#overview) 负责。

`CodecUtil.of(...)` 的实现里会把普通 `Codec` 自动包装成 `TestedCodec`，因此你可以自由选择：

- 直接传普通 codec
- 传已经配置好测试条件的 `TestedCodec`

如果候选分支之间边界很清晰，建议显式加上 `TestedCodec`，这样：

- 错误更清楚
- 不会让过宽的 codec 提前吃掉输入
- 多格式兼容会更稳定

<a id="list-of"></a>

## `CodecUtil.listOf(...)`

`CodecUtil.listOf(codec)` 是 `MultiCodec` 最常见的一个封装。它让一个值既支持：

- 单个元素
- 元素列表

并统一映射成 `List<E>`。

```java
MultiCodec<List<Identifier>> codec = CodecUtil.listOf(Identifier.CODEC);
```

这样就能同时接受：

```json
"croparia:gem_earth"
```

和：

```json
["croparia:gem_earth", "croparia:gem_water"]
```

它的设计重点不是“偷懒少写几行”，而是把这种高频兼容写法固定成统一行为。

<a id="ordering"></a>

## 候选顺序怎么选

设计 `MultiCodec` 时，候选顺序非常重要。一般建议：

- 更具体的格式放前面
- 更宽泛、更容易“误吞输入”的格式放后面

例如：

- “对象写法”通常比“字符串写法”更具体
- “列表写法”通常比“单值写法”更具体

如果顺序放反，很容易出现：

- 某个宽松 codec 提前成功
- 后面真正更合适的 codec 根本没机会尝试

<a id="tips"></a>

## 使用建议

- `MultiCodec` 适合解决“同一语义有多种写法”，不适合拿来替代正常的对象建模。
- 如果候选 codec 太多，优先考虑先收窄数据模型，而不是继续叠更多分支。
- 当某一分支的输入形态很明显时，配合 [TestedCodec](tested-codec.md#with-multicodec) 使用会更稳。
- 如果你的需求只是“单值或列表”，优先直接用 [CodecUtil.listOf](other.md#list-of)。

