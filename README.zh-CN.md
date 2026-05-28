# GRACE L2 Notes

[English](./README.md) | [简体中文](./README.zh-CN.md)

GRACE L2 Notes 是一个面向 GRACE/GRACE-FO Level-2 数据处理的双语网站，用于记录数据处理流程、滤波方法、产品路线、软件使用说明和版本发布信息。

网站首页：https://myair.info  
中文首页：https://myair.info/zh/  
软件下载：https://myair.info/zh/downloads/  
GitHub Releases：https://github.com/MXGG/myair-site/releases  
项目仓库：https://github.com/MXGG/myair-site  
GitHub 主页：https://github.com/MXGG  

## 项目简介

本网站是 GRACE/GRACE-FO Level-2 数据处理流程的技术文档与博客站点，主要记录从月尺度 GSM 球谐系数到格网等效水高产品的处理过程，包括数据预处理、滤波、球谐合成、质量验证、泄漏校正和产品管理等内容。

网站同时提供英文和简体中文页面，包含处理流程说明、方法介绍、博客文章、软件下载入口和项目背景信息。

## 主要栏目

- **处理流程**：介绍 GRACE Level-2 数据处理链路，包括数据获取、低阶项替换、GIA 改正、滤波、球谐合成和质量验证。
- **数据**：说明 Level-2 GSM 产品、等效水高格网、Mascon 参考产品、流域平均和辅助数据集。
- **方法**：记录 Gaussian 平滑、去相关滤波、DDK 滤波、Hankel/HSAF 滤波、泄漏校正、尺度因子恢复和质量控制流程。
- **博客**：发布可复现处理流程、滤波产品对比、预览设计和处理假设等双语技术文章。
- **下载**：提供软件安装包和版本发布入口。
- **关于**：展示项目背景、开发者信息和联系方式。

## GRACE Level-2 数据处理软件

GRACE Level-2 数据处理软件用于支持 GRACE/GRACE-FO Level-2 产品的后处理与分析，主要面向可复现处理、滤波方法对比、流域尺度分析、产品预览和质量控制等应用场景。

软件典型功能包括：

- 读取 GRACE/GRACE-FO Level-2 GSM 球谐系数产品；
- 执行低阶项替换、GIA 改正、基准期扣除、缺失月份处理等预处理步骤；
- 生成并对比多种滤波产品，包括 Gaussian、去相关组合、DDK 和 Hankel/HSAF 等滤波路线；
- 将球谐系数转换为格网等效水高产品；
- 支持流域平均、泄漏校正、趋势估计和产品预览；
- 通过明确的产品标签和处理记录管理输出结果，提高处理流程的可追溯性。

稳定版安装包和打包版本建议通过 GitHub Releases 发布：

https://github.com/MXGG/myair-site/releases

不建议将大型 `.exe`、`.msi` 或 `.zip` 安装包直接提交到网站源码仓库。

## 网站路由

- `/`：英文首页
- `/zh/`：简体中文首页
- `/blog/`：英文博客
- `/zh/blog/`：简体中文博客
- `/downloads/`：英文下载页
- `/zh/downloads/`：简体中文下载页
- `/about/`：英文项目信息
- `/zh/about/`：简体中文项目信息

## 本地维护

安装依赖并测试构建：

```powershell
cd D:\WebProjects\myair-site

npm.cmd install
npm.cmd run build
```

提交并推送网站更新：

```powershell
cd D:\WebProjects\myair-site

git status
npm.cmd run build

git add .
git commit -m "Update website"
git push origin main
```

如果 Windows 锁定了本地 Node 依赖，可以清理后重新安装：

```powershell
taskkill /F /IM node.exe
taskkill /F /IM esbuild.exe
cmd /c rmdir /s /q node_modules
npm.cmd install
npm.cmd run build
```

## 开发者信息

由华中科技大学国家精密重力测量科学中心固体地球物理组开发。

地址：武汉市洪山区珞喻路 1037 号  
邮箱：lilx@hust.edu.cn

## 许可与使用说明

本仓库主要包含网站源码、文档页面和版本发布信息。软件安装包、二进制文件和正式版本分发包应通过 GitHub Releases 管理。
