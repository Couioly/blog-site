---
title: "运行服务端Python文件"
date: "2026-03-31"
description: "将 Python 文件设为开机自启动服务，实现后台稳定运行、崩溃自动重启。"
tags: [python, devops, service]
---

> 将 Python 文件设为开机自启动服务，核心是**把脚本注册为系统服务**（Windows 用 NSSM / 任务计划，Linux 用 systemd），实现后台稳定运行、崩溃自动重启。下面分系统给出最稳方案。

---

### Windows 系统（推荐 NSSM 方案）

#### 方案一：NSSM 封装为 Windows 服务（最稳，后台运行）

1. 下载 NSSM：[官网](https://nssm.cc/) 解压到 `C:\nssm`（或任意目录）。
2. 以**管理员身份**打开 CMD，进入 NSSM 目录：

```cmd
cd C:\nssm\win64
```

3. 安装服务（替换路径）：

```cmd
nssm install MyPythonService
```

4. 在弹出窗口配置：

- **Path**：`C:\Python311\pythonw.exe`（用 `pythonw.exe` 无黑窗口）
- **Arguments**：`D:\your_script.py`（脚本绝对路径）
- **Working directory**：脚本所在文件夹（如 `D:\`）

5. 启动并设为开机自启：

```cmd
nssm start MyPythonService
nssm set MyPythonService Start SERVICE_AUTO_START
```

6. 管理服务：

```cmd
nssm stop MyPythonService   # 停止
nssm remove MyPythonService confirm  # 卸载
```

#### 方案二：任务计划程序（简单，可视化）

1. `Win+R` → 输入 `taskschd.msc` 打开任务计划程序。

```bash
taskschd.msc
```

2. 右侧「创建任务」→ 常规：填名称、勾选「不管用户是否登录都要运行」「使用最高权限运行」。
3. 触发器：新建 → 「在启动时」→ 确定。
4. 操作：新建 → 「启动程序」→ 配置：
   
    - 程序 / 脚本：`C:\Python311\pythonw.exe`
    - 添加参数：`D:\your_script.py`
    - 起始于：脚本所在目录
    
5. 设置：勾选「如果任务失败，每 5 分钟重试一次」→ 确定。

#### 方案三：启动文件夹（仅当前用户登录后运行）

1. `Win+R` → 输入 `shell:startup` 打开启动文件夹。
2. 新建快捷方式，目标：

```plaintext
"C:\Python311\pythonw.exe" "D:\your_script.py"
```

3. 保存，重启生效。

---

### Linux 系统（推荐 systemd 方案）

#### 方案一：systemd 服务（主流，稳定，支持重启）

1. 创建服务文件（替换路径 / 用户名）：

```bash
sudo nano /etc/systemd/system/mypython.service
```

2. 写入配置（直接复制修改）：

```ini
[Unit]
Description=My Python Service
After=network.target  # 等网络就绪再启动

[Service]
Type=simple
User=root  # 或普通用户（如 ubuntu）
WorkingDirectory=/home/ubuntu  # 脚本所在目录
ExecStart=/usr/bin/python3 /home/ubuntu/your_script.py
Restart=always  # 崩溃自动重启
RestartSec=5    # 重启间隔 5 秒

[Install]
WantedBy=multi-user.target  # 多用户模式自启
```

3. 重载配置、启用并启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable mypython.service  # 开机自启
sudo systemctl start mypython.service   # 立即启动
```

4. 管理与日志：

```bash
sudo systemctl status mypython.service  # 查看状态
sudo journalctl -u mypython.service -f  # 实时日志
sudo systemctl stop mypython.service    # 停止
sudo systemctl disable mypython.service # 取消自启
```

#### 方案二：crontab（轻量，无需 root）

1. 编辑定时任务：

```bash
crontab -e
```

2. 末尾添加（绝对路径 + 日志）：

```bash
@reboot /usr/bin/python3 /home/ubuntu/your_script.py >> /home/ubuntu/script.log 2>&1
```

3. 保存退出，重启生效。

---

### macOS 系统（launchd 方案）

1. 创建 plist 配置文件（替换路径）：

```bash
nano ~/Library/LaunchAgents/com.mypython.service.plist
```

2. 写入配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>com.mypython.service</string>
	<key>ProgramArguments</key>
	<array>
		<string>/usr/bin/python3</string>
		<string>/Users/yourname/your_script.py</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
	<key>KeepAlive</key>
	<true/>
</dict>
</plist>
```

3. 加载并启用：

```bash
launchctl load ~/Library/LaunchAgents/com.mypython.service.plist
```

---

### 关键注意事项

1. **路径必须绝对**：所有路径用完整绝对路径，避免相对路径失效。
2. **无窗口运行**：Windows 用 `pythonw.exe`，Linux/macOS 后台运行。
3. **权限**：Windows 用管理员；Linux 服务建议用普通用户，必要时 `sudo`。
4. **日志排查**：配置日志输出，方便定位启动失败原因。
5. **依赖处理**：脚本依赖的库、环境变量，开机时需已加载。
