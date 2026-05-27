---
title: 'A reproducible GRACE Level-2 workflow'
description: 'A compact map from monthly GSM spherical harmonics to gridded equivalent water height stacks.'
pubDate: 'May 27 2026'
tags: ['Workflow', 'Level-2', 'EWH']
readingMinutes: 3
heroImage: '../../assets/grace/dashboard.png'
---

The working rule for this pipeline is simple: keep MATLAB and Python aligned around the same configuration, the same data layout, and the same output conventions.

The source product begins with monthly GSM spherical harmonics. The run then applies low-degree replacement, optional GIA correction, and mean-field removal before generating a controlled set of filter products. Each product is synthesized to an EWH grid and stored in a stack shaped as `[nLon x nLat x Nt]`.

The useful part of writing this down as a blog is traceability. A basin time series, preview image, or exported plot should be explainable from four things: the input month, the correction settings, the filter tag, and the output stack metadata.

Current baseline products include `RAW`, `P4M6`, `GAUSS`, `FAN`, `P4M6_GAUSS`, `P4M6_FAN`, `DDK4`, and `HSAF`. The conservative interpreted product remains `P4M6_GAUSS`, while `DDK4` and `HSAF` stay visible for comparison.
