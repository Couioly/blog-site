---
title: "Git 进阶篇"
date: "2026-05-05"
description: "Git 进阶教程：远程仓库操作、SSH公钥配置、PyCharm中Git可视化管理、分支合并冲突解决。"
tags: ["Git", "版本控制"]
---

## 1 Git 远程仓库

### 1.1 常用的托管服务 [远程仓库]
前面我们已经知道了Git中存在两种类型的仓库，即**本地仓库和远程仓库**。那么我们如何搭建Git远程仓库呢？我们可以借助互联网上提供的一些代码托管服务来实现，其中比较常用的有 GitHub、码云、GitLab 等。

|  平台  |           地址            | 特点                                                         |
| :----: | :-----------------------: | :----------------------------------------------------------- |
| GitHub |    https://github.com/    | 面向开源及私有软件项目的托管平台，只支持Git作为唯一的版本库格式进行托管 |
| Gitee  |    https://gitee.com/     | 国内代码托管平台，服务器在国内，访问速度比GitHub更快         |
| GitLab | https://about.gitlab.com/ | 用于仓库管理系统的开源项目，基于Git搭建的Web服务，常用于企业、学校等内部网络搭建Git私服 |

---

### 1.2 注册码云(Gitee)
**Gitee官网 注册地址：https://gitee.com/signup**

![1775736967952](/images/blog/git-advanced/1775736967952.png)

### 1.3 创建远程仓库

根据个人所需创建远程仓库，若存在本地仓库，则不建议勾选创建按钮上方的三个复选框。

![1775737746677](/images/blog/git-advanced/1775737746677.png)

### 1.4 配置SSH公钥

1. 生成SSH公钥

   ```bash
   ssh-keygen -t rsa
   ```


2. 一路回车，使用默认值即可。

   ![1775804920198](/images/blog/git-advanced/1775804920198.png)

   也可以选择对密钥进行详细的配置，执行后会出现提示：

   - 首先询问密钥保存路径，直接按回车使用默认路径（`~/.ssh/id_rsa`）

   ```bash
   Enter file in which to save the key (/c/Users/YOU/.ssh/id_ALGORITHM): 回车
   ```

   - 然后会提示设置密码（可选），直接按回车跳过即可（无需密码）

   ```bash
   Enter passphrase (empty for no passphrase): 输入密码
   Enter same passphrase again: 再次输入密码
   ```

   生成成功后，再次执行 `ls -al ~/.ssh` 就能看到新生成的密钥文件：

   - `id_rsa`（私钥，务必保密，不要分享给任何人）
   - `id_rsa.pub`（公钥，需要添加到 GitHub 的文件）

3. 查看SSH公钥文件 `id_rsa.pub` 的内容且进行复制：

   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

4. 完整的复制SSH公钥后打开Gitee的SSH配置页面，将公钥复制到输入框中并保存，然后输入账户密码验证即可，如下图所示：

   ![1775805298552](/images/blog/git-advanced/1775805298552.png)

5. 返回 Git Bash 输入下列指令测试你的电脑能否通过 SSH 协议，成功连接到 Gitee 服务器，并验证你的密钥是否正确：

   ```bash
   ssh -T git@gitee.com
   ```

   首次连接可能出现下面的提示，此时只需在结尾处输入 `yes`，如下：

   ```bash
   Are you sure you want to continue connecting (yes/no/[fingerprint])? yes

   # 若成功，则出现类似下列内容的语句
   Hi 用户名! You've successfully authenticated, but GITEE.COM does not provide shell access.
   ```


> 错误提示：
>
> 执行 `ssh -T git@gitee.com` 时出现连接认证失败，报错 `ssh_dispatch_run_fatal: Connection to gitee.com port 22: Broken pipe`：
>
> - 原因：本地存在多组 SSH 密钥（例如 `id_ed25519` 用于 GitHub、`id_rsa` 用于 Gitee），默认连接未指定 Gitee 对应私钥，导致密钥不匹配、SSH 连接断开；
> - 解决方法：指定正确私钥执行 `ssh -T git@gitee.com -i ~/.ssh/id_rsa` 后，连接认证成功。

