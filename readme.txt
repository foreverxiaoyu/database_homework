V1.1 modify by jxy & hj
1.添加了注册，登录功能，且与数据库连接上了,与数据库连接详见config.py
2.添加了有关数据库表的创建以及相关表的操作的代码注释
3.添加了register.html以及register.js
4.修改了login.html，将部分代码移植到了register.html中，去除了login.js的使用(原因:email是key，而username可能重复,所以提交form是将username改成了email)
问题
1.还要在login.html和login.js中加入从/login跳转到/register的功能

V1.2 by ktp
1.修改了数据库结构
2.添加了一段关于收藏视频页面的代码（注释部分）

V1.3 modify by jxy
1.重构了底层代码，已弃用原来的网页cookie以及g.user在resources.html的使用，改用本地的session(cookie还是有，只不过没用)
2.与HJ的代码进行了整合
3.加入从/login跳转到/register的功能
4.修改了V1.2的英语单词拼写错误以及部分表
计划:
1.用户登录后可以上传视频(video_url,以及pic_url)

V1.4 modify by ktp & hj
1.创建了相关视频表完成了视频浏览功能
2.完成了视频收藏功能

V2.0 modify by jxy & hj & ktp
1.将代码好不容易的整合到了一起
2.实现了个人中心界面以及与数据库的的连接
3.测试了所有功能,修复了BUG,做了演示视频

