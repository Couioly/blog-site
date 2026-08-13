---
title: 模型的创建与调用
date: 2026-07-29
description: LangChain 中对话模型的多种初始化方式与调用方法详解，涵盖 DeepSeek、智谱、千问、Ollama 本地部署及中转平台
tags:
  - ai
  - langchain
  - llm
  - deepseek
  - ollama
---

## 1 模型调用的准备工作

### 1.1 一张图看大模型的调用

在 LangChain v 0.3版 本中，提到了Model I/O，包括输入提示(Format)、调用模型(Predict)、输出解析 (Parse)。分别对应着 `Prompt Template` ， `Model` 和 `Output Parser` 。

![1784794545303](/images/blog/langchain-model-creation-and-invocation/1784794545303.png)

关于模型调用模块，如今对话模型已经是主要形式。从历史上解读： 

在GPT-3时代，大模型以 **补全模型** 为主，只能以类似“成语接龙”的方式对文本进行补全，并且实际运行 效果也 **非常不稳定** 。此时LangChain借助一些高层封装的API，能够让模型完成对话、调用外部工具、甚至是结构化输出等功能，为开发者提供了极大的便利。 

伴随着GPT-3.5模型的发布， **对话模型** 正式登上历史的舞台，并逐渐 **成为主流** 。而得益于对话模型更强的指令跟随能力，很多GPT-3需要借助LangChain才能完成的工作，已经成为GPT-3.5原生自带的一些功能。

> 所以，本章只提供了对话模型的创建，而没有了非对话模型。 

### 1.2 模型初始化的分类方式 

> 简单来说，就是用谁家的API以什么方式创建存放在哪个位置的大模型

**角度1：调用谁家的API**

- 使用模型提供商的库 

- 使用LangChain统一方式（推荐） 

**角度2：模型初始化时，几个重要参数(如BASE_URL、API-KEY)的书写位置的不同：**

- 使用配置文件（推荐） 

- 硬编码：写在代码文件中 

**角度3：调用的模型所在位置**

- 在线部署的大模型 

- 本地部署的大模型 

> LangChain作为一个“工具”，不提供任何 LLMs，而是依赖于第三方集成各种大模型。这里就看大 模型到底部署在哪里。

### 1.3 线上大模型服务平台

有许多提供大模型API服务的平台，使用时只需要注册、充值并创建API-Key，之后即可使用API-Key与 URL来调用平台提供的相应的模型的服务。

|    平台    |                      网址                      |        备注         |
| :--------: | :--------------------------------------------: | :-----------------: |
| OpenRouter |             https://openrouter.ai/             | 全球主流,含国外模型 |
|  CloseAI   |       https://platform.closeai-asia.com/       | 亚洲最大,含国外模型 |
| 阿里云百炼 |      https://bailian.console.aliyun.com/       |     企业端友好      |
|  硅基流动  |          https://www.siliconflow.cn/           | 性价比高，适合个人  |
|  百度千帆  | https://console.bce.baidu.com/qianfan/overview |    主打百度生态     |
|  火山引擎  |      https://console.volcengine.com/ark/       | 主打字节多模态生态  |

> 说明：每个平台配置时，都需要几个要素： `模型名` 、 `api-key` 、 `base-url` 
>
> 如果大家想使用国外的大模型，就选择前两个；如果只使用国内的大模型，可以选择后四个。阿里云百炼：所有新用户可获得超过5000万Tokens的免费额度及4500张图片生成额度。适合toB 企业用户 硅基流动：号称9B 以下模型永久免费，开源模型价格低，适合个人学习。 此外，还有各个模型自己的厂商平台。比如deepseek、智谱等。 
>
> OpenRouter是一个第三方API聚合平台，专门转发大模型厂商的API服务。通过它我们可以间接调用几乎所有大模型厂商的API服务。OpenRouter支持支付宝或微信充值，最低限额$5，税费$0.8。需注意，部分模型（如ChatGPT）因服务商地区限制，可能无法在当前网络环境下直接调用，会提示This model is not available in your region。该海外服务服务器部署于境外，中国大陆常规家用网络无法直接访问；若因技术调试、学术研究需求使用，仅可依托国内运营商官方审批开通的合规国际专线渠道接入。根据个人情况，决定是否充值并调用OpenRouter API。

### 1.4 提前安装所有依赖

课程中会涉及到多个库的安装，这里一并声明在 `requirements.txt` 文件 中。 同时，LangChain的版本变化较快，不同版本之间可能存在兼容问题，为了避免因版本不一致导致的问 题，本课程会通过 `requirements.txt` 固定主要依赖版本 。 用法：将[《requirements.txt》](/images/blog/langchain-model-creation-and-invocation/requirements.txt)存放到项目所在的目录下，执行：

```bash
pip install -r .\requirements.txt
```

> 说明：课程中的部分章节会单独列出相关依赖，主要是为了帮助大家了解该章节涉及的核心库。 无需重复安装 ，这些依赖已经统一包含在 `requirements.txt` 中。

## 2 模型初始化角度1：使用模型提供商库

在 LangChain 中初始化模型，主要可以通过直接使用特定的Model Class和使用统一的 `init_chat_model` 函数这两种方式来实现。 

Model Class方式：这种方式最直接。LangChain为一些大模型供应商提供了专门的Model类，导入对应的具体类（如 ChatOpenAI、ChatAnthropic、ChatDeepSeek、ChatOllama、ChatHunyuan、 ChatTongyi、ChatZhipuAI）并进行实例化。 

官网链接：https://reference.langchain.com/python/langchain-community/chat-models 

### 2.1 通过专用API调用 

注意：使用不同的模型可能传入的参数名称不同，可以参考对应的源码。 

#### 2.1.1 DeepSeek大模型 

官网：https://www.deepseek.com/ 

**步骤1：安装必要的依赖(略)** 

执行过前面的requirements.txt文件指令的情况下，这里就不需要安装了。

```bash
#安装ChatOpenAI依赖包 
pip install langchain-openai 
#安装ChatDeepSeek 依赖包 
pip install langchain-deepseek 
# 用于环境管理的包 
pip install python-dotenv
```

说明：langchain-deepseek 是使用deepseek 大模型必要依赖。 

注意： langchain-deepseek 依赖于 langchain-openai ，安装前者，pip会自动从pypi拉取元数据解析依赖，后者也会被安装。所以我们把 langchain-openai 也放在此处。 

**步骤2：配置`.env`文件**（明确去deepseek官网获取key) 

在项目根目录下创建`.env`文件，在`.env`文件中写入以下内容：

```.env
DEEPSEEK_API_KEY=<Your API Key> 
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

说明：将占位符替换为自己的`API_KEY`。 

**步骤3：读取配置并初始化模型**

这里，我们用DeepSeek的模型进行测试，LangChain会从环境变量中读取`DEEPSEEK_API_KEY`。如下是 代码实现： 

方式1：

```python
from langchain_deepseek import ChatDeepSeek 
import os 
from dotenv import load_dotenv 
# 通过load_dotenv()将.env中的变量加载为环境变量
# override=True表示：无论你当前的操作系统、终端或者虚拟环境中是否已经存在同名的环境变量， 都会强行用.env 文件里写的值去覆盖它
load_dotenv(override=True) 
# 从环境变量读取配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")
# 创建DeepSeek LLM
deepseek_llm = ChatDeepSeek(
    api_key=DEEPSEEK_API_KEY,
    api_base=DEEPSEEK_BASE_URL, # 注意：这里是api_base，不是base_url
    model_name="deepseek-v4-flash",
)
print(deepseek_llm.invoke("请介绍一下你自己"))
```

基于模型集成[手册](https://docs.langchain.com/oss/python/integrations/chat/deepseek)和[LangChain Reference](https://reference.langchain.com/python/langchain)的API参考页[ChatDeepSeek](https://reference.langchain.com/python/langchain-deepseek/chat_models/ChatDeepSeek)可知相关的配置参数。

方式2：优化，依靠默认行为读取 `.env` 环境变量

```python 
from langchain_deepseek import ChatDeepSeek
# 创建DeepSeek LLM
deepseek_llm = ChatDeepSeek(
    model="deepseek-v4-flash",
)
print(deepseek_llm.invoke("请介绍一下你自己"))
```

> 说明：此处省略了手动读取和赋值环境变量操作，因为ChatDeepSeek在构建类时默认会去`.env`中读取所需的参数，比如deepseek的 `DEEPSEEK_API_KEY` 和`DEEPSEEK_API_BASE`，但仔细看可以发现，我的环境中并不存在 `DEEPSEEK_API_BASE` 变量，那为什么还是能够正常构造呢？——因为ChatDeepSeek类在构造时 `DEEPSEEK_API_BASE` 存在默认值 `DEFAULT_API_BASE="https://api.deepseek.com/v1"`

方式3：硬编码方式（**不推荐**）

```python
from langchain_deepseek import ChatDeepSeek
# 创建DeepSeek LLM
deepseek_llm = ChatDeepSeek(
    api_key="sk-2nkIWkv6M...U1Ra4P0NGa", # 明文暴露密钥
    api_base="https://api.deepseek.com",
    model="deepseek-v4-flash",
)
print(deepseek_llm.invoke("请介绍一下你自己"))
```

直接将 API Key 和模型参数写入代码，**仅适用于临时测试**，存在密钥泄露风险，在**生产环境不推荐** 。 相比来讲，`.env` 配置文件方式，生产环境推荐，配置文件可加入 `.gitignore` 避免泄露。

#### 2.1.2 智谱大模型 

官网：https://www.bigmodel.cn/ 

官方文档：https://docs.bigmodel.cn/cn/guide/develop/langchain/introduction

相关依赖：

```bash
# 安装 Langchain 社区依赖包，包含ChatHunyuan、ChatTongyi、ChatZhipuAI 
pip install langchain-community 
# ChatZhipuAI / 智谱 AI 认证相关依赖 
pip install pyjwt
```

环境变量：在`.env` 中补充

```.env
ZHIPUAI_API_KEY=<Your API Key>
ZHIPUAI_BASE_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
```

确保余额或免费额度大于零。

举例：

```python
from langchain_community.chat_models import ChatZhipuAI
from dotenv import load_dotenv
import os
# override=True 确保.env文件优先
load_dotenv(override=True)
ZHIPUAI_API_KEY = os.getenv("ZHIPUAI_API_KEY")
ZHIPUAI_BASE_URL = os.getenv("ZHIPUAI_BASE_URL")
zhipu_llm = ChatZhipuAI(
    model="glm-4.7",
    api_base=ZHIPUAI_BASE_URL, #可选
    api_key=ZHIPUAI_API_KEY #可选
)
print(zhipu_llm.invoke("请介绍一下你自己"))
```

举例优化：

```python
from langchain_community.chat_models import ChatZhipuAI
zhipu_llm = ChatZhipuAI(
    model="glm-4.7",
)
print(zhipu_llm.invoke("请介绍一下你自己"))
```

#### 2.1.3 千问大模型

通过阿里云百炼平台调用，官网：https://bailian.console.aliyun.com/

相关依赖：

```bash
# ChatTongyi / 阿里通义千问依赖包 
pip install dashscope
```

环境变量：在 `.env` 中补充

```.env
DASHSCOPE_API_KEY=<Your API Key>
```

注意：一般不要添加这样的环境变量 `DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1`

> 百炼平台提供了两种访问方式：专用SDK和OpenAI兼容接口，上述URL是为后者准备的，而ChatTongyi 底层是基于专用SDK实现的，如果指定了上述URL，则运行报错

举例：

```python
import os
from langchain_community.chat_models import ChatTongyi
from dotenv import load_dotenv
# override=True 确保.env文件优先
load_dotenv(override=True)
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY")
tongyi_llm = ChatTongyi(
    api_key=DASHSCOPE_API_KEY,
    model="qwen3-max",
)
print(tongyi_llm.invoke("请介绍一下你自己"))
```

案例优化：

```python
from langchain_community.chat_models import ChatTongyi
tongyi_llm = ChatTongyi(
    model="qwen3-max",
)
print(tongyi_llm.invoke("请介绍一下你自己"))
```

### 2.2 兼容用法

一方面，LangChain没有为所有大模型厂商提供专用接口，见 [Langchain大模型集成列表](https://docs.langchain.com/oss/python/integrations/chat#featured-models)。如果选用的平台没有专用接口，可以通过兼容接口调用。 另一方面，专用接口的对接方式五花八门，如腾讯混元的ChatHunyuan需要单独的 APP_ID + SecretId + SecretKey ，配置繁琐，用户不友好。

**结论：大多数API平台都支持OpenAI API接口规范，所以基本都可以通过 ChatOpenAI 集成。**

举例1：

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv(override=True)
DEEPSEEK_API_KEY=os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL=os.getenv("DEEPSEEK_BASE_URL")
llm_deepseek=ChatOpenAI(
    model="deepseek-v4-flash",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
)
print(llm_deepseek.invoke("1+1=?"))
```

