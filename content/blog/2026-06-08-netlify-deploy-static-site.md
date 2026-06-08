---
title: "Netlify部署静态网站"
date: "2026-06-08"
description: "从零到一：使用Netlify部署静态网站，包括Git推送、自动部署、自定义域名及DNS配置全流程"
tags: ["Netlify", "GitHub", "Git", "静态网站部署"]
---

# Netlify 部署静态网站

## 一、部署前准备

### 1. 创建配置文件

#### `.gitignore`

排除敏感文件和自动生成文件：

```gitignore
node_modules/
*.log
```

#### `netlify.toml`

Netlify 部署配置文件：

```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

> **说明**：`redirects` 规则确保刷新任何页面时都返回 `index.html`（SPA 的 fallback 机制）。

### 2. 初始化 Git 仓库并推送

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/english-exam-site.git
git push -u origin main
```

---

## 二、Netlify 部署流程概览

| 步骤 | 操作 |
|------|------|
| 1 | 打开 [Netlify](https://app.netlify.com) → Add new site → Import an existing project |
| 2 | 选择 GitHub → 授权 → 选择仓库 |
| 3 | 配置部署设置 |
| 4 | 点击 Deploy site，之后每次 `git push` 自动重新部署 |

### 部署配置参考

| 配置项 | 值 | 说明 |
|--------|-----|------|
| Branch to deploy | `main` | 部署分支 |
| Build command | 留空 | 无构建步骤 |
| Publish directory | `.` | 发布目录 |

---

## 三、实战部署过程

### 1. 推送至 GitHub 远程仓库

#### 项目结构

当前部署的项目为 `english-exam-site`：

![项目文件结构](/images/blog/netlify-deploy/1780918601373.png)

#### 创建 GitHub 仓库

打开 GitHub，新建项目：

![GitHub新建仓库](/images/blog/netlify-deploy/1780918702810.png)

复制远程仓库链接：

![复制仓库链接](/images/blog/netlify-deploy/1780918756115.png)

#### 推送代码

在本地 Git 命令行执行：

```bash
git remote add origin git@github.com:Couioly/english-exam-site.git
git push -u origin master
```

> 注意：将 `git@github.com:Couioly/english-exam-site.git` 替换为你刚才复制的远程仓库链接。

---

### 2. 连接 Netlify

#### 导入仓库

打开 [Netlify](https://app.netlify.com)（用 GitHub 登录）→ `Add new Project` → `Import a Git repository` → `GitHub`：

![Netlify导入仓库](/images/blog/netlify-deploy/1780919336677.png)

#### 选择仓库

在打开的页面中选择刚刚推送的远程仓库：

![选择仓库](/images/blog/netlify-deploy/1780919618467.png)

若未显示目标仓库，点击 `Configure the Netlify app on GitHub` 前往 GitHub 配置权限：

![配置GitHub权限](/images/blog/netlify-deploy/1780919554552.png)

#### 配置并部署

根据项目需求进行配置。此处仅填写项目名，然后滚动到页面底部点击 `Deploy` 开始部署：

![部署配置](/images/blog/netlify-deploy/1780919911379.png)

#### 部署成功

部署成功后，页面会展示绿色的网站访问链接，点击即可直接访问：

![部署成功](/images/blog/netlify-deploy/1780920060420.png)

---

## 四、配置自定义域名

> 前提：已拥有注册好的域名。此处以阿里云注册的 `junbo.site` 为例。

### 1. 添加域名

在 Netlify 的 `english-exam-site` 项目设置页，依次点击：

`Domain management` → `Add a domain` → `Add a domain you already own`

![添加域名入口](/images/blog/netlify-deploy/1780920371554.png)

### 2. 验证域名

输入已注册的域名，点击 `Verify`：

![验证域名](/images/blog/netlify-deploy/1780920515094.png)

出现以下提示说明域名验证成功：

> **junbo.site** found! To connect it to your site, update your DNS records at your registrar. Open "Pending DNS verification" in the next step for step-by-step instructions. Your site will work once the changes propagate.

点击 `Add domain`：

![添加域名确认](/images/blog/netlify-deploy/1780920664535.png)

### 3. 查看 DNS 配置要求

正常会出现以下页面，表示需要自行配置 DNS 解析：

![DNS配置提示](/images/blog/netlify-deploy/1780920735966.png)

### 4. 配置阿里云 DNS 解析

前往阿里云配置域名 DNS 解析。此处使用移动端阿里云操作：

![阿里云DNS配置](/images/blog/netlify-deploy/1780921374774.png)

#### DNS 记录配置

根域名使用 A 记录，子域名使用 CNAME 记录：

| 记录类型 | 主机记录 | 记录值 |
|----------|----------|--------|
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `english-exam-site.netlify.app` |

> **注意**：
> - 阿里云不支持 CNAME 扁平化，根域名需用 A 记录
> - Netlify 当前 Load Balancer IP 为 `75.2.60.5`
> - 建议前往 [Netlify 官方文档](https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/) 确认最新 IP

### 5. 等待生效

配置好 DNS 解析后，回到 Netlify 等待 DNS 生效和 HTTPS 配置：

| 阶段 | 说明 | 耗时 |
|------|------|------|
| DNS 生效 | 解析传播 | 几分钟到几小时 |
| DNS 检测 | Netlify 自动检测指向是否正确 | 自动 |
| SSL 证书 | Netlify 自动申请 Let's Encrypt 证书 | 几分钟 |
| 状态确认 | 域名状态标记为 ✅ Active | 完成 |

![域名配置成功](/images/blog/netlify-deploy/1780923457631.png)

### 6. 访问验证

访问 `https://你的域名` 验证是否成功：

![成功访问](/images/blog/netlify-deploy/1780923512392.png)

---

## 五、总结

| 阶段 | 关键操作 |
|------|----------|
| 准备 | 创建 `.gitignore`、`netlify.toml`，初始化 Git 仓库 |
| 推送 | 代码推送至 GitHub 远程仓库 |
| 部署 | Netlify 导入仓库，一键部署 |
| 域名 | 添加自定义域名，配置 DNS 解析，等待生效 |

Netlify 的优势在于**自动化**：代码推送后自动构建部署，SSL 证书自动申请，省去大量手动配置工作。