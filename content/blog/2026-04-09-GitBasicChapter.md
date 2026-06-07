---
title: "Git 基础篇"
date: "2026-04-09"
description: "Git版本控制工具首次体验，了解git本地常见指令集，比如：添加到暂存区、提交、合并冲突、分支操作等等..."
tags: ["工具","版本控制"]
---

## 1 Git 安装与常用命令

### 1.1 Git 安装

Git官网 - Windows安装地址：https://git-scm.cn/install/windows

![1775712053926](/images/blog/git-basics/1775712053926.png)

Git 是否安装成功验证方式：

![1775714157325](/images/blog/git-basics/1775714157325.png)

> **备注**:
>
> - Git GUI：Git提供的图形界面工具
> - Git Bash：Git提供的命令行工具

当安装Git后首先要做的事情是**设置用户名称和email地址**。这是非常重要的，因为每次Git提交都会使用该用户信息

### 1.2 Git 基本配置

1. 打开Git Bash
2. 设置用户信息
```bash
git config --global user.name "your_name"
git config --global user.email "your_email"
# 查看配置信息
git config --global user.name
git config --global user.email
```

### 1.3 Git 常用指令配置别名（可选）

有些常用的指令参数非常多，每次都要输入好多参数，我们可以使用别名。

1. 打开用户目录 `C:\Users\用户名`，创建 `.bashrc` 文件。部分Windows系统不允许用户创建点号开头的文件，可以打开Git Bash，执行：

```bash
touch ~/.bashrc
```

2. 在 `.bashrc` 文件中输入如下内容：

```bash
# 用于输出git提交日志
alias git-log='git log --pretty=oneline --all --graph --abbrev-commit'
# 用于输出当前目录所有文件及基本信息
alias ll='ls -al'
```

3. 打开 Git Bash，执行配置生效命令

```bash
source ~/.bashrc
```

### 1.4 解决GitBash乱码问题

1. 打开GitBash执行下面命令

```bash
git config --global core.quotepath false
```

2. `${git_home}/etc/bash.bashrc` 文件最后加入下面两行（ `git_home` 表示Git的安装目录）

```bash
export LANG="zh_CN.UTF-8"
export LC_ALL="zh_CN.UTF-8"
```

### 1.5 Git 常用命令

本教程里的git命令例子都是在Git Bash中演示的，会用到一些基本的linux命令，在此为大家提前列举：

- `ls/ll`：查看当前目录
- `cat`：查看文件内容
- `touch`：创建文件
- `vim` ：vim编辑器（可以记事本、editPlus、notPad++等其它编辑器）

## 2 获取本地仓库
要使用Git对我们的代码进行版本控制，首先需要获得本地仓库

**操作步骤**

1. 在电脑的任意位置创建一个空目录（例如test）作为我们的本地Git仓库
2. 进入这个目录中，点击右键打开Git bash窗口
3. 执行命令 `git init`
4. 如果创建成功后可在文件夹下看到隐藏的`.git`目录

**命令执行示例**

```bash
# 初始化当前目录为一个git仓库
31245@HUAWEINotBook16 MINGW64 /d/DailyFile/git-test/test01
$ git init
Initialized empty Git repository in D:/DailyFile/git-test/test01/.git/

31245@HUAWEINotBook16 MINGW64 /d/DailyFile/git-test/test01 (master)
```

## 3 基础操作指令

Git工作目录下对于文件的**修改**（增删改）会存在几个状态，这些修改的状态会随着我们执行Git的命令而发生变化。

![1775717111156](/images/blog/git-basics/1775717111156.png)

本教程主要讲解如何使用命令来控制这些状态之间的转换：

1. `git add`：将**工作区**中**新增/修改**的文件 传入 **暂存区**
2. `git commit`：将**暂存区**的文件 提交至 **本地仓库**
3. `git status`：查看当前的文件状态

如下图实例所示，观察每条git指令执行后文件状态的变化情况：

![1775718270816](/images/blog/git-basics/1775718270816.png)

**提示**：

1. `git add .`：常用 `.` 代替所有文件，提升效率
2. `git commit -m "commit_text"`：`commit_text` 是文件提交至本地仓库时的注释
3. `git log`：查看提交日志

![1775718899023](/images/blog/git-basics/1775718899023.png)

### 3.1 查看修改的状态（status）
*   **作用**：查看工作区与暂存区的修改状态
*   **命令形式**：
    
    ```bash
    git status
    ```

### 3.2 添加工作区到暂存区 (add)

- **作用**：将工作区中**一个或多个文件**的修改提交到暂存区

- **命令形式**：

  ```bash
  git add <单个文件名> | <通配符>
  # 将所有修改加入暂存区
  git add .
  ```

### 3.3 提交暂存区到本地仓库 (commit)

- **作用**：将暂存区的内容提交到本地仓库的当前分支，形成版本历史

- **命令形式**：

  ```bash
  git commit -m '<注释内容>'
  ```

### 3.4 查看提交日志(log)

> 说明：在 1.3 中配置的别名 `git-log` 已包含下方参数，后续可直接使用指令 `git-log`

*   **作用**：查看版本提交记录（历史版本）
*   **命令形式**：
    
    ```bash
    git log [option]
    ```

**常用可选参数（options）**

- `--all`：显示所有分支的提交日志
- `--pretty=oneline`：将提交信息显示为一行（简化输出）
- `--abbrev-commit`：使得输出的 `commitId`（版本号）更简短
- `--graph`：以图的形式（分支结构图）显示日志

