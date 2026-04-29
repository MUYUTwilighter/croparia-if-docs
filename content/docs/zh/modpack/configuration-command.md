---
title: 配置与指令
description: 介绍 Croparia IF 1.1.1a 的配置文件、服务端配置指令，以及 crop、generator 等常用查询与导出命令。
keywords:
  - Croparia IF
  - 矿石魔种
  - 1.1.1a
  - 整合包
  - 配置
  - 指令
  - croparia.json
  - croparia
  - cropariaServer
  - autoReload
  - override
  - filePath
  - recipeWizard
  - generator
  - dumpBuiltin
  - clearBuiltin
modVersions:
  - 1.1.1a
---

# 设置与指令

矿石魔种的配置文件位于 `[游戏目录]/config/croparia.json`。其中不少设置会直接影响作物加载、生成产物目录和运行时数据生成行为，因此建议结合[运行时数据生成系统](./generator/index.md)一起阅读。

模组会在游戏启动、进入存档的时候读取配置，并在退出存档时结束相关运行时资源。

<a id="config-file"></a>

## 设置项

下表中的设置项来自当前 `1.1.1a` 源码中的 `Config` 实现。

| 名称             | 默认值                             | 简介                                         |
|----------------|---------------------------------|--------------------------------------------|
| `autoReload`   | 20                              | 进入存档后调度一次额外数据包重载的延时；设置为小于 0 时不触发 |
| `override`     | true                            | 是否自动清空生成的临时数据                                |
| `filePath`     | "croparia"                      | **模组数据文件根目录**，其中包含临时数据、作物定义、生成器目录等           |
| `recipeWizard` | "croparia\\recipe_wizard\\dump" | 配方生成器的配方导出目录                               |
| `fruitUse`     | true                            | 是否启用果实作物右键地面转换为材料的特性                       |
| `infusor`      | true                            | 是否启用元素灌注                                   |
| `ritual`       | true                            | 是否启用元素仪式                                   |
| `soakAttempts` | 1                               | 元素浸润被触发时执行的浸润次数，设置为 0 表示禁用                 |
| `cropYield`    | 2                               | 内置果实作物的材料产出数量                              |
| `melonYield`   | 2                               | 内置巨果作物的材料产出数量                              |
| `blacklist`    | []                              | 作物黑名单；普通值表示作物 ID，用 `@` 开头表示按正则匹配模组命名空间      |

<a id="command-roots"></a>

## 指令

指令分为客户端指令 `/croparia` 与服务端指令 `/cropariaServer`。

- `/croparia`：仅提供 `crop`、`melon`、`generator` 相关命令，对客机本地数据生效。
- `/cropariaServer`：提供服务端侧的 `crop`、`melon`、`generator` 命令，以及配置项修改命令。

<a id="crop-melon-commands"></a>

### 作物与巨果作物命令

- `/croparia|cropariaServer crop|melon query [作物 ID]`：查询作物信息。若未提供作物 ID，则显示手中物品或者所指方块的作物信息。
- `/croparia|cropariaServer crop|melon dump [作物 ID]`：导出作物定义到模组数据根目录下的 `crops/` 或 `melons/` 中。
- `/croparia|cropariaServer crop|melon create [...多个参数]`：在模组数据根目录下的 `crops/` 或 `melons/` 中创建新的作物定义。

<a id="generator-commands"></a>

### 数据生成器命令

- `/croparia|cropariaServer generator query [生成包处理器 ID] [数据生成器名称]`：查询数据生成器状态。
- `/croparia|cropariaServer generator dumpBuiltin [生成包处理器 ID] [数据生成器名称]`：导出内置数据生成器到对应缓存目录的 `generator/` 文件夹中；不填名称则导出全部。
- `/croparia|cropariaServer generator clearBuiltin [生成包处理器 ID] [数据生成器名称]`：删除与内置数据生成器同名的已导出生成器文件；不填名称则删除全部。

如果你准备在导出后继续手写这些文件，可以接着看：

- [创建数据生成器](./generator/create-generator.md)
- [占位符解析器](./generator/placeholder.md)

<a id="config-commands"></a>

### 服务端配置命令

- `/cropariaServer <设置项>`：查询一个配置项的当前值。
- `/cropariaServer <设置项> [值]`：修改一个配置项的值。
- `/cropariaServer reset`：显示重置确认提示。
- `/cropariaServer reset confirm`：重置配置文件为默认值。

当前有对应服务端命令的配置项包括：

- `filePath`
- `recipeWizard`
- `infusor`
- `ritual`
- `fruitUse`
- `autoReload`
- `override`
- `soakAttempts`

`cropYield`、`melonYield` 与 `blacklist` 当前没有对应的服务端配置命令，只能通过配置文件修改。

<a id="tips"></a>

## 使用建议

- 如果你正在排查生成器未生效、作物未加载或导出目录异常，优先先检查 `filePath`、`override` 与 `autoReload`。
- 想修改内置生成器时，推荐先用 `generator dumpBuiltin` 导出，再参考[运行时数据生成系统](./generator/index.md)和[创建数据生成器](./generator/create-generator.md)进行修改。
- `blacklist` 中以 `@` 开头的项按模组命名空间正则处理，写法不当时可能会屏蔽超出预期的内容。
