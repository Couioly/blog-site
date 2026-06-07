---
title: "Python-安装"
date: "2025-07-01"
description: "Python解释器安装教程，Windows平台下载、安装与环境变量配置。"
tags: ["Python", "基础"]
---

## Python介绍
Python是一种功能强大且易学的编程语言，它可以做以下几个方面：

- Web开发
- 大数据处理
- 人工智能d
- 自动化运维开发
- 云计算
- 网络爬虫
- 游戏开发

## Python解释器安装
Python 解释器是 Python 生态系统的基石，它不仅负责代码的执行，还提供了内存管理、类型检查、异常处理等核心功能。同时，它的跨平台性和多样化实现，让 Python 能够在各种场景下得到广泛应用。

### 下载Python安装包
因为Python是一门解释型编程语言，所以要进行Python开发，需要先安装Python解释器。

首先访问Python官网 ：[点击跳转Python官网](https://www.python.org/)   进入官网后点击`dowmload`按钮，然后选择Python推荐的最新版本进行安装(可以选择其他版本)，具体操作如下所示：

![Python官网页面.png](/images/blog/python-basics/Python官网页面.png)

### 在Windows执行安装包
打开文件下载路径，找到刚刚下载好的Python安装包`python-3.13.5-amd64.exe`文件，双击执行，具体操作如下所示：

![执行安装包.png](/images/blog/python-basics/执行安装包.png)

### 安装步骤
1）首先在弹出的安装界面勾选`add python.exe to PATH`复选框，该命令表示将Python解释器添加至环境变量，若不勾选该命令，则在后续操作中会出现`xxx 不是内部或外部命令`的报错信息；再选择自定义安装`Customize installation`。具体操作如下所示：

![安装界面1.png](/images/blog/python-basics/安装界面1.png)

![安装界面2.png](/images/blog/python-basics/安装界面2.png)

2）点击自定义安装后默认全部勾选，直接点击`next`进入下一层选项，在该页面勾选为所有用户安装`install Python 3.13 for all users` 复选框，再点击`install`进行安装即可。具体操作如下所示：

![安装界面3.png](/images/blog/python-basics/安装界面3.png)

![安装完成.png](/images/blog/python-basics/安装完成.png)

### 测试是否安装成功
打开dos命令窗，输入`python` 点击回车，若成功的进入到了python即表示已成功安装Python解释器。具体操作如下所示：

![cmd窗口.png](/images/blog/python-basics/cmd窗口.png)

![调试python.png](/images/blog/python-basics/调试python.png)

### 编写第一个Python程序
在输入`python` 按回车进入Python后，可以在`>>>`的后面编写Python代码，敲回车可以执行这行代码。这里以`print("Hello World!")`为例，如下所示：

![编写代码.png](/images/blog/python-basics/编写代码.png)

### Python开发工具
经过上述编写代码的操作，会发现这种写一行执行一行的方式一点也不方便，所以为了方便我们可以借助Python编译器，实际上，`Python开发 = Python解释器 + Python编译器` ，在成功安装Python后它会自带一个编译器`IDLE`。接下来说说IDLE的使用方式。

首先打开IDLE：开始 -> 所有程序 -> Python3.13 -> IDLE(Python 3.13 64-bit)

![Pasted image 20250710100626](/images/blog/python-basics/Pasted%20image%2020250710100626.png)

正常打开后如下图所示，当前页面类似于dos窗口，还是单行执行程序。

![Pasted image 20250710100743](/images/blog/python-basics/Pasted%20image%2020250710100743.png)

接下新建一个文件，在新建好的文件中就可以多行的编写Python程序了，具体操作如下所示：

![Pasted image 20250710101251](/images/blog/python-basics/Pasted%20image%2020250710101251.png)

Python程序编写完成后，可以直接运行。依次点击 `run` --> `Run Module` --> `OK` --> `输入文件名` --> `保存` 即可看到程序执行结果！

![Pasted image 20250710101914](/images/blog/python-basics/Pasted%20image%2020250710101914.png)

![Pasted image 20250710102211](/images/blog/python-basics/Pasted%20image%2020250710102211.png)

除了自带的IDLE编译器外，还要其他的编译器，如 `Visual Studio Code` 和 `Pycharm` 等

## Pycharm编辑器安装
PyCharm 凭借其强大的代码分析、调试工具和框架支持，成为 Python 开发者的首选 IDE。无论是 Web 开发、数据科学还是自动化脚本编写，PyCharm 都能显著提升开发效率和代码质量。

### 下载Pycharm安装向导
首先访Pycharm官网：  [点击访问Pycharm官方网站](https://www.jetbrains.com.cn/en-us/pycharm/download/)  进入官网后点击`dowmload`按钮进行下载(可以选择其他版本)，具体操作如下所示：

![Pasted image 20250721164008](/images/blog/python-basics/Pasted%20image%2020250721164008.png)

### 安装步骤
1）等待下载完成后从安装路径打开Pycharm的安装向导`pycharm-2025.1.3.1.exe`，弹出的界面点击`下一步`，然后进入了自定义安装路径的界面，这里我将选择默认，建议更为为除C盘以外的其他盘符，如下图所示：

![Pasted image 20250721225115](/images/blog/python-basics/Pasted%20image%2020250721225115.png)

2）在接下来的界面中切记勾选`将bin文件夹添加到PATH`，其他的选项自定义，点击`下一步`，如下图：

![Pasted image 20250721225630](/images/blog/python-basics/Pasted%20image%2020250721225630.png)

3）然后点击 `下一步` --> `安装`  --> `完成` 即可完成Pycharm的安装。双击标图打开Pycharm，点击`下一个`，如下图：

![Pasted image 20250721230634](/images/blog/python-basics/Pasted%20image%2020250721230634.png)

4）勾选同意用户协议，点击`继续`，数据共享界面选择`不发送`，如下图：

![Pasted image 20250721230752](/images/blog/python-basics/Pasted%20image%2020250721230752.png)

![Pasted image 20250721230856](/images/blog/python-basics/Pasted%20image%2020250721230856.png)

### 文件测试
1）点击新建项目，自定义项目路径，然后选择自定义环境，选择现有，系统将自动识别python路径，再点击确定，如下图：

![Pasted image 20250721231421](/images/blog/python-basics/Pasted%20image%2020250721231421.png)

2）因为安装的是Pycharm专业版，因此此处显示试用按钮，它显示试用期为30天，这里可以通过一些激活脚本进行激活，例如`ckey.run`激活网站，具体操作访问  

![Pasted image 20250721231746](/images/blog/python-basics/Pasted%20image%2020250721231746.png)

3）在左侧根目录右击选择新建python文件，在弹出的窗口输入python文件名，然后回车即可创建一个`.py`的python文件，如下图：

![Pasted image 20250721233020](/images/blog/python-basics/Pasted%20image%2020250721233020.png)
![Pasted image 20250721233533](/images/blog/python-basics/Pasted%20image%2020250721233533.png)

4）将新建好的文件双击打开，在代码编写区域写入测试代码，如下：

```python
print("Hello World!")
```

代码文件运行后的结果为：

```
Hello World!
```

![Pasted image 20250721234003](/images/blog/python-basics/Pasted%20image%2020250721234003.png)


