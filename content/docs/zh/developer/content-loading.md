---
title: 内容加载
description: 规划 Croparia IF 1.1.0a 的开发者内容加载页，覆盖配方序列化、生成器和包处理流程。
keywords:
  - Croparia IF
  - 内容加载
modVersions:
  - 1.1.0a
---

# 内容加载

本页关注内容是如何从数据定义进入运行时系统的。

## 计划覆盖内容

- 配方类型与序列化器。
- Datapack / Resource pack handler。
- 生成器体系。
- 旧版兼容加载逻辑，如需说明可单列。

## 建议结构

- 从注册时机开始。
- 过渡到读取、解析、校验和应用。
- 最后说明扩展者需要注意的生命周期节点。
