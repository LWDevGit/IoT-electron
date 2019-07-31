# IoT-electron
## 版本
>1.0.0 r01
## 版本描述
>完成electron项目创建，加入ipc通信、serialport，移植electron-serialport代码

## 说明
>blockbot及ikakabot系列机器人控制器应用程序，采用electron框架，基于串口通信

## 界面
![ui界面](https://github.com/LinWeiGitHub/IoT-electron/ui.png)

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

### 开源代码
- [electron-serialport](https://github.com/PowerDos/electron-serialport)

### 技术文章
- [在electron中使用node-serialport的正确姿势](https://github.com/FakeFullStack/QA/issues/2)