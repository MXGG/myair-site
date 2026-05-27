# GRACE L2 Notes

Static technical site for GRACE and GRACE-FO Level-2 processing notes, reproducible workflow records, filtering notes, and software release links.

Production domain: <https://myair.info>

## Project structure

```text
├── .github/workflows/deploy.yml  # GitHub Pages deployment workflow
├── public/                       # Static files copied as-is, including CNAME and favicons
├── src/
│   ├── assets/                   # Optimized images and fonts used by Astro
│   ├── components/               # Shared site components
│   ├── content/blog/             # Markdown/MDX blog posts
│   ├── layouts/                  # Blog post layout
│   └── pages/                    # Route files: home, blog, about, downloads, RSS
├── astro.config.mjs
├── package.json
└── package-lock.json
```

Generated directories are intentionally excluded from version control: `node_modules/`, `dist/`, and `.astro/`.

## Local development

```sh
npm install
npm run dev
```

Build and preview the production output:

```sh
npm run build
npm run preview
```

## Blog workflow

Add new posts under `src/content/blog/`. Required frontmatter:

```yaml
title: 'Post title'
description: 'Short description for SEO and listing pages.'
pubDate: 'May 27 2026'
heroImage: '../../assets/grace/example.png'
```

The homepage reads recent articles directly from the blog collection, so the article list does not need to be edited manually.

## Software downloads

Large installers should not be committed to this website repository. Publish them as GitHub Release assets, then link to the release page from `src/pages/downloads.astro`.

Recommended release checklist:

1. Build and test the installer locally.
2. Create a version tag such as `v0.1.0`.
3. Upload the installer as a GitHub Release asset.
4. Add release notes, supported platform, package type, and checksum.
5. Verify the public link from the Downloads page after deployment.

## Deployment

The site is deployed by GitHub Actions using `.github/workflows/deploy.yml`. Push to `main`, then check the Pages deployment status in the repository Actions tab.
