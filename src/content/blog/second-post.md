---
title: 'Filter products as a graph, not a checklist'
description: 'Why P4M6, Gaussian, FAN, DDK, and HSAF should be traced as one product graph.'
pubDate: 'May 26 2026'
heroImage: '../../assets/grace/processing-setup.png'
---

GRACE Level-2 filtering is easiest to audit when it is treated as a graph. The corrected spherical harmonics are the shared source, and each product tag should preserve how it was derived.

`P4M6` performs polynomial de-striping in the harmonic domain. `GAUSS` applies isotropic degree-domain smoothing. `FAN` uses anisotropic smoothing in degree-order space. `DDK4` routes through the DDK filter family and must keep the requested DDK tag. `HSAF` is a grid-domain Hankel Spectrum Adaptive Filter, with `P4M6` as the default upstream input.

That graph matters because repeated recomputation can hide routing mistakes. A requested `DDK4` output should never silently fall back to Gaussian, and an `HSAF` output should always state which upstream grid it used.

For blog notes, the minimum useful record is the filter tag, the upstream source, the key parameters, and one validation check against the monthly product and stack outputs.
