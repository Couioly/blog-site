---
title: "PyQt5-使用 Qt Designer 创建窗口"
date: "2025-07-18"
description: "使用Qt Designer创建第一个窗口，.ui文件转.py文件与代码调试。"
tags: ["Python", "PyQt5", "GUI"]
---


## 1  Main Window介绍
---

在PyQt5中最常用的窗口有三种，即`Main Window`、`Widget`和`Dialog`，说明如下：

- `Main Window`：即主窗口，它主要为用户提供一个带有菜单栏、工具栏和状态栏的窗口。
- `Widget`：通用窗口，在PyQt5中，没有嵌入到其他控件中的控件都称为窗口。
- `Dialog`：对话框窗口，主要用来执行短期任务，或者与用户进行交互，没有菜单栏、工具栏和状态栏。

下面主要对`MainWindow`主窗口进行介绍。

## 2  创建主窗口
---

创建主窗口的方法非常简单，只需要打开Qt Designer设计器，在`新建窗体`中选择`Main Window`选项，然后单击`创建`按钮即可，如图所示。

![Pasted image 20250827094921](/images/blog/pyqt5/Pasted%20image%2020250827094921.png)

## 3  设计主窗口
---

创建完主窗口后，主窗口中默认只有一个菜单栏和一个状态栏，要设计主窗口时，只需要根据自己的需求，在左侧的`Widget Box`工具箱中选中相应的控件，然后按住鼠标左键，将其拖放到主窗口中的指定位置即可，操作如图所示。

![Pasted image 20250827095237](/images/blog/pyqt5/Pasted%20image%2020250827095237.png)

## 4  预览窗口效果
---

Qt Designer设计器提供了预览窗口效果的功能，可以预览设计的窗口在实际运行时的效果，以便根据该效果进行调整设计。具体使用方式为：在Qt Designer设计器的菜单栏中选择`窗体`→`预览于`，然后分别选择相应的菜单项即可，这里提供了3种风格的预览方式，如图所示。

![Pasted image 20250827095744](/images/blog/pyqt5/Pasted%20image%2020250827095744.png)

以上3种风格的预览效果分别如下图所示。

- `windowsvista`风格

![Pasted image 20250827100001](/images/blog/pyqt5/Pasted%20image%2020250827100001.png)

- Windows风格

![Pasted image 20250827100101](/images/blog/pyqt5/Pasted%20image%2020250827100101.png)

- Fusion风格

![Pasted image 20250827100129](/images/blog/pyqt5/Pasted%20image%2020250827100129.png)

## 5  查看Python代码
---

设计完窗口之后，可以直接在Qt Designer设计器中查看其对应的Python代码，方法是选择菜单栏中的`窗体`→`View Python Code`菜单，如图所示。

![Pasted image 20250827100327](/images/blog/pyqt5/Pasted%20image%2020250827100327.png)

出现一个显示当前窗口对应Python代码的窗体，如图所示，可以直接单击窗体工具栏中的`复制全部`按钮，将所有代码复制到Python开发工具（比如PyCharm）中进行使用。

![Pasted image 20250827100411](/images/blog/pyqt5/Pasted%20image%2020250827100411.png)

## 6  将`.ui`文件转换为`.py`文件
---

在 [PyQt5-环境搭建](/blog/2025-07-16-pyqt5-pyqt5) 中，配置了将`.ui`文件转换为`.py`文件的扩展工具Pyuic，在Qt Designer窗口中就可以使用该工具将`.ui`文件转换为对应的`.py`文件。步骤如下：

1）首先在Qt Designer设计器窗口中设计完的GUI窗口，按下`Ctrl + S`组合快捷键将窗体UI保存到指定路径下，这里直接保存到创建的Python项目中。

2）在PyCharm的项目导航窗口中选择保存好的`.ui`文件，然后选择菜单栏中的`Tools`→`External Tool`→`Pyuic`菜单，如图所示。

![Pasted image 20250827100906](/images/blog/pyqt5/Pasted%20image%2020250827100906.png)

3）即可自动将选中的.ui文件转换为同名的`.py`文件，双击即可查看代码，如图所示。

![Pasted image 20250827101042](/images/blog/pyqt5/Pasted%20image%2020250827101042.png)

## 7  运行主窗口
---

通过上面的步骤，已经将在Qt Designer中设计的窗体转换为了`.py`脚本文件，但还不能运行，因为转换后的文件代码中没有程序入口，因此需要通过判断名称是否为`__main__`来设置程序入口，并在其中通过`MainWindow`对象的`show()函数`来显示，代码如下：

```python
import sys  
# 程序入口，程序从此处启动PyQt设计的窗体  
if __name__ == '__main__':  
   app = QtWidgets.QApplication(sys.argv)  
   MainWindow = QtWidgets.QMainWindow() # 创建窗体对象  
   ui = Ui_MainWindow()                 # 创建PyQt设计的窗体对象  
   ui.setupUi(MainWindow)  # 调用PyQt窗体的方法对窗体对象进行初始化设置  
   MainWindow.show()                    # 显示窗体  
   sys.exit(app.exec_())                # 程序关闭时退出进程
```

添加完上面代码后，在当前的`.py`文件中，单击右键，在弹出的快捷菜单中选择`Run'文件名'`按钮，即可运行。

![Pasted image 20250827101401](/images/blog/pyqt5/Pasted%20image%2020250827101401.png)
