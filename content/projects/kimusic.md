---
title: kimusic — AI 音乐创作工具链
description: 概念→蓝图→代码→MP3 五步工作流，MIDI 生成 + FluidSynth/FFmpeg 渲染的 AI 音乐创作工具链。
tags:
  - AI 工具链
  - Python
link: https://github.com/ulinwang/kimusic
featured: false
order: 8
---

## 项目简介

kimusic 是一条 AI 音乐创作工具链：从一个模糊的音乐概念出发，走到一个可播放的 MP3 文件。

## 工作流程

1. **概念**：自然语言描述想要的音乐
2. **蓝图**：AI 将概念结构化为编曲蓝图
3. **代码**：蓝图转译为 MIDI 生成代码
4. **渲染**：FluidSynth / FFmpeg 渲染为音频
5. **成品**：输出 MP3
