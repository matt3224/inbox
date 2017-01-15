/*----------------------------------------------*\
	#SETUP WINDOW
\*----------------------------------------------*/

const {app, Menu, BrowserWindow} = require('electron');
const {appUpdater} = require('./autoupdater');

let win;

function createWindow() {
    
    win = new BrowserWindow({
        
        width : 1280,
        height : 1024,
        titleBarStyle : 'hidden-inset',
        title : 'Inbox',
        transparent : true,
        vibrancy : 'light'
    });

    win.loadURL(`file://${__dirname}/index.html`);
    
    //win.openDevTools();
    
    win.on('closed', function() {
        
        win = null
    });
    
    /*  COPY & PASTE  */

    let template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]
    }, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    }];
    
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    appUpdater();
    
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


