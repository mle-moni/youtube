function downloadBasicMP4(url, filePath) {
	let stream = ytdl(url, { filter: 'audioandvideo' })
		.on('progress', (_, downloaded, total) => {
			gui.progressStandalone.value = getPercent(downloaded, total);
		});
	const fileToCreate = `${filePath}.mp4`;

	stream.pipe(fs.createWriteStream(fileToCreate))
	.on('finish', () => {
		gui.endBox.style.display = "block";
		gui.waitBox.style.display = "none";
		localStorage.setItem("lastVideo", fileToCreate);
	});
	gui.setBox.style.display = "none";
	gui.waitBox.style.display = "block";
}

module.exports = downloadBasicMP4;