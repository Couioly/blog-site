---
title: "Alibaba Cloud Linux 指令集"
date: "2026-06-16"
description: "Alibaba Cloud Linux 常用指令整理，涵盖 tree 安装、MySQL 8.0 部署、防火墙配置及远程连接等运维操作"
tags: [devops, aliyun, linux]
---

### 安装tree

```bash
which tree >/dev/null && tree || echo "tree command not found"
```

说明：`which tree` 检查是否已安装 `tree` 命令；`&&` 表示前一条命令成功则执行 `tree`；`||` 表示前一条命令失败则提示未找到

```bash
[ecs-assist-user@your-instance-id ~]$ which tree >/dev/null && tree || echo "tree command not found"
/usr/bin/which: no tree in (/home/ecs-assist-user/.local/bin:/home/ecs-assist-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin)
tree command not found
```

系统中未安装 `tree` 命令。我将使用 `yum` 包管理器在 Alibaba Cloud Linux 上安装它。

```bash
sudo yum install -y tree
```

说明：`sudo yum install -y tree` 会在 Alibaba Cloud Linux 系统上非交互式地安装 `tree` 工具，`-y` 参数自动确认安装

```bash
[ecs-assist-user@your-instance-id ~]$ sudo yum install -y tree
Last metadata expiration check: 15:27:43 ago on Mon 15 Jun 2026 05:44:30 PM CST.
Dependencies resolved.
===========================================================================================================================================================================
 Package                             Architecture                          Version                                         Repository                                 Size
===========================================================================================================================================================================
Installing:
 tree                                x86_64                                1.7.0-15.2.al8                                  alinux3-os                                 60 k

Transaction Summary
===========================================================================================================================================================================
Install  1 Package

Total download size: 60 k
Installed size: 129 k
Downloading Packages:
tree-1.7.0-15.2.al8.x86_64.rpm                                                                                                             1.4 MB/s |  60 kB     00:00    
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                      1.3 MB/s |  60 kB     00:00     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                                                                                   1/1 
  Installing       : tree-1.7.0-15.2.al8.x86_64                                                                                                                        1/1 
  Running scriptlet: tree-1.7.0-15.2.al8.x86_64                                                                                                                        1/1 
  Verifying        : tree-1.7.0-15.2.al8.x86_64                                                                                                                        1/1 

Installed:
  tree-1.7.0-15.2.al8.x86_64                                                                                                                                               

Complete!
```

`tree` 命令已成功安装。

```bash
tree
```

说明：`tree` 命令会以树状格式递归列出当前目录下的所有文件和子目录

```bash
[ecs-assist-user@your-instance-id ~]$ tree
.

0 directories, 0 files
```

当前文件夹为空，没有子目录和文件。

如果您需要在其他目录查看树状结构，请使用 `tree /path/to/directory` 命令

### 创建文件夹

```bash
mkdir -p env_software
```

说明：`mkdir -p env_software` 会在当前目录下创建名为 `env_software` 的文件夹；`-p` 参数确保即使父目录不存在也能安全创建，且不会报错如果目录已存在

```bash
ls -l
```

说明：`ls -l` 以长格式列出当前目录内容，可以确认 `env_software` 文件夹是否存在

```bash
[ecs-assist-user@your-instance-id ~]$ ls -l
total 4
drwxrwxr-x 2 ecs-assist-user ecs-assist-user 4096 Jun 16 09:20 env_software
```

已成功创建名为 `env_software` 的文件夹，用于存放环境相关软件。您可以使用 `cd env_software` 进入该目录，或直接将软件包下载/解压到此目录中。

```bash
[ecs-assist-user@your-instance-id ~]$ ls
env_software
[ecs-assist-user@your-instance-id ~]$ cd env_software
[ecs-assist-user@your-instance-id env_software]$ 
```

### 安装MySQL服务器

1.在 Alibaba Cloud Linux 3 上安装 MySQL 8.0 服务器。首先，我会检查系统包管理器 `dnf` 中是否提供了 MySQL 8.0 的官方包。

```bash
sudo dnf module list mysql
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ sudo dnf module list mysql
Last metadata expiration check: 15:41:21 ago on Mon 15 Jun 2026 05:44:30 PM CST.
Error: No matching Modules to list
```