### 3.5 版本回退

*   **作用**：版本切换（回退到历史指定版本）
*   **命令形式**：
    ```bash
    git reset --hard commitID
    ```

- `commitID` 可通过 `git-log` 或 `git log` 指令查看

- **问题**：如何查看已经删除的提交记录？

  ```bash
  # 解决方案
  git reflog
  ```

- 该指令可以**查看所有操作记录，包括已被删除的提交记录**

### 3.6 添加文件至忽略列表

一般我们总会有些文件无需纳入Git的管理，也不希望它们总出现在未跟踪文件列表。通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。在这种情况下，我们可以在工作目录中创建一个名为 `.gitignore` 的文件（文件名称固定），列出要忽略的文件模式。

`.gitignore` 示例

```gitignore
# no .a files
*.a

# but do track lib.a, even though you're ignoring .a files above
!lib.a

# only ignore the TODO file in the current directory, not subdir/TODO
/TODO

# ignore all files in the build/ directory
build/

# ignore doc/notes.txt, but not doc/server/arch.txt
doc/*.txt

# ignore all .pdf files in the doc/ directory
doc/**/*.pdf
```

## 4 分支

几乎所有的版本控制系统都以某种形式支持分支。使用分支意味着你可以把你的工作从开发主线上分离开来进行重大的Bug修改、开发新的功能，以免影响开发主线。

### 4.1 查看本地分支
*   **命令**：
    ```bash
    git branch
    ```

### 4.2 创建本地分支

- 命令：

  ```bash
  git branch <分支名>
  ```

### 4.3 切换分支 (checkout)

- 命令：

  ```bash
  git checkout <分支名>
  ```

- 创建并切换到新分支（一步完成）：

  ```bash
  git checkout -b <分支名>
  ```

### 4.4 合并分支 (merge)

- **作用**：将一个分支上的提交合并到当前分支

- 命令：

  ```bash
  git merge <分支名称>
  ```

### 4.5 删除分支

- **不能删除当前分支，只能删除其他分支**
  - `git branch -d <分支名>`：删除分支时，需要做各种检查
  - `git branch -D <分支名>`：不做任何检查，强制删除（适用场景：当某分支已修改代码但未merge时）

- 使用 `-d` 删除时可能遇到的报错信息，此时就可以改用 `-D`：

  ```txt
  error: the branch 'dev02' is not fully merged
  ```

### 4.6 解决冲突 

当两个分支上对文件的修改可能存在冲突，例如同时修改同一文件的同一行，这时等后续合并时需手动解决冲突，示例如下：

![1775732583971](/images/blog/git-basics/1775732583971.png)

此时当我尝试合并 `master` 和 `dev` 分支时失败，错误信息如下所示：

```bash
31245@HUAWEINotBook16 MINGW64 /d/DailyFile/git-test/test01 (master)
$ git merge dev
Auto-merging demo01.txt
CONFLICT (content): Merge conflict in demo01.txt
Automatic merge failed; fix conflicts and then commit the result.
```

此时我的 `demo01.txt` 文件内容也出现了变化：

```txt
<<<<<<< HEAD
update commit=111
=======
update commit=11
>>>>>>> dev
```

解决冲突的步骤：

1. 手动修改冲突文件 `demo01.txt` 的内容，如下：

   ```txt
   Hello World!
   ```

2. 将解决完的冲突文件加入暂存区：`git add .`
3. 提交到本地仓库：`git commit`

### 3.7 开发中分支使用原则与流程

在开发中，一般有如下分支使用原则与流程：

##### master（生产）分支

*   **定位**：线上分支，主分支
*   **用途**：中小规模项目作为线上运行的应用对应的分支；直接用于部署生产环境。

##### develop（开发）分支

*   **定位**：从 `master` 创建的分支
*   **用途**：作为开发部门的主要开发分支。如果没有其他并行开发不同期上线要求，都可以在此版本进行开发。阶段开发完成后，需要是合并到 `master` 分支，准备上线。

##### feature/xxxx 分支

*   **定位**：从 `develop` 创建的分支
*   **用途**：同期并行开发，但不同期上线时创建的分支。分支上的研发任务完成后合并到 `develop` 分支。通常用于开发新功能。

##### hotfix/xxxx 分支

*   **定位**：从 `master` 派生的分支
*   **用途**：一般作为线上Bug修复使用。修复完成后需要合并到 `master`、`test`、`develop` 分支，确保补丁同时应用到生产和开发环境。

##### 其他辅助分支

*   **test 分支**：用于代码测试
*   **pre 分支**：预上线分支，用于模拟生产环境进行最后的验证



![1775733811162](/images/blog/git-basics/1775733811162.png)

## 5 Git 工作流程图

![1775713164804](/images/blog/git-basics/1775713164804.png)

**命令如下（进阶篇学习）**:

- `clone`（克隆）: 从远程仓库中克隆代码到本地仓库

- `checkout` （检出）:从本地仓库中检出一个仓库分支然后进行修订

- `add`（添加）: 在提交前先将代码提交到暂存区

- `commit`（提交）: 提交到本地仓库。本地仓库中保存修改的各个历史版本

- `fetch` (抓取)： 从远程库，抓取到本地仓库，不进行任何的合并动作，一般操作比较少。

- `pull` (拉取)： 从远程库拉到本地库，自动进行合并(merge)，然后放到到工作区，相当于fetch+merge

- `push`（推送）: 修改完成后，需要和团队成员共享代码时，将代码推送到远程仓库

