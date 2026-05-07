---
title: JSON 转换
desc: 介绍 Croparia IF 中的 JsonTransformer，它如何把 json、toml 与 cdg 等文本格式统一转换为 JsonElement 以供后续 Codec 读取。
keywords:
  - Croparia IF
  - JsonTransformer
  - JSON
  - TOML
  - CDG
  - JsonElement
  - 开发者文档
  - 1.1.0a
navOrder: 20
---

# JSON 转换

<a id="overview"></a>

`JsonTransformer` 位于 `api.json`，它的职责很直接：把不同文本格式的配置内容统一转换成 `JsonElement`。

这一层的意义在于：

- 上层系统可以继续使用统一的 `Codec` / `JsonElement` 流程
- 文件格式差异被限制在读取入口，而不会散落到业务代码里

当前源码中默认支持的文本格式有：

- `json`
- `toml`
- `cdg`

<a id="mental-model"></a>

## 心智模型

可以把 `JsonTransformer` 理解成“进入 Codec 之前的一层文本预处理器”。

它本身不负责：

- 业务结构校验
- 对象反序列化
- registry 解析

它只负责一件事：

- 把某种文本格式变成 `JsonElement`

这也是为什么运行时数据生成系统可以同时读取 `.json`、`.toml`、`.cdg` 文件，但后续的读取流程仍然保持统一。

<a id="workflow"></a>

## 工作流程

`JsonTransformer` 的工作流程非常简单：

1. 根据文件后缀决定使用哪个 transformer
2. 把原始文本转换成 `JsonElement`
3. 交给后续 codec 或业务层继续处理

源码里这个映射关系保存在 `JsonTransformer.TRANSFORMERS` 中。

<a id="formats"></a>

## 为什么这层有价值

它的价值主要体现在边界清晰：

- 文件格式判断集中在入口层
- 上层系统只需要面对统一的 `JsonElement`

如果没有 `JsonTransformer`，上层系统通常会面临两种常见问题：

- 每个功能模块都自己判断 `.json / .toml / .cdg`
- codec 本身被迫承担“文本格式转换”职责

Croparia IF 在这里采用的是：

- 文本先统一转成 `JsonElement`
- 之后一律按 JSON 数据结构继续流动

这让：

- [运行时数据生成系统](../generator/index.md#overview)
- [Codec API](../codec/index.md#overview)

这两类系统都能保持更干净的边界。

<a id="when-to-use"></a>

## 什么时候该复用

如果你在开发中遇到下面这些场景，就可以直接参考 `JsonTransformer` 这套写法：

- 你要支持多种文本配置格式
- 这些格式最终都要进入统一 codec 流程
- 你希望把“读取文件”和“解码对象”拆开

如果你的系统只支持单一 JSON 文件格式，或者根本不需要转成 `JsonElement`，那就没必要为了统一而强行加一层。

<a id="tips"></a>

## 使用建议

- 当一个系统的上层逻辑本质上都是围绕 `JsonElement` 或 `Codec` 展开时，优先考虑先做类似 `JsonTransformer` 的格式收敛层。
- 如果未来要扩展新的文本格式，优先在 transformer 层补入口，而不是去改多个业务模块。
- `JsonTransformer` 最适合做“文本到 JSON 结构”的转换，不适合承担对象级别的语义校验。

