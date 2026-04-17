---
title: MultiFieldCodec
description: 介绍 Croparia IF 的 MultiFieldCodec 与 OptionalMultiFieldCodec，它们如何让同一个字段兼容多个键名，并支持缺省字段。
keywords:
  - Croparia IF
  - Codec API
  - MultiFieldCodec
  - OptionalMultiFieldCodec
  - CodecUtil
  - fieldsOf
  - optionalFieldsOf
  - 多键名
  - MapCodec
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# MultiFieldCodec

<a id="overview"></a>

`MultiFieldCodec<T>` 基于 `MapCodec<T>`，用于让同一个字段兼容多个不同的键名。它最适合处理“历史字段名兼容”“别名字段”“同义字段”的问题。

与 [MultiCodec](multi-codec.md#overview) 解决“多种值格式”不同，`MultiFieldCodec` 解决的是“同一个值对应多个字段名”。

<a id="core-idea"></a>

## 核心思路

它的行为可以概括成：

- 解码时，按顺序查看多个键名
- 找到第一个存在且成功解码的字段后返回结果
- 编码时，总是写回第一个键名

所以它天然适合“读取时兼容多个来源，写出时统一收敛”的场景。

例如，你希望兼容这两种输入：

```json
{ "id": 1 }
```

和：

```json
{ "index": 1 }
```

最终都映射到同一个字段，就可以使用 `MultiFieldCodec`。

<a id="codecutil-fields"></a>

## `CodecUtil.fieldsOf(...)`

实际使用时，通常不会直接 `new MultiFieldCodec<>(...)`，而是使用 `CodecUtil.fieldsOf(...)`：

```java
MapCodec<MyType> codec = RecordCodecBuilder.mapCodec(instance -> instance.group(
    CodecUtil.fieldsOf(Codec.INT, "id", "index").forGetter(MyType::getId)
).apply(instance, MyType::new));
```

这里的含义是：

- 解码时兼容 `id` 和 `index`
- 编码时统一写成 `id`

这是一种很适合做平滑重命名的写法。

<a id="optional-field"></a>

## OptionalMultiFieldCodec

`OptionalMultiFieldCodec<T>` 是同一思路的“可缺省版本”。

它的区别是：

- 如果所有候选键都不存在，返回 `Optional.empty()`
- 如果存在候选键但都解码失败，才返回错误

这意味着它更适合：

- 可选字段
- 兼容多个旧字段名，但字段本身不是必须项

实际入口通常是 `CodecUtil.optionalFieldsOf(...)`。

<a id="codecutil-optional"></a>

## `CodecUtil.optionalFieldsOf(...)`

Croparia IF 提供了两种常用用法：

- 返回 `OptionalMultiFieldCodec<T>`
- 直接提供默认值，最终得到普通 `MapCodec<T>`

例如：

```java
MapCodec<Integer> codec = CodecUtil.optionalFieldsOf(Codec.INT, 0, "id", "index");
```

这表示：

- `id` 与 `index` 都是候选键
- 两者都不存在时使用默认值 `0`
- 编码时只会写回第一个字段名

如果你更想保留“字段是否存在”这个语义，可以先拿 `OptionalMultiFieldCodec<T>`，再自己决定如何处理 `Optional<T>`。

<a id="when-to-use"></a>

## 什么时候该用

适合的场景：

- 字段名重命名，但想兼容旧配置
- 同一个概念历史上出现过多个名字
- 需要对外暴露“人类更友好”的别名，同时保留旧键名兼容

不适合的场景：

- 字段名不同，但语义其实已经不同
- 你只是想偷懒少写字段定义

如果两个字段名背后的语义已经分叉，就不应该继续合并到同一个 `MultiFieldCodec` 里。

<a id="tips"></a>

## 使用建议

- 解码兼容多个字段名时，编码统一写回第一个键名，所以第一个名字最好就是你希望长期保留的规范名字。
- 如果字段本身不是必须项，优先考虑 `optionalFieldsOf(...)`，不要把“字段缺失”和“字段解析失败”混为一谈。
- 当你发现自己想给一个字段加很多很多别名时，通常说明配置设计本身需要重新梳理。
- 如果你同时还需要兼容“多种字段名 + 多种值格式”，可以把 `MultiFieldCodec` 和 [MultiCodec](multi-codec.md#overview) 组合起来用。
