param(
	[string]$HostName = "myair.info",
	[string]$SiteUrl = "https://myair.info",
	[string]$Key = "0145dc0a443f4396a03d6af5b2aad69d"
)

$ErrorActionPreference = "Stop"

$sitemapIndexUrl = "$SiteUrl/sitemap-index.xml"
$keyLocation = "$SiteUrl/$Key.txt"

[xml]$sitemapIndex = (Invoke-WebRequest -UseBasicParsing $sitemapIndexUrl).Content
$sitemapUrls = @($sitemapIndex.sitemapindex.sitemap | ForEach-Object { $_.loc })

$urls = foreach ($sitemapUrl in $sitemapUrls) {
	[xml]$sitemap = (Invoke-WebRequest -UseBasicParsing $sitemapUrl).Content
	$sitemap.urlset.url | ForEach-Object { $_.loc }
}

$urls = @($urls | Where-Object { $_ } | Sort-Object -Unique)

if ($urls.Count -eq 0) {
	throw "No URLs found in $sitemapIndexUrl"
}

$body = @{
	host = $HostName
	key = $Key
	keyLocation = $keyLocation
	urlList = $urls
} | ConvertTo-Json -Depth 4

Write-Host "Submitting $($urls.Count) URL(s) to IndexNow..."
Invoke-RestMethod `
	-Method Post `
	-Uri "https://api.indexnow.org/indexnow" `
	-ContentType "application/json; charset=utf-8" `
	-Body $body

Write-Host "Submitted:"
$urls | ForEach-Object { Write-Host " - $_" }
