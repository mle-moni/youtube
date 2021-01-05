const errorDiv = document.getElementById("errorDiv");
const errorText = document.getElementById("errorText");

const inputVideoURL = document.getElementById("videoURL");
const inputFileName = document.getElementById("fileName");
const inputFolderPath = document.getElementById("folderPath");
const inputOptions = document.getElementById("inputOptions");

const setBox = document.getElementById("setBox");
const waitBox = document.getElementById("waitBox");
const endBox = document.getElementById("endBox");
const percentsBox = document.getElementById("percentsBox");

const progressStandalone = document.getElementById("progressStandalone");
const progressVideo = document.getElementById("progressVideo");
const progressAudio = document.getElementById("progressAudio");

module.exports = {
	errorDiv,
	errorText,
	inputVideoURL,
	inputFileName,
	inputFolderPath,
	inputOptions,
	setBox,
	waitBox,
	endBox,
	percentsBox,
	progressStandalone,
	progressVideo,
	progressAudio
};
