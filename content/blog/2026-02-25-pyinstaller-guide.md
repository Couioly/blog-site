---
title: "PyInstaller 打包教程"
date: "2026-02-25"
description: "PyInstaller 完整教程，将Python脚本打包为独立exe，涵盖参数详解、spec文件配置、常见问题与解决方案。"
tags: ["Python", "打包", "工具"]
---

PyInstaller 是一个非常实用的 Python 打包工具，能够将 Python 脚本打包成独立的可执行文件，无需用户安装 Python 解释器即可运行。本教程将详细介绍 PyInstaller 的使用方法和各种参数。

## 一、安装 PyInstaller
---

首先需要安装 PyInstaller 包，使用 `pip` 命令即可：

```bash
pip install pyinstaller
```

验证安装是否成功：

```bash
pyinstaller --version
```

如果成功安装，会显示当前 PyInstaller 的版本号。

## 二、基本使用方法
---

最基本的打包命令非常简单，在命令行中进入脚本所在目录，执行：

```bash
# 此处的your_script.py替换为要打包的脚本文件
pyinstaller your_script.py
```

这个命令会在当前目录生成两个文件夹：

- `dist`：包含可执行文件和相关依赖
- `build`：包含打包过程中的临时文件

同时会生成一个 `.spec` 文件，用于高级打包配置。

## 三、常用参数详解
---

### 1. 输出文件类型控制

#### `-F`, `--onefile`

将所有内容打包成单个可执行文件。示例如下：

```bash
pyinstaller -F your_script.py
```

```bash
pyinstaller --onefile your_script.py
```

  上述两条指令作用相同。执行后，`dist` 目录下只会生成一个可执行文件。

#### `-D`, `--onedir`

**默认参数**，将程序打包成一个目录（包含可执行文件和相关依赖文件）。示例如下：

```bash
pyinstaller -D your_script.py
```

```bash
pyinstaller --onedir your_script.py
```

 上述两条指令作用相同。
 
### 2. 窗口设置

#### `-w`, `--windowed`, `--noconsole`

打包成窗口程序，不显示控制台窗口（适用于 GUI 程序）。示例如下（Tkinter 程序）：

```bash
pyinstaller -w -F your_gui_app.py
```

#### `-c`, `--console`, `--nowindowed`

**默认参数**，显示控制台窗口（适用于命令行程序）。示例如下：

```bash
pyinstaller -c -F your_cli_tool.py
```

### 3. 输出文件信息设置

#### `-n NAME`, `--name=NAME`

指定输出文件的名称。示例：

```bash
pyinstaller -F -n YourApplication your_script.py
```

这样生成的可执行文件名称为 `YourApplication`（Windows 下为 `YourApplication.exe`）

#### `-i ICON`, `--icon=ICON`

指定程序图标。

**示例（Windows）：**

```bash
pyinstaller -F -i app_icon.ico your_script.py
```

**示例（MacOS）：**

```bash
pyinstaller -F -i app_icon.icns your_script.py
```

### 4. 路径和导入设置

#### `--paths=DIRS`

添加 Python 模块的搜索路径。示例如下：

```bash
pyinstaller -F --paths=./libs --paths=./modules your_script.py
```

#### `--hidden-import=MODULENAME`

指定隐藏的导入模块（当 PyInstaller 自动检测不到某些依赖时使用）。示例如下：

```bash
pyinstaller -F --hidden-import=requests --hidden-import=beautifulsoup4 your_script.py
```

#### `--collect-data=MODULE`, `--add-data=SRC;DST` (Windows), `--add-data=SRC:DST` (Linux/MacOS)

添加非 Python 文件（如数据文件、配置文件等）。**参数详情**：

- `--collect-data=MODULE`：这个选项用于收集指定模块的所有数据文件 。`MODULE` 代表你想要收集数据文件的模块名称。
- `--add-data=SRC:DST`（在 Windows 系统上）和 `--add-data=SRC:DST`（在 Linux/MacOS 系统上）：这是用于添加自定义非 Python 文件的语法。`SRC` 表示源文件或源目录路径，`DST` 表示在打包后的可执行文件中目标文件或目录的路径。

**Windows 示例：**

```bash
pyinstaller -F --add-data="data/*;data" your_script.py
```

- `-F` 选项表示生成单个可执行文件。
- `--add-data="data/*;data"` 表示将 `data` 目录下的所有文件（`data/*` 中的 `*` 是通配符，代表所有文件）添加到打包后的可执行文件中的 `data` 目录下。
- `your_script.py` 是你要打包的 Python 脚本文件名。

**Linux/MacOS 示例：**

```bash
pyinstaller -F --add-data="data/*:data" your_script.py
```

-  `-F` 是生成单个可执行文件。
- `--add-data="data/*:data"` 这里用 `:` 分隔，含义和 Windows 示例类似，即将 `data` 目录下的所有文件添加到打包后的可执行文件中的 `data` 目录下，`your_script.py` 是待打包的 Python 脚本 。

#### `--collect-binaries=MODULE`, `--add-binary=SRC:DST`

添加二进制文件。**语法参数说明**：

