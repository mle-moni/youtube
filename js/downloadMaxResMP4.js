/**
 * Reencode audio & video without creating files first
 *
 * Requirements: ffmpeg, ether via a manual installation or via ffmpeg-static
 *
 * If you need more complex features like an output-stream you can check the older, more complex example:
 * https://github.com/fent/node-ytdl-core/blob/cc6720f9387088d6253acc71c8a49000544d4d2a/example/ffmpeg.js
 */

function downloadMaxResMP4(url, filePath) {
	// Global constants
	const tmpName = "out.mkv";
	const fileToCreate = `${filePath}.mp4`;

	gui.setBox.style.display = "none";
	gui.percentsBox.style.display = "block";
	
	// Get audio and video streams
	const audio = ytdl(url, { quality: 'highestaudio' })
		.on('progress', (_, downloaded, total) => {
			gui.progressAudio.value = getPercent(downloaded, total);
		});
	const video = ytdl(url, { quality: 'highestvideo' })
		.on('progress', (_, downloaded, total) => {
			gui.progressVideo.value = getPercent(downloaded, total);
		});

	try {
		fs.unlinkSync(tmpName);
	} catch (error) {}
	
	// Start the ffmpeg child process
	const ffmpegProcess = cp.spawn(ffmpeg, [
	  // Remove ffmpeg's console spamming
	  '-loglevel', '8', '-hide_banner',
	  // Redirect/Enable progress messages
	  '-progress', 'pipe:3',
	  // Set inputs
	  '-i', 'pipe:4',
	  '-i', 'pipe:5',
	  // Map audio & video from streams
	  '-map', '0:a',
	  '-map', '1:v',
	  // Keep encoding
	  '-c:v', 'copy',
	  // Define output file
	  tmpName,
	], {
	  windowsHide: true,
	  stdio: [
		/* Standard: stdin, stdout, stderr */
		'inherit', 'inherit', 'inherit',
		/* Custom: pipe:3, pipe:4, pipe:5 */
		'pipe', 'pipe', 'pipe',
	  ],
	});
	ffmpegProcess.on('close', () => {
		// Cleanup
		ffmpegFluent("out.mkv")
			.outputOptions("-c:v", "copy") // this will copy the data instead or reencode it
			.save(fileToCreate);
		localStorage.setItem("lastVideo", fileToCreate);
		percentsBox.style.display = "none";
		endBox.style.display = "block";
	});
	audio.pipe(ffmpegProcess.stdio[4]);
	video.pipe(ffmpegProcess.stdio[5]);
}

module.exports = downloadMaxResMP4;