### 1.5 添加远程仓库

1. 复制远程仓库的SSH仓库路径；

   ![1775809989482](/images/blog/git-advanced/1775809989482.png)

2. 执行下列指令将远程仓库绑定到本地；

   - 远程仓库名称：默认使用 `origin` ，也可自定义
   - 远程仓库路径：从远端服务器获取

   ```bash
   # git remote add 远程仓库名称 远程仓库路径
       git remote add origin git@gitee.com:Couioly/education-network.git
   ```

3. 执行 `git remote` 指令可以查看当前远程仓库列表；

4. 推送到远程仓库的完整版命令：

   ```bash
   git push [-f] [--set-upstream] [远程仓库名称[本地分支名][:远端分支名]]
   ```

   - 若远程分支名和本地分支名相同，则可以只写本地分支名；

     ```bash
     # git push 远程仓库名称 本地分支名称
     git push origin master
     ```

   - `-f` 表示强制，使用于在本地仓库和远程仓库发生冲突时，进行强制覆盖；

   - `--set-upstream` 推送到远端的同时并且建立起和远端分支的关联关系；

     ```bash
     git push --set-upstream origin master
     ```

   - 若**当前分支已经和远端分支关联**，则可以省略分支名和远端名。

     ```bash
     git push # 将master分支推送到已关联的远端分支
     ```

   - 设置关联关系相关的指令：

     ```bash
     git branch      # 查看本地仓库分支
     git branch -vv  # 查看分支关联关系
     git remote -vv  # 查看远程仓库分支
     ```


   ![1775812211632](/images/blog/git-advanced/1775812211632.png)

5. **删除远程文件（本地保留）**

   - 删除文件

     ```bash
     git rm --cached 文件名
     ```

   - 删除文件夹（必须加 -r）

     ```bash
     git rm --cached -r 文件夹名
     ```

     `--cached` 是关键！只删远程，不删本地。删除后再次执行提交-推送即可达到删除远程文件的目的。

### 1.6 克隆远程仓库

如果已存在一个远端仓库，我们可以直接 `clone` 到本地。指令如下：

```bash
# git clone <仓库路径> [本地目录(可选)]
git clone git@gitee.com:Couioly/education-network.git
```

### 1.7 远程仓库中抓取和拉取

远程分支和本地的分支一样，我们可以进行merge操作，只是需要先把远端仓库里的更新都下载到本地，再进行操作。

- **抓取（fetch）命令形式**：

  ```bash
  git fetch [remote name] [branch name]
  ```

- 说明：

  - 抓取指令就是将仓库里的更新都抓取到本地，**不会进行合并**，需再次执行 `git merge 远程仓库/远程分支名` 进行合并
  - 如果不指定远端名称和分支名，则抓取所有分支

- **拉取（pull）命令形式：**

  ```bash
  git pull [remote name] [branch name]
  ```

- 说明：

  - 拉取指令就是将远端仓库的修改拉到本地并自动进行合并，**等同于 fetch + merge**
  - 如果不指定远端名称和分支名，则抓取所有并更新当前分支

### 1.8 解决合并冲突

**冲突产生原因**：在一段时间内，A、B用户修改了同一个文件，且修改了同一行位置的代码，此时会发生合并冲突。

**冲突场景流程**：A用户在本地修改代码后优先推送到远程仓库，此时B用户在本地修订代码，提交到本地仓库后，也需要推送到远程仓库。由于B用户晚于A用户推送，故**需要先拉取远程仓库的提交，经过合并后才能推送到远端分支**（在B用户拉取代码时，因为A、B用户同一段时间修改了同一个文件的相同位置代码，故会发生合并冲突）

![1775814506803](/images/blog/git-advanced/1775814506803.png)

远程分支也是分支，所以**合并时冲突的解决方式也和解决本地分支冲突相同**，在此不再赘述。

## 2 PyCharm 中使用 Git

### 2.1 在PyCharm中配置Git