举例2：

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv(override=True)
ZHIPUAI_API_KEY=os.getenv("ZHIPUAI_API_KEY")
ZHIPUAI_BASE_URL=os.getenv("ZHIPUAI_BASE_URL")
llm_zhipuai=ChatOpenAI(
    model="glm-4.7",
    api_key=ZHIPUAI_API_KEY,
    base_url=ZHIPUAI_BASE_URL,
)
print(llm_zhipuai.invoke("1+1=?"))
```

> **注意**：此处直接执行会出如下异常：
>
> `NotFoundError: Error code: 404 - {'timestamp': '2026-07-24T01:12:41.977+00:00', 'status': 404, 'error': 'Not Found', 'path': '/v4/chat/completions/chat/completions'}`
>
> 这是因为底层接口不同，需要更换 `ZHIPUAI_BASE_URL`为`https://open.bigmodel.cn/api/paas/v4`

### 2.3 中转平台

由于网络连通性限制，国内常规网络环境无法直接调用部分海外闭源模型；若因技术调试、学术研究等需求使用这些模型，可依托国内运营商官方审批开通的合规国际专线渠道接入，通过API中转平台进行调用。

#### 2.3.1 OpenRouter

官网：https://openrouter.ai/ 

OpenRouter 是一个多模型 API 聚合平台，提供统一的 OpenAI 兼容接口，可以通过一个 API Key 调用 OpenAI、Claude、Gemini、DeepSeek、Qwen 等不同厂商的大模型。它适合用于模型对比、模型路由、Agent 应用开发和课程实验，是目前知名度最高的中转平台。该海外服务服务器部署于境外，中国大陆常规家用网络无法直接访问；若因技术调试、学术研究需求使用，仅可依托国内运营商官方审批开通的合规国际专线渠道接入。

相关依赖：

```bash
# OpenRouter 模型集成
pip install langchain-openrouter
```

环境变量：

```.env
OPENROUTER_API_KEY=<YOUR_API_KEY>
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
```

举例：

LangChain 当前版本为 OpenRouter 提供了专用集成：`ChatOpenRouter`

```python
from langchain_openrouter import ChatOpenRouter
from dotenv import load_dotenv
import os
load_dotenv(override=True)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") 
# OPENROUTER_API_BASE = os.getenv("OPENROUTER_API_BASE") 
model = ChatOpenRouter(
    model="deepseek/deepseek-v4-flash",
    api_key=OPENROUTER_API_KEY,
    # base_url=OPENROUTER_API_BASE,
)
print(model.invoke("一句话介绍下你自己"))
```

当然也可以使用ChatOpenAI的方式进行调用，如下：

```python
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os
load_dotenv(override=True)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_BASE = os.getenv("OPENROUTER_API_BASE")
model = ChatOpenAI(
    model="deepseek/deepseek-v4-flash",
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_API_BASE,
)
print(model.invoke("一句话介绍下你自己"))
```

补充说明：账户充值

![1784856725961](/images/blog/langchain-model-creation-and-invocation/1784856725961.png)

#### 2.3.2 CloseAI

官网：https://www.closeai-asia.com/ 

CloseAI 是一个面向国内用户的 AI API 中转平台，提供 OpenAI、Claude、Gemini 等模型接口的统一接入能力。它适合用于解决支付和接口统一管理等问题，常用于大模型应用开发、教学演示和测试环境。

**LangChain没有为CloseAI提供专用集成，可以通过ChatOpenAI兼容接口调用**。 举例：

```python
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os
load_dotenv(override=True)
CLOSEAI_API_KEY = os.getenv("CLOSEAI_API_KEY")
CLOSEAI_BASE_URL = os.getenv("CLOSEAI_BASE_URL")
model = ChatOpenAI(
    # model="gpt-5-mini",
    model="deepseek-v4-flash",
    api_key=CLOSEAI_API_KEY,
    base_url=CLOSEAI_BASE_URL,
)
print(model.invoke("欧盟都有哪些国家"))
```

## 3 模型初始化角度1：init_chat_model()

`init_chat_model` 是 LangChain 1.x 中推出的用于初始化聊天模型的统一接口。只要是LangChain支持的模型都可以处理，它会根据模型名称自动选择对应的模型类初始化实例。

基本语法：

```python
from langchain.chat_models import init_chat_model
model = init_chat_model(
    "provider:model_name", # 提供商:模型名称
    api_key="your-api-key", # API 密钥（可选，可从环境变量读取）
    temperature=0.7, # 温度参数（可选）
    max_tokens=1000, # 最大 token 数（可选）
    **kwargs # 其他模型特定参数
)
```

**问题**： `init_chat_model` 和直接使用 ChatTongyi、ChatOpenAI、ChatDeepSeek有什么区别？ 

**回答**： `init_chat_model` 是 LangChain 1.0 的统一接口，优势包括： 

- 统一接口：无需记住每个提供商的不同初始化方式（以一致的方式初始化） 

- 易于切换：简化了智能体系统中模型切换策略（只需修改模型字符串） 

- 简洁明了：更简洁的语法，减少样板代码 
- 自动适配：内部根据模型标识自动选择对应的驱动类(ChatOpenAI、ChatDeepSeek)

![1784857320025](/images/blog/langchain-model-creation-and-invocation/1784857320025.png)

### 3.1 使用举例

举例1：调用DeepSeek官网的大模型

```python
import os
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
# 从.env文件中加载环境变量
load_dotenv(override=True)
# 从环境变量读取配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")
model = init_chat_model(#model="deepseek-v4-flash",
                        #model_provider="deepseek", # 进入init_chat_model可以查看参数范围
                        model="deepseek:deepseek-v4-flash"
                        api_key=DEEPSEEK_API_KEY,
                        base_url=DEEPSEEK_BASE_URL)
# 向模型发送单条数据
response = model.invoke("你好，用一句话回答")
# 打印响应
print(response)
```

当我们传递的模型名称为 deepseek-v4-flash 时，`init_chat_model`会自动调用ChatDeepSeek初始化模型实例，和直接通过ChatDeepSeek初始化的效果完全一致。

举例2：调用阿里百炼大模型

环境变量：

```.env
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
DASHSCOPE_API_KEY=<YOUR_API_KEY>
```

代码：

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
load_dotenv(override=True)
DASHSCOPE_API_KEY=os.getenv("DASHSCOPE_API_KEY")
DASHSCOPE_BASE_URL=os.getenv("DASHSCOPE_BASE_URL")
model = init_chat_model(model="qwen3-max",
                        model_provider="openai",
                        api_key=DASHSCOPE_API_KEY,
                        base_url=DASHSCOPE_BASE_URL)
print(model.invoke("你好，用一句话回答"))
```

举例3：调用CloseAI中转平台大模型

环境变量：

```.env
CLOSEAI_API_KEY=<YOUR_API_KEY>
CLOSEAI_BASE_URL=https://api.openai-proxy.org/v1
```

代码：

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
load_dotenv(override=True)
CLOSEAI_API_KEY=os.getenv("CLOSEAI_API_KEY")
CLOSEAI_BASE_URL=os.getenv("CLOSEAI_BASE_URL")
model = init_chat_model(model="deepseek-v4-flash",
                        model_provider="openai",
                        api_key=CLOSEAI_API_KEY,
                        base_url=CLOSEAI_BASE_URL)
print(model.invoke("你好，用一句话回答"))
```

> 注意：即使CloseAI调用的是deepseek，但`model_provider`不能直接写`deepseek`，应该写`openai`，因为CloseAI的封装类是 `ChatOpenAI()`

<font color=red>问题1：model_provider支持哪些provider？ </font>

`model_provider` 表示模型的提供者，支持的providers有： anthropic , anthropic_bedrock, azure_ai, azure_openai, bedrockbedrock_converse, cohere, deepseek , fireworks, google_anthropic_vertex, google_genai, google_vertexaigrog, huggingface, ibm, mistralai, nvidia, ollama , openai , openrouter , perplexity, together, upstage, xai。 

如果 `model_provider="openai"` ，会自动加载 langchain-openai 的依赖包，底层调用的是 ChatOpenAI 类。 

如果 `model_provider="deepseek"` ，会自动加载 langchain-deepseek 的依赖包，底层调用的是ChatDeepSeek 类。 

像阿里的 dashscope 尚未被LangChain官方纳入模型的统一注册体系，暂时不知道"dashscope"的提供者是谁。**此时可以将model_provider设置为openai**，底层将会用openai的规范处理请求，这就要求我们调用的模型服务是OpenAI Compatible的。 

<font color=red>问题2：如果在model参数中没有指明模型提供者，必须在model_provider中指明？ </font>

可以在model参数中通过前缀指定模型供应商，和模型名称之间用冒号分割 ，等价于通过model_provider参数指定供应商。如果两个位置都没有指明供应商，LangChain底层会按照内置规则自动推断。 

**但是，并非所有的模型都支持自动推断，如model名称 qwen-plus 不支持自动推断，没有指明供应商会报错。**

### 3.2 小结：模型的调用

- **DeepSeek官网的DeepSeek模型**：可以调用`ChatDeepSeek()`

- **阿里云百炼平台的DeepSeek模型**：可以调用`ChatTongyi()`

- **OpenRouter平台的DeepSeek模型**：可以调用`ChatOpenRouter()`

- **CloseAPI平台的DeepSeek模型**：可以调用`ChatOpenAI()`

**以上四种模式均支持`ChatOpenAI()`、 `init_chat_model()`调用**

![1784986756660](/images/blog/langchain-model-creation-and-invocation/1784986756660.png)

### 3.3 模型初始化参数（常用版）

在LangChain中，Model Class 和init_chat_model初始化模型共同的参数及解释。 

API文档：https://docs.langchain.org.cn/oss/python/langchain/models#parameters

