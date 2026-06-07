---
title: "Python-操作数据库"
date: "2025-07-12"
description: "Python数据库操作：sqlite3/sqlalchemy连接、CRUD操作、事务处理与连接池。"
tags: ["Python", "基础"]
---
---
## 数据库编程接口
在项目开发中，数据库应用必不可少。虽然数据库的种类有很多，如SQLite、MySQL、Oracle等，但是它们的功能基本都是一样的，为了对数据库进行统一的操作，大多数语言都提供了简单的、标准化的数据库接口(API)。在Python Database API 2.0规范中，定义了Python数据库API接口的各个部分，如**模块接口、连接对象、游标对象、类型对象和构造器、DB API的可选扩展以及可选的错误处理机制**等。下面重点介绍一下**数据库API接口中的连接对象和游标对象**。

### 连接对象

**数据库连接对象（Connection Object）主要提供获取数据库游标对象和提交、回滚事务的方法，以及关闭数据库连接。**

##### 1）获取连接对象

如何获取连接对象呢？这就需要使用`connect()`函数。该函数有多个参数，具体使用哪个参数，取决于使用的数据库类型。例如，需要访问Oracle数据库和MySQL数据库，则必须同时下载Oracle和MySQL数据库模块。这些模块在获取连接对象时，都需要使用`connect()`函数。`connect()`函数常用的参数及说明如表所示。

| **参    数** |     **说    明**     |
| :--------: | :----------------: |
|    dsn     | 数据源名称，给出该参数表示数据库依赖 |
|    user    |        用户名         |
|  password  |        用户密码        |
|    host    |        主机名         |
|  database  |       数据库名称        |

例如，使用PyMySQL模块连接MySQL数据库，示例代码如下：

```python
conn = pymysql.connect(host='localhost',
                       user='user',
                       password='passwd',
                       db='test',
                       charset='utf8',
                       cursorclass=pymysql.cursors.DictCursor)
```

>说明：上述代码中，`pymysql.connect()`使用的参数与表1中并不完全相同。在使用时，要以具体的数据库模块为准。

##### 2）连接对象的方法

`Connect()`函数**返回连接对象**。这个对象表示目前和数据库的会话，连接对象支持的方法如下表所示。

| **方  法  名** |          **说    明**           |
| :---------: | :---------------------------: |
|   close()   |            关闭数据库连接            |
|  commit()   |             提交事务              |
| rollback()  |             回滚事务              |
|  cursor()   | 获取游标对象，操作数据库，如执行DML操作，调用存储过程等 |

`commit()`方法用于提交事务，事务主要用于处理数据量大、复杂度高的数据。如果操作的是一系列的动作，比如张三给李四转账，有如下2个操作：

- 张三账户金额减少
- 李四账户金额增加

这时**使用事务**可以**维护数据库的完整性**，保证2个操作要么全部执行，要么全部不执行。

### 游标对象

**游标对象（Cursor Object）代表数据库中的游标，用于指示抓取数据操作的上下文，主要提供执行SQL语句、调用存储过程、获取查询结果等方法。**

如何获取游标对象呢？通过使用连接对象的cursor()方法，可以获取到游标对象。游标对象的属性如下所示：

- `description`：数据库列类型和值的描述信息。
- `rowcount`：回返结果的行数统计信息，如SELECT、UPDATE、CALLPROC等。

游标对象的方法如下表所示。

|              **方  法  名**              |            **说    明**            |
| :-----------------------------------: | :------------------------------: |
|   callproc(procname,[, parameters])   |          调用存储过程，需要数据库支持          |
|                close()                |              关闭当前游标              |
|   execute(operation[, parameters])    |       执行数据库操作，SQL语句或者数据库命令       |
| executemany(operation, seq_of_params) |           用于批量操作，如批量更新           |
|              fetchone()               |          获取查询结果集中的下一条记录          |
|            fetchmany(size)            |            获取指定数量的记录             |
|              fetchall()               |            获取结果集的所有记录            |
|               nextset()               |           跳至下一个可用的结果集            |
|               arraysize               |    指定使用fetchmany()获取的行数，默认为1     |
|         setinputsizes(sizes)          |   设置在调用execute*()方法时分配的内存区域大小    |
|         setoutputsize(sizes)          | 设置列缓冲区大小，对大数据列（如LONGS和BLOBS）尤其有用 |
## 使用SQLite

与许多其他数据库管理系统不同，SQLite不是一个客户端/服务器结构的数据库引擎，而是一种嵌入式数据库，它的数据库就是一个文件。SQLite将整个数据库，包括定义、表、索引以及数据本身，作为一个单独的、可跨平台使用的文件存储在主机中。由于SQLite本身是C写的，而且体积很小，所以，经常被集成到各种应用程序中。Python就内置了SQLite3，所以在Python中使用SQLite，不需要安装任何模块，直接使用。

