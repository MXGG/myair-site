---
title: 'Preview is a quality-control surface'
description: 'The preview page should verify stack structure and product behavior without becoming the processing source of truth.'
pubDate: 'May 25 2026'
tags: ['Preview', 'Quality control', 'EWH']
readingMinutes: 3
heroImage: '../../assets/grace/preview.png'
---

The preview surface is not the pipeline. It is a quality-control layer over the saved products.

That distinction keeps debugging clean. Stored EWH values, stack shape, time labels, and product tags should be controlled by the processing code and metadata. The preview page can transform, slice, project, and render, but it should not become the authority for scientific meaning.

The practical target is fast inspection: load one time slice when possible, switch projections without changing product data, and make coastlines, graticules, color limits, and exported plots easy to reproduce.

When a plotted value looks surprising, the first question is not what the colorbar says. The first question is which stack was loaded, which unit contract it follows, and whether the preview path converted the value for display.