| 参数             | 类型    | 说明                                                                             | 默认值  |
| -------------- | ----- | ------------------------------------------------------------------------------ | ---- |
| model          | str   | 使用的特定提供商的模型名称(必需)。 比如：openai:gpt-4o、groq:gemma2-9b-it                          | 无    |
| model_provider | str   | 模型提供商名称                                                                        | 无    |
| api_key        | str   | API密钥。如果不提供，会从环境变量中读取（如DEEPSEEK_API_KEY）                                       | None |
| base_url       | str   | 大模型供应商API请求地址。                                                                 | None |
| temperature    | float | 控制输出随机性，范围0.0-2.0，温度越高输出越随机。 - 0.0：最确定性，输出几乎不变 - 1.0：平衡创造性和一致性 - 2.0：最随机，最有创造性 | 0.7  |
| max_tokens     | int   | 限制模型输出的最大token数量                                                               | None |
| timeout        | float | 超时时间（秒），超时未响应，请求会被取消。                                                          | None |
| max_retries    | int   | 请求失败（如网络问题、速率限制）时的最大重试次数                                                       | 6    |

说明： 

1.**temperature 参数根据使用场景选择：**

- **0.0-0.3**：需要一致性、准确性的任务（数学计算、数据提取、分类、代码生成） 
- **0.5-0.7**：平衡创造性和一致性（聊天、问答） 
- **0.8-1.5**：创造性任务（写作、头脑风暴） 
- **1.5-2.0**：高度创造性（诗歌、故事创作）

![1784987053615](/images/blog/langchain-model-creation-and-invocation/1784987053615.png)

举例1：

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os

load_dotenv(override=True)
model_llm = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="deepseek",
    temperature=0,
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
print(model_llm.invoke("帮我写一首关于春天的七言绝句").content)
```

```text
《七绝·春》
暄风一夜入庭除，桃李纷披柳眼疏。
燕啄芹泥争旧垒，春光何处不清书？

注：我的诗中，“暄风”暗合春信，“柳眼疏”点染初春萌态。后两句借燕啄芹泥的动景与“春光清书”的静观相映成趣，末句以反问收束，既赞春色无死角，又暗喻天地如卷、万象皆可品读的哲思。通篇未着“春”字却句句含春机，足见匠心。
```

对比：

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os

load_dotenv(override=True)
model_llm = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="deepseek",
    temperature=1.9,
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
print(model_llm.invoke("帮我写一首关于春天的七言绝句").content)
```

```text
《七绝·春思》
移花才发两三枝，又恐风来花暗落。
不见游蜂采蜜时，雕梁独坐春风薄。

注：我的诗作《七绝·春思》通过细腻的笔触描绘春天的微妙变化。首句“移花才发两三枝”暗示春意初萌，次句“又恐风来花暗落”以担忧口吻道出对春光易逝的敏感。后两句借“游蜂采蜜”与“雕梁独坐”的对比，既展现春天本应热闹的生机，又反衬出孤寂者对春光的独特感受，在传统伤春题材中注入现代性的孤独感。
```

举例2：应用

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
# 从.env文件中加载环境变量
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="deepseek",
    temperature=0,
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
# 向模型发送单条数据
response = model.invoke("张三，男，30岁，拥有8年编程开发经验，目前在某互联网大厂担任技术专家。帮我从上文中提取数据，返回JSON格式")
print(response.content)
```

```text
{"name": "张三", "gender": "男", "age": 30, "experience_years": 8, "position": "技术专家", "company": "某互联网大厂"}
```

使用场景：创意文案与头脑风暴

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
# 从.env文件中加载环境变量
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="deepseek",
    temperature=1.5,
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
# 向模型发送单条数据
response = model.invoke("请为一款极致静音的机械键盘写3个充满诗意且极具张力的广告语。")
print(response.content)
```

```text
好的，为你创作了三款关于极致静音机械键盘的广告语，希望能引发共鸣：

### 1. **无声的雷霆**
> **指尖落下，是无声的雷霆；**
> **唯有灵感，在寂静中炸裂。**

### 2. **战车的静默**
> **告别键盘的喧嚣，唤醒直觉的轰鸣。**
> **让我，做你凌晨四点的战车，**
> **在无人知晓的战场上，永动前行。**

### 3. **宇宙的坍缩**
> **每一次敲击，都是指尖的宇宙坍缩。**
> **千钧之力，化作一场寂静的诗篇。**
```

2.Token是什么？

基本单位 : 大模型通过分词器（Tokenizer）将文本拆分后的最小语义单元是token（相当于自然语言中 的词或字）。不同的模型采用不同的分词算法 （如BPE、WordPiece），因此同一段文本在不同模型中的Token数量可能不同。

 收费依据 ：大语言模型通常也是以token的数量作为其计量（或收费）的依据。 

- 1个中文Token≈1-1.8个汉字，1个英文Token≈3-4个字符 

- Token与字符转化的可视化工具： 

  - OpenAI提供：https://platform.openai.com/tokenizer 

  - 百度智能云提供：https://console.bce.baidu.com/support/#/tokenizer 

举例：

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
# 从.env文件中加载环境变量
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="deepseek",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
    max_tokens=15,
)
# 向模型发送单条数据
print(model.invoke("请介绍你自己"))
```

```text
content='' additional_kwargs={'refusal': None, 'reasoning_content': '好的，用户让我介绍自己。这是一个非常常见且直接的问题。我需要'} response_metadata={'token_usage': {'completion_tokens': 15, 'prompt_tokens': 7, 'total_tokens': 22, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 15, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}, 'prompt_cache_hit_tokens': 0, 'prompt_cache_miss_tokens': 7}, 'model_provider': 'deepseek', 'model_name': 'deepseek-v4-flash', 'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402', 'id': 'ddb205af-8a53-4e8d-b976-b615f62829b5', 'finish_reason': 'length', 'logprobs': None} id='lc_run--019f99ac-56be-7d00-a592-c6676b9d98a6-0' tool_calls=[] invalid_tool_calls=[] usage_metadata={'input_tokens': 7, 'output_tokens': 15, 'total_tokens': 22, 'input_token_details': {'cache_read': 0}, 'output_token_details': {'reasoning': 15}}
```

> 响应结果中可以通过 `finish_reason` 字段来查看结束原因，正常执行结束后的值为 `stop`，而由于 `max_tokens` 限制中断的值为 `length`

## 4 模型初始化角度3：本地模型的部署与调用

### 4.1 Ollama的介绍

LangChain也支持使用 Ollama 、 vLLM 等框架启动的本地大模型。这里以Ollama为例进行演示。 

Ollama是在Github上的一个开源项目，其项目定位是：一个本地运行大模型的集成框架，可以实现如 Qwen、Deepseek 等主流大模型的下载、启动和本地运行的自动化部署及推理流程。 

Ollama官方地址：https://ollama.com 

产品定位：

![1785114006761](/images/blog/langchain-model-creation-and-invocation/1785114006761.png)

### 4.2 Ollama及模型的下载安装

将千问在Ollama进行本地部署（此处模型可以根据电脑配置自己选择更优，教程模型只供教学使用）

[点击跳转至【Ollama+Qwen3.5本地部署教程】](../../L3-技术项目实战/工具配置脚本/20260401_1_Ollama+Qwen3.5本地部署.md)

### 4.3 Ollama 常用命令对照表

|                 命令                  |             一句话说明             |
| :-----------------------------------: | :--------------------------------: |
|         `ollama pull llama3`          |    下载指定模型（例：llama3）。    |
|          `ollama run llama3`          |     启动并进入该模型交互对话。     |
|             `ollama list`             |     列出本机已下载的所有模型。     |
|          `ollama rm llama3`           |   删除不再需要的模型以节省磁盘。   |
|     `ollama cp llama3 my-llama3`      |       本地复制/重命名模型。        |
|         `ollama show llama3`          | 查看模型详细信息（参数、大小等）。 |
| `ollama create my-model -f Modelfile` |  用自定义 Modelfile 构建新模型。   |
|            `ollama serve`             |    启动后台服务，供 API 调用。     |
|              `ollama ps`              |    查看当前正在运行的模型进程。    |
|         `ollama stop llama3`          |        停止正在运行的模型。        |
|          `ollama --version`           |        查看安装的ollama版本        |

### 4.4 LangChain调用模型

LangChain整合Ollama调用本地大模型：

```bash
#pip install langchain-ollama
pip install -qU langchain-ollama
pip install -U ollama
```

方式1：使用`ChatOllama()`

```python
from langchain_ollama import ChatOllama

model = ChatOllama(
    model="qwen3.5:0.8b",
    #如果Ollama在本地默认端口运行，则可省略，或使用http://localhost:11434
    base_url="http://localhost:11434",
)
print(model.invoke("一句话介绍一下你自己"))
```

```text
content='我是人工智能助手，致力于为用户提供准确、高效的解答和服务。' additional_kwargs={} response_metadata={'model': 'qwen3.5:0.8b', 'created_at': '2026-07-27T01:00:01.0663671Z', 'done': True, 'done_reason': 'stop', 'total_duration': 124127732100, 'load_duration': 2176758600, 'prompt_eval_count': 13, 'prompt_eval_duration': 105496300, 'eval_count': 2785, 'eval_duration': 120608456400, 'logprobs': None, 'model_name': 'qwen3.5:0.8b', 'model_provider': 'ollama'} id='lc_run--019fa114-19c6-7011-af10-6bd70990863d-0' tool_calls=[] invalid_tool_calls=[] usage_metadata={'input_tokens': 13, 'output_tokens': 2785, 'total_tokens': 2798}
```

方式2：使用 `init_chat_model()`

```python
from langchain.chat_models import init_chat_model

model = init_chat_model(
    model="qwen3.5:0.8b",
    model_provider="ollama",
    #如果Ollama在本地默认端口运行，则可省略，或使用http://localhost:11434
    base_url="http://localhost:11434",
)
print(model.invoke("一句话介绍一下你自己"))
```

```text
content='你好！我是 Qwen3.5，阿里巴巴集团研发的超智能助手，专注于为您提供高质量解答。' additional_kwargs={} response_metadata={'model': 'qwen3.5:0.8b', 'created_at': '2026-07-27T01:20:22.4013713Z', 'done': True, 'done_reason': 'stop', 'total_duration': 120418948400, 'load_duration': 3484715500, 'prompt_eval_count': 13, 'prompt_eval_duration': 134080200, 'eval_count': 2741, 'eval_duration': 115750052200, 'logprobs': None, 'model_name': 'qwen3.5:0.8b', 'model_provider': 'ollama'} id='lc_run--019fa126-cb1b-7ad3-b29d-8f344437b642-0' tool_calls=[] invalid_tool_calls=[] usage_metadata={'input_tokens': 13, 'output_tokens': 2741, 'total_tokens': 2754}
```

> 注意：此处的 `model_provider="ollama"` 必须添加，否则将会抛出异常，因为若不指定model_provider，init_chat_model将无法正确找到该model的供应商

## 5 模型的调用

在 LangChain 中，模型调用（Invocation）是指通过特定方法触发大语言模型生成输出的过程。根据不同的应用场景和需求，LangChain 提供了几种核心的调用方式，主要是 `invoke()`、 `stream()` 和 `batch()` 方法，以及它们的异步版本 `ainvoke()` 、 `astream()` 和 `abatch()` ，下面将系统地介绍这些方法。 

- `invoke()` ：阻塞式，一次性返回完整结果问答、批处理任务、无需实时反馈的场景。
- `ainvoke()` ：非阻塞式，提高系统吞吐量高并发Web应用、IO密集型任务。
- `stream()` ：流式输出，实时返回每个token聊天机器人、长文本生成、需要提升用户体验的交互 应用。
- `asteam()` ：非阻塞式，提高系统吞吐量高并发Web应用、IO密集型任务。
- `batch()` ：批量处理多个输入高并发场景，需要同时处理大量请求。
- `abatch()` ：非阻塞式，提高系统吞吐量高并发Web应用、IO密集型任务。

### 5.1 invoke() 

invoke() 是 LangChain 中最核心的方法，它的工作模式是阻塞式的，即程序会等待模型完全生成整个响应后，再一次性将结果返回给用户。 

#### 5.1.1 invoke()说明 

简单来说， invoke 方法的作用就是： 

1. 接收你的输入（问题、指令、对话历史等） 
2. 发送给 LLM 模型（如 GPT-4、Llama、Claude 等） 
3. 返回模型的响应（文本回复 + 元数据信息）

基本语法：

```python
response = model.invoke(input, config=None)
```

参数详情：

|   参数   |                  类型                  |         说明         | 必需  | 默认值  |
| :----: | :----------------------------------: | :----------------: | :-: | :--: |
| input  | str \| list[dict] \| list[Message] 等 |     你要发送给模型的内容     | 必需  |  无   |
| config |                 dict                 | 高级配置（回调函数、元数据、标签等） | 可选  | None |

#### 5.1.2 输入参数详解

invoke方法非常灵活，支持三种形式的输入： 文本输入 、 字典列表 、 消息对象列表 。 

1、**文本输入(最简单) **

简单的一次性问答，直接传入一个问题或指令。 

- 适用场景：快速测试，不需要保留对话历史的简单生成任务。 

- 缺点：无法设置系统提示（system prompt），无法传递对话历史

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
prompt="翻译成英文：你好世界"
print(model.invoke(prompt))
```

