---
title: '把滤波产品当作图结构，而不是清单'
description: 'P4M6、Gaussian、FAN、DDK 和 HSAF 应作为同一产品图进行追踪。'
pubDate: 'May 26 2026'
tags: ['滤波', 'HSAF', '产品图']
readingMinutes: 3
heroImage: '../../assets/grace/processing-setup.png'
---

GRACE Level-2 滤波最容易出问题的地方不是公式本身，而是产品路由。更稳妥的做法是把滤波产品视为图结构：改正后的球谐系数是共同源头，每个产品标识都应保留其来源路径。

`P4M6` 在球谐域执行多项式去相关；`GAUSS` 执行各向同性阶域平滑；`FAN` 在阶次空间中执行各向异性平滑；`DDK4` 应进入 DDK 滤波族并保留明确的 DDK 标签；`HSAF` 是格网域 Hankel 谱分析滤波，默认以上游 `P4M6` 格网作为输入。

这种图结构很重要，因为重复计算可能掩盖路由错误。请求 `DDK4` 输出时不应静默退回 Gaussian，请求 `HSAF` 输出时也必须说明它使用了哪个上游格网。

对于技术博客，最低限度的有效记录应包括滤波标签、上游来源、关键参数，以及一次针对月产品或数据栈输出的验证检查。
