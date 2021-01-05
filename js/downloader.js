const fs = require("fs");
const path = require("path");
const cp = require('child_process');
// external modules
const ytdl = require("ytdl-core");
const { ipcRenderer, shell } = require('electron');
const ffmpegFluent = require("fluent-ffmpeg");
const ffmpeg = require('ffmpeg-static');

// my modules
const downloadBasicMP4 = require("./js/downloadBasicMP4");
const downloadMaxResMP4 = require("./js/downloadMaxResMP4");
const gui = require("./js/domElements");
const getPercent = require("./js/utils/getPercent");

const previousPath = localStorage.getItem("folderPath");
if (previousPath !== null) {
	gui.inputFolderPath.value = previousPath;
}

function resetPage() {
	gui.inputFileName.value = "";
	gui.inputVideoURL.value = "";
	gui.endBox.style.display = "none";
	gui.percentsBox.style.display = "none";
	gui.setBox.style.display = "block";
	gui.progressStandalone.removeAttribute("value");
	gui.progressVideo.removeAttribute("value");
	gui.progressAudio.removeAttribute("value");
}

function chooseFolder() {
	ipcRenderer.send('chooseFolder');
}

function openFolder() {
	const lastVideo = localStorage.getItem("lastVideo");
	if (lastVideo) {
		shell.showItemInFolder(lastVideo);
	}
	resetPage();
}

ipcRenderer.on("folderChosen", (event, folderPath) => {
	if (folderPath == null) {
		showErrorDiv("Choisissez un dossier valide.")
		return;
	}
	gui.inputFolderPath.value = folderPath;
	localStorage.setItem("folderPath", folderPath);
});

function hideErrorDiv() {
	gui.errorDiv.style.display = "none";
}
function showErrorDiv(textContent) {
	errorText.innerText = textContent;
	gui.errorDiv.style.display = "block";
}

document.getElementById("startDownload").addEventListener("click", () => {
	const url = gui.inputVideoURL.value;
	if (gui.inputFileName.value == "") {
		showErrorDiv("Vous devez donner un nom a votre fichier !");
		return;
	}
	if (!ytdl.validateURL(url)) {
		showErrorDiv("Le lien de la video semble incorrect !");
		return;
	}
	const filePath = path.join(gui.inputFolderPath.value, gui.inputFileName.value);
	chooseOption(url, filePath);
});

document.getElementById("hideErrorButton").onclick = hideErrorDiv;

function chooseOption(url, filePath) {
	switch (inputOptions.value) {
		case "mp4":
			downloadBasicMP4(url, filePath);
			break;
		case "mp4-hd":
			downloadMaxResMP4(url, filePath);
			break;
		case "mp3":
			break;
	}
}
