---
title: "12306 车票查询接口实现"
date: "2025-08-01"
description: "Python爬虫实战：使用PyQt5构建12306火车票查询GUI工具，包含窗体设计、请求参数分析与数据展示。"
tags: ["Python", "爬虫", "PyQt5"]
---

## 12306爬票概述
---

无论是出差还是旅行，都无法离开交通工具的支持。现如今随着科技水平的提高，高铁与动车成为人们喜爱的交通工具。如果想要知道每列车次的时间信息，都需要在各类的列车网站中进行查询，本项目将通过Python的爬虫技术实现一个12306爬票工具，如图所示。

<video src="/images/blog/train-tickets/12306-assistant.mp4" controls style="max-width:100%;display:block;margin:1.5em auto;border-radius:4px">
  您的浏览器不支持视频播放
</video>

![Pasted image 20250801224932](/images/blog/train-tickets/Pasted%20image%2020250801224932.png)

## 搭建QT环境
---

Qt是Python开发窗体的工具之一，它不仅与Python有着良好的兼容性，还可以通过可视化拖拽的方式进行窗体的创建，提高开发人员的开发效率，因此受到开发人员的喜爱。

**第一步**：安装Python解释器
**第二步**：安装Pycharm编辑器
**第三步**：在Python上安装Qt模块环境
**第四步**：结合安装的PyQt5模块进行Pycharm的配置

详细QT环境的配置，请访问 [PyQt5环境搭建](/blog/2025-07-16-pyqt5-pyqt5)

## 主窗体设计
---

Python、QT与PyCharm配置完成后，接下来需要对快手爬票的主窗体进行设计，首先需要创建主窗体外层，然后依次添加顶部图片、查询区域、选择车次类型区域、分类图片区域、信息表格区域。设计顺序如图所示。

![Pasted image 20250731211018](/images/blog/train-tickets/Pasted%20image%2020250731211018.png)

### Qt拖曳控件

了解了窗体设计思路以后，接下来需要实现快手爬票的窗体。由于在14.4.2小节中已经将Python、QT与PyCharm三个开发工具进行了环境配置，所以创建窗体时只需要启动PyCharm开发工具即可，实现窗体的具体步骤如下：

1）在PyCharm开发工具中创建新的Python项目，项目打开完成后，在顶部的菜单栏中依次单击Tools → External Tools → Qt Designer打开设计师，如图所示：

![Pasted image 20250731161043](/images/blog/train-tickets/Pasted%20image%2020250731161043.png)

2）单击Qt Designer快捷工具后，Qt的窗口编辑工具将自动打开，并且会自动弹出一个新建窗体的窗口，在该窗口中选择一个主窗体的模板，这里选择`Main Window`然后单击创建按钮即可，如图所示：

![Pasted image 20250731161313](/images/blog/train-tickets/Pasted%20image%2020250731161313.png)

3）主窗体创建完成后，自动进入到Qt Designer的设计界面，顶部区域是菜单栏与快捷菜单选项，左侧区域是各种控件与布局，中间的区域为编辑区域，该区域可以将控件拖曳至此处，也可以预览窗体的设计效果。右侧上方是对象查看器，此处列出所有控件以及彼此所属的关系层。右侧中间的位置是属性编辑器，此处可以设置控件的各种属性。右侧底部的位置分别为信号/槽编辑器、动作编辑器及资源浏览器，具体位置如图所示：

![Pasted image 20250731162052](/images/blog/train-tickets/Pasted%20image%2020250731162052.png)

4）根据设计思路依次将指定的控件拖拽至主窗体中，首先添加主窗体容器内的控件如下表所示。

|    **对 象 名 称**    | **控 件 名 称**  |          **描    述**          |
| :---------------: | :----------: | :--------------------------: |
|  `centralwidget`  |  `QWidget`   | 该控件与对象名称是创建主窗体后默认生成，为主窗体外层容器 |
| `label_title_img` |   `QLabel`   | 该控件位于主窗体容器内，用于设置顶部图片、对象名称自定义 |
| `label_train_img` |   `QLabel`   | 该控件位于主窗体容器内，用于设置分类图片、对象名称自定义 |
|    `tableView`    | `QTableView` | 该控件位于主窗体容器内，用于显示信息表格、对象名称自定义 |

向主窗体中添加查询区域容器与控件，如下表所示。

|  **对 象 名 称**   |  **控 件 名 称**  |                  **描　　述**                   |
| :------------: | :-----------: | :-----------------------------------------: |
| `widget_query` |   `QWidget`   |      该控件位于用于显示查询区域，对象名称自定义，该控件为查询区域的容器      |
|    `label`     |   `QLabel`    |     该控件位于查询区域的容器内，用于显示“出发地：”文字、对象名称自定义      |
|   `label_2`    |   `QLabel`    | 该控件位于查询区域的容器内，用于查询区域的容器内，显示“目的地：”文字、对象名称自定义 |
|   `label_3`    |   `QLabel`    |     该控件位于查询区域的容器内，用于显示“出发日：”文字、对象名称自定义      |
|  `pushButton`  | `QPushButton` |       该控件位于查询区域的容器内，用于显示查询按钮，对象名称自定义        |
|   `textEdit`   |  `QTextEdit`  |   该控件位于查询区域的容器内，用于显示“出发地”所对应的编辑框、对象名称自定义    |
|  `textEdit_2`  |  `QTextEdit`  |   该控件位于查询区域的容器内，用于显示“目的地”所对应的编辑框、对象名称自定义    |
|  `textEdit_3`  |  `QTextEdit`  |   该控件位于查询区域的容器内，用于显示“出发日”所对应的编辑框、对象名称自定义    |

