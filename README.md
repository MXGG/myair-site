# GRACE L2 Notes

Static Astro website for GRACE/GRACE-FO Level-2 processing notes, filter-product records, software download guidance, and bilingual documentation.

## Main structure

- `src/pages/index.astro`: English home page.
- `src/pages/zh/index.astro`: Simplified Chinese home page.
- `src/pages/blog/`: English blog index and article routes.
- `src/pages/zh/blog/`: Simplified Chinese blog index and article routes.
- `src/content/blog/`: English Markdown posts.
- `src/content/blogZh/`: Simplified Chinese Markdown posts.
- `src/pages/downloads.astro` and `src/pages/zh/downloads.astro`: Download pages linking to GitHub Releases.
- `src/data/site.ts`: Shared bilingual navigation, labels, page copy, and route definitions.
- `src/styles/global.css`: Global responsive layout and UI styling.

## Local development

```powershell
cd D:\WebProjects\myair-site
npm.cmd install
npm.cmd run dev
```

## Build before pushing

```powershell
cd D:\WebProjects\myair-site
git status
npm.cmd run build

git add .
git commit -m "Update website"
git push origin main
```

## Add a blog post

1. Add the English post to `src/content/blog/<slug>.md`.
2. Add the Simplified Chinese post to `src/content/blogZh/<slug>.md`.
3. Keep the same slug in both folders so the language switch can map `/blog/<slug>/` and `/zh/blog/<slug>/`.
4. Recommended frontmatter:

```md
---
title: 'Article title'
description: 'Short article description.'
pubDate: 'May 27 2026'
tags: ['Workflow', 'Filtering']
readingMinutes: 3
heroImage: '../../assets/grace/preview.png'
---
```

## Publish installers

Use GitHub Releases for `.exe`, `.msi`, `.zip`, or other binary installers. Do not commit large installer binaries into the website repository. The `/downloads/` and `/zh/downloads/` pages already point to the repository release page.
