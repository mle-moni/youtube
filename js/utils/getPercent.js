function getPercent(downloaded, total, precision = 2) {
	return (downloaded / total * 100).toFixed(precision);
}

module.exports = getPercent;
