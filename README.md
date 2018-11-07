# skiping
跳绳计数小程序源代码
![跳绳计数小程序](https://upload-images.jianshu.io/upload_images/3466493-5fd8fc8ddab1eb2d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
最近一段时间,小孩子上小学了,每天下课作业里面有一项是1分钟跳绳。作为家长陪跳计数，一边提醒一边计数总容易忘记，所以萌生了写一个小程序辅助的想法。
功能很简单，就是倒计时然后记录跳绳多少个，花了一周多的业余时间上线了一个完整版本。页面请设计的同事帮忙弄了一下，总共就2个页面如下：

![主页面](https://upload-images.jianshu.io/upload_images/3466493-dc1104da97f2e398.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![历史记录](https://upload-images.jianshu.io/upload_images/3466493-adeecd70de6c0daf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

用到的技术点如下：

1.倒计时（这个看似简单的功能，折腾了不少时间）

2.小程序按钮声音

3.存储数据的小程序云开发

4.以及部分页面逻辑处理

从网上找的倒计时代码或多或少总有点问题,直接递减的方案时间容易偏快或者偏慢.一开始参考了这个项目 http://git.oschina.net/dotton/CountDown 发现使用setTimeout在小程序里循环调用会导致内存溢出.后来改用setInterval解决了内存溢出的问题.

按钮声音使用了wx.createInnerAudioContext()具体使用方法可以参考官方文档https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html
小程序的云开发对于这种小型应用真的是比较方便,一方面不需要自己准备服务器,另一方面直接用JS写服务端对于前端开发者提供了相当大的便利.代价就是有一定的学习成本,用过数据库的使用云函数应该没什么大问题.

项目开发过程中还是碰到了很多或多或少的问题,唯一的解决之道就是花时间去搞懂并解决它.
这里决定把源代码公开分享,希望抛砖迎玉,一起学习.


