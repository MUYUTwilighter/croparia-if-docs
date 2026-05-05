---
title: 作物嬗变仪
description: 介绍作物嬗变仪模块的方块、方块实体、菜单、界面与网络交互，帮助开发者理解其输入材料读取、候选产物选择与红石控制流程。
keywords:
  - Croparia IF
  - 开发者文档
  - CropTransmuter
  - CropTransmuterBlockEntity
  - CropTransmuterMenu
  - CropTransmuterScreen
  - CropTransmuterSelectPacket
  - RepoProxy
modVersions:
  - 1.1.0a
---

# 作物嬗变仪

<a id="overview"></a>

作物嬗变仪是 Croparia IF 里一个很适合拿来读架构的模块，因为它同时涉及：

- 方块与方块状态
- 方块实体持久化
- 菜单与界面
- `C2S` 网络交互
- 自动化输入输出

如果你想看一个“完整的机器模块”是怎么被拆开的，这页通常会比单独读 API 更有帮助。

<a id="module-role"></a>

## 模块职责

它的职责可以概括为一句话：

- 读取输入果实对应的 `Material`
- 把这个 `Material` 展开成多个候选输出
- 由玩家或界面状态决定当前选中的候选项
- 在红石条件满足时，把输入逐个转成输出

这意味着它不是一个“按固定配方工作”的机器，而是一个“输入确定候选集，再由状态决定结果”的机器。

<a id="core-classes"></a>

## 核心类

- `CropTransmuter`
  - 方块本体
  - 负责打开菜单、维护 `POWERED` 状态、注册自动化代理
- `CropTransmuterBlockEntity`
  - 真正的运行时状态中心
  - 维护库存、选择索引、红石模式
- `CropTransmuterMenu`
  - 服务端菜单
  - 负责容器槽位和基础数据同步
- `CropTransmuterScreen`
  - 客户端界面
  - 负责候选面板、分页、按钮与点击操作
- [CropTransmuterSelectPacket](../network#c2s-flow)
  - 负责把客户端选择同步到服务端
- [CropTransmuterRedstoneModePacket](../network#c2s-flow)
  - 负责切换红石模式

<a id="state-and-data"></a>

## 状态与数据

`CropTransmuterBlockEntity` 持有的关键状态不多，但分工很明确：

- `inventory`
  - 两个槽位
  - `INPUT_SLOT` 放输入果实
  - `OUTPUT_SLOT` 放转化结果
- `selectedIndex`
  - 当前候选产物的索引
- `positiveRedstone`
  - 机器是在“有红石时工作”还是“无红石时工作”

其中真正决定输出结果的不是菜单本身，而是：

- 输入物品对应的 `Material`
- 当前保存下来的 `selectedIndex`

所以这个模块的“用户选择”最终会沉淀成方块实体状态，而不是只停留在客户端 UI 中。

<a id="processing-flow"></a>

## 运行流程

### 1. 打开菜单

玩家右键方块时，`CropTransmuter.useItemOn(...)` 会在服务端调用 `MenuRegistry.openExtendedMenu(...)`。

这里用的是扩展菜单而不是普通菜单，因为客户端需要额外知道方块位置，后续两条 `C2S` 包都要靠这个位置做校验。

### 2. 读取输入材料

`CropTransmuterBlockEntity.readInputMaterial()` 会检查输入槽：

- 如果物品是 `AbstractFruit<?>`
- 就通过 `fruit.getCrop().getMaterial()` 读取对应 `Material`

这个设计很重要，因为它让机器本身不需要维护“作物到候选输出”的额外注册表，而是复用作物定义里已经存在的材料语义。

### 3. 客户端展示候选

`CropTransmuterScreen` 并不会从网络单独拉取候选列表，而是直接通过菜单访问方块实体当前可读到的材料，再调用 `Material.asItems()` 渲染候选物品。

换句话说：

- 候选集来自输入材料
- 当前选中项来自 `selectedIndex`
- 屏幕只是把这两者可视化出来

### 4. 客户端发起选择

当玩家在候选面板中点击某个物品时，客户端会发出 `CropTransmuterSelectPacket`。

服务端收到后不会直接相信这个选择，而是重新检查：

- 当前菜单是不是这台机器的菜单
- 方块位置是否一致
- 当前输入材料是否存在
- 传来的索引是否仍然合法

最后才调用 `setSelectedIndex(...)`。

### 5. 红石驱动处理

真正的加工发生在 `CropTransmuterBlockEntity.serverTick(...)`。

它每 tick 会做两件事：

- 把方块状态里的 `POWERED` 与真实红石输入对齐
- 根据 `powered != isPositiveRedstone()` 判断此刻是否应该工作

一旦条件满足，就进入 `tryProcess(...)`。

### 6. 生成输出

`tryProcess(...)` 的流程相对直接：

1. 读取输入槽
2. 解析当前 `Material`
3. 从 `Material.asItems()` 中取出候选列表
4. 按 `selectedIndex` 取当前目标
5. 尝试塞入输出槽
6. 成功后消耗一个输入

这里没有额外的配方匹配层，因为这个模块的核心规则本来就已经由 `Material` 给定了。

<a id="automation"></a>

## 自动化接入

`CropTransmuter` 在构造时通过 `ProxyProvider.registerItem(...)` 暴露了自己的物品代理。

真正的输入输出约束在 `CropTransmuterBlockEntity` 里定义：

- 输入侧使用 `repo.asAcceptOnly().asLocked(OUTPUT_SLOT)`
- 输出侧使用 `repo.asConsumeOnly().asLocked(INPUT_SLOT)`

最后分别包装成两个 `RepoProxy<ItemSpec>`：

- 从顶部和侧面访问时给输入代理
- 从底部访问时给输出代理

这一点很值得参考，因为它让自动化约束保持在仓储层，而不是散落在机器逻辑里。更详细的背景可以看 [Repo API](../repo/index.md)。

<a id="network-and-ui"></a>

## 菜单、界面与网络的分工

这个模块里最值得开发时留意的一点，是菜单、界面和网络各自都只做了自己那一层的事：

- `Menu`
  - 提供容器槽位与基础同步数据
- `Screen`
  - 负责展示候选面板和本地交互
- `Network`
  - 只传输“用户选择了什么”与“用户请求切换什么”
- `BlockEntity`
  - 持有最终可信状态

因此如果你要改这个模块，通常可以按下面的方式定位：

- 改候选逻辑：看 `readInputMaterial()` 与 `Material.asItems()`
- 改红石行为：看 `serverTick()` 与 `positiveRedstone`
- 改界面展示：看 `CropTransmuterScreen`
- 改自动化能力：看 `visitItem(...)` 与 `RepoProxy`

<a id="extension"></a>

## 扩展建议

- 如果你要新增“输入决定候选集”的机器，这个模块是最值得复用的参考模板。
- 如果你想把候选列表来源换成别的规则，优先替换“输入到候选列表”的读取过程，而不是直接改菜单或网络层。
- 如果你要加更多可配置状态，优先让状态落在方块实体上，再由菜单与界面读取，而不是把状态只留在客户端。
- 如果你要兼容自动化，优先在 `Repo` / `RepoProxy` 层先把输入输出边界设计好。