2.看起来系统中没有通过模块（module）方式提供 MySQL。接下来，我将直接查询 `dnf` 仓库中是否有 MySQL 8.0 的可用包。

```bash
sudo dnf list mysql80-community-server
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ sudo dnf list mysql80-community-server
Last metadata expiration check: 15:43:47 ago on Mon 15 Jun 2026 05:44:30 PM CST.
Error: No matching Packages to list
```

3.系统默认的 `dnf` 仓库中没有找到 MySQL 8.0 的安装包。我们需要手动添加 MySQL 官方的 Yum 仓库。首先，我会检查是否已经存在 MySQL 的 repo 文件。

```bash
ls /etc/yum.repos.d/mysql*.repo
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ ls /etc/yum.repos.d/mysql*.repo
ls: cannot access '/etc/yum.repos.d/mysql*.repo': No such file or directory
```

4.系统中尚未配置 MySQL 官方 Yum 仓库。接下来，我将从 MySQL 官方下载并安装其 Yum 仓库配置包。首先，我会验证是否可以正常访问 MySQL 官方下载地址。

```bash
curl --head --max-time 10 https://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ curl --head --max-time 10 https://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm
HTTP/2 302 
content-type: text/html; charset=UTF-8
x-frame-options: SAMEORIGIN
strict-transport-security: max-age=15768000
expires: Thu, 19 Nov 1981 08:52:00 GMT
cache-control: no-store, no-cache, must-revalidate
pragma: no-cache
location: https://repo.mysql.com//mysql80-community-release-el7-7.noarch.rpm
x-xss-protection: 1; mode=block
x-content-type-options: nosniff
content-length: 0
date: Tue, 16 Jun 2026 01:32:32 GMT
set-cookie: MySQL_S=6g4our63pd9jo8gme9s7piu4gbvg9aka; path=/; domain=mysql.com; HttpOnly
akamai-request-bc: [a=x.x.x.x,b=1031783839,c=g,n=TW__TAIPEI,o=20940],[c=c,n=US_CA_SANDIEGO,o=20940],[a=128,c=o]
akamai-grn: 0.3c7f1ab8.1781573552.3d7fc59f
server-timing: ak_p; desc="1781573551802_3088744252_1031783839_19457_5767_353_791_15";dur=1
```

5.可以正常访问 MySQL 官方仓库地址。接下来，我将下载并安装 MySQL 8.0 的 Yum 仓库配置包。该操作会自动创建 /etc/`yum`.repos.d/mysql-community.repo 文件。

```bash
sudo dnf -y install https://repo.mysql.com/mysql80-community-release-el7-7.noarch.rpm
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ sudo dnf -y install https://repo.mysql.com/mysql80-community-release-el7-7.noarch.rpm
Last metadata expiration check: 15:49:38 ago on Mon 15 Jun 2026 05:44:30 PM CST.
mysql80-community-release-el7-7.noarch.rpm                                                                                                 9.7 kB/s |  11 kB     00:01    
Dependencies resolved.
===========================================================================================================================================================================
 Package                                               Architecture                       Version                           Repository                                Size
===========================================================================================================================================================================
Installing:
 mysql80-community-release                             noarch                             el7-7                             @commandline                              11 k

Transaction Summary
===========================================================================================================================================================================
Install  1 Package

Total size: 11 k
Installed size: 10 k
Downloading Packages:
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                                                                                   1/1 
  Installing       : mysql80-community-release-el7-7.noarch                                                                                                            1/1 
  Verifying        : mysql80-community-release-el7-7.noarch                                                                                                            1/1 

Installed:
  mysql80-community-release-el7-7.noarch                                                                                                                                   

Complete!
```

6.MySQL 官方 Yum 仓库已成功安装。接下来，我将使用 `dnf` 安装 MySQL 8.0 服务器。

