---
title: 网络
description: 介绍 Croparia IF 1.1.0a 的网络抽象 NetworkHandler 与 NetworkHandlerType，以及作物嬗变仪菜单交互和配方同步两条实际数据流。
keywords:
  - Croparia IF
  - 网络
  - NetworkHandler
  - NetworkHandlerType
  - CropTransmuter
  - S2CSyncRecipeStart
  - S2CSyncRecipeChunk
  - S2CSyncRecipeEnd
  - Architectury
  - 开发者文档
  - 1.1.0a
modVersions:
  - 1.1.0a
---

# 网络

<a id="overview"></a>

Croparia IF 没有把网络层写成一套很重的框架，而是在 Architectury 的 `NetworkManager` 之上包了一层更轻的统一抽象：

- `NetworkHandler`
- `NetworkHandlerType`

这层抽象的目标很直接：

- 让一个包同时携带“类型信息、编解码、方向、处理逻辑”
- 简化跨平台注册流程
- 让发送侧代码尽量保持统一

如果你只是想理解模组里的网络流向，可以先记住一句话：

- `NetworkHandler` 表示“一个可发送、可处理的包”
- `NetworkHandlerType` 表示“这个包的注册信息”

<a id="mental-model"></a>

## 心智模型

Croparia IF 的网络层可以理解成三层：

1. `NetworkHandler`
2. `NetworkHandlerType`
3. `NetworkHandlers`

它们的分工分别是：

- `NetworkHandler`
  - 具体包对象
  - 同时实现 `CustomPacketPayload`
  - 负责提供自己的类型，并实现 `handle(...)`
- `NetworkHandlerType`
  - 描述这个包属于 `C2S` 还是 `S2C`
  - 持有 `CustomPacketPayload.Type`
  - 持有 `StreamCodec`
  - 在需要时附带 `PacketTransformer`
- `NetworkHandlers`
  - 统一注册入口
  - 把所有包类型接进 Architectury 的收发系统

这套结构的关键不是“抽象得多复杂”，而是让每个包都长成同一种样子：

- 一个 record 或对象表示载荷
- 一个 `TYPE` 常量表示注册信息
- 一个 `handle(...)` 表示接收后的处理逻辑

<a id="network-handler"></a>

## `NetworkHandler`

`NetworkHandler` 是 Croparia IF 对单个网络包的最小抽象。

它主要提供三件事：

- `type()`
  - 默认从 `handlerType()` 里取出真正的 payload type
- `send()`
  - 按包方向自动选择发往服务端或广播给客户端
- `handle(NetworkManager.PacketContext context)`
  - 收到包后的业务逻辑入口

这里最值得注意的是：发送逻辑已经被方向约束住了。

- 如果 `handlerType().side()` 是 `C2S`
  - `send()` 会尝试发给服务端
- 如果 `handlerType().side()` 是 `S2C`
  - `send()` 会走广播，或通过 `send(ServerPlayer)` 发给指定玩家

这意味着调用方通常不需要再手动区分“这是不是客户端包”，包类型自己就已经声明了方向。

<a id="network-handler-type"></a>

## `NetworkHandlerType`

`NetworkHandlerType` 是网络包的注册描述对象。

它封装了：

- 包的 `Identifier`
- 收发方向 `NetworkManager.Side`
- `StreamCodec`
- 可选的 `PacketTransformer`

源码里最常见的创建方式有：

- `NetworkHandlerType.ofC2S(...)`
- `NetworkHandlerType.ofS2C(...)`

开发时可以把它理解成“这个包的注册卡片”：

- `NetworkHandler` 是实际发送的内容
- `NetworkHandlerType` 是告诉系统“怎么识别、怎么编解码、走哪一边”

`ofS2C(...)` 额外支持 `PacketTransformer`，这点在大包同步时很重要，后面的配方同步会用到。

<a id="registration"></a>

## 注册流程

统一注册入口在 `NetworkHandlers`。

它的思路是：

- 对每个 `NetworkHandlerType` 调用一次 `register(...)`
- 根据方向选择正确的 Architectury 注册方法
- 对 `S2C` 包额外兼顾“客户端接收”和“服务端声明 payload type”这两种场景

对开发者来说，这一层最重要的价值是：

- 业务包不需要分别写 Fabric / Forge / NeoForge 三套注册逻辑
- 大多数时候只需要关心 `TYPE` 常量和 `handle(...)`

<a id="c2s-flow"></a>

## 典型 C2S：`CropTransmuter`

当前源码里最典型的 `C2S` 用法，是 `CropTransmuter` 菜单界面。

这里有两个包：

- `CropTransmuterSelectPacket`
- `CropTransmuterRedstoneModePacket`

它们都由客户端界面 [CropTransmuterScreen](core/crop-transmuter.md#network-and-ui) 中的按钮或点击操作发出，再由服务端更新对应的方块实体。

### 选择产物

`CropTransmuterSelectPacket` 负责把“玩家在界面里选中了第几个候选产物”发给服务端。

它携带的数据只有：

- `BlockPos pos`
- `int selectedIndex`

服务端处理时会依次校验：

1. 发送方是不是 `ServerPlayer`
2. 当前打开的容器是不是 `CropTransmuterMenu`
3. 菜单绑定的位置是否与包内位置一致
4. 该位置上的方块实体是否真的是 `CropTransmuterBlockEntity`
5. 当前输入材料是否存在
6. `selectedIndex` 是否落在合法范围内

最后才调用 `transmuter.setSelectedIndex(...)`。

这条链很适合作为参考，因为它体现了 Croparia IF 处理 `C2S` 包时的基本态度：

- 客户端只发最小必要状态
- 服务端永远重新校验上下文
- 不信任客户端传来的界面状态

### 切换红石模式

`CropTransmuterRedstoneModePacket` 更简单，只携带目标方块位置。

服务端收到后会：

1. 检查当前菜单和位置是否匹配
2. 找到对应 `CropTransmuterBlockEntity`
3. 调用 `toggleRedstoneMode()`
4. 再通过 `menu.broadcastChanges()` 让菜单数据同步回客户端

这说明这条包的职责非常单一：

- 它只表示“用户请求切换模式”
- 真正的状态变化仍由服务端完成

