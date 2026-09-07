---
title: 文化遗产知识图谱与数据分析
description: 南大艺术与文化创意实验室项目：六地博物馆文物数据采集与 MongoDB ETL、云纹四维统计分析、MMDetection 图像识别、KG4Story 知识图谱与 RAG、数字展览上线，ChinaVISAP 2025 参赛。
tags:
  - 数据分析
  - MongoDB
  - 知识图谱
featured: false
order: 7
x: 460
y: 900
---

## 项目简介

在南京大学艺术与文化创意实验室参与的文化遗产数字化项目，围绕**中国传统云纹**等文化遗产数据，完成了从数据采集、清洗、分析、建图谱到图像识别与数字展览的完整链路。相关可视化成果参加了 **ChinaVISAP 2025** 可视化竞赛。

## 数据采集与清洗

- 覆盖**甘肃、湖南、上海、山西、沈阳、台北**六地博物馆的文物数据采集与清洗脚本
- 设计并实现 **MongoDB ETL** 数据管道，含跨馆数据合并与去重

## 云纹数据分析

基于《中国传统云纹报告》数据集，从**分类、技法、材质、来源地**四个维度做统计分析：

![云纹分类分布](/uploads/yunwen/category.png)

![云纹技法分布](/uploads/yunwen/technique.png)

![云纹材质分布](/uploads/yunwen/material.png)

![云纹来源地分布](/uploads/yunwen/origin.png)

## 知识图谱与图像识别

- **KG4Story**：构建文化遗产知识图谱，并配套 RAG 问答文档
- **MMDetection**：云纹图像识别模型（Cascade Swin 配置）训练与部署
- 参与**数字展览网站**的建设与上线