![Pasted image 20250731170433](/images/blog/train-tickets/Pasted%20image%2020250731170433.png)

向主窗体中添加选择车次类型容器与控件，如下表所示：

|    **对 象 名 称**    | **控 件 名 称** |               **描    述**                |
| :---------------: | :---------: | :-------------------------------------: |
| `widget_checkBox` |  `QWidget`  | 该控件用于显示选择车次类型区域、对象名称自定义，该控件为选择车次类型区域的容器 |
|   `checkBox_D`    | `QCheckBox` |    该控件位于选择车次类型的容器内，用于选择动车类型、对象名称自定义     |
|   `checkBox_G`    | `QCheckBox` |    该控件位于选择车次类型的容器内，用于选择高铁类型、对象名称自定义     |
|   `checkBox_K`    | `QCheckBox` |    该控件位于选择车次类型的容器内，用于选择快车类型、对象名称自定义     |
|   `checkBox_T`    | `QCheckBox` |    该控件位于选择车次类型的容器内，用于选择特快类型、对象名称自定义     |
|   `checkBox_Z`    | `QCheckBox` |    该控件位于选择车次类型的容器内，用于选择直达类型、对象名称自定义     |
|   `label_type`    |  `QLabel`   |  该控件位于选择车次类型的容器内，用于显示“车次类型：”文字、对象名称自定义  |
|   `checkBox_O`    | `QCheckBox` |    该控件位于选择车次类型的容器内，用于选择其他类型、对象名称自定义     |
|   `checkBox_F`    | `QCheckBox` |    该控件位于选择车次类型的容器内，用于选择复兴号类型、对象名称自定义    |
|  `checkBox_EMU`   | `QCheckBox` |   该控件位于选择车次类型的容器内，用于选择智能动车组类型、对象名称自定义   |
|  `checkBox_ALL`   | `QCheckBox` |    该控件位于选择车次类型的容器内，用于选择全部类型、对象名称自定义     |

![Pasted image 20250731170532](/images/blog/train-tickets/Pasted%20image%2020250731170532.png)

>说明：除了主窗体默认创建的QWidget控件外，其他每个QWidget就是一个显示区域的容器，都需要自行拖曳到主窗体当中，然后将每个区域对应的控件拖曳并摆放在当前的容器中即可。

注意：在拖曳控件时可以根据控件边缘的蓝色调节点设置控件的位置与大小，如果需要修改非常精确的参数值可以在属性编辑器中进行设置也可以在生成后的Python代码中对窗体的详细参数进行修改。在设置控件文字时，可以选中控件然后在右侧的属性编辑器的text标签中进行设置，如图所示。

![Pasted image 20250731171105](/images/blog/train-tickets/Pasted%20image%2020250731171105.png)

![Pasted image 20250731171239](/images/blog/train-tickets/Pasted%20image%2020250731171239.png)

5）窗体设计完成后，按下`Ctrl+S`快捷键保存窗体设计文件名称为`window.ui`，然后需要将该文件保存在当前项目的目录当中，再选中该文件单击右键依次选择`External Tools → PyUIC`选项，将窗体设计的ui文件转换为`.py`文件，如图所示。

![Pasted image 20250731171635](/images/blog/train-tickets/Pasted%20image%2020250731171635.png)

![Pasted image 20250731171708](/images/blog/train-tickets/Pasted%20image%2020250731171708.png)

### 代码调试

打开`window.py`文件后，自动生成的代码中已经导入了PyQt5以及其内部的常用模块。PyQt5是一套Python绑定Digia QT5应用的框架，它可用于Python 2.x和3.x的版本中。它是功能最强大的GUI库之一，PyQt5的类别分为多个模块，常见的模块与概述如下表所示。

|  **模 块 名 称**  |                          **描    述**                          |
| :-----------: | :----------------------------------------------------------: |
|    QtCore     |          此模块用于处理时间、文件和目录、各种数据类型、流、URL、MIME类型、线程或进程           |
|     QtGui     | 此模块包含类窗口系统集成、事件处理、二维图形、基本成像、字体和文本，以及一套完整的OpenGL和OpenGL ES的绑定 |
|   QtWidgets   |              此模块中包含的类，提供了一组用于创建经典桌面风格用户界面的UI元素               |
| QtMultimedia  |              此模块中包含的类，用于处理多媒体内容和API来访问的相机、收音机功能              |
|   QtNetwork   |   此模块中包含网络编程的类，通过这些类使网络编程更简单，更便携，便于TCP / IP和UDP客户端和服务器的编码    |
| QtPositioning |              此模块中包含的类，利用各种可能的来源，确定位置，包括卫星、Wi-Fi              |
| QtWebSockets  |                    此模块中包含实现WebSocket协议的类                     |
|     QtXml     |          此模块中包含用于处理XML文件中的类，该模块为SAX和DOM API提供了解决方法           |
|     QtSvg     |    此模块中提供了用于显示SVG文件内容的类，（SVG）是可缩放矢量图形，用于描述XML中的二维图形的一种格式     |
|     QtSql     |                       此模块提供了用于处理数据库的类                        |
|    QtTest     |                   此模块包含的功能为pyqt5应用程序的单元测试                    |

下面通过代码来调试主窗体中各种控件的细节处理，以及相应的属性。具体步骤如下：

1）打开`window.py`文件，在右侧代码区域的`setupUi()`方法中修改主窗体的最大值与最小值，用于保持主窗体大小不变无法扩大或缩小。代码如下：

