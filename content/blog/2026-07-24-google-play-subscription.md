---
title: 用 GooglePlay 订阅服务
date: 2026-07-24
description: 通过 GooglePlay 绑定 VISA/Master/银联卡来订阅海外服务（如 ChatGPT Plus），解决国内卡被拒付的问题
tags:
  - tools
  - api
---

### 前言

如果直接使用国内的卡（VISA卡、Master卡、银联卡）去订阅国外的一些服务，将大有可能**被拒付**，因为这些服务本来就**不对中国大陆地区提供服务**。因此，若想要顺利订阅海外服务，我们需要借助GooglePlay的帮助。我们可以将卡片绑定到GooglePlay中，以GooglePlay的方式去订阅这些服务，从而绕过那些服务对我们卡片本身的限制。

<font color=red>限制条件：你打算订阅的那个服务必须使用当前Google账户注册</font>

### 情况1：使用VISA卡或Master卡

1.在Google中绑定银行卡（此处我的是工商银行的VISA星座卡）

![1784882303008](/images/blog/google-play-subscription/1784882303008.png)

2.正常进入后是这个页面（未绑定过任何支付方式），若绑定了其他付费方式，请将其移除掉

![1784882375844](/images/blog/google-play-subscription/1784882375844.png)

3.使用 [美国地址生成器](https://www.meiguodizhi.com/) 生成一个免税州的地址，此处以 `俄勒冈` 为例，将生成`街道、市/区、州全称、邮编`：

![1784883039956](/images/blog/google-play-subscription/1784883039956.png)

4.在Google中点击 `添加支付卡`，在填充页面填写卡号信息及地址（此处我的TIZI为美国且为美区Google账户，所以我将直接使用刚才生成的美国地址），如下图所示，为成功绑定卡号状态：

![1784883563993](/images/blog/google-play-subscription/1784883563993.png)

### 情况2：使用银联卡

如果要绑定银联卡，就不能使用美国地址，需要使用支持银联卡的地区，我推荐选择 `新加坡`。当直接点击添加支付卡后选择新加坡，会发现**填写卡号时仍显示不支持该卡**，所以需要进行下列操作来填写卡号：

1.打开GooglePlay，依次点击 头像-设置-常规-账号和设备偏好设置，可以看到国家/地区和个人资料为空，只有当绑定一个支付卡片后，才会显示卡片账单地区信息；

![1784884402487](/images/blog/google-play-subscription/1784884402487.png)

2.接下来我们需要换种思路：在`国家/地区和个人资料`中保存`新加坡`信息，接下来就可以在GooglePlay中`添加信用卡或借记卡`了。首先使用已有的VISA卡或Master卡去绑定支付卡，地区选择新加坡，这样就可以成功在`国家/地区和个人资料`中保存`新加坡`信息。

<font color=red>提示：这里有人会疑问"我都有VISA卡或Master卡，为什么还去绑定银联卡？"</font>

**Answer**：没错，所以此处我们可以去使用一张临时卡（3-4 RMB），临时卡的购买途径很多，比如：[点击跳转](https://kaka.kennygmail.com/)

![1784885443529](/images/blog/google-play-subscription/1784885443529.png)

3.复制购买的临时卡号，前往 [新加坡地址生成器](https://www.meiguodizhi.com/sg-address) 获取新加坡地址，然后输入信息后保存，刷新GooglePlay的 `国家/地区和个人资料` 会发现成功保存了 `新加坡` 地址。

4.在GooglePlay中点击 头像-付款和订阅-支付方式-添加信用卡或借记卡，然后输入银联卡信息，修改手机号为+86，正常验证保存即可成功添加银联卡。

### 订购ChatGPT服务

1.卸载当前手机端的ChatGPT应用，使用GooglePlay重新下载，下载后使用Google账户注册登录；

2.成功登录后点击订阅，若出现只能订阅Go会员的情况，则按下列操作处理：

- 清空后台
- 打开飞行模式
- 打开ChatGPT点击订阅会发现可以订阅Plus会员了
- 返回ChatGPT主页面
- 关掉飞行模式，打开TIZI
- 重新点击订阅

3.正常订阅ChatGPT Plus 会员
