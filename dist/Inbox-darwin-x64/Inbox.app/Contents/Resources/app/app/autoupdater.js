'use strict';
const os = require('os');
const {app, autoUpdater, dialog} = require('electron');
const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64

const updaterFeedURL = 'http://inbox-app.herokuapp.com/update/' + platform + '/' + version;

let notify = false;

function appUpdater() {
    
	autoUpdater.setFeedURL(updaterFeedURL);

	autoUpdater.on('error', err => {
    	
    	console.log(err);
    	
    	notify && dialog.showMessageBox({
        	type : 'error',
        	buttons : ['Okay'],
        	message : 'Awh something went wrong',
        	details : 'Perhaps inform Matt and let him know that he\'s a shocking excuse for a developer'
        });
    });
	autoUpdater.on('checking-for-update', () => console.log('Checking for update'));
	autoUpdater.on('update-available', () =>  console.log('There is an update available'));
	autoUpdater.on('update-not-available', () => {
    	
    	console.log('No update available');
    	
    	notify && dialog.showMessageBox({
        	type : 'info',
        	buttons : ['Okay'],
        	message : 'You’re up-to-date!',
        	detail : app.getName() + ' ' + app.getVersion() + ' is currently the newest version available.'
        });
    });

	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    	
		let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.';
		
		if (releaseNotes) {
			const splitNotes = releaseNotes.split(/[^\r]\n/);
			message += '\n\nRelease notes:\n';
			splitNotes.forEach(notes => {
				message += notes + '\n\n';
			});
		}

		dialog.showMessageBox({
			type : 'question',
			buttons : ['Install and Relaunch', 'Later'],
			defaultId : 0,
			message : 'A new version of ' + app.getName() + ' has been downloaded',
			detail : message
		}, response => {
    		
			if (response === 0) {
    			
				setTimeout(() => autoUpdater.quitAndInstall(), 1);
			}
		});
	});
	
	autoUpdater.checkForUpdates();
}

function appUpdateCheck() {
    notify = true;
    autoUpdater.checkForUpdates();
}

exports = module.exports = {
	appUpdater,
	appUpdateCheck
};