```python
MainWindow.setObjectName("MainWindow")                 # 设置窗体对象名称  
MainWindow.resize(1135, 806)                           # 设置窗体大小  
MainWindow.setMinimumSize(QtCore.QSize(1135, 806))     # 主窗体最小值  
MainWindow.setMaximumSize(QtCore.QSize(1135, 806))     # 主窗体最大值  
self.centralwidget = QtWidgets.QWidget(MainWindow)     # 主窗体的widget控件  
self.centralwidget.setObjectName("centralwidget")      # 设置对象名称
```

2）将图片资源`img`文件夹复制到该项目中，然后导入`PyQt5.QtGui`模块中的`QPalette`、`QPixmap`、`QColor`用于对控件设置背景图片，为对象名`label_title_img`的Label控件设置背景图片，该控件用于显示顶部图片。关键代码如下：

```python
# 导入QtGui模块  
from PyQt5.QtGui import QPalette, QPixmap, QColor  
# 通过label控件显示顶部图片  
self.label_title_img = QtWidgets.QLabel(self.centralwidget)  
self.label_title_img.setGeometry(QtCore.QRect(0, 0, 1131, 101))  
self.label_title_img.setObjectName("label_title_img")  
bg1_bath = os.path.join(base_dir,'BG1.png')  
# 打开顶部位图  
title_img = QPixmap(bg1_bath)  
# 设置调色板  
self.label_title_img.setPixmap(title_img)  
# 在设置pixmap后添加，让标签自适应图片大小  
self.label_title_img.setScaledContents(True)
```

3）设置复选框部分widget控件的背景图片，该控件起到容器的作用，在设置背景图片时并没有Label控件那么简单，首先需要为该控件开启自动填充背景功能，然后创建调色板对象，指定调色板背景图片，最后为控件设置对应的调色板即可。关键代码如下：

```python
# 查询部分的widget  
self.widget_checkBox = QtWidgets.QWidget(self.centralwidget)  
self.widget_checkBox.setGeometry(QtCore.QRect(0, 200, 1131, 51))  
# 开启自动填充背景  
self.widget_checkBox.setAutoFillBackground(True)  
bg2_bath = os.path.join(base_dir,'BG2.png')  
# 调色板类  
palette = QPalette()  
# 设置背景图片  
palette.setBrush(QPalette.Background, QtGui.QBrush(QtGui.QPixmap(bg2_bath)))  
# 为控件设置对应的调色板即可  
self.widget_checkBox.setPalette(palette)  
self.widget_checkBox.setObjectName("widget_checkBox")
```

>说明：根据以上两种设置背景图片的方法，分别为选择车次类型的widget控件与显示火车信息图片的Label控件设置背景图片。

4）设置中间部分widget控件的背景图片，该控件起到容器的作用，在设置背景图片时，首先需要为该控件开启自动填充背景功能，要让图片完全展示且保持比例，你可以使用 `QPixmap` 的 `scaled` 方法，并设置合适的缩放模式。然后创建调色板对象，指定调色板背景图片，最后为控件设置对应的调色板即可。关键代码如下：

```python
self.label_train_img = QtWidgets.QLabel(self.centralwidget)  
self.label_train_img.setGeometry(QtCore.QRect(0, 260, 1131, 71))  
self.label_train_img.setObjectName("label_train_img")  
self.label_train_img.setAutoFillBackground(True)  
# 加载图片  
bg3_bath = os.path.join(base_dir, 'BG3.png')  
pixmap = QtGui.QPixmap(bg3_bath)  
# 按标签大小缩放图片，保持比例，确保图片完全显示  
scaled_pixmap = pixmap.scaled(  
    self.label_train_img.size(),  
    QtCore.Qt.KeepAspectRatio,      # 保持宽高比  
    QtCore.Qt.SmoothTransformation  # 平滑缩放  
)  
# 设置调色板  
palette = QPalette()  
palette.setBrush(QPalette.Background, QtGui.QBrush(scaled_pixmap))  
self.label_train_img.setPalette(palette)
```

5）通过代码修改窗体或控件文字时，需要在`retranslateUi()`方法中进行设置，关键代码如下：

```python
MainWindow.setWindowTitle(_translate("MainWindow", "MainWindow"))  
self.label.setText(_translate("MainWindow", "出发地："))  
self.label_2.setText(_translate("MainWindow", "目的地："))  
self.label_3.setText(_translate("MainWindow", "出发日："))  
self.pushButton.setText(_translate("MainWindow", "查询"))  
self.label_4.setText(_translate("MainWindow", "车次类型："))  
self.checkBox_G.setText(_translate("MainWindow", "GC-高铁/城际"))  
self.checkBox_D.setText(_translate("MainWindow", "D-动车"))  
self.checkBox_Z.setText(_translate("MainWindow", "Z-直达"))  
self.checkBox_T.setText(_translate("MainWindow", "T-特快"))  
self.checkBox_K.setText(_translate("MainWindow", "K-快速"))  
self.checkBox_O.setText(_translate("MainWindow", "其他"))  
self.checkBox_F.setText(_translate("MainWindow", "复兴号"))  
self.checkBox_EMU.setText(_translate("MainWindow", "智能动车组"))  
self.checkBox_ALL.setText(_translate("MainWindow", "全部"))
```

6）导入sys模块，然后在代码块的最外层创建`show_MainWindow()`方法，该方法用于显示窗体。关键代码如下：

