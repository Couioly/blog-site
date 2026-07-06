---
title: "ClaudeCode CLI安装"
date: "2026-04-05"
description: "Claude Code CLI 安装与配置教程，包括绕过登录限制、接入免费大模型 LongCat 等"
tags: [ai, claude-code]
---

### 安装 ClaudeCode

1. 打开 powershell，输入安装指令：

```shell
irm https://claude.ai/install.ps1 | iex
```

![](/images/blog/claude-code-cli-setup/file-20260405101409153.png)

2. 此时表示安装成功，但是目前无法直接使用，需要配置环境变量：

![](/images/blog/claude-code-cli-setup/file-20260405101409154.png)

3. 重启powershell窗口，执行启动Claudecode命令：

```bash
claude
```

​	Anthropic对中国大陆地区的服务限制 -> 报错示例：

![](/images/blog/claude-code-cli-setup/file-20260405101409155.png)

4. 此时需要添加指令绕过登录即可，在 `C:\Users\31245` 中找到 `.claude.json` 的配置文件，在文件结尾处新增登录绕过指令：

```json
"hasCompletedOnboarding":true
```

![](/images/blog/claude-code-cli-setup/file-202604051014091551.png)

### 配置大模型

1. 此处推荐一款免费的大模型 LongCat-Flash-Thinking-2601，因为它免费，适合入门学习，打开LongCat的API开放平台，登录注册后进入该页面；

![](/images/blog/claude-code-cli-setup/file-20260405101538135.png)

2. 进入开放平台后就可以看到它每天都赠送 `50w Token` 的额度，每日更新；

![](/images/blog/claude-code-cli-setup/file-20260405101409157.png)

3. 接下来创建一个API密钥，点击 APIKeys 创建页面进行创建；

![](/images/blog/claude-code-cli-setup/file-202604051014091571.png)

4. 打开 接口文档，找到 Claudecode 的配置文件信息，复制该json文件内容；

![](/images/blog/claude-code-cli-setup/file-20260405101409158.png)

5. 打开 Claudecode 的配置文件 `setting.json` 复制粘贴的内容，文件路径默认为 `C:\User\用户名\.claude`;

![](/images/blog/claude-code-cli-setup/file-20260405101820043.png)

6. 接下来找一个信任文件夹，就可以开始使用了

![](/images/blog/claude-code-cli-setup/file-20260405102026849.png)

![](/images/blog/claude-code-cli-setup/file-20260405102428281.png)

此处所介绍说它时Claudecode模型，但实际为我们刚才配置的大模型Longcat，可以在开放平台看到已经开始消耗Token了。

![](/images/blog/claude-code-cli-setup/file-20260405102616567.png)

后续可结合CCSwitch接入其他厂商的模型

CloudeCode+CCSwitch+DeepSeekV4教程可以参考  [【CCSwitch中转站】](./2026-06-02-CCSwitch.md)