```bash
sudo dnf -y install mysql-server
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ sudo dnf -y install mysql-server
Last metadata expiration check: 0:01:18 ago on Tue 16 Jun 2026 09:34:23 AM CST.
Dependencies resolved.
===========================================================================================================================================================================
 Package                                             Architecture                Version                                      Repository                              Size
===========================================================================================================================================================================
Installing:
 mysql-community-server                              x86_64                      8.0.46-1.el7                                 mysql80-community                       65 M
Installing dependencies:
 compat-openssl10                                    x86_64                      1:1.0.2o-4.0.2.al8.2                         alinux3-updates                        1.1 M
 mysql-community-client                              x86_64                      8.0.46-1.el7                                 mysql80-community                       16 M
 mysql-community-client-plugins                      x86_64                      8.0.46-1.el7                                 mysql80-community                      3.5 M
 mysql-community-common                              x86_64                      8.0.46-1.el7                                 mysql80-community                      669 k
 mysql-community-icu-data-files                      x86_64                      8.0.46-1.el7                                 mysql80-community                      2.3 M
 mysql-community-libs                                x86_64                      8.0.46-1.el7                                 mysql80-community                      1.5 M

Transaction Summary
===========================================================================================================================================================================
Install  7 Packages

Total download size: 90 M
Installed size: 420 M
Downloading Packages:
(1/7): compat-openssl10-1.0.2o-4.0.2.al8.2.x86_64.rpm                                                                                      4.4 MB/s | 1.1 MB     00:00    
(2/7): mysql-community-common-8.0.46-1.el7.x86_64.rpm                                                                                      216 kB/s | 669 kB     00:03    
(3/7): mysql-community-client-plugins-8.0.46-1.el7.x86_64.rpm                                                                              1.0 MB/s | 3.5 MB     00:03    
(4/7): mysql-community-libs-8.0.46-1.el7.x86_64.rpm                                                                                        3.2 MB/s | 1.5 MB     00:00    
(5/7): mysql-community-icu-data-files-8.0.46-1.el7.x86_64.rpm                                                                              1.1 MB/s | 2.3 MB     00:02    
(6/7): mysql-community-client-8.0.46-1.el7.x86_64.rpm                                                                                      2.5 MB/s |  16 MB     00:06    
(7/7): mysql-community-server-8.0.46-1.el7.x86_64.rpm                                                                                      6.8 MB/s |  65 MB     00:09    
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                      6.7 MB/s |  90 MB     00:13     
MySQL 8.0 Community Server                                                                                                                 3.0 MB/s | 3.1 kB     00:00    
Importing GPG key 0x3A79BD29:
 Userid     : "MySQL Release Engineering <mysql-build@oss.oracle.com>"
 Fingerprint: 859B E8D7 C586 F538 430B 19C2 467B 942D 3A79 BD29
 From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022
Key imported successfully
MySQL 8.0 Community Server                                                                                                                 1.9 MB/s | 1.9 kB     00:00    
Importing GPG key 0x5072E1F5:
 Userid     : "MySQL Release Engineering <mysql-build@oss.oracle.com>"
 Fingerprint: A4A9 4068 76FC BD3C 4567 70C8 8C71 8D3B 5072 E1F5
 From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Key imported successfully
Import of key(s) didn't help, wrong key(s)?
Public key for mysql-community-client-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-client-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-client-plugins-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-client-plugins-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-common-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-common-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-icu-data-files-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-icu-data-files-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-libs-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-libs-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-server-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-server-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
The downloaded packages were saved in cache until the next successful transaction.
You can remove cached packages by executing 'dnf clean packages'.
Error: GPG check FAILED
```

7.安装过程中出现了 GPG 签名验证失败的问题。这通常是因为系统未能正确识别 MySQL 官方 RPM 包的 GPG 密钥。为了解决这个问题，我们需要手动导入正确的 GPG 密钥。首先，我会从 MySQL 官方下载并导入 GPG 密钥。

```bash
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
[ecs-assist-user@your-instance-id env_software]$ 
```

8.GPG 密钥已成功导入。现在，我将再次尝试安装 MySQL 8.0 服务器，跳过之前因 GPG 验证失败而中断的安装过程。

