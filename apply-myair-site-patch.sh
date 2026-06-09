#!/usr/bin/env bash
set -euo pipefail
echo "Applying GRACE Level-2 content patch to myair-site..."

if [ ! -f "package.json" ]; then
  echo "Please run this script from the myair-site repository root." >&2
  exit 1
fi
if [ ! -f "src/pages/index.astro" ]; then
  echo "This directory does not look like the Astro project root: src/pages/index.astro not found." >&2
  exit 1
fi

cp -R "$(dirname "$0")/patch-files/." .
node ./tools/patch-homepage-placeholders.mjs
npm run build
echo "Patch applied. Review changes with: git diff"