### 创建数据库文件

由于Python中已经内置了SQLite3，所以可以直接使用import语句导入SQLite3模块。Python操作数据库的通用的流程如图所示。

![Pasted image 20250721100354](/images/blog/python-basics/Pasted%20image%2020250721100354.png)

示例：创建一个info.db的数据库文件，然后执行SQL语句创建一个user（用户表），user表包含id和name两个字段。具体代码如下：

```python
import sqlite3

# 连接到SQLite数据库
# 数据库文件是info.db，如果文件不存在，会自动在当前目录创建
conn = sqlite3.connect('info.db')

# 创建一个Cursor
cursor = conn.cursor()

# 执行一条SQL语句，创建user表                   
cursor.execute('create  table  user (id int(10)  primary key, name varchar(20))')

# 关闭游标
cursor.close()

# 关闭Connection
conn.close()
```

上述代码中，使用`sqlite3.connect()`方法连接SQLite数据库文件info.db，由于info.db文件并不存在，所以会在本实例Python代码同级目录下创建info.db文件，该文件包含了user表的相关信息。info.db文件所在目录如图所示。

![Pasted image 20250721101112](/images/blog/python-basics/Pasted%20image%2020250721101112.png)

>说明：再次运行示例时，会提示错误信息：`sqlite3.OperationalError:table user alread exists`，这是因为user表已经存在。

### 操作SQLite

##### 1）新增用户数据信息

为了向数据表中新增数据，可以使用如下SQL语句：

```sql
insert into 表名(字段名1,字段名2,…,字段名n)  values (字段值1,字段值2,…,字段值n)
```

在user表中，有2个字段，字段名分别为`id`和`name`。而字段值需要根据字段的数据类型来赋值，如id是一个长度为10的整型，`name`是长度为20的字符串型数据。向user表中插入3条用户信息记录，则SQL语句如下：

```python
cursor.execute('insert into user (id, name) values ("1", "xiaozhang")')
cursor.execute('insert into user (id, name) values ("2", "xiaolan")')
cursor.execute('insert into user (id, name) values ("3", "xiaoliu")')
```

下面通过一个实例介绍向SQLite数据库中插入数据的流程。

**新增用户数据信息**

由于在示例中已经创建了user表，所以本实例可以直接操作user表，向user表中插入3条用户信息。此外，由于是新增数据，需要使用`commit()`方法提交事务。因为对于增加、修改和删除操作，使用`commit()`方法提交事务后，如果相应操作失败，可以使用`rollback()`方法回滚到操作之前的状态。新增用户数据信息具体代码如下：

```python
import sqlite3

# 连接到SQLite数据库
# 数据库文件是info.db
# 如果文件不存在，会自动在当前目录创建
conn = sqlite3.connect('info.db')

# 创建一个Cursor
cursor = conn.cursor()

# 执行一条SQL语句，插入一条记录
cursor.execute('insert into user (id, name) values ("1", "xiaozhang")')
cursor.execute('insert into user (id, name) values ("2", "xiaolan")')
cursor.execute('insert into user (id, name) values ("3", "xiaoliu")')

# 关闭游标
cursor.close()

# 提交事务
conn.commit()

# 关闭Connection
conn.close()
```

运行该实例，会向user表中插入3条记录。为验证程序是否正常运行，可以再次运行，如果提示如下信息，说明插入成功（因为user表中已经保存了上一次插入的记录，所以再次插入会报错）。

```
sqlite3.IntegrityError: UNIQUE constraint failed: user.id
```

##### 2）查看用户数据信息

查找user表中的数据可以使用如下SQL语句：

```sql
select  字段名1,字段名2,字段名3,… from 表名  where 查询条件
```

查看用户信息的代码与插入数据信息大致相同，不同点在于使用的SQL语句不同。此外，查询数据时通常使用如下3种方式：

- `fetchone()`：获取查询结果集中的下一条记录。
- `fetchmany(size)`：获取指定数量的记录。
- `fetchall()`：获取结果集的所有记录。

下面通过一个实例来学习这3种查询方式的区别。

**使用3种方式查询用户数据信息**

1）分别使用`fetchone`、`fetchmany`和`fetchall`这3种方式查询用户信息，具体代码如下：

```python
import sqlite3

# 连接到SQLite数据库,数据库文件是info.db
conn = sqlite3.connect('info.db')

# 创建一个Cursor
cursor = conn.cursor()

# 执行查询语句
cursor.execute('select * from user')

# 获取查询结果
result1 = cursor.fetchone()
print(result1)

# 关闭游标
cursor.close()

# 关闭Connection
conn.close()
```