在 invoke 中直接输入文本，即可自动转化为 user message 并进行对话。

2、**字典列表(推荐，最灵活) **

创建字典列表组成消息。一条消息通常包含 `role`（角色） 、 `content`（内容） 等信息。 

- 适用场景：可以设置系统提示，表达多轮对话历史，JSON 兼容，易于序列化和网络传输，生产环境 推荐。 

- 缺点：代码稍微多一点（但更清晰） 格式：

格式：

```python
messages = [
    {"role": "system", "content": "系统提示"},
    {"role": "user", "content": "用户消息"},
    {"role": "assistant", "content": "AI回复"}, # 可选，用于对话历史
    {"role": "user", "content": "继续提问"}
]
```

| 角色      | 英文         | 作用                           | 示例                       |
| --------- | ------------ | ------------------------------ | -------------------------- |
| system    | System       | 设定AI的行为、角色、规则       | "你是一个专业的Python导师" |
| user      | Human/User   | 用户的输入/问题                | "什么是装饰器？"           |
| assistant | AI/Assistant | AI的历史回复（用于对话上下文） | "装饰器是一种设计模式..."  |

> "user"和 "human"有时可以互换，但遵循你选择的主要模型提供商（如OpenAI）的惯例使用 "user"是最稳妥的做法。

举例1：单轮对话

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
messages = [
    {"role":"system","content":"你是小默的私人助手，负责回复小默的私人问题，比如小默的age=21，sex=boy，birth=20061111"},
    {"role":"user","content":"你老板多大了？"}
]
print(model.invoke(messages).content)
```

```text
我的老板就是你呀！你之前告诉我你今年21岁，所以你的年龄是21岁～ 😄
```

举例2：涉及多轮对话

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
messages = [
    {"role":"system","content":"你是小默的私人助手，负责回复小默的私人问题，比如小默的age=21，sex=boy，birth=20061111"},
    {"role":"user","content":"你老板多大了？"},
    {"role": "assistant", "content": "我的老板就是你呀！你之前告诉我你今年21岁，所以你的年龄是21岁～"},
    {"role":"user","content":"我刚刚问了什么？"}
]
print(model.invoke(messages).content)
```

```text
你刚刚问的是：“你老板多大了？” 😄
```

举例3：若不传历史，大模型会失忆

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)

messages1 = [
    {"role":"system","content":"你是友好的私人助手"},
    {"role":"user","content":"我的名字叫小默"}
]
print("AI回复1：",model.invoke(messages1).content)

messages2 = [
    {"role":"system","content":"你是友好的私人助手"},
    {"role":"user","content":"我叫什么名字？"}
]
print("AI回复2：",model.invoke(messages2).content)
```

```text
AI回复1： 你好呀，小默！很高兴认识你！😊 有什么需要我帮忙的吗？可以随便聊聊，也可以告诉我你想做什么，我会尽力帮你解答～
AI回复2： 很抱歉，目前我并不知道您的名字哦！您还没有告诉我呢～可以悄悄告诉我您叫什么吗？😊
```

作为对比，添加记忆

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
# 第一次对话
conversation = [
    {"role":"system","content":"你是友好的私人助手"},
    {"role":"user","content":"我的名字叫小默"}
]
response1 = model.invoke(conversation)
print("AI回复1：",response1.content)
# 添加记忆
conversation.append({"role": "assistant", "content":response1.content})
# 第二次对话
conversation.append({"role": "user", "content":"我叫什么名字？"})
print("AI回复2：",model.invoke(conversation).content)
```

```text
AI回复1： 小默你好！很高兴认识你！😊 我是你的私人助手，名字你可以随便叫。有什么需要帮忙的，随时告诉我哦～你最近在忙些什么呢？
AI回复2： 啊，你叫小默呀！刚才你告诉我了，我记得呢～😊 不过如果还有其他想让我称呼的名字，随时告诉我哦！
```

> 说明：关于消息列表的内容此处不必深究，Messages章节会系统介绍。

3、**消息对象列表**

使用内置的消息类（如 SystemMessage, HumanMessage, AIMessage），将消息对象列表输入模型。 

- 适用场景：需要类型检查（针对大型项目）、IDE 自动补全的场景 

- 缺点：代码较长、不如字典简洁、难以序列化（JSON） 消息类型对照：

消息类型参考：

| 消息类        | 对应字典格式                 | 作用     |
| ------------- | ---------------------------- | -------- |
| SystemMessage | `{"role": "system", ...}`    | 系统提示 |
| HumanMessage  | `{"role": "user", ...}`      | 用户输入 |
| AIMessage     | `{"role": "assistant", ...}` | AI回复   |

举例1：

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)

messages = [
    SystemMessage(content="你是小默的私人助手，负责回复小默的私人问题，比如小默的age=21，sex=boy，birth=20061111"),
    HumanMessage(content="小默今年多大了？")
]
print(model.invoke(messages).content)
```

```text
小默今年21岁啦！
```

举例2：添加记忆

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)

# 第一次对话
messages = [
    SystemMessage(content="你是友好的私人助手"),
    HumanMessage(content="我的名字叫小默")
]
response1 = model.invoke(messages)
print(f"AI回复1：{response1.content}")
# 添加记忆
messages.append(AIMessage(response1.content))
# 第二次对话
messages.append(HumanMessage("我的名字叫什么？"))
print(f"AI回复2：{model.invoke(messages).content}")
```

```text
AI回复1：你好，小默！很高兴认识你。我是你的私人助手，随时准备帮助你解答问题、提供建议或完成日常任务。请随时告诉我你的需求，无论是生活琐事、工作学习还是其他任何方面，我都会尽力提供支持。需要我为你做些什么吗？ 😊
AI回复2：你的名字叫小默呀！(◠‿◠) 刚刚你告诉过我的～需要我帮你做些什么吗？
```

#### 5.1.3 返回值详情

