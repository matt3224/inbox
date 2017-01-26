/*----------------------------------------------*\
	#SETUP WINDOW
\*----------------------------------------------*/

const {app, Menu, BrowserWindow} = require('electron');
const {appUpdater} = require('./autoupdater');

const path = require('path');
const fs = require('fs');


let win;

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

    win.loadURL(`file://${__dirname}/index.html`);
    
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
    
    /*  Menus  */

    const template = [
        {
            label: app.getName(),
            submenu: [
                { role: 'about' },
                {
                    label: 'Check for Updates...',
                    click: function() {
                        appUpdater();
                    }
                },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'delete' },
                { role: 'selectall' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'CmdOrCtrl+I',
                    click: function( item, focusedWindow ) {
                        focusedWindow && focusedWindow.webContents.send( 'openDevTools' );
                    }
                },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            role: 'window',
            submenu: [
                { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
                { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
                { label: 'Zoom', role: 'zoom' },
                { type: 'separator' },
                { label: 'Bring All to Front', role: 'front' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'GitHub Repository', click () {
                        require('electron').shell.openExternal('https://github.com/matt3224/inbox');
                    }
                }
            ]
        }
    ];
    
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    
    try {
        appUpdater();
    }
    catch(e) {}
    
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


