---
title: 阿里云服务器（学生优惠版）
date: 2026-06-14
description: 阿里云服务器（学生优惠版）
tags: ["阿里云","服务器"]
---

## 一、购买服务器

### 1. 领取优惠券

访问阿里云学生优惠页面领取优惠券：

[https://university.aliyun.com/course/promotion23-activity](https://university.aliyun.com/course/promotion23-activity)

![学生优惠券页面](/images/blog/aliyun-server-usage/1781335551132.png)

### 2. 选购服务器

领取优惠券后，按以下步骤操作：

`选择云服务器（e 实例）` → `立即购买` → `支付`

> 正常情况下使用优惠券后实付金额为 **0 元**。

![选购服务器](/images/blog/aliyun-server-usage/1781335651930.png)

---

## 二、首次配置

### 1. 分配公网 IP

进入云服务器控制台，默认只显示**私网 IP**（外网无法访问）。

需手动分配公网 IP：

1. 点击「分配 IP」
2. 带宽选择 **3M**
3. 点击「立即更改」

绑定完成后会显示一串数字公网 IP，**记下来**，后续远程登录需要使用。

![分配公网IP](/images/blog/aliyun-server-usage/1781336185797.png)

### 2. 重置密码

点击左上角「重置密码」：

- **用户名**：`root`
- **密码**：设置强密码

设置完成后，机器会自动重启生效。

![重置密码](/images/blog/aliyun-server-usage/1781337444199.png)

### 3. 检查安全组规则

点击「网络与安全组」，确认远程 SSH 连接端口（22 端口）已对外开放。

以下为正常开放状态：

![安全组规则](/images/blog/aliyun-server-usage/1781338586204.png)

### 4. 远程连接服务器

在本地电脑 PowerShell 中输入 SSH 连接指令：

```bash
ssh root@<你的公网IP>
```

#### 首次连接安全校验

首次连接会出现以下安全提示：

> This key is not known by any other names. Are you sure you want to continue connecting (yes/no/[fingerprint])?

此时输入 `yes` 即可。本地会永久保存该服务器的指纹，下次连接不再弹出此提示。

#### 登录验证

按下回车后，提示输入服务器 `root` 账号的登录密码：

> 输入密码时屏幕不会显示字符，属于正常现象，输完直接回车即可。

若显示 `Connection closed by <IP> port 22`，请检查密码是否正确，然后重新连接。

![SSH登录成功](/images/blog/aliyun-server-usage/1781339285997.png)

---

## 三、配置流程概览

| 步骤 | 操作 | 目的 |
|------|------|------|
| 1 | 分配公网 IP | 获取外网可访问的 IP 地址 |
| 2 | 重置 root 密码 | 设置安全的登录凭证 |
| 3 | 检查安全组 | 确保 SSH 端口（22）对外开放 |
| 4 | SSH 远程连接 | 登录 Linux 终端开始使用 |

---

## 四、常见问题

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| 连接被拒绝 | 安全组未开放 22 端口 | 检查安全组规则 |
| 连接超时 | 公网 IP 未分配或网络不通 | 确认已分配公网 IP |
| 密码错误 | 输入错误或密码未生效 | 检查密码，确认机器已重启 |
| 首次连接提示 | SSH 安全校验 | 输入 `yes` 确认即可 |

