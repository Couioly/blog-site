---
title: "0~1 ClawBot快速接入实战"
date: "2026-06-08"
description: "从零开始的ClawBot接入教程：OpenClaw安装配置、DeepSeek切换、微信插件接入、会话隔离设置。"
tags: ["ClawBot", "OpenClaw", "DeepSeek", "微信", "智能体"]
---

# 0~1 ClawBot快速接入实战

### 前言：为什么我现在才尝试 OpenClaw

这次对前几天的折腾做个总结，说实话，我对 AI 智能体一直很感兴趣，但之前 OpenClaw 火的时候，我根本不敢碰。

一搜教程，全是劝退：
- "安装配置特别复杂"
- "有风险，建议装虚拟机里"
- "环境配置一堆坑"

作为一个智能体小白，看到这些我直接劝退了。直到最近，微信推出官方 ClawBot 插件，我才觉得——是时候试试这块硬骨头了。

结果？整个过程意外顺利。普通人想用 ClawBot 聊天或做简单指令，其实并不难。

---

### 第一阶段：OpenClaw 安装

#### 执行官方安装指令

打开 PowerShell，执行官方一键安装命令：

```powershell
powershell -c "irm https://openclaw.ai/install.ps1 | iex"
```

安装脚本自动帮我配置了 Node.js 环境，然后 OpenClaw 主程序启动了 Setup Wizard（安装向导）。

#### Setup Wizard 配置过程

向导的问答流程：

| 问题 | 我的选择 |
|------|---------|
| Q1 | `YES` |
| Q2 | `QuickStart（recommended）` |
| Q3 | `OpenAI` |
| Q4 | `ChatGPT/Codex Browser Login` |

选择 Q4 后，系统弹出浏览器让我登录 OpenAI。

#### 遇到的第一个问题：地区限制

浏览器显示 `Authentication successful`，登录成功了。但 OpenClaw 本地进程向 OpenAI 换取访问令牌时，被拒绝了——判断为来自不支持的地区或网络线路。

**解决方法**：把代理改成 `Tun` 模式（全局代理），重新执行登录命令：

```powershell
openclaw models auth login --provider openai-codex
```

登录成功了，但 Codex 插件安装失败。不过这不影响后续使用，我直接 `Ctrl+C` 中断进程。

#### 验证模型列表

执行以下命令检查是否成功获取到 OpenAI 的大模型：

```powershell
openclaw models list
```

可以看到模型列表已经正常显示。

#### 遇到的第二个问题：对话请求被拒绝

输入 `openclaw chat` 打开对话，尝试调用模型后，推理调用失败了。

OpenClaw 能看到我的 OpenAI 账号，也能拉取模型列表，但真正发起 GPT-5.5 对话请求时，被 OpenAI 拒绝了。

**解决思路**：既然 OpenAI 有地区限制，那就换个模型提供商——接入 DeepSeek。

#### 切换到 DeepSeek

执行配置命令：

```powershell
openclaw configure
```

配置流程：

| 问题 | 我的选择 |
|------|---------|
| Q1 | `Local（this machine）` |
| Q2 | `Model` |
| Q3 | `More` |
| Q4 | `deepseek`，然后输入我的 DeepSeek API Key |
| Q5 | 方向键选择模型，空格键选中 |

配置完成后选择 `None` 退出配置项。

#### 首次成功对话

重新执行：

```powershell
openclaw chat
```

打开后发现它自动恢复了上一次的会话记录。输入 `/model` 修改大模型为 `deepseek-v4-flash`，然后发送问题——

**终于可以正常使用了！**

可以随时检查认证状态：

```powershell
openclaw models auth status
```

这个命令会显示 OpenClaw 当前有哪些模型可用、哪些 Provider 已认证、哪些认证过期了。

<font color=red>若要了解更详细的OpenClaw安装教程，可以访问 [【OpenClaw 安装教程】](/blog/2026-06-01-openclawinstall)</font>

---

### 第二阶段：接入微信 ClawBot 插件

#### 执行官方安装指令

```powershell
npx -y @tencent-weixin/openclaw-weixin-cli@latest install
```

扫码授权后，日志显示 Gateway 没启动/没装成服务。

#### 安装并启动 Gateway

```powershell
# 安装 Gateway
openclaw gateway install

# 启动 Gateway
openclaw gateway
```

看到提示 `Installed Scheduled Task: OpenClaw Gateway`，说明 OpenClaw 创建了一个 Windows 计划任务。以后重启电脑后，它应该会自动拉起 Gateway。

**启动成功后，就可以在刚刚扫码的微信中正常聊天了！**

<font color=red>若要了解更详细的ClawBot安装教程，可以访问 [【微信 ClawBot 插件】](2026-06-01-wechatclawbot)</font>

---

### 第三阶段：我的玩法配置

#### 玩法思路

我打算用一个微信号作为 AI 机器人，让所有好友都加这个号来聊天：

```
微信账号（机器人号）
      ↓
openclaw-weixin
      ↓
OpenClaw Gateway
      ↓
DeepSeek
```

#### 会话隔离配置

为了避免不同好友的对话混在一起，需要设置会话隔离：

```powershell
openclaw config set session.dmScope per-channel-peer
```

这个命令的含义：

```
openclaw
│
├─ config      → 修改配置
│
├─ set         → 设置配置项
│
├─ session.dmScope
│    ↓
│    Direct Message 会话隔离策略
│
└─ per-channel-peer
     ↓
     隔离级别（存在4个等级，此处为较高级别）
```

验证是否设置成功：

```powershell
Select-String -Path $HOME\.openclaw\openclaw.json -Pattern "dmScope"
```

输出示例：

```
C:\Users\31245\.openclaw\openclaw.json:167:    "dmScope": "per-channel-peer"
```

#### Agent 用户设定

执行以下命令可以查看 agent 用户设定相关的 MD 文件：

```powershell
dir $HOME\.openclaw\workspace
```

目录下有两个模板文件：

- `IDENTITY.md` - 定义 Agent 的身份（名字、类型、性格、头像等）
- `USER.md` - 记录用户信息（名字、称呼、时区、偏好等）

这些文件会在第一次对话时逐步填充，让 Agent 越来越了解你。

---

### 总结：我的感受

回顾整个过程，我的安装体验其实非常顺利：

1. **安装 OpenClaw**：一条命令搞定，Setup Wizard 引导清晰
2. **遇到的问题**：OpenAI 地区限制 → 切换 DeepSeek 解决
3. **接入微信**：官方插件一条命令，Gateway 装好就能用
4. **会话隔离**：一条命令配置，多好友场景必备

之前网上那些"复杂""有风险""必须虚拟机"的说法，可能更多是针对深度开发者的场景。对于普通人想用 ClawBot 聊天或做简单指令，其实门槛并不高。

**如果你也是智能体小白，别被吓到了，试试就知道了。**
