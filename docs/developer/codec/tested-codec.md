---
title: TestedCodec
description: 介绍 Croparia IF 的 TestedCodec，它如何在真正编码或解码之前对输入进行前置测试，并作为 MultiCodec 等工具的基础构件。
keywords:
  - Croparia IF
  - Codec API
  - TestedCodec
  - CodecUtil
  - EncodeTest
  - DecodeTest
  - MultiCodec
  - 前置测试
  - 开发者文档
  - 1.1.1a
---

# TestedCodec

<a id="overview"></a>

`TestedCodec<T>` 是 Croparia IF Codec API 里最基础的那一层。它包装了一个普通 `Codec<T>`，并在真正进入编码或解码之前，先执行一段“前置测试”。

它解决的问题是：

- 不是所有 codec 都适合处理所有输入
- 某些格式分支在真正 decode 之前就能根据结构判断“这条路不对”
- 单个 codec 本身并不负责“候选顺序”和“筛选条件”，但组合 codec 时这两个能力很重要

也正因为如此，`TestedCodec` 往往不会单独大规模使用，而是作为 [MultiCodec](multi-codec.md#overview)、[MultiFieldCodec](multi-field-codec.md#overview) 与 `CodecUtil.of(...)` 的基础积木。

<a id="core-idea"></a>

## 核心思路

`TestedCodec<T>` 内部持有三部分：

- 一个真正负责编解码的 `Codec<T>`
- 一个 `EncodeTest<T>`
- 一个 `DecodeTest<?>`

它的行为很直接：

- 编码时先跑 `EncodeTest`
- 解码时先跑 `DecodeTest`
- 测试通过，才调用底层 codec
- 测试失败，直接返回 `DataResult.error(...)`

所以它的价值不在“怎么编解码”，而在“什么时候应该尝试这条 codec 分支”。

<a id="when-to-use"></a>

## 什么时候该用

适合使用 `TestedCodec` 的场景：

- 你要把多个 codec 组合进 `MultiCodec`，但希望按输入结构过滤掉不匹配的分支
- 你希望某个 codec 只在特定对象状态下允许编码
- 你希望为错误分支提供更清晰的错误信息

不太适合的场景：

- 只有一个 codec，且不需要任何预筛选
- 所有合法性都已经在 codec 本身内部自然表达出来

<a id="basic-usage"></a>

## 基本用法

最常见的入口不是直接 `new TestedCodec<>(...)`，而是 `CodecUtil.of(...)`：

```java
Codec<List<String>> raw = Codec.STRING.listOf();

TestedCodec<List<String>> codec = CodecUtil.of(
    raw,
    list -> list.isEmpty()
        ? TestedCodec.fail(() -> "List must not be empty")
        : TestedCodec.success()
);
```

这段代码的含义是：

- 解码阶段直接使用原 codec
- 编码阶段先检查列表是否为空
- 为空就拒绝编码，并返回错误信息

如果你要做解码前检查，也可以传 `DecodeTest`：

```java
TestedCodec<Integer> codec = CodecUtil.of(
    Codec.INT,
    (ops, input) -> ops.getNumberValue(input).isSuccess()
        ? TestedCodec.success()
        : TestedCodec.fail(() -> "Input is not a number")
);
```

<a id="encode-decode-tests"></a>

## EncodeTest 与 DecodeTest

`TestedCodec` 提供了两类测试接口：

- `EncodeTest<T>`
  - 检查“这个对象是否适合用当前 codec 编码”
- `DecodeTest<I>`
  - 检查“这个原始输入是否适合交给当前 codec 解码”

两者都返回 `TestResult`，也就是：

- `success = true/false`
- `msg = Supplier<String>`

这里有一个很实用的点：失败消息是延迟构建的，因此你可以放心写得更具体一些，而不会在成功分支上浪费成本。

<a id="with-multicodec"></a>

## 与 MultiCodec 的关系

如果说 `MultiCodec` 负责“按顺序试多个 codec”，那么 `TestedCodec` 负责“每个 codec 自己先说一声，我适不适合当前输入”。

这也是源码里 `CodecUtil.of(...)` 返回 `MultiCodec` 时，会优先把普通 `Codec` 包装成 `TestedCodec` 的原因。

你可以把关系理解成：

- `TestedCodec`
  - 单分支前置判断
- `MultiCodec`
  - 多分支顺序调度

所以当你设计一个“支持多种输入格式”的 codec 时，通常不是直接手写多个 `if`，而是：

1. 为每一种格式准备一个 codec
2. 必要时给它们加上 `TestedCodec`
3. 最后用 `MultiCodec` 组合

<a id="tips"></a>

## 使用建议

- 当多个 codec 在输入结构上很容易区分时，优先用 `DecodeTest` 明确筛选，而不是让每个 codec 都硬着头皮失败一次。
- `EncodeTest` 更适合做“该不该用这个分支”，而不是做全部业务校验；业务约束过多时，错误会更难读。
- 如果你的目标只是“把普通 codec 塞进 MultiCodec”，优先用 `CodecUtil.of(...)`，不要每次都手写构造器。
- 当错误信息是给开发者看的时候，失败消息尽量写成“为什么这条 codec 不适用”，而不是只写“failed”。