> 美化输出（ 可选 | [访问美化模型输出响应详情](#6.1 美化模型输出响应) )

示例：

```python
AIMessage(
    # ====================== 核心应答内容 ======================
    content='2 + 3 * 2 = **8**',

    # 附加参数：拒绝标识，None=正常作答，未触发安全拦截
    additional_kwargs={
        'refusal': None
    },

    # ====================== API 原始响应元数据 ======================
    response_metadata={
        # Token 消耗统计
        'token_usage': {
            'completion_tokens': 15,        # 输出回答消耗Token
            'prompt_tokens': 16,             # 用户输入Prompt消耗Token
            'total_tokens': 31,              # 本次交互总消耗Token
            # 生成侧Token细分
            'completion_tokens_details': {
                'accepted_prediction_tokens': 0,
                'audio_tokens': 0,
                'reasoning_tokens': 0,       # 思考推理过程占用Token（推理模型生效）
                'rejected_prediction_tokens': 0
            },
            # 输入侧Token细分
            'prompt_tokens_details': {
                'audio_tokens': 0,
                'cached_tokens': 0           # 命中缓存Token数（缓存可降成本、提速）
            }
        },

        # 各阶段耗时监控（单位：毫秒 ms）
        'latency_checkpoint': {
            'engine_tbt_ms': 4,          # 引擎Token间平均间隔
            'engine_ttft_ms': 36,        # 引擎首个Token生成耗时
            'engine_ttlt_ms': 100,       # 引擎全部内容生成完毕耗时
            'pre_inference_ms': 86,      # 推理前预处理耗时：安全审核、分词、编码等
            'service_tbt_ms': 4,         # 服务端逐Token间隔，决定流式打字流畅度
            'service_ttft_ms': 280,      # 服务端收请求至输出首个字符总耗时
            'service_ttlt_ms': 338,      # 服务端完整回复输出总耗时
            'total_duration_ms': 259,    # 整条请求系统总运行时长
            'user_visible_ttft_ms': 194  # 用户肉眼感知到首个文字出现的等待时间
        },

        'model_provider': 'openai',                     # 模型厂商
        'model_name': 'gpt-5.4-mini-2026-03-17',        # 具体模型版本
        'system_fingerprint': None,                     # 后端配置指纹（追踪模型迭代变更）
        'id': 'chatcmpl-DgWobsxhDOqzjqVFwbZYKRnovpEiV', # OpenAI API 会话唯一ID
        'service_tier': 'default',                      # 服务套餐档位
        'finish_reason': 'stop',                        # 生成终止原因：stop=自然生成完毕
        'logprobs': None                                # 词汇对数概率（文本概率分析用）
    },

    # ====================== LangChain 框架内部属性 ======================
    id='lc_run--019e3659-5ee2-7b62-bc8a-741e27374b43-0', # LangChain 链路追踪ID

    # 工具调用记录
    tool_calls=[],                # 正常调用外部工具列表（本次无工具调用）
    invalid_tool_calls=[],        # 格式错误/调用失败的工具列表

    # LangChain 标准化Token用量元数据
    usage_metadata={
        'input_tokens': 16,
        'output_tokens': 15,
        'total_tokens': 31,
        'input_token_details': {
            'audio': 0,
            'cache_read': 0
        },
        'output_token_details': {
            'audio': 0,
            'reasoning': 0
        }
    }
)
```

示例2：

```python
AIMessage(
    # ====================== 核心应答内容 ======================
    content='2',

    # 附加参数：拒绝标识、思考过程文本
    additional_kwargs={
        'refusal': None,  # None表示正常回答，未触发安全策略拒绝输出
        'reasoning_content': 'We are asked: "1+1=?" This is a simple arithmetic question. The answer is 2. So I\'ll respond with the answer.'
    },

    # ====================== API 原始响应元数据 ======================
    response_metadata={
        # Token 消耗统计
        'token_usage': {
            'completion_tokens': 33,   # 输出回答整体消耗总Token数（包含推理思考+最终答案）
            'prompt_tokens': 8,        # 用户输入提示词消耗Token数
            'total_tokens': 41,        # 本次交互输入+输出合计消耗总Token
            # 输出端Token细分统计
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,    # 音频生成消耗Token（本次无音频输出）
                'reasoning_tokens': 31,  # 模型内部推理思考过程占用的Token数量
                'rejected_prediction_tokens': None
            },
            # 输入端Token细分统计
            'prompt_tokens_details': {
                'audio_tokens': None,    # 输入内容不含音频，音频Token为None
                'cached_tokens': 0       # 未命中缓存输入文本，缓存读取Token数量为0
            },
            'prompt_cache_hit_tokens': 0,  # 提示词缓存命中条数
            'prompt_cache_miss_tokens': 8  # 提示词未命中缓存、需要重新编码计算的Token数
        },

        'model_provider': 'deepseek',      # 大模型服务商厂商
        'model_name': 'deepseek-v4-flash', # 调用的具体模型版本名称
        # 后端系统指纹，用于追踪模型配置、版本迭代变更
        'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402',  
        # API 请求维度唯一响应ID，用于日志排查溯源
        'id': 'a2bd2d25-eb52-47fc-b874-c1fafa59acc3',  
        'finish_reason': 'stop',   # 生成终止原因：stop=内容自然生成完毕，无截断/超限
        'logprobs': None           # 词汇对数概率，用于文本生成概率分析，本次未开启
    },

    # ====================== LangChain 框架内部属性 ======================
    # LangChain链路追踪唯一运行ID，调试链路使用
    id='lc_run--019fa635-36ae-7360-884e-c2d7d58ddf3a-0',  

    # 工具调用相关记录
    tool_calls=[],                # 本次交互未调用任何外部工具，工具调用列表为空
    invalid_tool_calls=[],        # 不存在格式错误、调用失败的无效工具调用

    # LangChain 框架标准化后的Token用量元数据
    usage_metadata={
        'input_tokens': 8,                     # 标准化输入Token总数
        'output_tokens': 33,                   # 标准化输出Token总数
        'total_tokens': 41,                    # 标准化合计总Token消耗
        'input_token_details': {
            'cache_read': 0                    # 输入侧读取缓存的Token数量
        },
        'output_token_details': {
            'reasoning': 31                    # 输出里推理思考过程占用Token数量
        }
    }
)
```

总结一下：

1.核心内容与基本信息

- content : 模型生成的文本回答。这是你最关心的核心输出
- id : 本次运行在 LangChain 内部生成的唯一标识符（Run ID）
- additional_kwargs : 包含特定供应商的额外参数
- refusal : 如果模型拒绝回答（涉及敏感政策），此处会显示拒绝原因。

2.消耗统计 (Token Usage) 

这部分决定了你这一行输入操作花了多少钱： 

- prompt_tokens / input_tokens : 输入 Token 数。你发送给模型的问题长度
- completion_tokens / output_tokens : 输出 Token 数。模型回答生成的长度
- total_tokens : 总消耗。 两者之和
- reasoning_tokens : 推理 Token 数。 如果是 O1/O3 等推理模型，这里会显示它在“思考”时消耗的 Token
- cached_tokens : 缓存命中的 Token 数。重复提问时，如果命中了模型商的缓存，这部分费用通常更低

3.响应元数据 (Response Metadata)

这部分是 API 返回的原始详细信息：

- model_name : 实际调用的模型具体版本（如 gpt-5.4-mini ）
- model_provider : 模型供应商（如 openai ）
- finish_reason : 生成停止的原因
  - stop : 正常回答结束
  - length : 达到最大 Token 限制被截断
- system_fingerprint : 系统指纹，用于追踪模型后端的配置变更

4.性能与延迟 (Latency Checkpoint)

这是针对 API 响应速度的深度拆解（单位通常为毫秒 ms）：

- total_duration_ms : 总耗时。从请求发出到完全收到的总时间（259ms）
- user_visible_ttft_ms : 首字到达时间。用户看到第一个字跳出来等待的时间（194ms），这是体感快慢的关键
- engine_ttft_ms : 引擎层面的首字到达时间（36ms）
- engine_ttlt_ms : 引擎生成最后一个字的时间（100ms）
- pre_inference_ms : 推理前处理耗时。包括安全审核、Token 化等预处理（86ms）
- service_tbt_ms : Time Between Tokens。字与字之间生成的间隔时间，决定了打字机效果是否丝滑。 

5.工具调用信息

- tool_calls : 结构化工具调用列表。如果模型决定调用某个 Python 函数或搜索工具，参数会在这里。
- invalid_tool_calls : 格式错误的工具调用尝试。 

举例：访问所有信息

```python
response = model.invoke("用一句话解释什么是 AI")
# 1. 获取回复内容
print("AI 回复:", response.content)
# 2. 获取响应元数据
metadata = response.response_metadata
print(f"使用的模型: {metadata['model_name']}")
print(f"结束原因: {metadata['finish_reason']}")
print(f"模型提供商：{metadata['model_provider']}\n")
# 3. 获取 Token 使用情况
usage = metadata.get('token_usage', {})
print(f"输入 tokens: {usage.get('prompt_tokens')}")
print(f"输出 tokens: {usage.get('completion_tokens')}")
print(f"总计 tokens: {usage.get('total_tokens')}")
# 4. 获取消息 ID
print(f"消息 ID: {response.id}")
```

```text
AI 回复: AI（人工智能）就是让机器模拟人类的学习、推理、感知和决策等智能行为，使其能够像人一样“听、看、说、想”。
使用的模型: deepseek-v4-flash
结束原因: stop
模型提供商：deepseek

输入 tokens: 9
输出 tokens: 189
总计 tokens: 198
消息 ID: lc_run--019fa64f-9458-7b00-8e1a-8b795ecb0c29-0
```

### 5.2 流式调用

`invoke` 和 `stream` 有什么区别？

- `invoke()` ：同步调用，在模型输出完成后一次性获取响应，对于输出文本很长的场景，用户体验不好。
- `stream()` ：流式调用，实时返回响应片段。调用后，返回一个 迭代器(iterator) ，可以通过循环来实时处理每一个新生成的chunk内容块。 

> 注意：流式输出依赖于模型供应商对于流式输出的支持。

举例：

```python 
import os
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek
load_dotenv(override=True)
model = ChatDeepSeek(
    model="deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
for chunk in model.stream("写一首七言律诗，总结大模型的发展"):
    print(chunk.text, end="", flush=True) # 逐Token输出
```

```text
《咏大模型》
千亿参数隐玄机，数据为薪炼一炉。
破壁忽成通慧眼，隔空能作应声奴。
文生万象凭吞吐，理蕴百科任卷舒。
莫道今朝终局定，江山代有妙思出。

注：本诗以七律形式概括大模型发展历程。首联“千亿参数”点明规模特征，“炼一炉”喻训练过程；颔联“破壁”“隔空”对应跨模态与交互能力；颈联“吞吐”“卷舒”展现生成与推理能力；尾联以“终局”反思当前极限，借“江山代有”展望未来突破。全诗通过意象组合与技术隐喻，展现大模型从数据训练到智能涌现的演进图景。
```

**stream()方式的优点**：

- 响应速度更快 — 用户不必等待完整输出
- 交互体验更流畅 — 尤其在长文本或复杂推理场景下
- 可实时展示模型思考过程

### 5.3 批量调用

batch() 方法允许你一次性**发送一组请求** （含多条独立请求），模型会在后台**并行处理**，然后返回**所有结果的列表**。 与逐个顺序调用（invoke）相比，能大幅**减少网络往返开销**和**等待时间**，显著提升性能、降低成本。

适用场景：文档摘要、批量问答、数据预处理、多样本分类等。

#### 5.3.1 一次性接收所有响应

batch()特点是等待所有请求处理完毕，按原始输入顺序返回结果列表。

```python
import os
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek
load_dotenv(override=True)
model = ChatDeepSeek(
    model="deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
messages = [
    "一句话介绍你自己",
    "2+2*2=?",
    "中国国土面积多大？"
]
responses = model.batch(messages)
for response in responses:
    print(response.content)
```

```text
我是DeepSeek，一个由深度求索公司创造的AI助手，致力于为你提供高效、准确的帮助。
The answer is 6, following the order of operations (multiplication before addition).
中国国土面积约为960万平方公里，包括陆地和水域面积。
```

#### 5.3.2 按完成顺序接收响应

当输入列表很大或单个模型调用耗时差异显著时， `batch_as_completed()` 允许应用在收到第一个结果后立即返回响应，而不会等待批次内所有任务完成才响应。即`batch_as_completed()` 每个请求完成后立即 yield 结果，**结果可能乱序**。 但是，每个返回的响应都被放在一个**元组**中，元组的第一个元素是原始输入的 index 索引，可根据索引重新排序。

```python
import os
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek
load_dotenv(override=True)
model = ChatDeepSeek(
    model="deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
messages = [
    "一句话介绍你自己",
    "2+2*2=?",
    "中国国土面积多大？"
]
responses = model.batch_as_completed(messages)
for response in responses:
    print(response)
```

```text
(1, AIMessage(content='The result of 2+2×2 is 6, following the order of operations (multiplication before addition).', additional_kwargs={'refusal': None, 'reasoning_content': 'We need to calculate 2+2*2. According to order of operations (PEMDAS/BODMAS), multiplication comes before addition. So 2*2 = 4, then 2+4 = 6. So answer is 6.'}, response_metadata={'token_usage': {'completion_tokens': 79, 'prompt_tokens': 10, 'total_tokens': 89, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 54, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}, 'prompt_cache_hit_tokens': 0, 'prompt_cache_miss_tokens': 10}, 'model_provider': 'deepseek', 'model_name': 'deepseek-v4-flash', 'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402', 'id': '707266ea-576f-4caa-9c5d-595fe4b46b08', 'finish_reason': 'stop', 'logprobs': None}, id='lc_run--019fa66a-fd5e-7310-92a2-2529dfd6356b-0', tool_calls=[], invalid_tool_calls=[], usage_metadata={'input_tokens': 10, 'output_tokens': 79, 'total_tokens': 89, 'input_token_details': {'cache_read': 0}, 'output_token_details': {'reasoning': 54}}))
(0, AIMessage(content='你好，我是DeepSeek，一个由深度求索公司创造的免费AI助手，擅长回答各种问题、处理文本任务、支持文件上传和长上下文对话，还能联网搜索帮助你获取最新信息！', additional_kwargs={'refusal': None, 'reasoning_content': '嗯，用户让我用一句话介绍自己。这是一个简单直接的请求。我需要用简洁、清晰的一句话概括我的核心身份和功能。我是DeepSeek，由深度求索公司创造的AI助手。我的主要特点是免费、文本处理、文件支持、长上下文以及联网搜索。把这些关键信息浓缩成一句话，保持流畅自然。'}, response_metadata={'token_usage': {'completion_tokens': 113, 'prompt_tokens': 7, 'total_tokens': 120, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 69, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}, 'prompt_cache_hit_tokens': 0, 'prompt_cache_miss_tokens': 7}, 'model_provider': 'deepseek', 'model_name': 'deepseek-v4-flash', 'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402', 'id': 'df7a27e4-e0fc-4283-98cb-92f73775c352', 'finish_reason': 'stop', 'logprobs': None}, id='lc_run--019fa66a-fd5c-74b0-873a-1d86cc68b720-0', tool_calls=[], invalid_tool_calls=[], usage_metadata={'input_tokens': 7, 'output_tokens': 113, 'total_tokens': 120, 'input_token_details': {'cache_read': 0}, 'output_token_details': {'reasoning': 69}}))
(2, AIMessage(content='中国的国土面积约为**960万平方公里**（陆地面积），位居世界第三。这一数据通常不包括领海面积。若加上管辖的海域面积（约470多万平方公里），中国的国土总面积则更为广阔。需要注意的是，不同统计口径下（如是否计入争议地区、内水等），具体数字可能存在细微差异，但“960万平方公里”是官方普遍引用的核心数据。', additional_kwargs={'refusal': None, 'reasoning_content': '嗯，用户问的是中国国土面积，这是一个基础且常见的地理知识问题。需要给出准确的数据，并且最好说明一下统计口径，因为不同来源（如陆地面积、加上领海等）的数据会略有差异。\n\n通常普遍引用的数据是约960万平方公里的陆地面积，这是中国官方公布的数值，也常见于教材和官方文件中。如果考虑管辖海域，面积会更大，但“国土面积”一般主要指陆地。所以回答时应该明确给出960万平方公里这个核心数字，并补充说明这是陆地总面积，不包括领海，以免用户混淆。\n\n另外，可以简洁提一下中国的地形特点或世界排名，但问题只要求面积，所以回答应聚焦在数据本身，避免过度展开。想到了直接给出数字，并说明其官方性和主要构成。'}, response_metadata={'token_usage': {'completion_tokens': 248, 'prompt_tokens': 9, 'total_tokens': 257, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 166, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}, 'prompt_cache_hit_tokens': 0, 'prompt_cache_miss_tokens': 9}, 'model_provider': 'deepseek', 'model_name': 'deepseek-v4-flash', 'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402', 'id': '6c01136e-5829-4fe0-a425-cac90b8d74b1', 'finish_reason': 'stop', 'logprobs': None}, id='lc_run--019fa66a-fd5f-7ff3-a038-f633587235b6-0', tool_calls=[], invalid_tool_calls=[], usage_metadata={'input_tokens': 9, 'output_tokens': 248, 'total_tokens': 257, 'input_token_details': {'cache_read': 0}, 'output_token_details': {'reasoning': 166}}))
```

#### 5.3.3 性能对比

使用batch()：

```python
import os
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek
load_dotenv(override=True)
model = ChatDeepSeek(
    model="deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
# 准备多个输入
inputs = [
    "翻译成英文：春天来了",
    "翻译成英文：夏天很热",
    "翻译成英文：秋天落叶",
    "翻译成英文：冬天下雪"
] 
# 批量调用（高效）
import time
start = time.time()
responses = model.batch(inputs)
batch_time = time.time() - start
print("批量调用结果：")
for i, response in enumerate(responses):
    print(f"{i+1}. {response.content}")
print(f"耗时: {batch_time:.2f}秒\n")
```

```text
批量调用结果：
1. Spring has come.
2. Summer is very hot.
3. Autumn leaves falling
4. In winter, it snows.
耗时: 3.55秒
```

使用循环调用invoke()：

```python
# 循环调用（低效，仅用于对比）
inputs = [
    "翻译成英文：春天来了",
    "翻译成英文：夏天很热",
    "翻译成英文：秋天落叶",
    "翻译成英文：冬天下雪"
]
start = time.time()
loop_responses = []
for inp in inputs:
    response = model.invoke(inp)
    loop_responses.append(response)
loop_time = time.time() - start
for i, response in enumerate(responses):
    print(f"{i+1}. {response.content}")
print(f"循环调用耗时: {loop_time:.2f}秒")
print(f"批量调用节省: {((loop_time - batch_time) / loop_time * 100):.1f}%")
```

```text
1. Spring has come.
2. Summer is very hot.
3. Autumn leaves falling
4. In winter, it snows.
循环调用耗时: 6.03秒
批量调用节省: 41.0%
```

### 5.4 异步调用

**复习：同步 vs 异步**

同步(sync) ： 

- 概念：发起一个任务之后，需要等待该任务完成后 ，才能继续执行后续任务
- 表现：当前执行流会被『阻塞』 

异步(async) ：

- 概念：发起一个任务之后， 不必等该任务完成 ，就可以继续执行其他任务
- 备注：虽然不必等待任务完成，但任务完成后，仍然可以通过特定方式获取结果
- 表现：当前执行流 不会被『阻塞』 

举例：

![1785204604857](/images/blog/langchain-model-creation-and-invocation/1785204604857.png)

在LangChain框架中，异步方法（ainvoke、astream、abatch）与它们的同步版本（invoke、stream、batch）相比，具备如下特点： 

- 避免阻塞主线程 ：同步调用会阻塞程序执行，而异步方法让应用程序在等待API响应时保持响应性
- 优化资源利用 ：异步操作可以更高效地利用系统资源，减少空闲等待时间

举例1：ainvoke()

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
import asyncio
import time
# 从.env文件中加载环境变量
load_dotenv(override=True)
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)
async def demo_async_invoke():
    print("=== 演示：ainvoke 的异步（非阻塞）效果 ===")
    start_time = time.perf_counter()
    # 记录开始时间
    print("程序开始...")
    # 1. 创建任务 (Task)
    print(">>> 发起异步模型调用 (ainvoke)...")
    async_task = asyncio.create_task(model.ainvoke("用一句话解释人工智能。"))
    # 2. 并行执行其他任务
    print(">>> 模型请求已在后台发送，继续执行本地逻辑...")
    for i in range(3):
        await asyncio.sleep(1)
        # 使用异步等待，释放控制权
        print(f">>> 正在执行第{i + 1}个任务... (已耗时 {time.perf_counter() - start_time:.2f}s)")
    # 3. 获取模型结果
    print(">>> 本地任务完成，检查模型状态...")
    response = await async_task
    end_time = time.perf_counter()
    print(f">>> 模型返回: {response.content}")
    print(f"=== 总运行耗时: {end_time - start_time:.2f}s ===")
