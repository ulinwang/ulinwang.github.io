---
title: Poly — LLM 多智能体预测市场仿真平台
description: 本科毕业论文研究的产品化平台：Python 撮合引擎 + 实时看板，8 家大模型统一接入，基于 Polymarket 真实链上数据校准 Agent 行为。
tags:
  - LLM Agent
  - 仿真
  - Python
  - React
  - Docker
link: https://github.com/ulinwang/Poly
featured: true
order: 1
x: 80
y: 140
---

## 项目简介

Poly 是我本科毕业论文研究的产品化平台：一个由 LLM 驱动的多智能体预测市场仿真系统。

## 技术亮点

- **撮合引擎**：Python 实现的 CLOB（中央限价订单簿）撮合引擎，还原真实预测市场的交易微观结构
- **实时看板**：Fastify + React 19 构建的实时行情与 Agent 行为可视化面板
- **多模型接入**：通过 litellm 统一接入 OpenAI、Kimi、DeepSeek 等 8 家大模型
- **数据校准**：基于 Polymarket 真实链上数据校准 Agent 行为参数
- **双层评估**：宏观（市场层面 stylized facts）与微观（个体行为）双层 eval 体系
- **工程化**：Docker 一键部署 + CI 流水线，223 commits 的个人 monorepo