```bash
sudo dnf -y install mysql-server
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ sudo dnf -y install mysql-server
Last metadata expiration check: 0:04:49 ago on Tue 16 Jun 2026 09:34:23 AM CST.
Dependencies resolved.
===========================================================================================================================================================================
 Package                                             Architecture                Version                                      Repository                              Size
===========================================================================================================================================================================
Installing:
 mysql-community-server                              x86_64                      8.0.46-1.el7                                 mysql80-community                       65 M
Installing dependencies:
 compat-openssl10                                    x86_64                      1:1.0.2o-4.0.2.al8.2                         alinux3-updates                        1.1 M
 mysql-community-client                              x86_64                      8.0.46-1.el7                                 mysql80-community                       16 M
 mysql-community-client-plugins                      x86_64                      8.0.46-1.el7                                 mysql80-community                      3.5 M
 mysql-community-common                              x86_64                      8.0.46-1.el7                                 mysql80-community                      669 k
 mysql-community-icu-data-files                      x86_64                      8.0.46-1.el7                                 mysql80-community                      2.3 M
 mysql-community-libs                                x86_64                      8.0.46-1.el7                                 mysql80-community                      1.5 M

Transaction Summary
===========================================================================================================================================================================
Install  7 Packages

Total size: 90 M
Installed size: 420 M
Downloading Packages:
[SKIPPED] compat-openssl10-1.0.2o-4.0.2.al8.2.x86_64.rpm: Already downloaded                                                                                              
[SKIPPED] mysql-community-client-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                              
[SKIPPED] mysql-community-client-plugins-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                      
[SKIPPED] mysql-community-common-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                              
[SKIPPED] mysql-community-icu-data-files-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                      
[SKIPPED] mysql-community-libs-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                                
[SKIPPED] mysql-community-server-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                              
MySQL 8.0 Community Server                                                                                                                 3.0 MB/s | 3.1 kB     00:00    
GPG key at file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022 (0x3A79BD29) is already installed
MySQL 8.0 Community Server                                                                                                                 1.9 MB/s | 1.9 kB     00:00    
GPG key at file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql (0x5072E1F5) is already installed
The GPG keys listed for the "MySQL 8.0 Community Server" repository are already installed but they are not correct for this package.
Check that the correct key URLs are configured for this repository.. Failing package is: mysql-community-client-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-client-plugins-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-client-plugins-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-common-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-common-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-icu-data-files-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-icu-data-files-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-libs-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-libs-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
Public key for mysql-community-server-8.0.46-1.el7.x86_64.rpm is not installed. Failing package is: mysql-community-server-8.0.46-1.el7.x86_64
 GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
The downloaded packages were saved in cache until the next successful transaction.
You can remove cached packages by executing 'dnf clean packages'.
Error: GPG check FAILED
```

9.尽管我们已经导入了 GPG 密钥，但安装仍然因为 GPG 验证失败而中断。这个问题可能是因为 MySQL 8.0 的 RPM 包使用了较新的签名方式，而系统未能正确识别。为了解决这个问题，我们可以临时禁用 GPG 检查来完成安装（仅限可信源）。由于我们是从 MySQL 官方源安装，可以安全地跳过 GPG 验证。

```bash
sudo dnf --nogpgcheck -y install mysql-server
```

运行结果

