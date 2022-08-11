const {app, BrowserWindow, ipcMain, Tray, Menu} = require('electron');
const axios = require('axios');

app.dock.hide()

const path = require('path');

let tray = undefined
let window = undefined

// Don't show the app in the doc

app.on('ready', () => {
  createTray()
  createWindow()
})

const createTray = () => {
  tray = new Tray(path.join('./assets/icon-tray.png'))
  tray.on('click', function (event) {
    toggleWindow()
  });
  tray.setIgnoreDoubleClickEvents(true)
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return {x: x, y: y};
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 520,
    height: 420,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: true,
    transparent: false,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
    }
  })
  window.setAlwaysOnTop(true);

  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  // window.loadURL(`https://translate.google.com.hk/?hl=en&sl=auto&tl=zh-CN&op=translate`)
  // window.webContents.openDevTools()
  // Hide the window when it loses focus
  // window.on('blur', () => {
  //   if (!window.webContents.isDevToolsOpened()) {
  //     window.hide()
  //   }
  // })
}

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
}

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
}

ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('translate', (e, args) => {
  console.log(args)

  var data = `async=translate,sl:en,tl:zh-CN,st:${args},id:1660197075856,qc:true,ac:false,_id:tw-async-translate,_pms:s,_fmt:pc`;

  var config = {
    method: 'post',
    url: 'https://www.google.com/async/translate?vet=12ahUKEwjo1p79i775AhUyy4sBHStwC6oQqDh6BAgDECs..i&ei=vZj0YqiEN7KWr7wPq-Ct0Ao&client=firefox-b-d&yv=3&cs=0',
    headers: { 
      'User-Agent': ' Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0', 
      'Content-Type': ' application/x-www-form-urlencoded;charset=utf-8', 
      'Cookie': '1P_JAR=2022-08-11-06; NID=511=fTbETNYmSrn1m7PbHQxZ_4Kulf9nIoWDCwsdzllIOtodZ1nUwz6-1IBQwHLrO0mKM4ZIqV7avdpzqaHhakB_F67zNiVUFZIwbFFmWhAztf0hDfW_gr6nDacN-E2NXu_7AVGCgMhAOw0JUMDfta0bfxrjKwSpt7Qphjt-8LWarY8'
    },
    data : data
  };

  axios(config).then(function (response) {
    console.log(JSON.stringify(response.data));
    e.reply('translated', response.data);
  }).catch(function (error) {
    console.log(error);
  });

})
