[CmdletBinding()]
param(
    [string]$OutputPath = "E:\myairinfo_logs",
    [string]$ApiBase = "https://myair.info/api/guestbook",
    [string]$SyncScriptUrl = "https://raw.githubusercontent.com/MXGG/myair-site/main/scripts/windows/sync-guestbook.ps1"
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Write-Utf8File {
    param([string]$Path, [string]$Content)
    $encoding = New-Object Text.UTF8Encoding($false)
	$temporaryPath = "$Path.$PID.tmp"
	[IO.File]::WriteAllText($temporaryPath, $Content, $encoding)
	Move-Item -LiteralPath $temporaryPath -Destination $Path -Force
}

$outputRoot = [IO.Path]::GetPathRoot($OutputPath)
if ([string]::IsNullOrWhiteSpace($outputRoot) -or -not (Test-Path -LiteralPath $outputRoot)) {
    throw "目标磁盘不存在：$outputRoot。请确认 E: 盘已经连接。"
}

$appDirectory = Join-Path $env:LOCALAPPDATA "MyAirInfoGuestbook"
$syncScriptPath = Join-Path $appDirectory "sync-guestbook.ps1"
$tokenPath = Join-Path $appDirectory "admin-token.txt"
New-Item -ItemType Directory -Path $appDirectory -Force | Out-Null
New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null

Write-Host "正在下载本机同步程序……" -ForegroundColor Cyan
Invoke-WebRequest -Uri $SyncScriptUrl -OutFile $syncScriptPath -UseBasicParsing

Write-Host "请输入留言板管理员口令。口令会使用 Windows DPAPI 加密，只能由当前用户解密。" -ForegroundColor Cyan
$secureToken = Read-Host -Prompt "管理员口令" -AsSecureString
$encryptedToken = ConvertFrom-SecureString -SecureString $secureToken
if ([string]::IsNullOrWhiteSpace($encryptedToken)) { throw "未输入管理员口令。" }

$credential = New-Object Management.Automation.PSCredential("guestbook", $secureToken)
$plainToken = $credential.GetNetworkCredential().Password
$headers = @{ Accept = "application/json"; Authorization = "Bearer $plainToken" }
try {
    $checkUri = "{0}/admin/messages?limit=1&after=0" -f $ApiBase.TrimEnd('/')
    $check = Invoke-RestMethod -Uri $checkUri -Method Get -Headers $headers
    if (-not $check.ok) { throw "接口未返回成功状态。" }
} catch {
    throw "管理员口令验证失败，尚未创建计划任务。请确认口令正确后重试。详情：$($_.Exception.Message)"
} finally {
    $plainToken = $null
	$headers = $null
}
Write-Utf8File -Path $tokenPath -Content $encryptedToken

$taskName = "MyAirInfoGuestbookSync"
$arguments = '-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}" -ApiBase "{1}" -OutputPath "{2}" -TokenPath "{3}"' -f $syncScriptPath, $ApiBase, $OutputPath, $tokenPath
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arguments
$repeatTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 2) -RepetitionDuration (New-TimeSpan -Days 3650)
$logonTrigger = New-ScheduledTaskTrigger -AtLogOn -User ([Security.Principal.WindowsIdentity]::GetCurrent().Name)
$principal = New-ScheduledTaskPrincipal -UserId ([Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 10) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger @($repeatTrigger, $logonTrigger) -Principal $principal -Settings $settings -Description "每两分钟将 myair.info 私密留言和图片同步到本机。" -Force | Out-Null

$readme = @"
myair.info 私密留言本机备份

保存目录：$OutputPath
同步频率：每 2 分钟，并在当前用户登录时补同步
计划任务：$taskName
口令保存：$tokenPath（Windows DPAPI 加密，不是明文）

每条留言保存在“日期\九位留言编号”文件夹，包含 message.json、message.md 和 attachments 子目录。
本地备份不会因为云端删除留言而自动删除。

如需停用：
Unregister-ScheduledTask -TaskName "$taskName" -Confirm:`$false
"@
Write-Utf8File -Path (Join-Path $OutputPath "同步说明.txt") -Content $readme

Write-Host "正在执行第一次同步……" -ForegroundColor Cyan
& powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $syncScriptPath -ApiBase $ApiBase -OutputPath $OutputPath -TokenPath $tokenPath
if ($LASTEXITCODE -ne 0) {
    throw "计划任务已创建，但第一次同步失败。请查看 $OutputPath\sync.log。"
}

Write-Host "安装完成。新留言和私密图片将每 2 分钟同步到 $OutputPath。" -ForegroundColor Green
