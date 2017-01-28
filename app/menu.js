const {app, Menu, shell} = require('electron');

module.exports = function() {
    const template = [
        {
            label: app.getName(),
            submenu: [
                { role: 'about' },
                {
                    label: 'Check for Updates...',
                    click: function() {
                        appUpdateCheck();
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
                        shell.openExternal('https://github.com/matt3224/inbox');
                    }
                }
            ]
        }
    ];
    
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};