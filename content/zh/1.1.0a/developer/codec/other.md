---
title: 其他工具方法
desc: 介绍 Croparia IF CodecUtil 中除 MultiCodec 和 MultiFieldCodec 之外更常用的辅助工具，包括 extend、listOf、toMap、JSON 读写与 StreamCodec 转换。
keywords:
  - Croparia IF
  - Codec API
  - CodecUtil
  - extend
  - listOf
  - toMap
  - encodeJson
  - decodeJson
  - StreamCodec
  - 开发者文档
  - 1.1.0a
navOrder: 40
---

# 其他工具方法

<a id="overview"></a>

除了 [TestedCodec](tested-codec.md#overview)、[MultiCodec](multi-codec.md#overview) 和 [MultiFieldCodec](multi-field-codec.md#overview) 之外，`CodecUtil` 里还有几组在日常开发中非常实用的方法。

这一页重点介绍最常用、也最值得优先掌握的几类。

<a id="extend"></a>

## `CodecUtil.extend(...)`

这是 Croparia IF Codec API 中最有代表性的一个工具方法。它的目标非常明确：

- 已经有一个父类 `MapCodec`
- 子类只想在父类基础上追加几个字段
- 不想把整段 `RecordCodecBuilder` 重写一遍

例如：

```java
MapCodec<Child> codec = CodecUtil.extend(
    Parent.CODEC,
    Codec.INT.fieldOf("extra").forGetter(Child::getExtra),
    (parent, extra) -> new Child(parent.getId(), extra)
);
```

这里的思路是：

1. 先复用 `Parent.CODEC` 解析父类字段
2. 再读取新增字段 `extra`
3. 最后把两部分结果重新组装成 `Child`

如果你在写继承层级较深的对象，`extend(...)` 的价值会非常明显。

<a id="list-of"></a>

## `CodecUtil.listOf(...)`

`listOf(codec)` 是“单值或列表”这一高频兼容写法的现成封装。

```java
MultiCodec<List<Identifier>> codec = CodecUtil.listOf(Identifier.CODEC);
```

它会同时接受：

- 单个值
- 列表值

并统一返回 `List<E>`。

如果你的配置格式希望对“只有一项”的场景更友好，这个方法会很实用。

<a id="to-map"></a>

## `CodecUtil.toMap(...)`

原版里 `Codec<T>` 和 `MapCodec<T>` 是两个不同层级：

- `Codec<T>` 可以处理任意值
- `MapCodec<T>` 只能处理对象字段结构

`CodecUtil.toMap(...)` 的作用就是：

- 如果输入本来就是 `MapCodec`，直接返回
- 否则用 `MapCodec.assumeMapUnsafe(codec)` 做一次不安全包装

它适合的场景主要是：

- 你手里有一个普通 `Codec`
- 但当前调用位置要求 `MapCodec`

需要注意的是，这个方法名字里的 `unsafe` 不是装饰词，它真的意味着你要自己清楚输入结构是否合适。

<a id="json-helpers"></a>

## JSON 辅助方法

`CodecUtil` 还提供了一组常用的 JSON 读写辅助：

- `encodeJson(object, codec)`
- `decodeJson(element, codec)`
- `dumpJson(object, codec, path, override)`
- `readJson(file, codec)`
- `readJson(string, codec)`

它们的价值主要在于：

- 自动走 `RegistryOps`，避免很多 registry 相关环境细节
- 在工具代码、数据生成、调试输出时更顺手

如果你只是想“验证某个对象能不能正确编码成 JSON”或者“从文件快速读出对象”，这些方法比手动拼 `JsonOps` 更省事。

<a id="stream-codec"></a>

## StreamCodec 相关方法

Croparia IF 还补了两组网络编解码辅助：

- `toStream(codec)`
- `mapStream(codec, parser, getter)`

它们的目标是把普通 `Codec` 转成 `StreamCodec<RegistryFriendlyByteBuf, T>`，方便网络同步或数据包场景复用已有 codec。

如果你已经有稳定的 `Codec<T>`，并且网络侧也想复用相同结构，这组工具会非常实用。

<a id="ops"></a>

## `getOps(...)` 与 `getRegistryOps(...)`

这两个方法属于“通常不需要主动记住，但出问题时很有用”的底层辅助。

它们主要负责：

- 在有游戏上下文时尝试构造 `RegistryOps`
- 在纯测试或早期启动阶段拿不到 registry 时安全回退

如果你自己在工具代码里手动操作 codec，并遇到 registry 相关异常，这两个方法背后的思路很值得参考。

<a id="tips"></a>

## 使用建议

- 子类追加字段时，优先考虑 `extend(...)`，不要急着复制整段父类 codec。
- 想做“单值或列表”兼容时，优先考虑 `listOf(...)`，而不是每次手写一个 [MultiCodec](multi-codec.md#list-of)。
- `toMap(...)` 只在你明确知道目标调用方必须接受 `MapCodec` 时再用，不要把它当常规转换。
- 如果只是想快速调试对象与 JSON 之间的转换，直接用 `encodeJson(...)` / `decodeJson(...)` 会很省时间。

