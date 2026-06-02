# Optimization round 2

This package contains a second optimization pass for the GRACE L2 Notes blog site.

## Implemented changes

1. Blog hub discovery
   - Added a search box to the English and Chinese blog index pages.
   - Kept topic filtering, and connected the sidebar topic map to the same filter logic.
   - Added an empty-state message when no article matches the query.

2. Article page retention
   - Added previous/next article navigation.
   - Added related-note cards generated from overlapping tags.
   - Added an author information box at the end of each article.
   - Added Article JSON-LD structured data for article pages.

3. Homepage reading path
   - Expanded recent-article cards on the homepage with descriptions, reading time, and topic tags.

4. Download page clarity
   - Added release verification checklists to English and Chinese download pages.
   - Kept GitHub Releases as the single verified download entry point.

5. Metadata and performance
   - Added WebSite JSON-LD metadata.
   - Added preconnect hints for remote font and MathJax resources.
   - Removed the local Astro font provider dependency from astro.config.mjs.

## Build status

`npm run build` completed successfully. The regenerated static output is in `dist/`.

## Notes

`node_modules/`, `.git/`, `.astro/`, and local font files are intentionally excluded from this package. Run `npm install` before local development.