async def main():
    """主函数"""
    await demo_async_invoke()
if __name__ == "__main__":
    asyncio.run(main())
```

```text
=== 演示：ainvoke 的异步（非阻塞）效果 ===
程序开始...
>>> 发起异步模型调用 (ainvoke)...
>>> 模型请求已在后台发送，继续执行本地逻辑...
>>> 正在执行第1个任务... (已耗时 1.00s)
>>> 正在执行第2个任务... (已耗时 2.01s)
>>> 正在执行第3个任务... (已耗时 3.02s)
>>> 本地任务完成，检查模型状态...
>>> 模型返回: 人工智能是让机器模拟人类智能的理论、方法和技术，使其能够学习、推理、感知和自主决策。
=== 总运行耗时: 3.02s ===
```

> 说明：在 `.py` 文件中执行，而非jupyter中执行

举例2：astream()：

```python
import asyncio
import os
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import time

# 从.env文件中加载环境变量
load_dotenv(override=True)
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)

async def demo_async_stream():
    """演示异步调用的非阻塞特性"""
    print("=== 演示：astream 的异步（非阻塞）效果 ===")
    start_time = time.perf_counter()  # 记录开始时间
    print("程序开始...")
    # 1. 发起异步流式请求
    # 注意：此时请求已发出，返回的是一个异步生成器
    print(">>> 发起异步流式调用 (astream)...")
    stream_resp = model.astream("请用一句话解释机器学习的基本概念。")
    # 2. 在等待流式响应的同时，执行其他任务
    print(">>> 流式请求已发送，程序无需等待，继续执行其他异步任务...")
    for i in range(3):
        # 使用 asyncio.sleep 而非 time.sleep
        # 这允许事件循环在等待时去处理上面的 stream_resp 网络 IO
        await asyncio.sleep(1)
        # print(f">>> 正在执行并发任务 {i + 1}... ")
        print(f">>> 正在执行第{i + 1}个任务... (已耗时 {time.perf_counter() - start_time:.2f}s)")
        # 3. 现在开始处理流式结果
    print(">>> 模拟任务已完成，开始读取缓冲区中的流式结果...")
    end_time = time.perf_counter()
    print(">>> 流式输出: ", end="", flush=True)
    async for chunk in stream_resp:
        # LangChain 的消息块通常通过 .content 获取内容
        content = chunk.content if hasattr(chunk, 'content') else str(chunk)
        print(content, end="", flush=True)
    print("\n>>> 流式输出结束\n")
    print(f"=== 总运行耗时: {end_time - start_time:.2f}s ===")

async def main():
    """主函数"""
    await demo_async_stream()

if __name__ == "__main__":
    asyncio.run(main())
```

```text
=== 演示：astream 的异步（非阻塞）效果 ===
程序开始...
>>> 发起异步流式调用 (astream)...
>>> 流式请求已发送，程序无需等待，继续执行其他异步任务...
>>> 正在执行第1个任务... (已耗时 1.01s)
>>> 正在执行第2个任务... (已耗时 2.01s)
>>> 正在执行第3个任务... (已耗时 3.02s)
>>> 模拟任务已完成，开始读取缓冲区中的流式结果...
>>> 流式输出: 机器学习是通过让计算机从数据中自动发现模式并优化自身性能，而无需人为编写明确规则的方法。
>>> 流式输出结束

=== 总运行耗时: 3.02s ===
```

举例3：abatch()：

```python
import asyncio
import os
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import time
# 从.env文件中加载环境变量
load_dotenv(override=True)
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)

async def demo_async_batch():
    """演示异步批量的非阻塞特性"""
    print("=== 演示：abatch 的异步（非阻塞）效果 ===")
    start_time = time.perf_counter() # 记录开始时间
    print("程序开始...")
    # 准备批量输入
    questions = ["用一句话说明深度学习与传统机器学习的区别", "中国首都在哪里？"]
    # 1. 发起异步批量请求
    # 关键修改：使用 create_task 让协程立即在后台执行
    print(">>> 发起异步批量调用 (abatch)...")
    batch_task = asyncio.create_task(model.abatch(questions))
    # 2. 在等待批量处理的同时，执行其他任务
    print(">>> 批量任务已在后台运行，主程序继续执行...")
    for i in range(3):
        # 关键修改：使用 asyncio.sleep 允许后台任务获取 CPU 时间片进行网络请求
        await asyncio.sleep(1)
        print(f">>> 正在执行第{i + 1}个任务... (已耗时 {time.perf_counter() - start_time:.2f}s)")
    # 3. 等待批量处理结果
    print(">>> 其他任务已完成，现在获取后台批量任务的结果...")
    # 此时 batch_task 可能已经完成，或者我们在这里等待它完成
    responses = await batch_task
    end_time = time.perf_counter()
    for response in responses:
        content = response.content if hasattr(response, 'content') else str(response)
        print(f">>> 响应内容: {content}")
    print(f"=== 总运行耗时: {end_time - start_time:.2f}s ===")
    
async def main():
    """主函数"""
    await demo_async_batch()
    
if __name__ == "__main__":
    asyncio.run(main())
```

```text
=== 演示：abatch 的异步（非阻塞）效果 ===
程序开始...
>>> 发起异步批量调用 (abatch)...
>>> 批量任务已在后台运行，主程序继续执行...
>>> 正在执行第1个任务... (已耗时 1.01s)
>>> 正在执行第2个任务... (已耗时 2.02s)
>>> 正在执行第3个任务... (已耗时 3.03s)
>>> 其他任务已完成，现在获取后台批量任务的结果...
>>> 响应内容: 深度学习通过多层神经网络自动提取特征，而传统机器学习依赖人工设计的特征。
>>> 响应内容: 中国首都是北京。
=== 总运行耗时: 3.03s ===
```

### 5.5 如何处理API调用失败

使用 try-except 块捕获异常：

```python
try:
    response = model.invoke("Hello")
    print(response.content)
except ValueError as e:
    print(f"配置错误: {e}")
except ConnectionError as e:
    print(f"网络错误: {e}")
except Exception as e:
    print(f"未知错误: {e}")
```

## 6 拓展内容

### 6.1 美化模型输出响应

**方法1**：使用pretty_print()

我们查看响应的方式是直接print(response)，返回的内容比较杂乱，可以调用 pretty_print() 美化输出内容。

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
messages = [
    {"role":"system","content":"你是小默的私人助手，负责回复小默的私人问题，比如小默的age=21，sex=boy，birth=20061111"},
    {"role":"user","content":"你老板多大了？"}
]
response = model.invoke(messages)
# 美化输出
response.pretty_print()
```