- `--collect-binaries=MODULE`：让 `PyInstaller` 收集指定 `MODULE`（模块）相关的二进制文件，会自动查找模块关联的二进制依赖并打包 。
- `--add-binary=SRC:DST`：手动指定要添加的二进制文件，`SRC` 是源路径（可含通配符，像示例里 `libs/*.dll` 匹配 `libs` 目录下所有 DLL 文件 ），`DST` 是打包后这些文件存放的目录（示例中是 `libs` ，即保持相对路径结构 ）。

**Windows 示例：**

```bash
pyinstaller -F --add-binary="libs/*.dll;libs" your_script.py
```

- `-F`：生成单个可执行文件，把所有依赖打包进一个 EXE 里。
- `--add-binary="libs/*.dll;libs"`：把 `libs` 目录下所有 DLL 文件，按 `libs` 相对路径结构，添加到打包内容里，程序运行时能找到这些二进制依赖。
- `my_script.py`：要打包的 Python 脚本入口文件。

### 5. 其他常用参数

#### `--clean`

在构建之前清理临时文件。示例如下：

```bash
pyinstaller --clean -F your_script.py
```

#### `--debug`

生成调试版本，包含调试信息。示例如下：

```bash
pyinstaller --debug -F your_script.py
```

#### `--version-file=FILE`

添加版本信息文件。示例如下：

```bash
pyinstaller -F --version-file=version_info.txt your_script.py
```

#### `--upx-dir=DIR`

指定 UPX 压缩工具的目录（用于压缩可执行文件）。示例如下：

```bash
pyinstaller -F --upx-dir=./upx your_script.py
```

#### `--noupx`

禁用 UPX 压缩。示例如下：

```bash
pyinstaller -F --noupx your_script.py
```

#### `-y`, `--noconfirm`

替换输出目录而不询问确认。示例如下：

```bash
pyinstaller -F -y your_script.py
```

## 四、使用 spec 文件进行高级打包

对于复杂的打包需求，建议使用 spec 文件进行配置。生成 spec 文件的命令：

```bash
pyi-makespec my_script.py
```

这会生成一个 `my_script.spec` 文件，内容大致如下：

```python
# my_script.spec
a = Analysis(['my_script.py'],
             pathex=['/path/to/your/script'],
             binaries=[],
             datas=[],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='my_script',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None,
          console=True)
```

  修改 spec 文件后，使用以下命令进行打包：

```bash
pyinstaller my_script.spec
```

### spec 文件高级配置示例

添加数据文件：

```python
datas=[('data/*.txt', 'data'), ('images/*.png', 'images')],
```

  添加隐藏导入：

```python
hiddenimports=['module1', 'module2.submodule'],
```

  设置图标和其他属性：

```python
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='MyApplication',
          debug=False,
          icon='app_icon.ico',  # 设置图标
          console=False,  # 不显示控制台
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None)
```

## 五、常见问题及解决方法
---

### 1. 打包后运行提示缺少模块

解决方法：使用 `--hidden-import` 参数手动指定缺少的模块

```bash
pyinstaller -F --hidden-import=missing_module my_script.py
```

### 2. 数据文件无法访问

解决方法：

1. 使用 `--add-data` 参数添加数据文件
2. 在代码中使用正确的路径访问数据文件，推荐使用以下方法获取数据文件路径：

```python
import sys
import os

def get_resource_path(relative_path):
    """获取资源文件的绝对路径"""
    if getattr(sys, 'frozen', False):
        # 打包后的环境
        base_path = sys._MEIPASS
    else:
        # 开发环境
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# 使用示例
data_file_path = get_resource_path('data/config.ini')
```

### 3. 打包后的文件体积过大

解决方法：

1. 使用 UPX 压缩（需要先安装 UPX）

```bash
pyinstaller -F --upx-dir=./upx my_script.py
```

2. 排除不必要的模块

```bash
pyinstaller -F --exclude-module=matplotlib --exclude-module=numpy my_script.py
```

3. 使用虚拟环境，只安装必要的依赖

### 4. 打包后程序运行闪退

解决方法：

1. 不使用 `-w` 参数，显示控制台窗口，查看错误信息

```bash
pyinstaller -F my_script.py  # 不添加 -w 参数
```

2. 检查是否有相对路径问题，确保所有文件路径都使用绝对路径或上述的资源路径获取方法

## 六、完整示例
---

### 示例 1：打包一个简单的命令行程序

```bash
# 打包成单个文件，显示控制台，指定名称为 "calculator"
pyinstaller -F -n calculator calculator.py
```

### 示例 2：打包一个 Tkinter GUI 程序

```bash
# 打包成单个文件，不显示控制台，指定图标，添加数据文件
pyinstaller -F -w -i app_icon.ico --add-data="images/*;images" my_gui_app.py
```

### 示例 3：使用 spec 文件打包复杂应用

1. 生成 spec 文件：

```bash
pyi-makespec --name "MyApp" --icon "app_icon.ico" --windowed my_app.py
```

2. 编辑 spec 文件，添加数据和隐藏导入：

```python
a = Analysis(['my_app.py'],
             pathex=['/path/to/app'],
             binaries=[],
             datas=[('assets/*', 'assets'), ('config/*.json', 'config')],
             hiddenimports=['pandas', 'requests'],
             # 其他默认配置...
            )
# 其他配置...
exe = EXE(pyz,
          # 其他配置...
          console=False,
          icon='app_icon.ico'
         )
```

3. 使用 spec 文件打包：

```bash
pyinstaller MyApp.spec
```