安装好PyCharm后，如果Git安装在默认路径下，那么PyCharm会自动找到git的位置，如果更改了Git的安装位置则需要手动配置下Git的路径。选择File→Settings打开设置窗口，找到Version Control下的git选项：

![1775815884830](/images/blog/git-advanced/1775815884830.png)

### 2.2 在PyCharm中操作Git

1. 创建一个远程仓库，此处以 `AIHeartCrisis` 为例；

   ![1775817252203](/images/blog/git-advanced/1775817252203.png)

2. 打开本地 `HeartCrisisAPI` 项目，将本地项目初始化为Git项目，相当于执行了 `git init` 指令；

   ![1775816649707](/images/blog/git-advanced/1775816649707.png)

3. 选择需要变更为Git项目的项目根目录文件夹；

   ![1775817440166](/images/blog/git-advanced/1775817440166.png)

4. 点击左侧栏中的 `commit` 按钮，勾选需要提交到仓库的文件，因为此处配置了 `.gitignore` 文件，所以可以一键勾选，该步骤类似于 `git add .` 指令；然后输入提交注释，该步骤类似于 `git commit -m ''` 指令；接下来点击 `commit and push` 首次推送远程仓库会遇到需要绑定远程仓库的情况，此处点击 `Define remote` ，在打开的窗口中配置远程仓库信息，最后点击 `OK` 和 `Push`即可完成推送操作。

   ![1775817950527](/images/blog/git-advanced/1775817950527.png)

5. 回到远程仓库刷新，发现成功推送！

   ![1775818570340](/images/blog/git-advanced/1775818570340.png)


### 2.3 克隆远程仓库到PyCharm

1. 通过 `file` - `Project from Version Control` 打开克隆窗口，将远程仓库的SSH路径复制到URL中，点击克隆 `Clone`；

   ![1775819381563](/images/blog/git-advanced/1775819381563.png)

2. 下图为克隆后的效果图，它将在一个新的窗口中展示；

   ![1775819841223](/images/blog/git-advanced/1775819841223.png)

### 2.4 解决冲突

1. 假设此时我在原来的项目中添加了一个用于展示登录页面的接口 `api/login-page`；与此同时，在克隆项目中添加了一个用于展示主页页面的接口 `api/index-page`，它们属于同一文件下同一位置，如下图所示：

   ![1775820923148](/images/blog/git-advanced/1775820923148.png)

2. 此时我先推送原项目的修改内容至远程仓库，可见可以成功推送；

   ![1775821364173](/images/blog/git-advanced/1775821364173.png)

3. 接下来在克隆项目中我先进行提交 `commit`，然后点击 `Git` - `Pull` 后，它将提示处理 `Merge` 异常的窗口，由于刚刚接触，我们先不在此处修改，直接关闭该窗口，接着你将看到版本控制区显示了 `fetch` 到的记录，同时导致 `Merge` 异常的文件将报错高亮显示，如下图；

   ![1775821690591](/images/blog/git-advanced/1775821690591.png)

4. 修改合并出错的语句块，修改完成后将该文件 `add` 到缓存区，如下图所示：

   ![1775822145279](/images/blog/git-advanced/1775822145279.png)

5. 最后根据正常推送逻辑进行远程仓库推送即可

   ![1775822259230](/images/blog/git-advanced/1775822259230.png)

   ![1775822300039](/images/blog/git-advanced/1775822300039.png)

### 2.5 其他Git操作

1. 添加分支操作：打开Git的Log页面，直接点击需要创建分支的位置，右键选择新建分支；

   ![1775822921996](/images/blog/git-advanced/1775822921996.png)

2. 合并分支操作：假设现在需要将 `dev` 分支合并至 `master` 分支，需先将当前分支切换至 `master`，然后右击 `dev` 选择 `Merge 'dev' into 'master'`；

   ![1775823212025](/images/blog/git-advanced/1775823212025.png)

3. 修改PyCharm的Terminal为Git-Bash

   ![1775824100487](/images/blog/git-advanced/1775824100487.png)

## 3 Git铁令

- **切换分支前先提交本地的修改**
- **任何修改文件及时提交**
- **遇到任何问题都不要删除文件目录**