```python
def show_MainWindow():  
    app = QtWidgets.QApplication(sys.argv)   # 实例化QApplication类，作为GUI主程序入口  
    MainWindow = QtWidgets.QMainWindow()     # 创建MainWindow类  
    ui = Ui_MainWindow()                     # 实例UI类  
    ui.setupUi(MainWindow)                   # 设置窗体UI  
    MainWindow.show()                        # 显示窗体  
    sys.exit(app.exec_())                    # 当窗口创建完成，需要结束主循环过程
```

>说明：sys模块是python自带的模块，该模块提供了一系列有关Python运行环境的变量和函数。sys模块的常见用法与含义如表7所示。

**sys模块的常见用法**

|        **常 见 用 法**         |                                       **描    述**                                       |
| :------------------------: | :------------------------------------------------------------------------------------: |
|         `sys.argv`         |                                该方法用于获取当前正在执行的命令行参数的参数列表                                |
|         `sys.path`         |                                  该方法用于获取指定模块路径的字符串集合                                   |
|        `sys.exit()`        |                   该方法用于退出程序，当参数非0时，会引发一个SystemExit异常，从而可以在主程序中捕获该异常                    |
|       `sys.platform`       |                                     该方法用于获取当前系统平台                                      |
|       `sys.modules`        | 该方法是用于加载模块的字典，每当程序员导入新的模块时，sys.modules将自动记录该模块。当相同模块第二次导入时Python将从该字典中进行查询，从而加快程序的运行速度 |
| `sys.getdefaultencoding()` |                                    该方法用于获取当前系统编码方式                                     |

6）在代码块的最外层模拟Python的程序入口，然后调用显示窗体的`show_MainWindow()`方法。关键代码如下：

```python
if __name__ == "__main__":  
    show_MainWindow()
```

执行该python文件将显示如下主界面：

![Pasted image 20250801225319](/images/blog/train-tickets/Pasted%20image%2020250801225319.png)

## 分析网页请求参数
---

既然是爬票，那么一定需要一个爬取的对象，本项目实战将通过12306中国铁路客户服务中心所提供的查票请求地址获取火车票的相关信息。在发送请求时，地址中需要填写必要的参数否则后台将无法返回前台所需要的正确信息，所以首先需要分析网页请求参数，具体步骤如下：

1）浏览器打开12306官方网站`https://www.12306.cn/index/`，输入出发地与目的地，出发日期默认即可，点击查询后会发现新打开了一个页面`https://kyfw.12306.cn/otn/leftTicket/init`，这个页面才是我们的目标页面。输入出发地目的地及日期后，按下`F12`快捷键打开网络监视器，然后单击查询按钮，在网络监视器中将显示对应的网络请求，如图所示。

![Pasted image 20250731155223](/images/blog/train-tickets/Pasted%20image%2020250731155223.png)
![Pasted image 20250731155548](/images/blog/train-tickets/Pasted%20image%2020250731155548.png)

2）单击网络请求将显示请求细节的窗口，在该窗口中默认会显示消息头的相关数据，此处可以获取完整的请求地址，如图所示。

![Pasted image 20250731155738](/images/blog/train-tickets/Pasted%20image%2020250731155738.png)

>注意：随着12306官方网站的更新，请求地址会发生改变，要以当时获取的地址为准。

3）在请求地址的下方，请求头信息当中获取该请求地址中的Cookie信息，如图所示：

![Pasted image 20250731155955](/images/blog/train-tickets/Pasted%20image%2020250731155955.png)

4）在请求地址的上方选择参数选项，将显示该请求地址中的必要参数，如图所示：

![Pasted image 20250731160453](/images/blog/train-tickets/Pasted%20image%2020250731160453.png)

## 下载站名文件
---

得到了请求地址与请求参数后，可以发现请求参数中的出发地与目的地均为车站名的英文缩写。而这个英文缩写的字母是通过输入中文车站名转换而来的，所以需要在网页中仔细查找是否有将车站名自动转换为英文缩写的请求信息，具体步骤如下：

1）关闭并重新打开网络监视器，然后按下快捷键`F5`进行余票查询网页的刷新，此时在网络监视器中选择类型为`js`的网络请求。在文件类型中仔细分析文件内容是否有，与车站名相关的信息如图所示。

![Pasted image 20250731211908](/images/blog/train-tickets/Pasted%20image%2020250731211908.png)

>说明：在分析信息位置时，查询按钮仅仅实现了发送查票的网络请求，而并没有发现将文字转换为车站名缩写的相关处理，此时可以判断在进入余票查询页面时就已经得到了将车站名转换为英文缩写的相关信息，所以可以刷新页面查看网络监视器中的网络请求。

2）选中与车站名相关的网络请求，在请求细节中找到该请求的完整地址。然后在网页中打开该地址测试返回数据，如图所示。

![Pasted image 20250731212159](/images/blog/train-tickets/Pasted%20image%2020250731212159.png)

>说明：看到返回的车站名信息，此时可以确认根据该信息可以进行车站名汉字与对应的英文缩写进行转换。例如，可以在该条信息中找到天水南对应的是`TIJ`。由于该条信息并没有自动转换的功能，所以需要将该信息以文件的方式保存在项目中。当需要转换时在文件中查找对应的英文缩写即可。

3）打开PyCharm开发工具，在项目目录中右键菜单依次选择New → Python File，创建一个名称为`get_stations.py`文件，然后确保已成功安装requests模块即可。

4）在`get_stations.py`文件中分别导入`requests`模块、`re`模块及`os`模块，然后创建`getStation()`方法，该方法用于发送获取地址信息的网络请求，并将返回的数据转换为需要的类型。关键代码如下：

