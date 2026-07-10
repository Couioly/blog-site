---
title: "Claude常用指令集"
date: "2026-07-10"
description: "Claude CLI 常用指令整理，涵盖更新、会话恢复、权限模式切换及交互界面快捷操作"
tags: [claude, tools, ai]
---

## 1 Claude 更新

在终端执行下列操作指令：

```bash
claude doctor
```

返回信息中包含当前本地 Claude 版本号 `Currently running`、稳定版本号 `Stable version`、最新版本号 `Latest version`。

```text
D:\CodeFile\AI_Code\claudedemo>claude doctor
──────────────────────────────────────────────────────────────────────
  Diagnostics
  └ Currently running: native (2.1.92)
  └ Path: C:\Users\31245\.local\bin\claude.exe
  └ Invoked: C:\Users\31245\.local\bin\claude.exe
  └ Config install method: native
  └ Search: OK (bundled)
  Updates
  └ Auto-updates: disabled (CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
   set)
  └ Auto-update channel: latest
  └ Stable version: 2.1.195
  └ Latest version: 2.1.202
  Version Locks
  └ No active version locks
  Press Enter to continue…
```

若存在最新版本，则可以执行更新指令进行更新：

```bash
claude update
```

更新指令响应结果：

```bash
D:\CodeFile\AI_Code\claudedemo>claude update
Current version: 2.1.92
Checking for updates to latest version...
Successfully updated from 2.1.92 to version 2.1.202
```

## 2 恢复已关闭的会话

### 2.1 恢复上一次关闭的会话

```bash
claude -c # 或 claude --continue
```

**作用** ：自动加载当前目录最近一次关闭的会话，一键恢复完整对话上下文。

**适用场景** ：不小心关掉终端、重启电脑、窗口闪退

### 2.2 打开会话列表

```bash
claude -r # 或 claude --resume
```

执行后弹出交互式会话选择器，列出当前项目所有保存会话（含之前关闭的多窗口会话）

`Ctrl+A`：展开本机全部项目的所有历史会话

上下箭头切换，回车选中恢复

### 2.3 按名称/ID指定恢复会话

**前提**：会话提前命名（创建时命名方便后续恢复），指令如下：

```bash
claude -n 前端工程师
```

通过名称直接恢复

```bash
claude --resume "前端工程师"
```

通过会话ID找回（适合跨目录找回）

```bash
claude --resume session-xxxxxx
```

### 2.4 在当前会话中恢复旧会话

进入Claude交互界面后，输入 `/` 调出选择列表：

```claude
/resume
```

同样支持输入会话名/ID快速跳转，不用退出当前终端

## 3 Claude 不同权限启动

| 启动命令                                | 权限模式                   | 权限与安全特性&适用场景                                      |
| --------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| `claude`                                | default 默认               | 弹窗确认全部文件/Shell操作，完整安全校验，高危操作强制弹窗；适合含隐私密钥、新项目日常开发，安全等级最高★★★★★ |
| `claude --permission-mode auto`         | auto 自动                  | 项目内基础读写自动放行，AI识别高危行为，可疑操作弹窗；适合批量重构、本地可信项目，安全均衡★★★☆☆ |
| `claude --dangerously-skip-permissions` | bypassPermissions 跳过权限 | 无弹窗、关闭绝大多数安全校验，仅兜底拦截全盘删除；仅隔离沙盒/离线CI使用，高危★☆☆☆☆ |

已打开的 Claude 窗口中可以使用 `Shift+Tab` 来切换当前的权限，循环顺序：`default（当前） → acceptEdits → plan → auto`

## 4 工具-查看上下文及Token插件

![1783387007940](/images/blog/claude-common-commands/1783387007940.png)

GitHub仓库地址：https://github.com/jarrodwatts/claude-hud

安装时只需在 Claude 交互界面只需下列指令即可：

```claude
/plugin marketplace add jarrodwatts/claude-hud
```



## 其他指令

|    指令    |                             说明                             |
| :--------: | :----------------------------------------------------------: |
|  `/model`  |                  切换模型，不建议在中途切换                  |
| `/effort`  |                         设置思考程度                         |
|  `/clear`  |           彻底清空会话内容，相当于重开了一个新会话           |
| `/compact` | 上下文用量高时使用该命令将之前的上下文进行压缩，按`ESC`可打断命令 |
|   `/btw`   | 临时对话，能看到上下文且不污染主上下文，不影响正在执行的长任务，无工具 |
|    `!`     |                  `!`后可以直接输入终端指令                   |