使用`fetchone()`方法返回的`result1`为一个元组，执行结果如下：

```
(1, 'xiaozhang')
```

2）修改实例代码，将获取查询结果的语句块代码修改为：

```python
result2 = cursor.fetchmany(2)     # 使用fetchmany方法查询多条数据
print(result2)
```

使用`fetchmany()`方法传递一个参数，其值为2，默认为1。返回的`result2`为一个列表，列表中包含2个元组，运行结果如下：

```
[(1, 'xiaozhang'), (2, 'xiaolan')]
```

3）修改实例代码，将获取查询结果的语句块代码修改为：

```python
result3 = cursor.fetchall()         # 使用fetchmany方法查询多条数据
print(result3)
```

使用`fetchall()`方法返回的`result3`为一个列表，列表中包含所有user表中数据组成的元组，运行结果如下：

```
[(1, 'xiaozhang'), (2, 'xiaolan'), (3, 'xiaoliu')]
```

4）修改实例代码，将获取查询结果的语句块代码修改为：

```python
cursor.execute('select * from user where id > ?',(1,))
result3 = cursor.fetchall()
print(result3)
```

在select查询语句中，使用问号作为占位符代替具体的数值，然后使用一个元组来替换问号（注意，不要忽略元组中最后的逗号），元组类似于传参会将值传给占位符。上述查询语句等价于：

```python
cursor.execute('select * from user where id > 1')
```

执行结果如下：

```
[(2, 'xiaolan'), (3, 'xiaoliu')]
```

>说明：使用占位符的方式可以避免SQL注入的风险，推荐使用这种方式。

##### 3）修改用户数据信息

修改user表中的数据可以使用如下SQL语句：

```sql
update  表名  set 字段名 = 字段值  where 查询条件
```

下面通过一个实例来学习一下如何修改表中数据。

**修改用户数据信息**

将SQLite数据库中user表ID为1的数据name字段值`xiaozhang`修改为`Xiao`，并使用`fetchall`获取表中的所有数据。具体代码如下：

```python
import sqlite3

# 连接到SQLite数据库，数据库文件是info.db
conn = sqlite3.connect('info.db')

# 创建一个Cursor:
cursor = conn.cursor()
cursor.execute('update user set name = ? where id = ?',('Xiao',1))
cursor.execute('select * from user')
result = cursor.fetchall()
print(result)

# 关闭游标
cursor.close()

# 提交事务
conn.commit()

# 关闭Connection:
conn.close()
```

执行结果如下：

```
[(1, 'Xiao'), (2, 'xiaolan'), (3, 'xiaoliu')]
```

##### 4）删除用户数据信息

删除user表中的数据可以使用如下SQL语句：

```sql
delete  from 表名  where 查询条件
```

下面通过一个实例来学习如何删除表中数据。

**删除用户数据信息**

将SQLite数据库中user表ID为1的数据删除，并使用`fetchall`获取表中的所有数据，查看删除后的结果。具体代码如下：

```python
import sqlite3

# 连接到SQLite数据库，数据库文件是info.db
conn = sqlite3.connect('info.db')

# 创建一个Cursor:
cursor = conn.cursor()
cursor.execute('delete from user where id = ?',(1,))
cursor.execute('select * from user')
result = cursor.fetchall()
print(result)

# 关闭游标
cursor.close()

# 提交事务
conn.commit()

# 关闭Connection:
conn.close()
```

执行上述代码后，user表中ID为1的数据将被删除。运行结果如下：

```
[(2, 'xiaolan'), (3, 'xiaoliu')]
```

## 使用MySQL
### 安装PyMySQL

由于MySQL服务器以独立的进程运行，并通过网络对外服务，所以，需要支持Python的MySQL驱动来连接到MySQL服务器。在Python中支持MySQL的数据库模块有很多，我们选择使用PyMySQL。

PyMySQL的安装比较简单，在终端中执行如下命令：

```shell
pip install pymysql
```

运行结果如图12所示。

![Pasted image 20250721105513](/images/blog/python-basics/Pasted%20image%2020250721105513.png)

### 连接数据库

使用数据库的第一步是连接数据库。接下来使用PyMySQL连接数据库。由于PyMySQL也遵循Python Database API 2.0规范，所以操作MySQL数据库的方式与SQLite相似。我们可以通过类比的方式来学习。

**使用PyMySQL连接数据库**

前面我们已经创建了一个MySQL连接`studyPython`，并且在安装数据库时设置了数据库的用户名“root”和密码“123456”。下面通过connect()方法连接MySQL数据库info，具体代码如下：