```python
stat = {}                                       # 设定一个全局变量存放地址转换字典信息
def getStation():  
    # 发送请求获取所有车站名称，通过输入的站名转换为查询地址的参数  
    url = 'https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=1.9346'  
    response = requests.get(url, verify=True) # 请求并进行验证  
    # 获取需要的车站名称  
    stations = re.findall(r'([\u4e00-\u9fa5]+)\|([A-Z]+)', response.text)  
    stations = dict((stations))                  # 转换为字典类型  
    global stat  
    stat = stations                              # 将结果存入全局变量stat  
    stations = str(stations)                     # 转换为字符串类型否则无法写入文件  
    write(stations)                              # 调用写入方法
```

>说明：requests模块为第三方模块，该模块主要用于处理网络请求；re模块为Python自带的模块，主要通过正则表达式匹配并处理相应的字符串；os模块为Python自带的模块，主要用于判断某个路径下的某个文件。

注意：随着12306官方网站的更新，请求地址会发生改变，要以当时获取的地址为准。

5）分别创建`write()`方法、`read()`方法及`isStations()`方法，分别用于写入文件、读取文件以及判断车站文件是否存在，代码如下：

```python
def write(stations):  
    file =open('stations.text','w',encoding='utf_8_sig')   # 以写模式打开文件  
    file.write(stations)                                   # 写入文件  
    file.close()  
  
def read():  
    file =open('stations.text','r',encoding='utf_8_sig')   # 以写模式打开文件  
    data = file.readline()                                 # 读取文件  
    file.close()  
    return data  
  
def isStations():  
    isStations = os.path.exists('stations.text')           # 判断车站文件是否存在  
    return isStations
```

6）打开`window.py`文件，首先导入`get_stations`文件下的所有方法，然后在模拟python的程序入口处修改代码。接下来判断是否存在所有车站信息的文件，如果没有该文件就下载车站信息的文件然后显示窗体，如果存在将直接显示窗体即可。修改后代码如下：

```python
from get_stations import * # 导入get_stations文件下的所有方法

if __name__ == "__main__":  
    if isStations() ==False:     # 判断是否存在所有车站的文件，没有就下载，有就直接显示窗体  
        getStation()             # 下载所有车站文件  
        show_MainWindow()        # 调用显示窗体的方法  
    else:  
        show_MainWindow()        # 调用显示窗体的方法
```

7）在`window.py`文件下，单击右键菜单中选择“Run 'window'”菜单运行主窗体，主窗体界面显示后在check tickets目录下将自动下载stations.text文件，如图所示，通过该文件可以实现车站名称与对应的英文缩写进行转换。

![Pasted image 20250731221559](/images/blog/train-tickets/Pasted%20image%2020250731221559.png)

## 车票信息的请求与显示
---

### 1  发送与分析车票信息的查询请求

得到了获取车票信息的网络请求地址，然后又分析出请求地址的必要参数以及车站名称转换的文件，接下来就需要将主窗体中输入的出发地、目的地以及出发日期三个重要的参数配置到查票的请求地址中，然后分析并接收所查询车票的对应信息。具体步骤如下：

1）在浏览器中打开如下图所示的查询请求地址。

![Pasted image 20250731223116](/images/blog/train-tickets/Pasted%20image%2020250731223116.png)

然后在浏览器中将以`json`的方式返回车票的查询信息，如图所示。

![Pasted image 20250731223611](/images/blog/train-tickets/Pasted%20image%2020250731223611.png)

>说明：在看到的加密信息后先分析数据中是否含有可用的信息，例如，网页中的预订、时间、车次，在上图中的加密信息中含有`G13`的字样和时间信息。然后对照浏览器中余票查询的页面，查找对应车次信息如图所示，此时可以判断返回的`json`信息确实含有可用数据。

![Pasted image 20250731223933](/images/blog/train-tickets/Pasted%20image%2020250731223933.png)

2）发现可用数据后，在项目中创建`query_request.py`文件，在该文件中首先导入`get_stations`文件下的所有方法，然后分别创建名称为`data`与`type_data`的列表（list）分别用于保存整理好的车次信息与分类后的车次信息。代码如下：

```python
import requests  
import get_stations  
from fake_useragent import UserAgent        # 导入伪造头部信息模块  
  
"""  
seat -> 3 车次 6 出发站 7 到达站 8 出发时间 9 到达时间 10 历时 32 商务/特等座 20 优选一等座 31 一等座 30 二等座  21 高级软卧 23 一等卧 28 二等卧 24 软座 29 硬座 26 无座  
"""  
  
data = []                                   # 用于保存整理好的车次信息  
type_data = []                              # 保存车次分类后最后的数据  
  
headers = {'User-Agent': UserAgent().random,  # 随机生成浏览器头部信息  
           'Cookie':'_uab_collina=175394...'}
```

>说明：由于返回的加密信息很杂乱，所以需要创建“data = []”列表（list）来保存后期整理好的车次信息，然后需要将车次分类（例如，高铁、动车等），最后创建`type_data = []`列表（list）来保存分类后的车次信息。

3）创建`query()`方法，在调用该方法时需要三个参数，分别为`出发日期`、`出发地`以及`目的地`；然后创建查询请求的完整地址，并通过`format()`方法格式化地址；再将返回的`json`数据转换为字典类型；最后通过字典类型键值的方法取出对应的数据并进行整理与分类。代码如下：

