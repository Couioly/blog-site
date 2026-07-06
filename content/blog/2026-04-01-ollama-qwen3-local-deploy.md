---
title: "Ollama+Qwen3.5本地部署"
date: "2026-04-01"
description: "本地使用Ollama部署Qwen3.5实战过程"
tags: [ai, ollama, qwen, local-deploy]
---

### 安装 Ollama

1. 访问 [Ollama 官方](https://ollama.com/download) 进行安装包下载；

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612878.png)

2. 双击安装包后在安装向导中点击 `Install` 进行安装即可

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612879.png)

3. 验证是否安装成功，Win + R 输入 `cmd` 打开命令窗口，输入：

```bash
ollama --version
```

若显示ollama的版本信息如 `ollama version is 0.19.0`，则表示安装成功！

### 安装 Qwen3.5 大模型

1. 点击 Models 进入大模型页面；

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612880.png)

2. 根据自己电脑的适配性选择对应的版本，此处以最小的0.8b版本为例

![](/images/blog/ollama-qwen3-local-deploy/file-202604011136128801.png)

3. 复制对应版本的安装链接在cmd终端页面运行；

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612881.png)

4. 首次下载会有一个下载过程，如图所示：

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612882.png)

5. 安装成功后就可以在终端进行首轮测试了，如下所示：

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612884.png)

### 使用 Chatbox AI 进行测试

1. 访问 [Chatbox AI 网页版](https://web.chatboxai.app/) ；

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612885.png)

2. 点击左下角 Setting 可以对网页进行汉化设置；

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612886.png)

3. 在 Chatbox AI 中创建一个ollama提供的模型；

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612887.png)

>注意
>- 模型 ID 必须与 Ollama 中拉取的模型名完全一致；
>- API主机为 `127.0.0.1:11434/V1`

4. 尝试使用ollama提供的模型进行对话，发现报错了，这是因为未配置环境变量导致的；

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612888.png)

5. 配置环境变量，打开环境变量配置窗口，在用户变量中点击新增，输入以下内容：

- 添加该环境配置的目的是让任何IP都能够访问到 ollama；

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612889.png)

- 添加该配置的目的是可以接收任何来源的请求

![](/images/blog/ollama-qwen3-local-deploy/file-202604011136128891.png)

6. 配置环境后一定要重启 ollama 服务，在托盘找到 ollama 并退出，重新搜索应用并打开

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612890.png)

![](/images/blog/ollama-qwen3-local-deploy/file-202604011136128901.png)

7. 最后回到对话窗口，重新测试后就可以正常对话了。

![](/images/blog/ollama-qwen3-local-deploy/file-20260401113612891.png)
