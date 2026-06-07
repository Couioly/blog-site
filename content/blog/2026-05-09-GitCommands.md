---
title: "Git 指令集"
date: "2026-05-09"
description: "Git 实用指令集：本地文件永久忽略、团队远程推送流程、Connection was reset 问题排查与解决。"
tags: ["Git", "版本控制"]
---

### 指令1：本地修改文件不提交到远程

#### 场景说明

作为后端开发人员，本地开发时会修改前端文件（如调试、适配），但不希望将这些本地修改提交到远程仓库，避免干扰前端同事的代码提交。

- **核心方案**：永久忽略本地前端文件（推荐）

- **适用场景**：本地修改的前端文件无需同步到远程，且后续持续保持该规则。

> 操作命令（在项目根目录终端执行）

#### 场景 1：忽略整个前端文件夹

假设前端文件夹名为`frontend`/`web`/`client`，执行：

```bash
# 替换为实际前端文件夹名
git update-index --skip-worktree 前端文件夹名/
```

示例（前端文件夹为`frontend`）：

```bash
git update-index --skip-worktree frontend/
```

#### 场景 2：忽略特定类型前端文件

若仅需忽略`.html`/`.js`/`.css`等文件，执行：

```bash
git update-index --skip-worktree *.html *.js *.css
```

**核心作用**

- 本地可随意修改前端文件，Git 不会记录这些修改；
- 不影响远程仓库的前端代码，同事提交不受干扰；
- 永久生效，直到手动取消忽略规则。

#### 场景 3：临时撤销修改

**适用场景**：临时需要将本地前端文件恢复到远程版本（如提交前清理）。操作命令：

```bash
# 撤销指定前端文件夹修改
git checkout -- 前端文件夹名/

# 撤销指定前端文件修改
git checkout -- 前端文件路径
```

示例（撤销`frontend`文件夹所有修改）：

```bash
git checkout -- frontend/
```

#### 场景 4：恢复忽略规则

若后续需要提交本地前端修改，执行以下命令取消忽略：

```bash
# 取消整个文件夹忽略
git update-index --no-skip-worktree 前端文件夹名/

# 取消单个文件忽略
git update-index --no-skip-worktree 前端文件路径
```

#### 核心规则总结

| 操作需求             | 命令                                                  | 效果                                 |
| :------------------- | :---------------------------------------------------- | :----------------------------------- |
| 永久忽略本地前端文件 | `git update-index --skip-worktree 前端文件夹/文件`    | Git 忽略本地修改，不提交、不干扰同事 |
| 临时恢复本地前端文件 | `git checkout -- 前端文件夹/文件`                     | 撤销本地修改，同步远程版本           |
| 恢复提交前端文件权限 | `git update-index --no-skip-worktree 前端文件夹/文件` | 取消忽略，可正常提交前端修改         |

**注意事项**

1. 执行命令前需确保在**项目根目录**（与`.git`文件夹同级）；
2. 该规则仅对**本地仓库**生效，不会影响远程仓库和同事的本地环境；
3. 若多人协作，需提前沟通避免重复配置冲突。

---

### 指令2：团队 Git 远程推送

#### 场景说明

我现在是团队后端开发者，我的远程仓库分支为 `backend` 分支，我现在需要向主分支 `master` 提交新功能！

- 本地开发分支：**`master`**
- 你负责的远程分支：**`origin/backend`**
- 队友负责的远程分支：**`origin/frontend`**
- 你的本地 master 已远超 `origin/master`
- 目标：**提交新功能到 `origin/master`，绝不影响 `frontend` 代码**

#### 安全操作流程

1. 拉取最新远程代码（不伤代码）

```bash
git fetch origin
```

2. 确保你在本地 `master` 分支（你本地仓库负责的分支）

```bash
git checkout master
```

3. 把本地 `master` 推送到 **你负责的远程 `backend` 分支**

```bash
git push origin master:backend
```

**命令注释**：本地 `master` → 推送到 远程 `origin/backend`（不会碰 `master` 主分支，不会碰 `frontend`）

4. 在 GitHub 上发起 **Pull Request (PR)**

- base: `master`
- compare: `backend`
- 创建 PR → 合并

*如果你想直接本地合并（不发起 PR）*

```bash
git checkout master
git pull origin master   # 同步最新主分支
git push origin master   # 推送你的功能
```

**绝对不能做（会覆盖队友代码）**

1. 不要用 `git push --force`
2. 不要动 `frontend` 分支
3. 不要强推覆盖主分支

---

### 指令3：Connection was reset 解决方案

#### 错误截图

![1777951180085](/images/blog/git-commands/1777951180085.png)

#### Git 连接失败解决方案

**问题现象**

执行 `git push/pull` 时报错：

```bash
Recv failure: Connection was reset
Failed to connect to github.com port 443: Could not connect to server
```

**核心原因**

使用 `v2rayN` 代理工具导致本地网络无法正常访问 `GitHub HTTPS` 端口（443），Git 未配置代理导致连接失败。

**最终解决方案**

通过 Git 全局代理配置 解决，执行以下命令，配置完成后，重新执行 `git push/pull` 即可正常连接 GitHub。

```bash
# 配置 Git 全局 HTTP/HTTPS 代理（替换为自己的本地代理端口，v2rayN常用 10808）
git config --global http.proxy http://127.0.0.1:10808 # 该问题当我执行这条指令后就已解决问题
git config --global https.proxy http://127.0.0.1:10808
```

**取消代理（无需代理时使用）**

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**查看当前代理配置**

```bash
git config --global --get http.proxy
git config --global --get https.proxy
```

**适用场景**

本地开启了科学上网，浏览器可访问 GitHub，但 Git 命令行连接失败的情况。

> 总结
> 问题：Git 连接 GitHub 443 端口被重置，网络不通
> 解决：git config --global 配置本地代理
> 验证：重新执行 Git 操作，连接成功

#### 切换HTTPS至Git连接

**代理 + `GitHub HTTPS` 连接被强制重置，根本推不上去**，可以尝试直接改用 `SSH` 推送（彻底绕开 `HTTPS` 被拦截的问题）

1. **生成 SSH 密钥**（一路回车，不用输密码）

```bash
ssh-keygen -t ed25519
```

2. **复制公钥**

```bash
cat ~/.ssh/id_ed25519.pub
```

​	把输出的一长串内容**全选复制**。

3. 打开 GitHub 添加密钥

   GitHub → 右上角头像 → `Settings` → `SSH and GPG keys` → `New SSH key` 粘贴刚才复制的内容，保存。

4. **切换仓库为 SSH 地址**

```bash
git remote set-url origin git@github.com:Couiolly/AIHeartCrisis.git
```

5. **直接推送（就是你要的 master → 后）**

```bash
git push origin master:后
```