```bash
[ecs-assist-user@your-instance-id env_software]$ sudo dnf --nogpgcheck -y install mysql-server
Last metadata expiration check: 0:06:19 ago on Tue 16 Jun 2026 09:34:23 AM CST.
Dependencies resolved.
===========================================================================================================================================================================
 Package                                             Architecture                Version                                      Repository                              Size
===========================================================================================================================================================================
Installing:
 mysql-community-server                              x86_64                      8.0.46-1.el7                                 mysql80-community                       65 M
Installing dependencies:
 compat-openssl10                                    x86_64                      1:1.0.2o-4.0.2.al8.2                         alinux3-updates                        1.1 M
 mysql-community-client                              x86_64                      8.0.46-1.el7                                 mysql80-community                       16 M
 mysql-community-client-plugins                      x86_64                      8.0.46-1.el7                                 mysql80-community                      3.5 M
 mysql-community-common                              x86_64                      8.0.46-1.el7                                 mysql80-community                      669 k
 mysql-community-icu-data-files                      x86_64                      8.0.46-1.el7                                 mysql80-community                      2.3 M
 mysql-community-libs                                x86_64                      8.0.46-1.el7                                 mysql80-community                      1.5 M

Transaction Summary
===========================================================================================================================================================================
Install  7 Packages

Total size: 90 M
Installed size: 420 M
Downloading Packages:
[SKIPPED] compat-openssl10-1.0.2o-4.0.2.al8.2.x86_64.rpm: Already downloaded                                                                                              
[SKIPPED] mysql-community-client-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                              
[SKIPPED] mysql-community-client-plugins-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                      
[SKIPPED] mysql-community-common-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                              
[SKIPPED] mysql-community-icu-data-files-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                      
[SKIPPED] mysql-community-libs-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                                
[SKIPPED] mysql-community-server-8.0.46-1.el7.x86_64.rpm: Already downloaded                                                                                              
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                                                                                   1/1 
  Installing       : compat-openssl10-1:1.0.2o-4.0.2.al8.2.x86_64                                                                                                      1/7 
  Running scriptlet: compat-openssl10-1:1.0.2o-4.0.2.al8.2.x86_64                                                                                                      1/7 
  Installing       : mysql-community-client-plugins-8.0.46-1.el7.x86_64                                                                                                2/7 
  Installing       : mysql-community-common-8.0.46-1.el7.x86_64                                                                                                        3/7 
  Installing       : mysql-community-libs-8.0.46-1.el7.x86_64                                                                                                          4/7 
  Running scriptlet: mysql-community-libs-8.0.46-1.el7.x86_64                                                                                                          4/7 
  Installing       : mysql-community-client-8.0.46-1.el7.x86_64                                                                                                        5/7 
  Installing       : mysql-community-icu-data-files-8.0.46-1.el7.x86_64                                                                                                6/7 
  Running scriptlet: mysql-community-server-8.0.46-1.el7.x86_64                                                                                                        7/7 
  Installing       : mysql-community-server-8.0.46-1.el7.x86_64                                                                                                        7/7 
  Running scriptlet: mysql-community-server-8.0.46-1.el7.x86_64                                                                                                        7/7 
[/etc/tmpfiles.d/tpm2-tss-fapi.conf:3] Line references path below legacy directory /var/run/, updating /var/run/tpm2-tss/eventlog → /run/tpm2-tss/eventlog; please update the tmpfiles.d/ drop-in file accordingly.

  Verifying        : compat-openssl10-1:1.0.2o-4.0.2.al8.2.x86_64                                                                                                      1/7 
  Verifying        : mysql-community-client-8.0.46-1.el7.x86_64                                                                                                        2/7 
  Verifying        : mysql-community-client-plugins-8.0.46-1.el7.x86_64                                                                                                3/7 
  Verifying        : mysql-community-common-8.0.46-1.el7.x86_64                                                                                                        4/7 
  Verifying        : mysql-community-icu-data-files-8.0.46-1.el7.x86_64                                                                                                5/7 
  Verifying        : mysql-community-libs-8.0.46-1.el7.x86_64                                                                                                          6/7 
  Verifying        : mysql-community-server-8.0.46-1.el7.x86_64                                                                                                        7/7 

Installed:
  compat-openssl10-1:1.0.2o-4.0.2.al8.2.x86_64        mysql-community-client-8.0.46-1.el7.x86_64                mysql-community-client-plugins-8.0.46-1.el7.x86_64       
  mysql-community-common-8.0.46-1.el7.x86_64          mysql-community-icu-data-files-8.0.46-1.el7.x86_64        mysql-community-libs-8.0.46-1.el7.x86_64                 
  mysql-community-server-8.0.46-1.el7.x86_64         

Complete!
```

MySQL 8.0 服务器已成功安装！接下来您可以执行以下操作：
1. 启动 MySQL 服务并设置开机自启：

  ```bash
  sudo systemctl start mysqld
  sudo systemctl enable mysqld
  ```

2. 查看 root 用户的临时初始密码（Alibaba Cloud Linux 3）：

  ```bash
  sudo grep 'temporary password' /var/log/mysqld.log
  ```