```python
def query(date,from_station, to_station):  
    data.clear()                               # 清空数据  
    type_data.clear()                          # 清空车次分类保存的数据  
    # 查询请求地址  
    url =   'https://kyfw.12306.cn/otn/leftTicket/queryU?leftTicketDTO.train_date={}&leftTicketDTO.from_station={}&leftTicketDTO.to_station={}&purpose_codes=ADULT'.format(date, stat_change(from_station), stat_change(to_station))  
    # 发送查询请求  
    response = requests.get(url,headers=headers)  
    # 将json数据转换为字典类型，通过键值对取数据  
    result = response.json()  
    result = result['data']['result']  
  
    # 判断车站文件是否存在  
    if get_stations.isStations():  
        with open('stations.text','r',encoding='UTF-8') as f:  
            stations = f.read()  
        stations = format_file(stations)        # 读取所有车站并转换为dic类型  
  
    if  len(result) != 0:                       # 判断返回数据是否为空  
        for i in result:  
            # 分割数据并添加到列表中  
            tmp_list = i.split('|')  
            global lis_info  
            t_list = [i for i in tmp_list]  
            lis_info.append(t_list)  
            # 因为查询结果中出发站和到达站为站名的缩写字母，所以需要在车站库中找到对应的车站名称  
            # 根据英文缩写的索引值查找对应的中文名  
            from_station = list(stations.keys())[list(stations.values()).index(tmp_list[6])]  
            to_station = list(stations.keys())[list(stations.values()).index(tmp_list[7])]  
            # 创建座位数组，由于返回的座位数据中含有空既“”，所以将空改成--这样好识别  
            """seat -> 车次 出发站 到达站 出发时间 到达时间 历时 商务/特等座 优选一等座 一等座 二等座  高级软卧 一等卧 二等卧 软座 硬座 无座"""  
            seat = [tmp_list[3], from_station, to_station, tmp_list[8], tmp_list[9], tmp_list[10],  
                    tmp_list[32], tmp_list[20], tmp_list[31], tmp_list[30], tmp_list[21], tmp_list[23],  
                    tmp_list[28], tmp_list[24], tmp_list[29],  tmp_list[26]]  
            newSeat = []  
            # 循环将座位信息中的空既""，改成--这样好识别  
            for s in seat:  
                if  s == "":  
                    s = "{}".format("--")  
                else:  
                    s = "{}".format(s)  
                newSeat.append(s) # 保存新的座位信息  
            data.append(newSeat)  
    return  data #  返回整理好的车次信息
```

以下是该函数所调用的其他两个函数体，如下：

```python
def stat_change(address):                         # 用来转换请求url中的地址名，将其转换为英文缩写  
    get_stations.getStation()  
    address = get_stations.stat.get(address)  
    return address  
  
def format_file(s : str) -> dict:  
    dic = {}  
    lis = s.strip('{').strip('}').split(',')  
    for i in lis:  
        i = i.split(':')  
        dic[eval(i[0])]=eval(i[1])  
    return dic
```

>说明：因为返回的`Json`信息顺序比较零乱，所以在获取指定的数据时通过`tmp_list`分割后的列表将数据与浏览器余票查询页面中的数据逐个对比后，才能找出数据所对应的位置。数字为数据分割后`tmp_list`的索引值。通过对比后找到的数据位置如下：

```python
"""  
3 车次 6 出发站 7 到达站 8 出发时间 9 到达时间 10 历时 32 商务/特等座 20 优选一等座 31 一等座 30 二等座  21 高级软卧 23 一等卧 28 二等卧 24 软座 29 硬座 26 无座  
"""
```

4）依次创建获取高铁信息、移除高铁信息、获取动车信息、移除动车信息、获取直达信息、移除直达信息、获取特快信息、移除特快信息、获取快速信息及移除快速信息...的方法。这些方法用于车次分类数据的处理，代码如下：

