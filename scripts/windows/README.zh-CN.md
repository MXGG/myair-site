# myair.info 留言本机同步

此工具由 Windows 主动通过 HTTPS 拉取私密留言，不开放本机端口，也不使用 `192.168.1.3` 等局域网地址。

在 Windows PowerShell 中运行：

```powershell
irm https://raw.githubusercontent.com/MXGG/myair-site/main/scripts/windows/install-guestbook-sync.ps1 | iex
```

按提示输入留言板管理员口令。安装器会：

- 使用 Windows DPAPI 加密保存管理员口令；
- 创建 `E:\myairinfo_logs`；
- 立即执行第一次同步；
- 注册 `MyAirInfoGuestbookSync` 计划任务，每 2 分钟同步一次，并在登录时补同步；
- 将每条留言保存为 `message.json`、`message.md` 和私密图片附件。

云端删除留言不会删除已经同步到本机的副本。若 E: 盘暂时不可用，任务会记录失败并在下次运行时继续补齐。
