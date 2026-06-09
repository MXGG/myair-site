$ErrorActionPreference = "Stop"
Write-Host "Applying GRACE Level-2 content patch to myair-site..." -ForegroundColor Cyan

if (!(Test-Path "package.json")) {
  throw "请在 myair-site 仓库根目录执行本脚本。当前目录未找到 package.json。"
}
if (!(Test-Path "src/pages/index.astro")) {
  throw "当前目录不像 Astro 项目根目录：未找到 src/pages/index.astro。"
}

$patchRoot = Join-Path $PSScriptRoot "patch-files"
if (!(Test-Path $patchRoot)) {
  throw "未找到 patch-files 目录。请保持压缩包解压后的目录结构。"
}

Copy-Item -Path (Join-Path $patchRoot "*") -Destination "." -Recurse -Force
Write-Host "Copied replacement pages and Footer.astro." -ForegroundColor Green

node .\tools\patch-homepage-placeholders.mjs

Write-Host "Running Astro build..." -ForegroundColor Cyan
npm run build

Write-Host "Patch applied. Review changes with: git diff" -ForegroundColor Green
