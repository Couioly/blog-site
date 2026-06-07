---
title: "BeautifulSoup 使用说明"
date: "2026-02-20"
description: "Python BeautifulSoup 库使用教程，HTML/XML解析、节点导航、搜索与CSS选择器实战。"
tags: ["Python", "爬虫", "HTML"]
---

### BeautifulSoup介绍

BeautifulSoup是一个用于从HTML和XML文件中提取数据的Python库。它将自动将输入的文档转换为Unicode编码，输出文档转换为UTF-8编码。其主要功能有：

- 导航
- 搜索
- 修改分析树

> **Warning:** 注意
>
> 一般情况下不需要考虑编码方式，除非文档没有指定一个编码方式，因此遇到BeautifulSoup不能自动识别编码方式的情况，只需要说明一下原始编码方式即可。

### 环境准备

Windows使用前需要安装库，终端指令如下：

```shell
pip install beautifulsoup4
```

> **Info:** 源码方式安装
>
> 1. 打开源码地址进行下载：[点击访问源码地址](https://www.crummy.com/software/BeautifulSoup/bs4/download/)
> 2. 使用控制台打开进入源码所在路径
> 3. 执行命令：`python setup.py install`

### 适配解释器

BeautifulSoup支持python标准库中包含的HTML解析器，但常用的有lxml解析器和html5lib解析器，可以通过下列命令进行安装解析器(安装其一即可）：

```shell
pip install lxml
pip install html5lib
```

### BeautifulSoup的使用

#### 导包

```python
from bs4 import BeautifulSoup
```

#### 创建BeautifulSoup对象

```python
# 创建BeautifulSoup对象并指定解析器为lxml
soup = BeautifulSoup(html_doc,features='lxml')
```

`html_doc`：为HTML的字符串
`features`：用于指定解析器

> **Tips:**
>
> 若HTML为'index.html'类型的文件，则可以将原来的`html_doc`替换为`open('index.html')`即可。

**BeautifulSoup对象的prettify()方法**可以对输出的内容自动进行格式化排版，按HTML层级添加缩进和换行，结构清晰。

#### 获取节点内容

**获取节点对应的代码**语法格式如下：

```python
soup.标签         # 获取节点对应的代码
soup.标签.name    # 获取节点对应的名称
```

示例：

```python
soup = BeautifulSoup(html_doc,features="lxml")
print(soup.head)      # 打印head节点
print(soup.body)      # 打印body节点
print(soup.title)     # 打印title节点
print(soup.p.name)    # 打印p节点的名称
```

> **Warning:** 注意
>
> 该获取方法仅打印第一个检测到的`<p>`标签而忽略其他。

#### 获取节点属性

若已选择一个指定的节点名称，那么只需调用attrs即可获取这个节点下的所有属性，返回值为**字典类型**。语法格式如下：

```python
soup.标签.attrs           # 获取指定节点的属性
soup.标签.attrs[属性名]    # 获取指定节点的指定属性名的值(attrs可省略)
```

示例：

```python
soup = BeautifulSoup(html_doc,features="lxml")
print(soup.meta.attrs)         # 打印meta的属性
print(soup.link.attrs)         # 打印link的属性
print(soup.div.attrs['id'])    # 打印div的id属性值
print(soup.div['id'])          # 打印div的id属性值
```

#### 获取节点包含的文本内容

若要获取节点包含的文本内容，只需在节点名称后面添加`string`属性即可。语法如下：

```python
soup.标签.string     # 获取指定节点的文本内容
```

示例：

```python
soup = BeautifulSoup(html_doc,features="lxml")
print(soup.title.string)        # 打印title节点包含的文本内容
print(soup.link.string)         # 打印link节点包含的文本内容
```

#### 嵌套获取节点内容

使用beautifulsoup获取每个节点的内容时，可以通过 `.` 直接获取下一个节点的内容，代码如下：

```python
soup = BeautifulSoup(html_doc,features="lxml")
print(soup.head.title)         # 打印head节点中title节点内容
print(soup.head.title.string)  # 打印head节点中title节点的文本内容
print(soup.div.attrs['id'])    # 打印div的id属性值
print(soup.div['id'])          # 打印div的id属性值
```

> **Info:** 说明
>
> 获取head与其内部的title节点内容时数据类型均为 `<class 'bs4.element.Tag'>`，说明在Tag类的基础上可以获取当前节点的子节点内容

#### 关联获取

先确认某一节点，然后以该节点为中心获取对应的子节点、孙节点、父节点及兄弟节点。

**获取子节点**

获取某节点下面的所有的子节点时，可以使用 `contents` 或 `children` 属性来实现，其中contents返回一个列表，该列表中每个元素都是一个子节点内容，而children所返回的则是一个list_iterator类型的可迭代对象，需要转换成list类型或遍历进行获取。语法如下：

```python
soup = BeautifulSoup(html_doc,features="lxml")
print(soup.head.contents)         # 列表形式打印head节点下所有子节点
print(soup.head.children)         # 可迭代对象形式打印head节点下所有子节点
```

**获得孙节点**

在获取某节点下所有的子孙节点时，可以使用 `descendants` 属性来实现，该属性会返回一个generator对象，其内容需要转换成list类型或遍历进行获取。语法如下：

```python
soup = BeautifulSoup(html_doc,features="lxml")
# 打印body节点下所欲子孙节点内容的generator对象
print(soup.body.descendants)
```

**获取父节点**

获取父节点存在两种方式：
1. 通过 `parents` 属性直接获取指定节点的父节点内容，还可以返回父节点及以上节点（祖先节点）内容，其内容需要转换成list类型或遍历进行获取。语法如下：

```python
soup = BeautifulSoup(html_doc,features='lxml')
print(soup.title.parent)  # 打印title节点的父节点内容
print(soup.title.parents) # 打印title节点的父节点及以上内容的generator对象
```

> **Info:** 说明
>
> parents属性所获取父节点的顺序为head、html、[document]，此处的 `[document]` 表示文档对象，时整个HTML文档，也是BeautifulSoup对象。

**获取兄弟节点**

假若在一段HTML中获取第一个p节点的下一个div兄弟节点时可以使用 `next_sibling` 属性，若要获取当前div节点的上一个兄弟节点p时，则可以使用 `previous_sibling` 属性。想获取当前节点后面的所有兄弟节点，则可以使用 `next_siblings` 属性，若要获取前面的，则使用 `previous_siblings` 属性。这两个属性都将以generator对象的形式返回，语法格式如下：

```python
soup = BeautifulSoup(html_doc,features='lxml')
print(soup.p.next_sibling)  # 打印第一个p节点的下一个兄弟节点
# 打印p节点前面的所有兄弟节点的generator对象
print(soup.p.previous_siblings)
```

#### 方法获取内容

 - find_all()
 - find()

find_all()获取所有符合条件的内容，find()获取第一个匹配的节点内容，接下来以find_all()为例进行整理：

```python
find_all(name=None,attrs={},recursive=True,text=None,limit=None,**kwargs)
```

`name参数`

用来指定节点名称，指定该参数以后将返回一个可迭代对象，所有符合条件的均为对象的一个元素。代码如下：

```python
print(soup.find_all(name='p')) # 打印所有名称为p的节点内容
```

> **Info:** 说明
>
> bs4.element.ResultSet类型的数据与python的列表类型，可以使用切片的方式进行数据获取，如：`print(soup.find_all(name='p')[0])`

> **Warning:** 嵌套获取
>
> 因为bs4.element.ResultSet数据中的每一个元素都是bs4.element.Tag类型，所以可以直接对某一元素进行嵌套获取，代码如下：
>
> ```python
> print(soup.find_all(name='p')[0])
> print(soup.find_all(name='p')[0].find_all(name='a'))
> ```

`attrs参数`

在填写attrs参数时，默认情况下需要填写字典类型的参数值，不过也可以通过以赋值的方式填写参数。代码如下：

```python
print(soup.find_all(attrs={'values':'1'}))
print(soup.find_all(value='1')) # 打印value值为1的所有内容
```

`text参数`

指定text参数可以获取节点中的文本，该参数可以指定字符串或者正则表达式对象，代码如下：

```python
print(soup.find_all(text="Python"))
print(soup.find_all(text=re.compile('Python')))
```

#### CSS选择器

参考文档：[点击进行访问](https://www.w3school.com.cn/cssref/css_selectors.ASP)

若是Tag或BeautifulSoup对象都可以直接调用 `select()` 方法，然后填写指定参数即可通过CSS选择器获取节点中的内容。

```python
print(soup.select('p'))       # 打印所有p节点内容
print(soup.select('p')[0])    # 打印所有p节点中的第一个节点
print(soup.select('html head title')) # 打印逐层获取的title节点
print(soup.select('.test_2'))   # 打印类名为test_2所对应的节点
print(soup.select('#class_1'))  # 打印id值为class_1所对应的节点
```

`select_one()`方法：用于获取所有符合条件节点中的第一个节点。
