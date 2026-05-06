---
title: Codec API
desc: 面向 Croparia IF 下游开发者的 Codec API 概览，介绍 MultiCodec、MultiFieldCodec、TestedCodec 与 CodecUtil 的理解方式和使用场景。
keywords:
  - Croparia IF
  - Codec API
  - CodecUtil
  - MultiCodec
  - MultiFieldCodec
  - OptionalMultiFieldCodec
  - TestedCodec
  - MapCodec
  - RecordCodecBuilder
  - 开发者文档
  - 1.1.0a
navOrder: 50
---

# Codec API

<a id="overview"></a>

Codec API 是 Croparia IF 对原版 `Codec` 系统的一组扩展工具。它的重点不是替代 Mojang 提供的 `Codec`、`MapCodec`、`RecordCodecBuilder`，而是在这些基础之上补足几个原版里经常会遇到的痛点：

- 一个类型需要支持多种序列化格式
- 一个字段需要兼容多个键名
- 编解码前需要先做结构判断
- 一个子类想复用父类 `MapCodec` 并追加字段

如果你已经熟悉原版 `Codec` 系统，可以把这一套看成“以 `CodecUtil` 为入口的几个高频增强工具”。

<a id="when-to-use"></a>

## 什么时候该用 Codec API

优先使用 Croparia IF Codec API 的典型场景有：

- 你想让一个值既能写成单值，也能写成列表
- 你想兼容旧字段名与新字段名
- 你想在真正调用 codec 之前，先根据输入结构筛掉明显不匹配的分支
- 你已经有父类 `MapCodec`，想在子类里继续追加字段，而不想重写整段 `RecordCodecBuilder`

如果只是常规的对象编解码，原版 `RecordCodecBuilder.mapCodec(...)` 通常已经够用，不必为了“统一风格”强行套上 Croparia IF 的扩展。

<a id="mental-model"></a>

## 心智模型

理解这套 API 时，可以先记住下面这张对应表：

- `TestedCodec`
  - 给单个 codec 增加“前置测试”
- `MultiCodec`
  - 把多个 codec 串成“按顺序尝试”的联合 codec
- `MultiFieldCodec`
  - 让一个字段支持多个键名
- `OptionalMultiFieldCodec`
  - 类似 `MultiFieldCodec`，但字段整体可缺省
- `CodecUtil.extend(...)`
  - 在已有 `MapCodec` 基础上追加字段
- `CodecUtil.listOf(...)`
  - 让一个值既支持单项写法，也支持列表写法

如果换成更直白的话：

- `TestedCodec` 解决“这个 codec 什么时候应该被尝试”
- `MultiCodec` 解决“有多个 codec 可以试，谁先上”
- `MultiFieldCodec` 解决“这个字段名可能不止一个”
- `CodecUtil.extend(...)` 解决“父类 codec 不想重写”

<a id="navigation"></a>

## 导航

- [TestedCodec：前置测试](tested-codec.md#overview)
- [MultiCodec：多格式联合](multi-codec.md#overview)
- [MultiFieldCodec：多字段名兼容](multi-field-codec.md#overview)
- [其他工具方法](other.md#overview)

