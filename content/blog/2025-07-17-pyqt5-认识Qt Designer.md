---
title: "PyQt5-认识 Qt Designer"
date: "2025-07-17"
description: "认识Qt Designer可视化界面设计工具，了解各区域功能与基本操作。"
tags: ["Python", "PyQt5", "GUI"]
---

Qt Designer，中文名称为Qt设计师，它是一个强大的可视化GUI设计工具。通过使用Qt Designer设计GUI程序界面，可以大大地提高开发效率，本节先对Qt Designer及其支持的几种窗口类型进行介绍。

## 1  几种常用的窗口类型
---

按照 [PyQt5-环境搭建](/blog/2025-07-16-pyqt5-pyqt5) 的步骤在PyCharm开发工具中配置完Qt Designer后，即可通过PyCharm开发工具中的“External Tools”（扩展工具）菜单快速打开Qt Designer，步骤如下：

1）在PyCharm的菜单栏中依次单击Tools→External Tools→Qt Designer菜单，如图所示。

![Pasted image 20250827090902](/images/blog/pyqt5/Pasted%20image%2020250827090902.png)

 > **Tip:** 多学两招
>除了在PyCharm中通过扩展工具打开Qt Designer设计器，还可以通过可执行文件打开，Qt Designer的可执行文件安装在当前虚拟环境下的`Lib\site-packages\QtDesigner`路径下，名称为designer.exe，通过双击该文件，也可以打开Qt Designer设计器；另外，为了使用方便，可以为其创建一个桌面快捷方式，具体方式为：选中`designer.exe`文件，单击右键，在弹出的快捷菜单中依次选择`发送到`→`桌面快捷方式`，如下图所示，创建designer.exe文件在系统桌面上的快捷方式。这样以后就可以直接在桌面上面通过双击该快捷方式打开Qt Designer设计器了。

![Pasted image 20250827091341](/images/blog/pyqt5/Pasted%20image%2020250827091341.png)

2）即可打开Qt Designer设计器，并显示“新建窗体”窗口，该窗口中以列表形式列出Qt支持的几种窗口类型，分别如下：

- `Dialog with Buttons Bottom`：按钮在底部的对话框窗口，效果如图所示。

![Pasted image 20250827091525](/images/blog/pyqt5/Pasted%20image%2020250827091525.png)

- `Dialog with Buttons Right`：按钮在右上角的对话框窗口，效果如图所示。

![Pasted image 20250827091625](/images/blog/pyqt5/Pasted%20image%2020250827091625.png)

- `Dialog without Buttons`：没有按钮的对话框窗口，效果如图所示。

![Pasted image 20250827091722](/images/blog/pyqt5/Pasted%20image%2020250827091722.png)

- `Main Window`：一个带菜单、停靠窗口和状态栏的主窗口，效果如图所示。

![Pasted image 20250827091820](/images/blog/pyqt5/Pasted%20image%2020250827091820.png)

 > **Info:** 说明
>`Main Window`窗口是使用PyQt5设计GUI程序时最常用的窗口，本教程中的所有案例都将以创建`Main Window`窗口为基础进行讲解。

- `Widget`：通用窗口，效果如图所示。

![Pasted image 20250827092000](/images/blog/pyqt5/Pasted%20image%2020250827092000.png)

 > **Info:** 说明
>从图可以看出，`Widget`窗口和`Main Window`窗口看起来是一样的，但它们其实是有区别的，区别是：
>- `Main Window`窗口会**自带一个菜单栏和一个状态栏**；
>- 而`Widget`窗口没有，默认就是一个空窗口。

## 2  熟悉Qt Designer窗口区域
---

在Qt Designer设计器的“新建窗体”窗口中选择“Main Window”，即可创建一个主窗口，Qt Designer设计器的几个主要组成部分如图所示。

![Pasted image 20250827092743](/images/blog/pyqt5/Pasted%20image%2020250827092743.png)

下面对Qt Designer设计器的主要区域进行介绍。

### 1）菜单栏

菜单栏显示了所有可用的Qt命令，Qt Designer的菜单栏如图所示。

![Pasted image 20250827092835](/images/blog/pyqt5/Pasted%20image%2020250827092835.png)

