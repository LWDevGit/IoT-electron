# IoT-electron
## 版本
>1.0.0 (003)
## 版本描述
>增加的功能
- 发送回车
- 自动换行（基于定时器固定时间间隔，后续版本改为按波特率动态调整判断的间隔）
- 波特率选择列表
- 增加各事件的监控和处理
- 优化数据接收的方式
>准备增加的功能
- ascii和hex的转换
- 校验位，数据位，停止位的设置
- 波特率的动态修改
- 自定义波特率
- 动态刷新COM
- 定时发送数据

## 说明
>采用electron框架，基于serialport
- Milestone1： 串口调试助手
- Milestone2： blockbot和ikakabot系列机器人的控制器

## 界面
![image](https://github.com/LinWeiGitHub/IoT-electron/blob/master/ui.png)

## 使用
- step1 工具准备
    - CMD管理员模式
    - 安装node-gyp
    - 安装python2.7
    - 安装vs build tools或vs
- step2 安装serialport
    - npm install serialport
- step3 electron-rebuild
    - npm install electron-rebuild --save-dev
- step4 安装各种依赖
    - npm install
- step5 重新编译
    - npm install electron-prebuilt --save-dev
    - .\node_modules\.bin\electron-rebuild.cmd
- step6 启动
    - npm start

## 参考资料

### 开发指南
- [electron文档](https://electronjs.org/docs)
- [serialport文档](https://serialport.io/docs/guide-usage)
- [jQuery教程](https://www.runoob.com/jquery/jquery-tutorial.html)

### 开源代码
- [electron-serialport](https://github.com/PowerDos/electron-serialport)

### 技术文章
- [在electron中使用node-serialport的正确姿势](https://github.com/FakeFullStack/QA/issues/2)
