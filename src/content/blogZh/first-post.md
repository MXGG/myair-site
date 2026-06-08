---
title: '可复现的 GRACE Level-2 处理流程'
description: '从月尺度 GSM 球谐系数到格网等效水高数据栈的紧凑流程说明。'
pubDate: 'May 27 2026'
tags: ['处理流程', 'Level-2', 'EWH']
readingMinutes: 3
heroImage: '../../assets/grace/dashboard.png'
---

这套处理流程的基本原则很明确：MATLAB 与 Python 实现应围绕同一套配置、同一套数据目录和同一套输出约定保持一致。

源数据从月尺度 GSM 球谐系数开始。处理过程随后执行低阶项替换、可选的 GIA 改正和均值场扣除，并生成一组受控的滤波产品。每个产品最终合成为 EWH 格网，并以 `[nLon x nLat x Nt]` 的数据栈形式保存。

把这些内容写成博客的价值在于可追溯性。一个流域时间序列、预览图或导出图件，至少应能由四个信息解释：输入月份、改正设置、滤波产品标识和输出栈元数据。

当前基准产品包括 `RAW`、`P4M6`、`GAUSS`、`FAN`、`P4M6_GAUSS`、`P4M6_FAN`、`DDK4` 和 `HSAF`。保守解释产品仍以 `P4M6_GAUSS` 为主，同时保留 `DDK4` 和 `HSAF` 作为对比产品。
