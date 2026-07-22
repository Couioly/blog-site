---
title: Python 虚拟环境新建不匹配
date: 2026-05-13
description: Windows 多 Python 环境冲突导致 venv 创建失败或生成 bin 而非 Scripts 的排查与解决方案
tags:
  - python
  - basics
  - cli
---

## Windows Python 环境异常排查记录

### 问题现象

在 Windows 环境下执行：`python -m venv EducSite` 后：

- 没有任何报错
- 但虚拟环境文件夹未生成
- 此前还出现：
    - `.venv/bin`
    - 而非 Windows 正常的 `.venv/Scripts`

---

### 第一阶段问题：venv 生成 bin 而非 Scripts

#### 现象

创建虚拟环境后目录结构为：

```
.venv/ 
	├── bin/ 
	├── lib/
```

而不是：

```
.venv/ 
	├── Scripts/ 
	├── Lib/
```

#### 原因

执行的 `python` 实际来自：`D:\ProgramEnviron\MSYS2\mingw64\bin\python.exe` 即：

- MSYS2 Python
- 类 Unix 环境 Python

因此生成的是 Linux 风格虚拟环境。

#### 排查命令

```
python -c "import platform,sys;print(platform.system());print(sys.executable)"
```

输出：

```
WindowsD:\ProgramEnviron\MSYS2\mingw64\bin\python.exe
```

#### 解决方法

删除或下移系统环境变量(**注意区分系统环境和用户环境的覆盖性**)中的：

```
D:\ProgramEnviron\MSYS2\mingw64\bin
```

重启终端后重新检查：

```
where python
```

---

### 第二阶段问题：venv 创建无反应

#### 现象

执行：`python -m venv EducSite` 后：

- 无报错
- 无输出
- 无虚拟环境生成

#### 排查

执行：

```
where python
```

输出：

```
C:\Users\31245\AppData\Local\Microsoft\WindowsApps\python.exe
D:\ProgramEnviron\Python\Python311\python.exe
D:\ProgramEnviron\Python\Python310\python.exe
```

发现第一优先级命中了：

```
WindowsApps\python.exe
```

---

### 根本原因

WindowsApps 中的：

```
python.exe
python3.exe
```

并不是真实 Python。它们是：

- Microsoft Store 应用执行别名
- 0KB 占位启动器

作用：

- 用户未安装 Python 时
- 自动跳转微软商店

因此：

```
python
```

实际上没有调用真正的 Python 解释器。

---

### 解决方案

#### 方法1：关闭应用执行别名（推荐）

路径：

```
设置→ 应用→ 高级应用设置→ 应用执行别名
```

关闭：

```
python.exe
python3.exe
```

---

#### 方法2：直接指定 Python 路径

```
D:\ProgramEnviron\Python\Python311\python.exe -m venv EducSite
```

---

### 修复验证

重新打开 CMD：

```
where python
```

正确结果应为：

```
D:\ProgramEnviron\Python\Python311\python.exe
```

随后执行：

```
python -m venv EducSite
```

即可正常生成：

```
EducSite/ 
	├── Scripts/ 
	├── Lib/ 
	├── Include/
```

---

### 最终结论

本次问题由两个环境冲突共同导致：

1. MSYS2 Python 抢占 PATH
2. WindowsApps 的假 python.exe 再次抢占 PATH

导致：

- 虚拟环境结构异常
- venv 创建失败
- python 命令实际未调用真实解释器

属于典型 Windows 多 Python 环境冲突问题。
