function downloadMP3(url, filePath) {
	let stream = ytdl(url, { quality: 'highestaudio' })
		.on('progress', (_, downloaded, total) => {
			gui.progressStandalone.value = getPercent(downloaded, total);
		});
	const fileToCreate = `${filePath}.mp3`;

	gui.setBox.style.display = "none";
	gui.waitBox.style.display = "block";
	
	ffmpegFluent(stream)
		.audioBitrate(128)
		.save(fileToCreate)
		.on("end", () => {
			gui.endBox.style.display = "block";
			gui.waitBox.style.display = "none";
			localStorage.setItem("lastVideo", fileToCreate);
		})
}

module.exports = downloadMP3;
