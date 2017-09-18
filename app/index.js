/*----------------------------------------------*\
	#SETUP WINDOW
\*----------------------------------------------*/

let win;
let first = true;

const {app, BrowserWindow} = require('electron');
const {appUpdater} = require('./autoupdater');

const path = require('path');
const fs = require('fs');

const menu = require('./menu');

function createWindow() {

    const initPath = path.join(app.getPath('userData'), 'init.json');

    let data = {};

    try {

        data = JSON.parse(fs.readFileSync(initPath, 'utf8'));
    }
    catch(e) {}

    win = new BrowserWindow({

        width : data.bounds ? data.bounds.width : 1280,
        height : data.bounds ? data.bounds.height : 1024,
        x : data.pos ? data.pos[0] : null,
        y : data.pos ? data.pos[1] : null,
        titleBarStyle : 'hidden-inset',
        title : 'Inbox',
        transparent : true,
        vibrancy : 'light'
    });

    win.loadURL(`file://${__dirname}/../web/index.html`);

    //win.openDevTools();

    function saveWin() {

        data.bounds = win.getBounds();
        data.pos = win.getPosition();

        fs.writeFileSync(initPath, JSON.stringify(data));
    }

    win.on('resize', saveWin);

    win.on('move', saveWin);

    win.on('closed', function() {

        win = null;
    });

    first = false;

    menu();

    /*  END  */
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {

    if (process.platform !== 'darwin') {

        app.quit();
    }
});

app.on('activate', function() {

    if (win === null) {

        createWindow();
    }
});


