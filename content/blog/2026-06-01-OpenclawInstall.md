---
title: "OpenClaw 安装教程"
date: "2026-06-01"
description: "OpenClaw 安装与配置教程，包含 OpenAI 授权、DeepSeek 接入、常见问题排查及常用命令。"
tags: ["工具", "AI"]
---

### 一键安装

执行官网的安装指令（Windows）：

```powershell
powershell -c "irm https://openclaw.ai/install.ps1 | iex"
```

系统会自动配置 `node.js` 环境。

![1780134869377](/images/blog/openclaw-install/1780134869377.png)

### 安装向导（Setup Wizard）

OpenClaw 主程序安装成功后，会启动安装向导（Setup Wizard）。

![1780143609184](/images/blog/openclaw-install/1780143609184.png)

#### 问答配置过程

| 问题 | 选项 | 说明 |
|:----:|------|------|
| Q1 | `YES` | 同意协议，开始配置 |
| Q2 | `QuickStart（recommended）` | 快速启动模式 |
| Q3 | `OpenAI` | 选择模型供应商 |
| Q4 | `ChatGPT/Codex Browser Login` | 浏览器登录授权 |

##### Q1-Q3 配置

依次选择 `YES` → `QuickStart` → `OpenAI`：

![1780143787897](/images/blog/openclaw-install/1780143787897.png)

![1780143962234](/images/blog/openclaw-install/1780143962234.png)

![1780144124929](/images/blog/openclaw-install/1780144124929.png)

##### Q4 浏览器登录授权

选择 `ChatGPT/Codex Browser Login`，弹出浏览器进行 OpenAI 登录。

![1780144268219](/images/blog/openclaw-install/1780144268219.png)

---

### 问题排查

#### 问题一：地区限制

浏览器显示 `Authentication successful`，登录成功了。但 OpenClaw 本地进程向 OpenAI 换取访问令牌时，被 OpenAI 判断为来自不支持的地区或网络线路。

![1780145568920](/images/blog/openclaw-install/1780145568920.png)

**解决方法**：修改代理为 `Tun` 模式（全局代理），重新执行登录命令：

```powershell
openclaw models auth login --provider openai-codex
```

登录成功，但 Codex 插件安装失败。直接 `Ctrl+C` 中断进程即可。

![1780149412580](/images/blog/openclaw-install/1780149412580.png)

#### 验证模型列表

执行以下命令确认是否成功获取到 OpenAI 的大模型：

```powershell
openclaw models list
```

![1780146499753](/images/blog/openclaw-install/1780146499753.png)

#### 问题二：对话请求被拒绝

输入 `openclaw chat` 打开对话，调用模型后反馈推理调用失败。

OpenClaw 能看到 OpenAI 账号，也能拉取模型列表，但真正发起 GPT-5.5 对话请求时，被 OpenAI 拒绝了。

![1780146724389](/images/blog/openclaw-install/1780146724389.png)

**解决思路**：OpenAI 有地区限制，改用 DeepSeek。

---

### 接入 DeepSeek

#### 打开配置项

```powershell
openclaw configure
```

#### 配置流程

| 问题 | 选择 | 说明 |
|:----:|------|------|
| Q1 | `Local（this machine）` | 本地运行 |
| Q2 | `Model` | 修改模型配置 |
| Q3 | `More` | 更多选项 |
| Q4 | `deepseek` | 选择 DeepSeek，输入 API Key |
| Q5 | 空格键选中模型 | 方向键选择需要的模型 |

##### Q1-Q3 配置

选择 `Local` → `Model` → `More`：

![1780146947657](/images/blog/openclaw-install/1780146947657.png)

![1780147129514](/images/blog/openclaw-install/1780147129514.png)

![1780147166005](/images/blog/openclaw-install/1780147166005.png)

##### Q4-Q5 配置

选择 `deepseek`，输入自己的 API，然后选择需要的大模型（方向键选择，空格键选中）：

![1780147332623](/images/blog/openclaw-install/1780147332623.png)

![1780147436886](/images/blog/openclaw-install/1780147436886.png)

#### 首次成功对话

配置完成后选择 `None` 退出，重新执行：

```powershell
openclaw chat
```

打开后会自动恢复上一次的会话记录。输入 `/model` 修改大模型为 `deepseek-v4-flash`，重新发送问题——成功！

![1780147719463](/images/blog/openclaw-install/1780147719463.png)

---

### 常用命令

#### 查看认证状态

```powershell
openclaw models auth status
```

该命令用于**认证状态检查**，不会调用模型聊天，而是查看：
- 当前有哪些模型可用
- 哪些 Provider 已认证
- 哪些认证过期了

![1780149065699](/images/blog/openclaw-install/1780149065699.png)
