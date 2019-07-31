/*const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow*/

const {app, BrowserWindow, ipcMain} = require('electron')

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let isDev = true;
let splash;
let mainWindow;

let mainFrameLoaded = false;
let closeWd = false;

let initFile = null;

// 保证单一窗口启动，安装serialport后不可用，原因未明
const gotTheLock = true;//app.requestSingleInstanceLock();

app.on('second-instance', (commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
    }
})

//单例模式，第二个窗口直接退出
if (!gotTheLock) {
    return app.quit()
} else {
    //第一个窗口需要执行的逻辑
    //Chromium cmd
    app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');
    // app.commandLine.appendSwitch('enable-gpu-rasterization', 'true');
    app.commandLine.appendSwitch('enable-zero-copy', 'true');
    app.commandLine.appendSwitch('disable-software-rasterizer', 'false');
    app.commandLine.appendSwitch('enable-native-gpu-memory-buffers', 'true');
    app.commandLine.appendSwitch('no-proxy-server');

    function sendStartConfig(){
        const startConfig = {
        };
        mainWindow.webContents.send("start", startConfig);
    }

    // 设置应用名称
    //app.setName('IoT Desktop');

    // 退出前显示确认框
    app.showExitPrompt = true;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', function(){
        createWindow()
    })

    function createWindow () {
        console.log("cwd", app.getAppPath());
        // Create the loading window
        splash = new BrowserWindow({
            width: 349,
            height: 413,
            backgroundColor: '#fff',
            frame: false
        })
        splash.loadURL(`file://${__dirname}/loading.html`)

        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 800,
            minHeight: 600,
            icon:'./public/img/icon.png',
            show: false,
            webPreferences: {
                webgl: true,
                nativeWindowOpen: true
            }
        })

        console.log('load')
        // and load the index.html of the app.
        //mainWindow.loadURL(`file://${__dirname}/index.html`)
        mainWindow.loadURL(url.format({
            pathname:path.join(__dirname,'index.html'),
            protocol:'file:',
            slashes:true
        }))

        mainWindow.setMenu(null);

        mainWindow.webContents.on("did-stop-loading", () => {
            if(!mainFrameLoaded){ // fix for frame switching
            sendStartConfig();
            //open dev windows
            if (isDev) {
              mainWindow.webContents.openDevTools({ mode: "detach" });
             }
            mainFrameLoaded = true;
            if (initFile){
                mainWindow.webContents.send('opensb3', initFile);
            }
        }
    });

        mainWindow.once('ready-to-show', () => {
            mainWindow.show()
        splash.close();

    });

        mainWindow.on('close', function(e){
            console.log("close notify");

            closeWd = true;
            e.preventDefault();
            mainWindow.webContents.send('closeapp', '');
            setTimeout(() => {
                if (closeWd) app.exit(0);
        }, 500);
        });
        // Open the DevTools.
        //mainWindow.webContents.openDevTools()

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null
        })
    }

    app.on('open-file', (event, path)=>{
        event.preventDefault();
    filePath = path;
    if (process.platform === 'win32' && process.argv.length > 1) {
        filePath = process.argv[1];
    }
    if (mainWindow) {
        mainWindow.webContents.send('opensb3', path);
    }
})

    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        //console.log('close')
        //if (process.platform !== 'darwin') {
        app.quit()
        //}
    })

    app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.

        if (mainWindow === null) {
            createWindow()
        }
    })

    //communicate with html

    //登录窗口最小化
    ipcMain.on('window-min',function(){
        mainWindow.minimize();
    })
    //登录窗口最大化
    ipcMain.on('window-max',function(){
        if(mainWindow.isMaximized()){
            mainWindow.restore();
        }else{
            mainWindow.maximize();
        }
    })
    //关闭窗口
    ipcMain.on('window-close',function(){
        console.log('revClose')
        //app.exit(0);
        closeWd = false;
        // mainWindow.close();
    })
    // 刷新界面
    ipcMain.on('refreshWeb', function (){
        console.log("refreshWeb");
        mainWindow.loadURL(`file://${__dirname}/index.html`)
    })
}

