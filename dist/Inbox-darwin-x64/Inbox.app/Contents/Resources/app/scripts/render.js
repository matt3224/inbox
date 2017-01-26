const {shell, ipcRenderer, remote} = require('electron');
const fs = require('fs');

const {Menu, app} = remote;

let css;


fs.readFile(__dirname + '/styles/inbox.css', "utf-8", function(error, data) {
    
    if(!error){
        
        css = data.replace(/\s{2,10}/g, ' ').trim();
    }
});


onload = () => {
    
    const webview = document.getElementById('webview');
    
    const context = Menu.buildFromTemplate([
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        { label: 'Reload', click() { webview.reload() } },
        { label: 'Back', click() { webview.goBack() } }
    ]);
    
    webview.addEventListener("dom-ready", function(){
        
        webview.insertCSS(css);
    });
    
    const wait = (function(){
        
        var timer = 0;
        
        return function(callback, ms){
            
            clearTimeout (timer);
            
            timer = setTimeout(callback, ms);
        };
    })();
    
    let loaded = false;
    
    const loadstart = () => {
        
        document.querySelector('.status').classList.remove('status--bad', 'status--good', 'status--confused');
        
        if ( !loaded ) {
            
            setTimeout(function(){
        
                document.querySelector('.intro').classList.remove('intro--hide');
            }, 750);
        }
    };
    
    const loadstop = () => {
        
        loaded = true;
        
        wait(function(){
            
            document.querySelector('.intro').classList.add('intro--hide');
            
            setTimeout(function(){
                
                document.querySelector('.webview').classList.add('webview--show');
            }, 250);
        }, 250);
    };
    
    const loadFail = () => {
        
        document.querySelector('.status').classList.add('status--bad');
        
        document.querySelector('.status__button').innerHTML = 'Reload';
        
        document.querySelector('.status__message').innerHTML = 'Oh no! The Myth of the Internet continues';
    };

    const handleRedirect = (e) => {
        
        if ( e.url.includes('?authuser=') || e.url.includes('accounts.google.com') ) {

            e.preventDefault();
            
            webview.loadURL(e.url);
        }
        
        else if( ! e.url.includes(webview.getURL()) ) {

            e.preventDefault();

            shell.openExternal(e.url);
        }
    };

    const switcher = (e) => {

        if ( e.ctrlKey && (e.keyCode === 49 || e.keyCode === 50) ) {

            let user = e.keyCode === 49 ? '0' : '1';

            loaded = false;

            document.querySelector('.webview').classList.remove('webview--show');

            document.querySelector('.intro').classList.add('intro--hide');

            webview.loadURL('https://inbox.google.com/u/0/?authuser=' + user);
        }
    };
    
    const button = () => {
        
        if ( document.querySelector('.status').classList.contains('status--bad') ) {
        
            webview.reload();
        }
    };
    
    webview.addEventListener('did-start-loading', loadstart);
    
    webview.addEventListener('did-stop-loading', loadstop);
    
    webview.addEventListener('did-fail-load', loadFail);

    webview.addEventListener('will-navigate', handleRedirect);

    webview.addEventListener('new-window', handleRedirect);

    webview.addEventListener('keyup', switcher);

    document.querySelector('.js-button').addEventListener('click', button);
    
    ipcRenderer.on( 'openDevTools', () => {
        
        document.querySelector( 'webview' ).openDevTools();
    });
    
    webview.addEventListener('contextmenu', (e) => {
        
        e.preventDefault();
        
        context.popup(remote.getCurrentWindow());
        
    }, false);

};