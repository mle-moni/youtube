const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
	ipcRenderer.removeAllListeners('app_version');
	const version = document.getElementById('version');
	version.innerText = 'Version ' + arg.version;
});

ipcRenderer.on('update_available', () => {
	ipcRenderer.removeAllListeners('update_available');
	message.innerText = 'Une nouvelle mise à jour est disponible, téléchargement en cours...';
	notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
	ipcRenderer.removeAllListeners('update_downloaded');
	message.innerText = "Mise à jour téléchargée. Elle sera installée au prochain lancement de l'application. Relancer maintenant ?";
	restartButton.classList.remove('hidden');
	notification.classList.remove('hidden');
});

function closeNotification() {
	notification.classList.add('hidden');
}

function restartApp() {
	ipcRenderer.send('restart_app');
}