```text
================================== Ai Message ==================================

我的老板小默今年21岁哦！

```

**方法2**：使用 rich 库

如果你在终端（Terminal）工作，想要色彩鲜明、排版优雅的调试界面，可以使用 `rich` 这个库。

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from rich import print as rprint
load_dotenv(override=True)
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)
messages = [
    {"role":"system","content":"你是小默的私人助手，负责回复小默的私人问题，比如小默的age=21，sex=boy，birth=20061111"},
    {"role":"user","content":"你老板多大了？"}
]
response = model.invoke(messages)
# 美化输出
rprint(response)
```

```text
AIMessage(
    content='我的老板小默今年21岁。',
    additional_kwargs={
        'refusal': None,
        'reasoning_content': 
'我们已知小默的年龄是21岁。但用户问的是“你老板”，这里的“老板”可能是指小默自己（
因为我是小默的私人助手）。需要明确：我的老板就是小默。所以根据小默的age=21，直
接回答即可。'
    },
    response_metadata={
        'token_usage': {
            'completion_tokens': 67,
            'prompt_tokens': 41,
            'total_tokens': 108,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 58,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {
                'audio_tokens': None,
                'cached_tokens': 0
            },
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 41
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-v4-flash',
        'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402',
        'id': 'a395c1c4-7b1f-429d-802f-647b2e6df2fd',
        'finish_reason': 'stop',
        'logprobs': None
    },
    id='lc_run--019fa8ec-fc13-7950-b7bb-efd5620a3b8c-0',
    tool_calls=[],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 41,
        'output_tokens': 67,
        'total_tokens': 108,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {'reasoning': 58}
    }
)
```

### 6.2 模型配置信息profile

LangChain1.1及更高版本可以通过 `profile属性` 查看模型的配置信息。 这是LangChain针对模型的能力画像，但是否存在，取决于LangChain在集成模型厂商的服务时是否声明了能力画像。 

举例1：DeepSeek官方模型的能力画像

```python
from dotenv import load_dotenv
from langchain_deepseek import ChatDeepSeek
load_dotenv(override=True)

model = ChatDeepSeek(
    model="deepseek-v4-flash",
)

print(model.profile)
```

```text
{}
```

举例2：OpenRouter中DeepSeek能力画像

```python
from langchain_openrouter import ChatOpenRouter
from dotenv import load_dotenv
from rich import print as rprint
load_dotenv(override=True)
model = ChatOpenRouter(
    model="deepseek/deepseek-v4-flash",
    temperature=0.7,
    timeout=30,
    max_tokens=1000,
    max_retries=6
)
rprint(model.profile)
```

```text
{
	'max_input_tokens': 163840,
	'max_output_tokens': 65536,
	'text_inputs': True,
	'image_inputs': False,
	'audio_inputs': False,
	'video_inputs': False,
	'text_outputs': True,
	'image_outputs': False,
	'audio_outputs': False,
	'video_outputs': False,
	'reasoning_output': True,
	'tool_calling': True,
	'structured_output': True
}
```

说明：LangChain已声明了OpenRouter平台模型的画像

注意：我们当前的代码只需要OpenRouter的API_KEY，不会真正发送请求，不必充值。

### 6.3 模型初始化参数(完整版)

#### 6.3.1 查看所有初始化参数

官方文档和源码注释没有给出完整的参数列表。

以ChatDeepSeek类为例，其参数可以由 `自身定义` 或 `从父类BaseChatModel继承` 。直接查看源码也很难拼凑完整列表。这里通过查看ChatDeepSeek的类属性`model_fields`来获得完整参数列表。 

举例1：查看ChatDeepSeek支持的完整参数列表

```python
from langchain_deepseek import ChatDeepSeek

print(ChatDeepSeek.model_fields.keys())
```

```text
dict_keys(['name', 'cache', 'verbose', 'callbacks', 'tags', 'metadata', 'custom_get_token_ids', 'rate_limiter', 'disable_streaming', 'output_version', 'profile', 'client', 'async_client', 'root_client', 'root_async_client', 'model_name', 'temperature', 'model_kwargs', 'openai_api_key', 'openai_api_base', 'openai_organization', 'openai_proxy', 'request_timeout', 'stream_usage', 'max_retries', 'presence_penalty', 'frequency_penalty', 'seed', 'logprobs', 'top_logprobs', 'logit_bias', 'streaming', 'n', 'top_p', 'max_tokens', 'reasoning_effort', 'reasoning', 'verbosity', 'tiktoken_model_name', 'default_headers', 'default_query', 'http_client', 'http_async_client', 'stop', 'extra_body', 'include_response_headers', 'disabled_params', 'context_management', 'include', 'service_tier', 'store', 'truncation', 'use_previous_response_id', 'use_responses_api', 'api_key', 'api_base'])
```

举例2：查看ChatOpenAI支持的完整参数列表

```python
from langchain_openai import ChatOpenAI

print(ChatOpenAI.model_fields.keys())
```

```text
dict_keys(['name', 'cache', 'verbose', 'callbacks', 'tags', 'metadata', 'custom_get_token_ids', 'rate_limiter', 'disable_streaming', 'output_version', 'profile', 'client', 'async_client', 'root_client', 'root_async_client', 'model_name', 'temperature', 'model_kwargs', 'openai_api_key', 'openai_api_base', 'openai_organization', 'openai_proxy', 'request_timeout', 'stream_usage', 'max_retries', 'presence_penalty', 'frequency_penalty', 'seed', 'logprobs', 'top_logprobs', 'logit_bias', 'streaming', 'n', 'top_p', 'max_tokens', 'reasoning_effort', 'reasoning', 'verbosity', 'tiktoken_model_name', 'default_headers', 'default_query', 'http_client', 'http_async_client', 'stop', 'extra_body', 'include_response_headers', 'disabled_params', 'context_management', 'include', 'service_tier', 'store', 'truncation', 'use_previous_response_id', 'use_responses_api'])
```

举例3：查看init_chat_model的某model_provider支持的完整参数列表

```python
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
load_dotenv(override=True)
# 1. 实例化一个模型对象
model = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="deepseek",
)
# 2. 现在它已经是一个具体的ChatDeepSeek对象了
print(model.model_fields.keys())
```

```text
dict_keys(['name', 'cache', 'verbose', 'callbacks', 'tags', 'metadata', 'custom_get_token_ids', 'rate_limiter', 'disable_streaming', 'output_version', 'profile', 'client', 'async_client', 'root_client', 'root_async_client', 'model_name', 'temperature', 'model_kwargs', 'openai_api_key', 'openai_api_base', 'openai_organization', 'openai_proxy', 'request_timeout', 'stream_usage', 'max_retries', 'presence_penalty', 'frequency_penalty', 'seed', 'logprobs', 'top_logprobs', 'logit_bias', 'streaming', 'n', 'top_p', 'max_tokens', 'reasoning_effort', 'reasoning', 'verbosity', 'tiktoken_model_name', 'default_headers', 'default_query', 'http_client', 'http_async_client', 'stop', 'extra_body', 'include_response_headers', 'disabled_params', 'context_management', 'include', 'service_tier', 'store', 'truncation', 'use_previous_response_id', 'use_responses_api', 'api_key', 'api_base'])
```

举例4：可以查看每个字段的属性

```python
from langchain_deepseek import ChatDeepSeek
for name, field in ChatDeepSeek.model_fields.items():
    print(name)
    print(" annotation:", field.annotation)
    print(" default:", field.default)
    print(" description:", getattr(field, "description", None))
    print(" alias:", field.alias)
    print()
```

```text
name
 annotation: str | None
 default: None
 description: None
 alias: None

cache
 annotation: langchain_core.caches.BaseCache | bool | None
 default: None
 description: None
 alias: None

verbose
 annotation: <class 'bool'>
 default: PydanticUndefined
 description: None
 alias: None

# 此处省略大量参数...

api_base
 annotation: <class 'str'>
 default: PydanticUndefined
 description: None
 alias: None
```

#### 6.3.2 模型类的参数构成

以ChatDeepSeek为例，完整参数列表由如下几个部分构成：

1、**客户端与连接参数（Networking）**

这类参数决定了代码“怎么连到服务端”，而不是“让模型怎么生成”。

|             参数名              |                     说明                     |
| :-----------------------------: | :------------------------------------------: |
|    api_key / openai_api_key     | 鉴权密钥。DeepSeek 通常兼容 OpenAI 接口格式  |
|   api_base / openai_api_base    |  接口地址，示例：https://api.deepseeks.com   |
|         request_timeout         |               网络请求超时时间               |
|           max_retries           |             请求失败时的重试次数             |
| http_client / http_async_client | 手动传入 httpx.Client 实例，适配复杂网络配置 |
|          openai_proxy           |                代理服务器配置                |
| default_headers / default_query |    每次请求默认携带的HTTP请求头或查询参数    |

2、**模型推理参数（Model Inference）**

这些是直接传递给 DeepSeek 模型API的参数，决定了`生成内容`的质量和风格。

|                参数名                |                         说明                          |
| :----------------------------------: | :---------------------------------------------------: |
|              model_name              | 指定调用模型，示例：deepseek-chat、deepseek-reasoning |
|             temperature              |         采样温度，数值越高生成内容随机性越强          |
|                top_p                 |            核采样参数，用于控制生成多样性             |
|              max_tokens              |                 单次输出最大token数量                 |
|                 stop                 |               文本停止生成的标识符列表                |
|              streaming               |                 是否开启流式逐块输出                  |
|                  n                   |             一次性生成多条候选回复的数量              |
|              reasoning               |                 开启/关闭推理思考模式                 |
|           reasoning_effort           |    DeepSeek R1专属参数，调控思维链（COT）思考深度     |
| presence_penalty / frequency_penalty |         存在惩罚、频率惩罚，抑制文本重复生成          |
|                store                 |               是否云端留存本次对话记录                |
|              logit_bias              |             自定义调整指定词汇的生成概率              |

3、**LangChain框架通用参数**

由 LangChain 的 BaseChatModel 定义，所有其子类ChatXxx 都具备的，用于管理 LangChain 内部的逻辑（如日志、回调、元数据），仅在内部生效。 

|     参数名      |                          说明                           |
| :-------------: | :-----------------------------------------------------: |
|      name       | 为模型实例命名，用于在LangSmith等追踪工具中区分不同实例 |
|     verbose     |              控制是否打印程序详细运行日志               |
|    callbacks    |  回调处理器，用于对接LangSmith监控平台或自定义监控逻辑  |
| tags / metadata |       为实例添加标签与元数据，用于归类、检索标记        |
|      cache      |              开启/关闭模型接口请求结果缓存              |
|  rate_limiter   |     LangChain内置调用频次限制工具，管控接口调用速率     |

4、**高级与特定扩展参数**

这类参数通常用于特定场景，或为了保持与OpenAI协议的兼容性而存在。

[DeepSeek官方文档](https://api-docs.deepseek.com/zh-cn/)明确说明见下图：

![1785287371532](/images/blog/langchain-model-creation-and-invocation/1785287371532.png)

- 底层客户端访问: `client` , `async_client` , `root_client` （这些通常是内部生成的 SDK 实例，不建议在初始化时手动传参）。 
- 透传参数: `model_kwargs` , `extra_body` （如果你想传递 DeepSeek API 支持但 LangChain 还没定义的参数，可以写在这里）。 
- 功能开关: `disable_streaming` , `include_response_headers` （决定是否在输出中包含 Header）。 
- 兼容性参数: `openai_organization` , `service_tier` , `store` （这些多为 OpenAI 遗留参数， DeepSeek 实际使用较少）。 

**参数：model_kwargs**

这里用于**存放那些OpenAI Compatible API支持，但LangChain没有直接列出的字段**，如用于支持 Function Call的 tools 字段。 

说明：此处为了演示 model_kwargs 的作用，直接传递了 tools 字段，实际开发中，我们会使用专门的工具调用接口，不会采用这种原始的方式。 

查阅[OpenAI Chat Completions文档](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)，可以看到官方支持的所有请求字段

![1785287781807](/images/blog/langchain-model-creation-and-invocation/1785287781807.png)

上文输出的字段列表不包含tools字段，因此我们需要通过model_kwargs传递。

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from rich import print as rprint

# 加载 .env 环境变量，重复变量强制覆盖
load_dotenv(override=True)

# 初始化 DeepSeek 对话大模型，并绑定天气查询工具
model = init_chat_model(
    model="deepseek:deepseek-v4-flash",
    model_kwargs={
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "get_weather",
                    "description": "Get weather of a location, the user should supply a location first.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {
                                "type": "string",
                                "description": "The city and state, e.g. San Francisco, CA"
                            }
                        },
                        "required": ["location"]
                    }
                }
            }
        ]
    }
)

# 调用模型，提问查询北京今日天气
response = model.invoke("你好，今天北京的天气如何")

# 优雅打印模型完整返回结果
rprint(response)
```