```python
# 获取高铁信息的方法  
def gc_vehicle():  
    if len(data) != 0:  
        for g in data:                   # 循环所有列车数据  
            if g[0].startswith("G") or g[0].startswith("C"):  # 判断车次首字母是否为高铁  
                type_data.append(g)  
# 移除高铁信息的方法  
def r_gc_vehicle():  
    if len(data) != 0 and len(type_data) != 0:  
        for g in data:  
            if g[0].startswith("G") or g[0].startswith("C"):  
                type_data.remove(g)  
  
# 获取动车信息的方法  
def d_vehicle():  
    if len(data) != 0:  
        for d in data:                   # 循环所有列车数据  
            i = d[0].startswith("D")     # 判断车次首字母是否为动车  
            if i:                        # 如果是，将该条数据添加到列车数据中  
                type_data.append(d)  
# 移除动车信息的方法  
def r_d_vehicle():  
    if len(data) != 0 and len(type_data) != 0:  
        for d in data:  
            i = d[0].startswith("D")  
            if i: type_data.remove(d)  
  
# 获取直达信息的方法  
def z_vehicle():  
    if len(data) != 0:  
        for z in data:                   # 循环所有列车数据  
            i = z[0].startswith("Z")     # 判断车次首字母是否为直达  
            if i:                        # 如果是，将该条数据添加到列车数据中  
                type_data.append(z)  
# 移除直达信息的方法  
def r_z_vehicle():  
    if len(data) != 0 and len(type_data) != 0:  
        for z in data:  
            i = z[0].startswith("Z")  
            if i: type_data.remove(z)  
  
# 获取特快信息的方法  
def t_vehicle():  
    if len(data) != 0:  
        for t in data:                   # 循环所有列车数据  
            i = t[0].startswith("T")     # 判断车次首字母是否为特快  
            if i:                        # 如果是，将该条数据添加到列车数据中  
                type_data.append(t)  
# 移除特快信息的方法  
def r_t_vehicle():  
    if len(data) != 0 and len(type_data) != 0:  
        for t in data:  
            i = t[0].startswith("T")  
            if i: type_data.remove(t)  
  
# 获取快速列车信息的方法  
def k_vehicle():  
    if len(data) != 0:  
        for k in data:                   # 循环所有列车数据  
            i = k[0].startswith("K")     # 判断车次首字母是否为快速列车  
            if i:                        # 如果是，将该条数据添加到列车数据中  
                type_data.append(k)  
# 移除快速列车信息的方法  
def r_k_vehicle():  
    if len(data) != 0 and len(type_data) != 0:  
        for k in data:  
            i = k[0].startswith("K")  
            if i: type_data.remove(k)  
  
# 获取复兴号信息的方法  
def cr_vehicle():  
    if len(data) != 0:  
        for r in data:                   # 循环所有列车数据  
            i = r[0].startswith("CR")     # 判断车次首字母是否为复兴号  
            if i:                        # 如果是，将该条数据添加到列车数据中  
                type_data.append(r)  
# 移除复兴号信息的方法  
def r_cr_vehicle():  
    if len(data) != 0 and len(type_data) != 0:  
        for r in data:  
            i = r[0].startswith("CR")  
            if i: type_data.remove(r)  
  
# 获取智能动车组信息的方法  
def crz_vehicle():  
    if len(data) != 0:  
        for z in data:                   # 循环所有列车数据  
            if z[0].startswith("CR") and z[0].endswith("Z"):    # 判断车次首字母是否为智能动车组  
                type_data.append(z)  
# 移除智能动车组信息的方法  
def r_crz_vehicle():  
    if len(data) != 0 and len(type_data) != 0:  
        for z in data:  
            if z[0].startswith("CR") and z[0].endswith("Z"):  
                type_data.remove(z)  
  
# 获取其他类型信息的方法  
def other_vehicle():  
    if len(data) != 0:  
        l = ['G','C','T','K','Z','D','CR']  
        for o in data:  
            if o[0][0] not in l:              # 判断车次是否为其他类型  
                type_data.append(o)  
# 移除其他类型信息的方法  
def r_other_vehicle():  
    if len(data) != 0 and len(type_data) != 0:  
        l = ['G','C','T','K','Z','D','CR']  
        for o in data:  
            if o[0][0] not in l: type_data.remove(o)
```

### 2  在主窗体中显示查票信息

完成了车票信息查询请求的文件后，接下来需要将获取的车票信息显示在快手爬票的主窗体当中。具体实现步骤如下：

1）打开`window.py`文件，导入`PyQt5.QtCore`模块中的Qt类，然后导入`PyQt5.QtWidgets`模块与`PyQt5.QtGui`模块下的所有方法，再导入`query_request`文件中的所有方法。代码如下：

```python
from PyQt5.QtGui import *  
from PyQt5.QtCore import Qt  
from PyQt5.QtWidgets import *  
from query_request import *
```

2）在`setupUi()`方法中找到用于显示车票信息的`tableView`表格控件。然后为该控件设置相关属性，关键代码如下：

```python
self.tableView = QtWidgets.QTableView(self.centralwidget)  
self.tableView.setGeometry(QtCore.QRect(0, 340, 1131, 431))  
self.tableView.setObjectName("tableView")  
self.model = QStandardItemModel()  # 创建存储数据的模式  
# 根据空间自动改变列宽度并不可修改列宽度  
self.tableView.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)  
# 设置表头不见  
self.tableView.horizontalHeader().setVisible(False)  
# 纵向表头不可见  
self.tableView.verticalHeader().setVisible(False)  
# 设置表格内容文字大小  
font = QtGui.QFont()  
font.setPointSize(10)  
self.tableView.setFont(font)  
# 设置表格内容不可编辑  
self.tableView.setEditTriggers(QAbstractItemView.NoEditTriggers)  
# 垂直滚动条始终开启  
self.tableView.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOn)
```

3）导入time模块，该模块提供了用于处理时间的各种方法。然后在代码块的最外层创建get_time()方法用于获取系统的当前日期，再创建is_valid_date()方法用于判断输入的日期是否是一个有效的日期字符串，代码如下：

```python
import time
def get_time():  
    # 获取当前时间的时间戳  
    now = int(time.time())  
    # 转换为其他日期格式，如：%Y-%m-%d %H:%M:%S  
    timeStruct = time.localtime(now)  
    str_Time = time.strftime("%Y-%m-%d %H:%M:%S", timeStruct)  
    return str_Time  
  
def is_valid_date(str_Time):  
    """判断是否是一个有效的日期字符串"""  
    try:  
        time.strptime(str_Time, "%Y-%m-%d")  
        return True  
    except:  
        return False
```

4）依次创建`change_G()`、`change_D()`、`change_Z()`、`change_T()`、`change_K()`、`change_CR()`、`change_CRZ()`、`change_Other()`方法，以上方法均为车次分类复选框的事件处理，由于代码几乎相同，此处提供关键代码如下：

```python
# 高铁复选框事件处理  
def change_G(self,state):  
    # 选中将高铁信息添加到最后要显示的数据当中  
    if state == QtCore.Qt.Checked:  
        # 获取高铁信息  
        query("2025-08-10","天水南","西安北")# 测试数据  
        gc_vehicle()  
        # 通过表格显示该车型数据  
        self.displayTable(len(type_data),16,type_data)  
    else:  
        # 取消选中状态将移除该数据  
        r_gc_vehicle()  
        self.displayTable(len(type_data),16,type_data)
```

5）创建`change_All()`方法，该方法用于将所有车次分类复选框勾选处理方法，代码如下：

