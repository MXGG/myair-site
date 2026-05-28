# GRACE L2 Notes

[English](./README.md) | [简体中文](./README.zh-CN.md)

GRACE L2 Notes is a bilingual website for documenting GRACE/GRACE-FO Level-2 data processing workflows, filtering methods, product routes, software usage notes, and release information.

Website: https://myair.info  
Chinese site: https://myair.info/zh/  
Downloads: https://myair.info/downloads/  
GitHub Releases: https://github.com/MXGG/myair-site/releases  
Repository: https://github.com/MXGG/myair-site  
GitHub profile: https://github.com/MXGG  

## Overview

This website serves as a technical documentation and blog portal for GRACE/GRACE-FO Level-2 data processing. It records the workflow from monthly GSM spherical harmonic coefficients to gridded equivalent water height products, with notes on preprocessing, filtering, spherical harmonic synthesis, validation, leakage correction, and product management.

The website provides both English and Simplified Chinese pages, including processing workflow notes, method explanations, blog posts, software download information, and project background.

## Main sections

- **Processing Pipeline**: overview of the GRACE Level-2 processing chain, including data acquisition, low-degree coefficient replacement, GIA correction, filtering, synthesis, and validation.
- **Data**: notes on Level-2 GSM products, equivalent water height grids, mascon references, basin averages, and auxiliary datasets.
- **Methods**: technical notes on Gaussian smoothing, decorrelation filtering, DDK filtering, Hankel/HSAF filtering, leakage correction, scaling, and quality-control procedures.
- **Blog**: bilingual posts about reproducible workflows, filter-product comparison, preview design, and processing assumptions.
- **Downloads**: entrance for packaged software releases and installer downloads.
- **About**: project and developer information.

## GRACE Level-2 Processing Software

The GRACE Level-2 Processing Software is designed to support post-processing and analysis of GRACE/GRACE-FO Level-2 products. It is intended for reproducible processing, filter comparison, basin-scale analysis, product preview, and quality-control review.

Typical functions include:

- loading GRACE/GRACE-FO Level-2 GSM spherical harmonic products;
- applying preprocessing steps such as low-degree coefficient replacement, GIA correction, baseline removal, and missing-month handling;
- generating and comparing filtering products, including Gaussian, decorrelation-based, DDK, and Hankel/HSAF filtering routes;
- converting spherical harmonic coefficients into gridded equivalent water height products;
- supporting basin averaging, leakage correction, trend estimation, and product preview;
- organizing output files with explicit product tags and reproducible processing records.

Stable installers and packaged releases should be published through GitHub Releases:

https://github.com/MXGG/myair-site/releases

Large installer files should not be committed directly to this website repository.

## Website routes

- `/` — English homepage
- `/zh/` — Simplified Chinese homepage
- `/blog/` — English blog
- `/zh/blog/` — Simplified Chinese blog
- `/downloads/` — English download page
- `/zh/downloads/` — Simplified Chinese download page
- `/about/` — English project information
- `/zh/about/` — Simplified Chinese project information

## Local maintenance

Install dependencies and test the build:

```powershell
cd D:\WebProjects\myair-site

npm.cmd install
npm.cmd run build
```

Commit and push updates:

```powershell
cd D:\WebProjects\myair-site

git status
npm.cmd run build

git add .
git commit -m "Update website"
git push origin main
```

If Windows locks local Node dependencies, clean and reinstall them:

```powershell
taskkill /F /IM node.exe
taskkill /F /IM esbuild.exe
cmd /c rmdir /s /q node_modules
npm.cmd install
npm.cmd run build
```

## Developer information

Developed by the Solid Geophysics Group, National Gravity Laboratory, Huazhong University of Science and Technology.

Address: 1037 Luoyu Road, Hongshan District, Wuhan, China  
Email: lilx@hust.edu.cn

## License and usage

This repository mainly contains website source code, documentation pages, and release metadata. Software installers, binary packages, and versioned distributions should be managed through GitHub Releases.
