const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const { ipcRenderer, shell } = require('electron')
const path = require("path");

const errorDiv = document.getElementById("errorDiv");
const errorText = document.getElementById("errorText");

const inputVideoURL = document.getElementById("videoURL");
const inputFileName = document.getElementById("fileName");
const inputFolderPath = document.getElementById("folderPath");

const setBox = document.getElementById("setBox");
const waitBox = document.getElementById("waitBox");
const endBox = document.getElementById("endBox");

const previousPath = localStorage.getItem("folderPath");
if (previousPath !== null) {
	inputFolderPath.value = previousPath;
}

function resetPage() {
	inputFileName.value = "";
	inputVideoURL.value = "";
	endBox.style.display = "none";
	endBox.style.display = "none";
	setBox.style.display = "block";
}

function chooseFolder() {
	ipcRenderer.send('chooseFolder');
}

function openFolder() {
	shell.showItemInFolder(window.lastVideo);
	resetPage();
}

ipcRenderer.on("folderChosen", (event, folderPath) => {
	if (folderPath == null) {
		showErrorDiv("Choisissez un dossier valide.")
		return;
	}
	inputFolderPath.value = folderPath;
	localStorage.setItem("folderPath", folderPath);
});


async function downloadMP4(url, filename) {
	if (!ytdl.validateURL(url)) {
		showErrorDiv("Le lien de la video semble incorrect !");
		return;
	}
	let stream = ytdl(url, {
		filter: 'audioandvideo'
	});
	const fileToCreate = `${filename}.mp4`;

	stream.pipe(fs.createWriteStream(fileToCreate))
	.on('finish', () => {
		endBox.style.display = "block";
		waitBox.style.display = "none";
		window.lastVideo = fileToCreate;
	});
	setBox.style.display = "none";
	waitBox.style.display = "block";
}

function hideErrorDiv() {
	errorDiv.style.display = "none";
}
function showErrorDiv(textContent) {
	errorText.innerText = textContent;
	errorDiv.style.display = "block";
}

document.getElementById("startDownload").addEventListener("click", () => {
	const url = inputVideoURL.value;
	if (inputFileName.value == "") {
		showErrorDiv("Vous devez donner un nom a votre fichier !");
		return;
	}
	const filePath = path.join(inputFolderPath.value, inputFileName.value);
	downloadMP4(url, filePath);
});