```python
def change_ALL(self,state):  
    if state == QtCore.Qt.Checked:  
        self.checkBox_G.setChecked(True)  
        self.checkBox_D.setChecked(True)  
        self.checkBox_Z.setChecked(True)  
        self.checkBox_EMU.setChecked(True)  
        self.checkBox_T.setChecked(True)  
        self.checkBox_K.setChecked(True)  
        self.checkBox_O.setChecked(True)  
        self.checkBox_F.setChecked(True)  
    else:  
        self.checkBox_G.setChecked(False)  
        self.checkBox_D.setChecked(False)  
        self.checkBox_Z.setChecked(False)  
        self.checkBox_EMU.setChecked(False)  
        self.checkBox_T.setChecked(False)  
        self.checkBox_K.setChecked(False)  
        self.checkBox_O.setChecked(False)  
        self.checkBox_F.setChecked(False)
```

6）创建`messageDialog()`方法，用于显示主窗体非法操作的消息提示框；创建`displayTable()`方法，用于显示车次信息的表格与内容。代码如下：

```python
# 异常提示框  
def messageDialog(self, title, message):  
    msg = QMessageBox(QMessageBox.Warning, title, message)  
    msg.exec_()  
  
# 更新表单  
def displayTable(self, row_count, col_count, data):  
    self.model.setRowCount(row_count)  # 设置行数  
    self.model.setColumnCount(col_count)  # 设置列数  
    for row in range(row_count):  
        for col in range(col_count):  
            item = QStandardItem(str(data[row][col]))  # data是二维列表  
            self.model.setItem(row, col, item)  
    self.tableView.setModel(self.model)  # 重新绑定模型（确保刷新）
```

7）创建`on_click()`方法，该方法是查询按钮的单击事件。在该方法中首先获取出发地、目的地与出发日期三个编辑框的输入内容，然后对三个编辑框中输入的内容进行合法检测，符合规范后调用query()方法提交车票查询的请求并且将返回的数据赋值给data，最后通过调用`displayTable()`方法实现在表格中显示车票查询的全部信息。代码如下：

```python
# 查询按钮的单击事件  
  
def on_click(self):  
  
    get_from = self.textEdit.toPlainText()  # 获取出发地  
    get_to = self.textEdit_2.toPlainText()  # 获取到达地  
    get_date = self.textEdit_3.toPlainText()  # 获取出发时间  
    # 判断车站文件是否存在  
    if isStations() == True:  
        stations = give_dic()  # 读取所有车站并转换为dic类型  
        # 判断所有参数是否为空，以及出发地、目的地、出发日期  
        if get_from != "" and get_to != "" and get_date != "":  
            # 判断输入的车站名称是否存在，以及时间格式是否正确  
            if get_from in stations and get_to in stations and is_valid_date(get_date):  
                # 获取输入的日期是当前年初到现在一共过了多少天  
                inputYearDay = time.strptime(get_date, "%Y-%m-%d").tm_yday  
                # 获取系统当前日期是当前年初到现在一共过了多少天  
                yearToday = time.localtime(time.time()).tm_yday  
                # 计算时间差，也就是输入的日期减掉系统当前的日期  
                timeDifference = inputYearDay - yearToday  
                # 判断时间差为0时证明是查询当前的查票  
                # 以及29天以后的车票，12306官方要求只能查询30天以内的车票  
                if timeDifference >= 0 and timeDifference <= 28:  
                    # 在所有车站文件中找到对应的参数  
                    from_station = stations[get_from]  # 出发地  
                    to_station = stations[get_to]  # 目的地  
                    # 发送查询请求，并获取返回的信息  
                    data = query(get_date, from_station, to_station)  
                    self.checkBox_default()  # 调用取消勾选所有车次分类复选框  
                    if len(data) != 0:  # 判断返回的数据是否为空  
                        # 如果不是空的数据就将车票信息显示在表格中  
                        self.displayTable(len(data), 16, data)  
                    else:  
                        self.messageDialog('警告', '没有返回的网络数据！')  
                else:  
                    self.messageDialog('警告','超出查询日期的范围内,不可查询昨天的车票信息,以及29天以后的车票信息！')  
            else:  
                self.messageDialog('警告', '输入的站名不存在,或日期格式不正确！')  
        else:  
            self.messageDialog('警告', '请填写车站名称！')  
    else:  
        self.messageDialog('警告', '未下载车站查询文件！')
```

8）在`retranslateUi()`方法中，首先设置出发日期的编辑框中显示系统的当前日期，然后设置查询按钮的单击事件，最后分别设置高铁、动车、直达、特快以及快车复选框选中与取消事件。关键代码如下：

```python
self.textEdit_3.setText(get_time())
self.pushButton.clicked.connect(self.on_click)  
self.checkBox_G.stateChanged.connect(self.change_G)  
self.checkBox_D.stateChanged.connect(self.change_D)  
self.checkBox_Z.stateChanged.connect(self.change_Z)  
self.checkBox_T.stateChanged.connect(self.change_T)  
self.checkBox_K.stateChanged.connect(self.change_K)  
self.checkBox_O.stateChanged.connect(self.change_O)  
self.checkBox_F.stateChanged.connect(self.change_F)  
self.checkBox_EMU.stateChanged.connect(self.change_EMU)  
self.checkBox_ALL.stateChanged.connect(self.change_ALL)
```

（9）在window.py文件下，单击右键，选择“Run 'window'”菜单运行主窗体，然后输入符合规范的出发地、目的地与出发日期，单击查询按钮将显示如图35所示。

![Pasted image 20250801224854](/images/blog/train-tickets/Pasted%20image%2020250801224854.png)
