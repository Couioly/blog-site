---
title: "Python Logging 日志打印库详解"
date: "2026-02-15"
description: "Python logging 标准库完整教程，包含日志分级、Handler配置、Formatter格式化、文件切割与配置文件管理。"
tags: ["Python", "日志"]
---

你想了解 Python 的 logging 日志库，它是 Python 内置的标准日志处理库（无需额外安装），相比简单的`print()`函数，提供了更灵活、更强大的日志分级、输出控制、持久化存储等功能，是项目开发（尤其是中大型项目）中日志记录的首选工具。

## 一、logging 库的核心优势（对比 print）

1. **日志分级管理**：可按严重程度划分日志级别，按需输出不同重要性的日志信息，避免无关日志干扰调试；
2. **灵活输出目标**：日志可同时输出到控制台、文件、数据库等多个目标，支持按文件大小 / 时间切割日志文件；
3. **丰富的日志格式**：可自定义日志包含的内容（如时间、模块、行号、日志级别等），便于问题排查；
4. **模块化配置**：支持通过代码、配置文件等方式配置日志，便于在不同环境（开发 / 测试 / 生产）中切换日志策略；
5. **线程安全**：原生支持多线程环境下的日志记录，无需额外处理线程同步问题。

## 二、logging 库的核心组件

logging 库通过四大核心组件协同工作，构成完整的日志处理流程：

1. **Logger（日志器）**：入口组件，负责创建日志记录对象，应用程序通过 Logger 实例调用日志方法（如`logger.debug()`）；
2. **Handler（处理器）**：负责将日志分发到不同目标，常见 Handler 包括`StreamHandler`（输出到控制台）、`FileHandler`（输出到文件）、`RotatingFileHandler`（按大小切割文件）等；
3. **Formatter（格式化器）**：负责定义日志的输出格式，控制日志信息的展示样式；
4. **Filter（过滤器）**：可选组件，用于对日志进行过滤，只保留符合条件的日志（如只记录指定模块的日志）。

## 三、日志级别（从低到高）

logging 库定义了 5 个标准日志级别，可通过级别控制日志的输出范围，级别越高，日志越重要：

|级别名称|对应方法|描述|常用场景|
|---|---|---|---|
|DEBUG|`logger.debug()`|调试信息，用于开发阶段排查问题|开发环境调试代码、打印变量|
|INFO|`logger.info()`|普通信息，记录程序正常运行状态|记录程序启动、流程完成等|
|WARNING|`logger.warning()`|警告信息，程序存在潜在风险但不影响运行|配置缺失、资源不足等|
|ERROR|`logger.error()`|错误信息，程序部分功能异常|接口调用失败、数据处理出错|
|CRITICAL|`logger.critical()`|严重错误，程序无法继续运行|数据库连接失败、核心模块崩溃|

**默认级别**：logging 库默认日志级别为`WARNING`，即只输出`WARNING`及以上级别的日志（WARNING、ERROR、CRITICAL）。

## 四、基本使用示例

### 1. 简单使用（默认配置，输出到控制台）

```python
import logging

# 直接使用根日志器（简单场景快速上手）
logging.debug("这是DEBUG级别的调试日志（默认不输出）")
logging.info("这是INFO级别的普通日志（默认不输出）")
logging.warning("这是WARNING级别的警告日志（默认输出）")
logging.error("这是ERROR级别的错误日志（默认输出）")
logging.critical("这是CRITICAL级别的严重错误日志（默认输出）")
```

### 2. 自定义配置（输出到控制台 + 文件，自定义格式）

```python
import logging

# 1. 创建日志器（设置全局日志级别，低于该级别的日志会被过滤）
logger = logging.getLogger("my_project_logger")
logger.setLevel(logging.DEBUG)  # 全局级别设为DEBUG，确保所有级别日志都能被处理

# 2. 创建处理器（控制台处理器+文件处理器）
# 控制台处理器
stream_handler = logging.StreamHandler()
# 文件处理器（将日志写入文件，追加模式）
file_handler = logging.FileHandler("project_log.log", mode="a", encoding="utf-8")

# 3. 创建格式化器（定义日志输出格式）
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s"
)
# 格式化器说明：
# %(asctime)s：日志记录时间
# %(name)s：日志器名称
# %(levelname)s：日志级别名称
# %(filename)s：日志所在文件名
# %(lineno)d：日志所在行号
# %(message)s：日志核心内容

# 4. 为处理器绑定格式化器
stream_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# 5. 为日志器添加处理器
logger.addHandler(stream_handler)
logger.addHandler(file_handler)

# 6. 打印不同级别的日志
if __name__ == "__main__":
    logger.debug("调试：用户进入登录页面")
    logger.info("信息：用户登录成功，用户名：test_user")
    logger.warning("警告：用户密码强度过低")
    logger.error("错误：用户提交订单时，数据库连接超时")
    logger.critical("严重：核心服务崩溃，无法提供服务")
```

### 3. 高级使用：按文件大小切割日志