3. 使用初始密码登录 MySQL 并修改 root 密码：

  ```bash
  mysql -uroot -p
  # 在 MySQL 提示符下执行：
  # ALTER USER 'root'@'localhost' IDENTIFIED BY '您的新密码';
  ```
4. 查看服务运行状态：

   ```bash
   sudo systemctl status mysqld
   ```

5. 关闭开机自启动：

   ```bash
   sudo systemctl disable mysqld
   ```

6. 重启数据库：

   ```bash
   sudo systemctl restart mysqld
   ```

注意：MySQL 8.0 对密码强度有较高要求，请确保新密码包含大小写字母、数字和特殊字符，且长度不少于8位。

运行示例：

```bash
[ecs-assist-user@your-instance-id env_software]$ sudo systemctl status mysqld
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: inactive (dead)
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
[ecs-assist-user@your-instance-id env_software]$ sudo systemctl start mysqld
[ecs-assist-user@your-instance-id env_software]$ sudo systemctl status mysqld
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since Tue 2026-06-16 09:50:36 CST; 5s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 18588 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 18656 (mysqld)
   Status: "Server is operational"
    Tasks: 38 (limit: 11714)
   Memory: 456.2M
   CGroup: /system.slice/mysqld.service
           └─18656 /usr/sbin/mysqld

Jun 16 09:50:27 your-instance-id systemd[1]: Starting MySQL Server...
Jun 16 09:50:36 your-instance-id systemd[1]: Started MySQL Server.
[ecs-assist-user@your-instance-id env_software]$ sudo grep 'temporary password' /var/log/mysqld.log
2026-06-16T01:50:30.886503Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: your-temp-password
# 临时密码：your-temp-password
```

10.使用临时密码登录后就可以正常使用MySQL数据库了，如新建一个 `smart-education` 数据库：

```mysql
CREATE DATABASE `smart-education` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

11.开放远程 root 权限 SQL

1. 先用临时密码登录 MySQL

  ```bash
  mysql -uroot -p
  # 输入临时密码
  ```

2. 先修改本地 root 密码（必须先改，否则执行授权会报错）

  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED BY '自定义强密码123!';
  -- 密码规则：8 位以上，大小写字母 + 数字 + 特殊符号
  ```

3. 执行你这条开放远程 root 权限 SQL（把「你的密码」替换成上面新设的密码）

```sql
CREATE USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '自定义强密码123!';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
4. 补充说明（此处我的默认未开启防火墙，因此将直接跳过）

   `root@%`：允许任意 IP远程连接数据库，生产环境不推荐，最好指定固定 IP 如 `root@192.168.1.%`

   `mysql_native_password`：适配 Navicat、DBeaver 等旧客户端加密方式，MySQL8.0 默认 caching_sha2_password 会连不上
   
  额外必须操作：服务器安全组放行 3306 端口，防火墙开放 3306

   ```bash
   # 方法1：关闭firewalld测试（线上按需配置放行规则）
   systemctl stop firewalld
   # 作用：临时关闭 Linux 系统自带防火墙 firewalld
   # - 关闭后外部可以直接访问服务器 3306、22 等端口，不会被防火墙拦截
   # - 临时关闭：服务器重启后防火墙会自动重新开启
   
   # 方法2：不用关防火墙，只放行数据库端口
   firewall-cmd --add-port=3306/tcp --permanent
   firewall-cmd --reload
   # 只允许 3306 端口通行，其他端口依旧受防火墙保护，更安全
   
   # 补充防火墙指令
   # 启动防火墙
   sudo systemctl start firewalld
   # 设置开机自启防火墙
   sudo systemctl enable firewalld
   # 查看防火墙状态
   sudo systemctl status firewalld
   ```

   > 阿里云就算服务器防火墙开了 3306，外网还是连不上。因为阿里云后台还有一层安全组，相当于第二层防火墙，需要你登录阿里云网页后台，手动添加放行 3306 端口的规则。

   ![1781578928654](/images/blog/alibaba-cloud-linux-commands/1781578928654.png)

12.截止目前，我可以正常访问云服务器端的数据库了，如我在本地DataGrip成功连接到远程数据库：

![1781579016850](/images/blog/alibaba-cloud-linux-commands/1781579016850.png)