在Qt Designer的菜单栏中，最常用的是前面4个菜单，即文件、Edit（编辑）、窗体和视图。其中，文件菜单主要提供基本的新建、保存、关闭等功能菜单，如图所示；

![Pasted image 20250827093013](/images/blog/pyqt5/Pasted%20image%2020250827093013.png)

Edit（编辑）菜单除了提供常规的复制、粘贴、删除等操作外，还提供了特定于Qt的几个菜单，即编辑窗口部件、编辑信号/槽、编辑伙伴、编辑Tab顺序，这4个菜单主要用来切换Qt窗口的设计状态，Edit（编辑）菜单如图所示。

![Pasted image 20250827093115](/images/blog/pyqt5/Pasted%20image%2020250827093115.png)

窗体菜单提供布局及预览窗体效果、C++代码和Python代码相关的功能，如图所示；

![Pasted image 20250827093218](/images/blog/pyqt5/Pasted%20image%2020250827093218.png)

视图菜单主要用来提供Qt常用窗口的快捷打开方式，如图所示。

![Pasted image 20250827093245](/images/blog/pyqt5/Pasted%20image%2020250827093245.png)

### 2）工具栏

为了操作更加方便、快捷，将菜单项中常用的命令放入了工具栏中。通过工具栏可以快速访问常用的菜单命令。Qt Designer的工具栏如图所示。

![Pasted image 20250827093408](/images/blog/pyqt5/Pasted%20image%2020250827093408.png)

### 3）工具箱

工具箱是Qt Designer最常用、最重要的一个窗口，每一个开发人员都必须对这个窗口非常熟悉。工具箱提供了进行PyQt5 GUI界面开发所必需的控件。通过工具箱，开发人员可以方便地进行可视化的窗体设计，简化程序设计的工作量，提高工作效率等。根据控件功能的不同，工具箱分为8个分类，如图所示。

![Pasted image 20250827093625](/images/blog/pyqt5/Pasted%20image%2020250827093625.png)

而展开每个分类，都可以看到各个分类下包含的控件，如图所示。

![Pasted image 20250827093709](/images/blog/pyqt5/Pasted%20image%2020250827093709.png)

 > **Info:** 说明
>在设计GUI界面时，如果需要使用某个控件，可以在工具箱中选中需要的控件，直接将其拖放到设计窗口的指定位置即可。

### 4）窗口设计区域

窗口设计区域是GUI界面的可视化显示窗口，任何对窗口的改动，都可以在该区域实时显示出来，例如，下图是一个默认的`Main Window`窗口，该窗口中包含一个默认的菜单和状态栏。

![Pasted image 20250827094023](/images/blog/pyqt5/Pasted%20image%2020250827094023.png)

### 5）对象查看器

对象查看器主要用来查看设计窗口中放置的对象列表，如图所示。

![Pasted image 20250827094055](/images/blog/pyqt5/Pasted%20image%2020250827094055.png)

### 6）属性编辑器

属性编辑器是Qt Designer中的另一个常用且关键的窗口，该窗口为PyQt5设计的GUI界面提供了对窗口、控件和布局等相关属性的修改功能。对设计窗口中的各个控件属性都可以在属性编辑器中进行设置完成。属性编辑器窗口如图所示。

![Pasted image 20250827094135](/images/blog/pyqt5/Pasted%20image%2020250827094135.png)

### 7）信号/槽编辑器

信号/槽编辑器主要用来编辑控件的信号和槽函数，另外也可以为控件添加自定义的信号和槽函数，效果如图所示。

![Pasted image 20250827094241](/images/blog/pyqt5/Pasted%20image%2020250827094241.png)

### 8）动作编辑器

动作编辑器主要用来对控件的动作进行编辑，包括提示文字、图标及图标主题、快捷键等，如图所示。

![Pasted image 20250827094305](/images/blog/pyqt5/Pasted%20image%2020250827094305.png)

### 9）资源浏览器

在资源浏览器中，开发人员可以为控件添加图片（例如Label、Button等背景图片）、图标等资源，如图所示。

![Pasted image 20250827094528](/images/blog/pyqt5/Pasted%20image%2020250827094528.png)
