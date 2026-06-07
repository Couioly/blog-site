---
title: "Pyfiglet 使用教程"
date: "2026-03-05"
description: "Pyfiglet ASCII艺术字生成教程，将普通文本转换为Banner、支持多种字体样式、对齐方式与颜色输出。"
tags: ["Python", "终端"]
---

## 一、Pyfiglet 简介
---

Pyfiglet 是一个 Python 模块，用于将普通文本转换为 ASCII 艺术字（大型字母）。它是 FIGlet 程序的 Python 实现，可以生成各种风格的文本 banner。

### 主要特点

- 支持多种字体样式
- 可自定义输出宽度
- 支持左右中对齐
- 跨平台兼容

## 二、安装 Pyfiglet
---

### 1. 使用 pip 安装

```bash
pip install pyfiglet
```

### 2. 验证安装

```python
import pyfiglet
print(pyfiglet.__version__)
```

## 三、基本使用方法
---

### 1. 最简单的文本转换

```python
import pyfiglet

result = pyfiglet.figlet_format("Hello")
print(result)
```

输出:

```text
  _   _      _ _       
 | | | | ___| | | ___  
 | |_| |/ _ \ | |/ _ \ 
 |  _  |  __/ | | (_) |
 |_| |_|\___|_|_|\___/ 
```

### 2. 指定字体

```python
result = pyfiglet.figlet_format("Python", font="slant")
print(result)
```

输出:

```text
 ____        _   _                 
|  _ \ _   _| |_| |__   ___  _ __  
| |_) | | | | __| '_ \ / _ \| '_ \ 
|  __/| |_| | |_| | | | (_) | | | |
|_|    \__, |\__|_| |_|\___/|_| |_|
       |___/        
```               

## 四、高级功能
---

### 1. 使用 Figlet 类

```python
from pyfiglet import Figlet

f = Figlet(font='banner')
print(f.renderText('Advanced'))
```

输出:

```text
     #     #    #    ######  ####### 
     #     #   # #   #     # #     # 
     #     #  #   #  #     # #     # 
     #     # #     # ######  #     # 
      #   #  ####### #       #     # 
       # #   #     # #       #     # 
        #    #     # #       ####### 
```

### 2. 设置输出宽度

```python
f = Figlet(font='standard', width=100)
print(f.renderText('Wide Text'))
```

### 3. 文本对齐方式

```python
f = Figlet(font='small', justify='center')  # 可选 'left', 'center', 'right'
print(f.renderText('Centered'))
```

## 五、字体管理
---

### 1. 获取可用字体列表

```python
from pyfiglet import FigletFont

print(FigletFont.getFonts())
```

### 2. 使用自定义字体

1. 首先获取字体文件 (`.flf`)
2. 将字体文件放在` pyfiglet` 的 `fonts` 目录或指定路径
3. 使用字体:

```python
f = Figlet(font='path/to/custom.flf')
```

## 六、实用示例
---

### 1. 创建欢迎横幅

```python
def welcome_banner():
    f = Figlet(font='big', width=120)
    print(f.renderText('WELCOME'))
    print("-" * 80)
    print(" Welcome to our Python application!".center(80))
    print("-" * 80)

welcome_banner()
```

### 2. 进度指示器

```python
import time

for i in range(1, 6):
    text = f"STEP {i}"
    print(pyfiglet.figlet_format(text, font="mini"))
    time.sleep(1)
```

### 3. 彩色 ASCII 艺术字

结合 colorama 模块:

```python
from colorama import Fore, init
init()

result = pyfiglet.figlet_format("COLOR", font="slant")
print(Fore.RED + result)
```

## 七、常见问题解答
---

### 1. 字体显示不正常

- 确保终端支持 ASCII 艺术字
- 尝试不同的字体
- 检查终端字体设置

### 2. 如何调整字符间距

使用 `Figlet` 类的 `setFont()` 方法:

```python
f = Figlet()
f.setFont(font='term', kwidth=2)  # 增加字符间距
print(f.renderText('Spaced'))
```

### 3. 多行文本处理

```python
text = """Line 1
Line 2
Line 3"""

for line in text.split('\n'):
    print(pyfiglet.figlet_format(line, font="small"))
```

## 八、最佳实践

1. 对于长文本，考虑使用较简单的字体
2. 在 Web 应用中，可以将输出转换为 HTML 的 `<pre>` 标签
3. 日志系统中可以使用 ASCII banner 分隔不同部分
4. 结合进度条库创建更丰富的终端界面

## 九、总结

Pyfiglet 是一个功能强大且易于使用的 ASCII 艺术字生成工具，适用于:

- 命令行工具美化
- 日志系统装饰
- 终端应用界面
- 生成独特的文本输出

通过本教程，掌握了 Pyfiglet 的基本和高级用法，可以开始在项目中应用这些技术了。
