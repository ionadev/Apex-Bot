const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

exports.showSeconds = duration => {
  	const seconds = Math.floor(duration / SECOND) % 60;
	if (duration < MINUTE) return seconds === 1 ? 'a second' : `${seconds} seconds`;

	const minutes = Math.floor(duration / MINUTE) % 60;
	let output = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	if (duration >= HOUR) {
		const hours = Math.floor(duration / HOUR);
		output = `${hours.toString().padStart(2, '0')}:${output}`;
	}

	return output;
};

exports.splitText = (str, length) => {
	const x = str.substring(0, length).lastIndexOf(' ');
	const pos = x === -1 ? length : x;
	return str.substring(0, pos);
};

exports.getDifference = (a, b) => {
	a = a.toLowerCase();
	b = b.toLowerCase();
	var i = 0;
	var j = 0;
	var result = '';

	while (j < b.length) {
		if (a[i] != b[j] || i == a.length) { result += b[j]; } else { i++; }
		j++;
	}
	return result;
};
