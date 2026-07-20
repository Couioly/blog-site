---
title: VSCode 配置 Claude
date: 2026-07-16
description: 在 VSCode 中安装配置 Claude Code 的完整指南，解决国内用户访问限制，通过 CCSwitch 中转站正常使用 Claude Code
tags:
  - tools
  - claude-code
  - ide
  - api
---

### 当前环境

- `claude --version`：2.1.202（Claude Code）
- `code --version`：1.129.0（VSCode）

### 安装 Claude Code for VS Code

1.搜索并安装插件 `Claude Code for VS Code`，成功安装后，右上角应该会出现Claude图标；

![1784184296833](/images/blog/vscode-claude-config/1784184296833.png)

2.由于 Claude Code 对国内用户的限制，因此注册账户极其困难，所以此时需要修改 `.json` 文件进行配置；

3.`Ctrl+,` 打开 `设置` 页面，依次点击 `扩展` -- `Claude Code` -- `在settings.json中编辑`；

![1784184669163](/images/blog/vscode-claude-config/1784184669163.png)

4.默认打开Claude Code配置文件13~23行内容如下：

```json
{
    ...,
    "editor.minimap.enabled": true,
    "liveServer.settings.donotShowInfoMsg": true,
    "git.confirmSync": false,
    "terminal.integrated.defaultProfile.windows": "Command Prompt",
    "explorer.confirmDragAndDrop": false,
    "terminal.integrated.inheritEnv": false,
    "explorer.confirmDelete": false,
    "claudeCode.preferredLocation": "panel",
    "claudeCode.environmentVariables": [
        
    ]
}
```

5.将下列内容复制到 `claudeCode.environmentVariables` 列表中；

```json
{"name": "ANTHROPIC_BASE_URL", "value": "https://xxxx"},
{"name": "ANTHROPIC_AUTH_TOKEN", "value": "xxxx"}
```

6.配置好的 `Settings.json` 内容参考如下：

```json
{
    ...,
    "editor.minimap.enabled": true,
    "liveServer.settings.donotShowInfoMsg": true,
    "git.confirmSync": false,
    "terminal.integrated.defaultProfile.windows": "Command Prompt",
    "explorer.confirmDragAndDrop": false,
    "terminal.integrated.inheritEnv": false,
    "explorer.confirmDelete": false,
    "claudeCode.preferredLocation": "panel",
    "claudeCode.environmentVariables": [
        {"name": "ANTHROPIC_BASE_URL", "value": "https://xxxx"},
        {"name": "ANTHROPIC_AUTH_TOKEN", "value": "xxxx"}
    ]
}
```

7.前往 [【DeepSeek 开放平台】](https://platform.deepseek.com/usage) 获取 DeepSeek V4 Pro Key；

8.安装 CCSwitch 配置Claude Code中转站，具体教程参考 [【CCSwitch中转站】](./2026-06-02-CCSwitch.md)；

9.配置完成后就可以正常在 VSCode 中使用 Claude Code

![1784188031465](/images/blog/vscode-claude-config/1784188031465.png)