```python
import pymysql

# 打开数据库连接，参数1：主机名或IP；参数2：用户名；参数3：密码；参数4：数据库名称
db = pymysql.connect(  
    host="localhost",  
    user="root",  
    password="123456",  
    db="info" 
)

# 使用cursor()方法创建一个游标对象cursor
cursor = db.cursor()

# 使用execute()方法执行SQL查询
cursor.execute("SELECT VERSION()")

# 使用fetchone()方法获取单条数据
data = cursor.fetchone()
print ("Database version : %s " % data)

# 关闭数据库连接
db.close()
```

上述代码中，首先使用connect()方法连接数据库，然后使用`cursor()`方法创建游标，接着使用`excute()`方法执行SQL语句查看MySQL数据库版本，然后使用`fetchone()`方法获取数据，最后使用`close()`方法关闭数据库连接。执行结果如下：

```
Database version : 8.0.41 
```

### 创建数据表

数据库连接成功以后，我们就可以为数据库创建数据表了。下面通过一个实例，使用`execute()`方法来为数据库创建表books图书表。

**创建books图书表**

books表包含id（主键）、name（图书名称），category（图书分类），price（图书价格）和publish_time（出版时间）5个字段。创建books表的SQL语句如下：

```sql
CREATE TABLE books (
  id int(8) NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  category varchar(50) NOT NULL,
  price decimal(10,2) DEFAULT NULL,
  publish_time date DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

在创建数据表前，使用如下语句：

```sql
DROP TABLE IF EXISTS `books`;
```

如果info数据库中已经存在books，那么先删除books，然后再创建books数据表。具体代码如下：

```python
import pymysql

# 打开数据库连接
db = pymysql.connect(  
    host="localhost",  
    user="root",  
    password="123456",  
    db="info" 
)

# 使用cursor()方法创建一个游标对象cursor
cursor = db.cursor()

# 使用 execute()方法执行SQL，如果表存在则删除
cursor.execute("DROP TABLE IF EXISTS books")

# 使用预处理语句创建表
sql = """
CREATE TABLE books (
  id int(8) NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  category varchar(50) NOT NULL,
  price decimal(10,2) DEFAULT NULL,
  publish_time date DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
"""

# 执行SQL语句
cursor.execute(sql)

# 关闭数据库连接
db.close()
```

运行上述代码后，info数据库下就已经创建了一个books表。打开DataGrip（如果已经打开，则进行刷新），发现info数据库下多了一个books表，双击books，效果如图所示。

![Pasted image 20250721131222](/images/blog/python-basics/Pasted%20image%2020250721131222.png)

### 操作MySQL数据表

MySQL数据表的操作主要包括数据的增删改查，与操作SQLite类似，这里我们通过一个实例讲解如何向books表中新增数据，至于修改、查找和删除数据则不再赘述。

**向books图书表添加图书数据**

在向books图书表中插入图书数据时，可以使用`excute()`方法添加一条记录，也可以使用`executemany()`方法批量添加多条记录，`executemany()`方法的语法格式如下：

```python
executemany(operation, seq_of_params)
```

- `operation`：操作的SQL语句。
- `seq_of_params`：参数序列。

`executemany()`方法批量添加多条记录的具体代码如下：

```python
import pymysql

# 打开数据库连接
db = pymysql.connect(  
    host="localhost",  
    user="root",  
    password="123456",  
    db="info" 
)

# 使用cursor()方法获取操作游标
cursor = db.cursor()

# 数据列表
data = [("零基础学Python",'Python','79.80','2018-5-20'),
        ("Python从入门到精通",'Python','69.80','2018-6-18'),
        ("零基础学PHP",'PHP','69.80','2017-5-21'),
        ("PHP项目开发实战入门",'PHP','79.80','2016-5-21'),
        ("零基础学Java",'Java','69.80','2017-5-21'),
        ]
try:
    # 执行sql语句，插入多条数据
    cursor.executemany("insert into books(name, category, price, publish_time) values (%s,%s,%s,%s)", data)
    
    # 提交数据
    db.commit()

except:

    # 发生错误时回滚
    db.rollback()

# 关闭数据库连接
db.close()
```

注意：

（1）使用`connect()`方法连接数据库时，额外设置字符集`charset=utf-8`，可以防止插入中文时出错。
（2）在使用`insert`语句插入数据时，使用`%s`作为占位符，可以防止SQL注入。

运行上述代码，在DataGirp中查看books表数据，如图所示。

![Pasted image 20250721133636](/images/blog/python-basics/Pasted%20image%2020250721133636.png)