```text
AIMessage(
    content='你好！让我帮你查一下北京今天的天气情况。',
    additional_kwargs={
        'refusal': None,
        'reasoning_content': 
'用户想知道北京今天的天气。我可以使用get_weather工具来获取北京今天的天气信息。
让我调用这个工具。'
    },
    response_metadata={
        'token_usage': {
            'completion_tokens': 79,
            'prompt_tokens': 303,
            'total_tokens': 382,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 24,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {
                'audio_tokens': None,
                'cached_tokens': 0
            },
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 303
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-v4-flash',
        'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402',
        'id': '7eb8dcf6-c287-453a-a9f5-80fa916af027',
        'finish_reason': 'tool_calls',
        'logprobs': None
    },
    id='lc_run--019fab74-9962-70e3-aa2e-e96a9ff67596-0',
    tool_calls=[
        {
            'name': 'get_weather',
            'args': {'location': '北京'},
            'id': 'call_00_fTcw1tPCcejqUx6PEvwD5018',
            'type': 'tool_call'
        }
    ],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 303,
        'output_tokens': 79,
        'total_tokens': 382,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {'reasoning': 24}
    }
)
```

可以看到，输出包含了 `tool_calls` 字段，说明工具被模型正确识别了。

**参数：extra_body**

这里用于存放模型厂商基于OpenAI API协议扩展的字段。 查阅[OpenAI Chat Completions文档](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)和[DeepSeek对话补全API文档](https://api-docs.deepseek.com/zh-cn/api/create-chat-completion/)可知， thinking 是DeepSeek扩展的 字段，用于控制是否启用思考模式。

![1785288283775](/images/blog/langchain-model-creation-and-invocation/1785288283775.png)

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from rich import print as rprint
load_dotenv(override=True)
model = init_chat_model(
	model="deepseek:deepseek-v4-flash",
    extra_body={"thinking": {"type":"enabled"}},
)
rprint(model.invoke("你好，一句话回答"))
```

```text
AIMessage(
    content='好的，请提问，我将用一句话回答您。',
    additional_kwargs={
        'refusal': None,
        'reasoning_content': 
'用户问的是“一句话回答”，要求非常明确：用一句话来回应。我需要给出一个直接、简洁
的答复，不能展开解释或添加多余内容。最简单的办法就是先确认用户的需求，然后表示
愿意配合。所以直接说“好的，请提问，我将用一句话回答您。”这样既符合指令，又为后
续对话做好了准备。'
    },
    response_metadata={
        'token_usage': {
            'completion_tokens': 85,
            'prompt_tokens': 8,
            'total_tokens': 93,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 73,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {
                'audio_tokens': None,
                'cached_tokens': 0
            },
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 8
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-v4-flash',
        'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402',
        'id': 'e01b7bb7-72b3-446a-b737-5dc83e420bb3',
        'finish_reason': 'stop',
        'logprobs': None
    },
    id='lc_run--019fab7d-42cd-7200-964a-7ff835878343-0',
    tool_calls=[],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 8,
        'output_tokens': 85,
        'total_tokens': 93,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {'reasoning': 73}
    }
)
```

输出包含了 `reasoning_content` ，说明启用了思考模式。与 `extra_body={"thinking": {"type": "disabled"}}`, 对比如下，不包含 `reasoning_content` ，说明没有启用思考模式。

```text
AIMessage(
    content='你好！我在这里，随时为你提供帮助，请说。',
    additional_kwargs={'refusal': None},
    response_metadata={
        'token_usage': {
            'completion_tokens': 13,
            'prompt_tokens': 8,
            'total_tokens': 21,
            'completion_tokens_details': None,
            'prompt_tokens_details': {
                'audio_tokens': None,
                'cached_tokens': 0
            },
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 8
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-v4-flash',
        'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402',
        'id': '6351e395-64ac-4719-9014-daedcf5d6318',
        'finish_reason': 'stop',
        'logprobs': None
    },
    id='lc_run--019fab7e-7c82-7581-a117-9b5042be82ba-0',
    tool_calls=[],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 8,
        'output_tokens': 13,
        'total_tokens': 21,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {}
    }
)
```

#### 6.3.3 需要记住哪些参数

记住常见参数及用法即可，如果需要精细控制模型输出，可以查阅OpenAI和特定模型供应商的官方文 档，通过 `model_kwargs` 或 `extra_body` 传递。

### 6.4 模型调用中config参数

在调用模型时（如使用 invoke(), ainvoke(), stream(),batch()等方法时），我们可以传入config参数。

```python
def invoke(
    self,
    input: LanguageModelInput,
    config: RunnableConfig | None = None,
    *,
    stop: list[str] | None = None,
    **kwargs: Any,
) -> AIMessage
```

config参数：**允许在调用模型时，动态地配置和控制模型的行为**，而无需在初始化时就固定所有参数， 这为应用带来了极大的灵活性和可维护性。 

关于config中可配参数的解释参考： https://reference.langchain.com/python/langchain-core/runnables/config/RunnableConfig 

举例：

```python
deepseek_llm.invoke(
    "你好",
    config={
        # LangSmith 链路运行名称，追踪时展示自定义名称
        "run_name": "...",
        # 自定义标签，用于LangSmith筛选、归类测试环境运行记录
        "tags": ["test", "development"],
        # 自定义元数据，可存入用户ID等业务字段，用于日志检索溯源
        "metadata": {"user_id": "123"},
        # 注册自定义回调处理器，可监听模型流式输出、调用起止事件
        "callbacks": [custom_handler],
        # 可动态覆盖的模型运行参数配置区
        "configurable": {
            "model": "deepseek-reasoner",   # 指定本次调用使用的推理模型
            "temperature": 0.7,             # 温度系数：控制生成随机性，0=确定 1=发散
            "max_tokens": 100               # 限制单次回复最大输出令牌数量
        }
    }
)
```

config中支持配置的参数如下：

|     配置项      |           类型            | 描述                                                         |
| :-------------: | :-----------------------: | :----------------------------------------------------------- |
|    run_name     |            str            | 为本次运行设置可读名称，便于在LangSmith追踪系统中快速查找区分运行任务 |
|      tags       |         List[str]         | 运行标签列表，用于分类、筛选任务，方便追踪平台检索           |
|    callbacks    | List[BaseCallbackHandler] | 回调处理器列表，在运行各阶段触发回调逻辑，对接LangSmith实现调试与深度追踪 |
|    metadata     |      Dict[str, Any]       | 自定义键值对元数据，可存储业务上下文（用户ID、会话ID等）     |
| max_concurrency |            int            | 最大并发运行数，限制并发量，减轻接口与服务器压力，实现限流   |
| recursion_limit |            int            | 递归调用最大深度，多用于Agent多轮工具调用场景，规避无限递归死循环 |
|  configurable   |      Dict[str, Any]       | 通用扩展字典，传递各类额外配置参数，用于动态切换模型、组件等高级功能 |

说明如下：

- config中参数 run_name 、 tags 、 callbacks 主要用在LangSmith中，用于追踪、筛选和调试。

- metadata 可以配置用户指定的一些信息，在工作流开发中，当整个流程被包装为Runnable链时，可以将这些参数传递给后续的链节点使用。
- configurable 中可配置的参数与 init_chat_model 初始化模型参数一样，与在初始化模型时设置的参数（如 temperature=0.7）的关键区别在于：
  - init_chat_model初始化参数：模型的 默认设置 ，适用于该模型实例的大部分场景。
  - 运行时 config： 单次调用的特定设置 ，优先级更高，针对本次调用进行的特殊调整。

举例1：

当需要处理大量输入时，为了避免对模型服务造成过大压力或触发速率限制，在config中使用 max_concurrency参数控制最大并行数。

```python
large_list_of_inputs = [..., ..., ...]
model.batch(
	large_list_of_inputs,
    config={
        'max_concurrency': 5 # 限制最大并发数为5
    }
)
```

举例2：

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os
from rich import print as rprint

# 从 .env 文件加载环境变量，重复变量强制覆盖原有值
load_dotenv(override=True)

# 读取密钥与接口地址环境变量
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

# 1. 初始化 DeepSeek 对话大模型
model = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
    temperature=0.2,
    max_tokens=500,
    # 声明允许通过configurable动态覆写的参数列表，否则无效
    configurable_fields=("model", "model_provider", "temperature", "max_tokens"),
)

# 2. 构造调用配置：链路追踪标签、元数据、单次动态覆写参数
config = {
    "run_name": "joke_generation",          # LangSmith 链路运行名称
    "tags": ["tag1", "tag2"],               # 自定义标签，用于日志筛选分类
    "metadata": {"user_id": "123"},         # 业务自定义元数据，可溯源用户信息
    "configurable": {
        "model": "deepseek-v4-pro",          # 本次调用临时切换模型版本
        "model_provider": "openai",         # 临时指定模型服务商
        "temperature": 0.7,                  # 本次生成随机性参数
        "max_tokens": 1000                  # 本次最大输出token上限
    }
}

# 3. 发起模型调用，传入自定义运行配置
response = model.invoke(
    "1 + 2 = ？",
    config=config
)

# 美化打印模型返回完整结果
rprint(response)
```

```text
AIMessage(
    content='1 + 2 = 3',
    additional_kwargs={'refusal': None},
    response_metadata={
        'token_usage': {
            'completion_tokens': 35,
            'prompt_tokens': 11,
            'total_tokens': 46,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 27,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {
                'audio_tokens': None,
                'cached_tokens': 0
            },
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 11
        },
        'model_provider': 'openai',
        'model_name': 'deepseek-v4-pro',
        'system_fingerprint': 'fp_9954b31ca7_prod0820_fp8_kvcache_20260402',
        'id': 'c3fcc5e4-0a92-41c3-b6a5-1d98a84039a8',
        'finish_reason': 'stop',
        'logprobs': None
    },
    id='lc_run--019fab8c-2f0b-76c3-9bcc-71bd43da424f-0',
    tool_calls=[],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 11,
        'output_tokens': 35,
        'total_tokens': 46,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {'reasoning': 27}
    }
)
```

说明：配置configurable覆盖默认参数时需要在“init_chat_model”初始化模型中指定 “configurable_fields”参数来指定模型运行时可替换的参数有哪些。