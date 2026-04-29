---
title: 网络
description: 介绍 Croparia IF 的网络抽象 NetworkHandler 与 NetworkHandlerType，以及 Crop Transmuter 菜单交互和配方同步两条实际数据流。
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
  - 1.1.1a
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

<a id="s2c-flow"></a>

## 典型 S2C：配方同步

另一条更值得关注的链，是 `SyncedRecipeCache` 使用的三段式 `S2C` 配方同步：

- `S2CSyncRecipeStart`
- `S2CSyncRecipeChunk`
- `S2CSyncRecipeEnd`

它们共同服务于一个目标：

- 把被标记为“需要客户端同步”的配方类型，以快照形式发送到客户端

### 为什么是三段式

同步不是一次性直接塞一个大包，而是拆成三个阶段：

1. `Start`
   - 告诉客户端“这次同步的 `syncId` 是什么，要同步哪些配方类型”
2. `Chunk`
   - 按类型、按分片逐段发送实际配方数据
3. `End`
   - 告诉客户端“这次同步结束，可以提交成新的快照了”

这样做的好处是：

- 客户端可以显式区分一轮完整同步
- 大量配方不会挤进单个超大包
- 服务端可以按类型与大小分块发送

### `SplitPacketTransformer`

`S2CSyncRecipeChunk` 的 `TYPE` 注册时带了 `SplitPacketTransformer`。

这说明配方同步不仅在逻辑层面做了分片，在底层网络传输层也显式声明了“大包需要拆分”的处理方式。对开发者来说，这是一条很实用的经验：

- 如果一个 `S2C` 包天然会很大，不要只靠“自己少发一点”
- 可以像这里一样，在 `NetworkHandlerType` 上附带 transformer

### 客户端如何落地

客户端端的落地点在 `SyncedRecipeCache`：

- `beginClientSync(...)`
  - 创建本轮同步状态
- `acceptChunk(...)`
  - 暂存每一块配方数据
- `endClientSync(...)`
  - 把所有分片合并为新的 live snapshot
  - 然后触发 `CompatRecipeRefresh.onRecipesUpdated(...)`

因此这条网络链路的重点不是“客户端立刻处理每个包”，而是：

- 先在客户端拼出一份完整快照
- 再统一对外刷新配方可见状态

<a id="queue-and-validation"></a>

## `handle(...)` 里的两个习惯

目前这几类包的 `handle(...)` 都有两个很稳定的写法。

### `context.queue(...)`

处理逻辑通常包在 `context.queue(...)` 里执行。

这意味着 Croparia IF 默认把真正的状态修改放回正确线程上下文，而不是在网络回调线程里直接动世界或客户端缓存。

如果你要新增包，通常也应该延续这个习惯。

### 先校验上下文，再改状态

无论是 `CropTransmuter` 还是配方同步，处理逻辑都不是“收到就改”。

常见的校验包括：

- 当前玩家是否存在
- 当前打开的菜单是否匹配
- 方块位置是否一致
- 方块实体类型是否一致
- 索引、材料、分片编号是否仍然合法

这也是这套网络层最值得复用的地方之一：

- 包结构尽量小
- 真正的可信判断尽量留在接收端

<a id="when-to-follow"></a>

## 什么时候该沿用这套写法

下面这些场景很适合直接照着现有网络层扩展：

- 你要做一个小型 GUI 交互，需要把按钮点击或选择结果发回服务端
- 你要同步一组只读快照到客户端，并希望兼容大批量数据
- 你已经在用 `StreamCodec`，希望包定义与注册尽量保持统一
- 你希望在 Architectury 之上保留一层更贴近模组业务的抽象

如果你的需求只是很局部、一次性的客户端按钮回调，而不会复用，也不一定非得抽象出更多层；但只要它会进入 Croparia IF 的公共 API，沿用 `NetworkHandler` / `NetworkHandlerType` 会更稳。

<a id="tips"></a>

## 使用建议

- 新包优先写成“一个载荷对象 + 一个 `TYPE` 常量 + 一个 `handle(...)`”的结构，这样最符合现有代码风格。
- `C2S` 包只发送最小必要信息，不要把客户端已经能伪造的大量状态直接当真。
- 涉及菜单或方块实体时，始终在服务端重新校验当前位置、容器和实体类型。
- 如果 `S2C` 数据量可能很大，优先考虑像配方同步那样分阶段、分片发送。
- 当一个系统最终还是围绕客户端快照工作时，优先在接收端先暂存、再统一提交，而不是每收一包就立即刷新外部状态。