当日志文件过大时，可使用`RotatingFileHandler`按大小切割，避免单个日志文件过大难以管理：

```python
import logging
from logging.handlers import RotatingFileHandler

# 创建日志器
logger = logging.getLogger("size_rotating_logger")
logger.setLevel(logging.DEBUG)

# 创建按大小切割的文件处理器（单个文件最大10MB，最多保留5个备份文件）
rotating_handler = RotatingFileHandler(
    "rotating_project.log",
    mode="a",
    encoding="utf-8",
    maxBytes=10 * 1024 * 1024,  # 10MB
    backupCount=5  # 保留5个备份（rotating_project.log.1 ~ rotating_project.log.5）
)

# 配置格式化器
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
rotating_handler.setFormatter(formatter)

# 添加处理器
logger.addHandler(rotating_handler)

# 测试日志输出
for i in range(1000):
    logger.info(f"这是第{i+1}条测试日志，用于验证日志切割功能")
```

### 4. 高级使用：按时间切割日志

使用`TimedRotatingFileHandler`可按时间周期（如按天、按小时）切割日志，便于按时间维度归档日志：

```python
import logging
from logging.handlers import TimedRotatingFileHandler

# 创建日志器
logger = logging.getLogger("time_rotating_logger")
logger.setLevel(logging.DEBUG)

# 创建按时间切割的文件处理器（按天切割，保留7天备份，后缀为年月日）
timed_handler = TimedRotatingFileHandler(
    "timed_project.log",
    when="D",  # 切割单位：S(秒)、M(分)、H(小时)、D(天)、W0-W6(星期)
    interval=1,  # 每隔1个单位切割一次
    backupCount=7,  # 保留7天备份
    encoding="utf-8",
    delay=False
)

# 配置格式化器
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
timed_handler.setFormatter(formatter)

# 添加处理器
logger.addHandler(timed_handler)

# 测试日志输出
logger.info("按天切割的日志示例，每天生成一个新的日志文件")
```

## 五、配置方式

logging 库支持多种配置方式，满足不同项目场景的需求：

### 1. 代码配置（如上示例）

通过代码直接创建 Logger、Handler、Formatter，灵活度高，适合简单项目或需要动态调整配置的场景。

### 2. 配置文件配置（推荐中大型项目）

通过`logging.config.fileConfig()`加载配置文件（ini 格式），便于统一管理和环境切换：

#### 步骤 1：创建日志配置文件 `logging_config.ini`

```ini
[loggers]
keys=root,my_project_logger

[handlers]
keys=stream_handler,file_handler

[formatters]
keys=default_formatter

[logger_root]
level=WARNING
handlers=stream_handler

[logger_my_project_logger]
level=DEBUG
handlers=stream_handler,file_handler
qualname=my_project_logger
propagate=0

[handler_stream_handler]
class=StreamHandler
level=DEBUG
formatter=default_formatter
args=(sys.stdout,)

[handler_file_handler]
class=FileHandler
level=DEBUG
formatter=default_formatter
args=("project_log.ini.log", "a", "utf-8")

[formatter_default_formatter]
format=%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s
datefmt=%Y-%m-%d %H:%M:%S
```

#### 步骤 2：加载配置文件并使用

```python
import logging
import logging.config

# 加载ini配置文件
logging.config.fileConfig("logging_config.ini")

# 获取日志器
logger = logging.getLogger("my_project_logger")

# 打印日志
logger.debug("通过配置文件加载的调试日志")
logger.info("通过配置文件加载的普通日志")
```

### 3. 字典配置（现代 Python 项目推荐）

通过`logging.config.dictConfig()`加载字典格式配置，支持更复杂的配置逻辑（如自定义 Handler）：

```python
import logging
import logging.config

# 日志配置字典
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "default",
            "stream": "ext://sys.stdout"
        },
        "file": {
            "class": "logging.FileHandler",
            "level": "INFO",
            "formatter": "default",
            "filename": "project_log.dict.log",
            "encoding": "utf-8"
        }
    },
    "loggers": {
        "my_project_logger": {
            "level": "DEBUG",
            "handlers": ["console", "file"],
            "propagate": False
        }
    }
}

# 加载字典配置
logging.config.dictConfig(LOGGING_CONFIG)

# 获取日志器并使用
logger = logging.getLogger("my_project_logger")
logger.info("通过字典配置加载的日志信息")
```

## 六、总结

1. **logging 是 Python 内置标准库**，无需额外安装，是项目日志处理的首选工具，优于`print()`函数；
2. **核心要素**：四大组件（Logger/Handler/Formatter/Filter）、五级日志级别（DEBUG~CRITICAL），支撑灵活的日志管理；
3. **核心功能**：日志分级输出、多目标持久化、自定义格式、日志切割，满足开发 / 测试 / 生产环境的不同需求；
4. **配置方式**：代码配置（简单场景）、ini 配置文件（传统项目）、字典配置（现代项目），可按需选择；
5. **适用场景**：中大型 Python 项目开发、后端服务调试、生产环境问题排查、数据监控等，是 Python 工程师必备技能。
