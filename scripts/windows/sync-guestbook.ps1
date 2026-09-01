[CmdletBinding()]
param(
    [string]$ApiBase = "https://myair.info/api/guestbook",
    [string]$OutputPath = "E:\myairinfo_logs",
    [string]$TokenPath = (Join-Path $env:LOCALAPPDATA "MyAirInfoGuestbook\admin-token.txt")
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$mutex = New-Object Threading.Mutex($false, "Local\MyAirInfoGuestbookSync")
$hasMutex = $false
$exitCode = 0

function Write-Utf8File {
    param([string]$Path, [string]$Content)
    $encoding = New-Object Text.UTF8Encoding($false)
    $temporaryPath = "$Path.$PID.tmp"
    [IO.File]::WriteAllText($temporaryPath, $Content, $encoding)
    Move-Item -LiteralPath $temporaryPath -Destination $Path -Force
}

function Write-SyncLog {
    param([string]$Message)
    $line = "{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Add-Content -LiteralPath (Join-Path $OutputPath "sync.log") -Value $line -Encoding UTF8
}

function Get-SafeFileName {
    param([string]$Name)
    $safeName = $Name
    foreach ($character in [IO.Path]::GetInvalidFileNameChars()) {
        $safeName = $safeName.Replace([string]$character, "_")
    }
    $safeName = [regex]::Replace($safeName, "\s+", " ").Trim()
	$safeName = [regex]::Replace($safeName, "[ .]+$", "")
    if ([string]::IsNullOrWhiteSpace($safeName)) { return "image" }
    if ($safeName.Length -gt 120) { return $safeName.Substring(0, 120) }
    return $safeName
}

try {
    $hasMutex = $mutex.WaitOne(0, $false)
    if (-not $hasMutex) { exit 0 }

    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    if (-not (Test-Path -LiteralPath $TokenPath)) {
        throw "找不到加密的管理员口令。请先运行 install-guestbook-sync.ps1。"
    }

    $encryptedToken = [IO.File]::ReadAllText($TokenPath).Trim()
    $secureToken = ConvertTo-SecureString $encryptedToken
    $credential = New-Object Management.Automation.PSCredential("guestbook", $secureToken)
    $plainToken = $credential.GetNetworkCredential().Password
    if ([string]::IsNullOrWhiteSpace($plainToken)) { throw "管理员口令为空。" }

    $headers = @{
        Accept = "application/json"
        Authorization = "Bearer $plainToken"
    }
    $statePath = Join-Path $OutputPath ".sync-state.json"
    [int64]$lastId = 0
    if (Test-Path -LiteralPath $statePath) {
        try {
            $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
            $lastId = [int64]$state.lastId
        } catch {
            throw "同步状态文件损坏：$statePath"
        }
    }

    $origin = ([Uri]$ApiBase).GetLeftPart([UriPartial]::Authority)
    $syncedCount = 0
    do {
        $listUri = "{0}/admin/messages?limit=100&after={1}" -f $ApiBase.TrimEnd('/'), $lastId
        $response = Invoke-RestMethod -Uri $listUri -Method Get -Headers $headers
        $messages = @($response.messages) | Where-Object { $null -ne $_ } | Sort-Object { [int64]$_.id }

        foreach ($message in $messages) {
            [int64]$messageId = [int64]$message.id
            $created = [DateTimeOffset]::Parse([string]$message.createdAt).ToLocalTime()
            $dateDirectory = Join-Path $OutputPath $created.ToString("yyyy-MM-dd")
            $messageDirectory = Join-Path $dateDirectory ("{0:D9}" -f $messageId)
            $attachmentDirectory = Join-Path $messageDirectory "attachments"
            New-Item -ItemType Directory -Path $messageDirectory -Force | Out-Null

            $savedAttachments = @()
            foreach ($attachment in @($message.attachments)) {
                if ($null -eq $attachment) { continue }
                New-Item -ItemType Directory -Path $attachmentDirectory -Force | Out-Null
                $attachmentId = [string]$attachment.id
                $shortId = if ($attachmentId.Length -gt 8) { $attachmentId.Substring(0, 8) } else { $attachmentId }
                $fileName = "{0}_{1}" -f $shortId, (Get-SafeFileName ([string]$attachment.name))
                $filePath = Join-Path $attachmentDirectory $fileName
                if (-not (Test-Path -LiteralPath $filePath)) {
                    $downloadUri = if ([Uri]::IsWellFormedUriString([string]$attachment.downloadPath, [UriKind]::Absolute)) {
                        [string]$attachment.downloadPath
                    } else {
                        ([Uri]::new([Uri]$origin, [string]$attachment.downloadPath)).AbsoluteUri
                    }
                    $temporaryFile = "$filePath.$PID.download"
                    try {
                        Invoke-WebRequest -Uri $downloadUri -Method Get -Headers $headers -OutFile $temporaryFile -UseBasicParsing
                        Move-Item -LiteralPath $temporaryFile -Destination $filePath -Force
                    } finally {
                        if (Test-Path -LiteralPath $temporaryFile) { Remove-Item -LiteralPath $temporaryFile -Force }
                    }
                }
                $savedAttachments += [ordered]@{
                    id = $attachmentId
                    originalName = [string]$attachment.name
                    localFile = "attachments\$fileName"
                    contentType = [string]$attachment.contentType
                    size = [int64]$attachment.size
                }
            }

            $localRecord = [ordered]@{
                id = $messageId
                name = [string]$message.name
                contact = [string]$message.contact
                content = [string]$message.content
                createdAt = [string]$message.createdAt
                readAt = $message.readAt
                attachments = $savedAttachments
                syncedAt = [DateTimeOffset]::Now.ToString("o")
            }
            Write-Utf8File -Path (Join-Path $messageDirectory "message.json") -Content ($localRecord | ConvertTo-Json -Depth 8)

            $contactText = if ([string]::IsNullOrWhiteSpace([string]$message.contact)) { "未填写" } else { [string]$message.contact }
            $markdown = @(
                "# 私密留言 #$messageId",
                "",
                "- 提交时间：$($created.ToString('yyyy-MM-dd HH:mm:ss zzz'))",
                "- 昵称：$([string]$message.name)",
                "- 联系方式：$contactText",
                "- 图片数量：$($savedAttachments.Count)",
                "",
                "---",
                "",
                [string]$message.content
            ) -join [Environment]::NewLine
            Write-Utf8File -Path (Join-Path $messageDirectory "message.md") -Content $markdown

            $lastId = $messageId
            $syncedCount += 1
            $newState = [ordered]@{ lastId = $lastId; updatedAt = [DateTimeOffset]::Now.ToString("o") }
            Write-Utf8File -Path $statePath -Content ($newState | ConvertTo-Json)
        }
    } while ($messages.Count -eq 100)

    if ($syncedCount -gt 0) {
        Write-SyncLog "已同步 $syncedCount 条新留言，最新编号为 $lastId。"
    }
} catch {
    $exitCode = 1
    try {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
        Write-SyncLog "同步失败：$($_.Exception.Message)"
    } catch {}
} finally {
    if ($hasMutex) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}

exit $exitCode
