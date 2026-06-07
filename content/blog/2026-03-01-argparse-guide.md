---
title: "argparse 命令行参数解析工具"
date: "2026-03-01"
description: "Python argparse 标准库使用教程，掌握命令行参数解析、类型转换和自动帮助信息生成。"
tags: ["Python", "命令行"]
---

`argparse` 是 Python 标准库中用于解析命令行参数的强大工具，它可以自动处理参数解析、类型转换、生成帮助信息等。以下是使用 `argparse` 解析命令行参数的详细步骤和示例。

### 基本使用步骤

1. **导入 argparse 模块**
2. **创建解析器对象**（`ArgumentParser`）
3. **添加参数规则**（`add_argument()` 方法）
4. **解析参数**（`parse_args()` 方法）
5. **使用解析后的参数**

### 详细示例

假设我们要实现一个脚本，支持接收以下参数：

- 必选参数：`-n`（数字，如年龄）
- 可选参数：`-m`（字符串，如消息）
- 标志参数：`-v`（无值，用于开启 verbose 模式）

#### 示例代码

```python
# demo.py
import argparse

# 1. 创建解析器对象，可指定脚本描述
parser = argparse.ArgumentParser(description="这是一个argparse示例脚本，用于演示参数解析")

# 2. 添加参数规则
# 添加必选参数 -n（整数类型）
parser.add_argument('-n', '--number', type=int, required=True, help='必选数字参数（整数），例如年龄')

# 添加可选参数 -m（字符串类型，默认值为"hello"）
parser.add_argument('-m', '--message', type=str, default='hello', help='可选字符串参数（默认值：hello）')

# 添加标志参数 -v（无需值，出现则为True）
parser.add_argument('-v', '--verbose', action='store_true', help='开启详细输出模式')

# 3. 解析命令行参数
args = parser.parse_args()

# 4. 使用解析后的参数
print(f"数字参数: {args.number}（类型：{type(args.number)}）")
print(f"消息参数: {args.message}（类型：{type(args.message)}）")

if args.verbose:
    print("详细模式已开启：正在执行额外的日志输出...")
```

### 运行与测试

在终端中运行脚本，传递不同参数测试效果：

#### 1. 基本用法（传递必选参数 `-n`）

```bash
python demo.py -n 25
```

输出：

```plaintext
数字参数: 25（类型：<class 'int'>）
消息参数: hello（类型：<class 'str'>）
```

#### 2. 传递全部参数

```bash
python demo.py -n 30 -m "argparse真好用" -v
```

输出：

```plaintext
数字参数: 30（类型：<class 'int'>）
消息参数: argparse真好用（类型：<class 'str'>）
详细模式已开启：正在执行额外的日志输出...
```

#### 3. 查看自动生成的帮助信息

```bash
python demo.py -h  # 或 --help
```

输出：

```plaintext
usage: demo.py [-h] -n NUMBER [-m MESSAGE] [-v]

这是一个argparse示例脚本，用于演示参数解析

options:
  -h, --help            show this help message and exit
  -n NUMBER, --number NUMBER
                        必选数字参数（整数），例如年龄
  -m MESSAGE, --message MESSAGE
                        可选字符串参数（默认值：hello）
  -v, --verbose         开启详细输出模式
```

#### 4. 错误情况（缺少必选参数）

```bash
python demo.py -m "测试"
```

输出（自动提示错误）：

```plaintext
error: the following arguments are required: -n/--number
```

### 核心参数说明（`add_argument()` 方法）

|参数|作用说明|
|---|---|
|`name`|参数名，如 `-n` 或 `--number`（短选项 / 长选项，推荐同时提供）|
|`type`|参数类型（如 `int`、`str`、`float`），自动转换输入值|
|`required`|是否必选（`True`/`False`，默认 `False`）|
|`default`|可选参数的默认值（`required=False` 时有效）|
|`help`|参数描述（`-h` 时显示）|
|`action`|特殊动作，如 `store_true` 表示参数出现时赋值为 `True`（用于标志参数）|
|`choices`|限制参数可选值（如 `choices=[1,2,3]`）|

### 总结

- `argparse` 简化了命令行参数的解析逻辑，无需手动处理 `sys.argv`
- 支持自动类型转换、参数校验和帮助信息生成
- 适合开发命令行工具、脚本等需要动态配置的场景
