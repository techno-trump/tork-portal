export const debounce = (callback, delay) => {
	let timeOut = null;

	return (...args) => {
		if(timeOut) {
			clearTimeout(timeOut);
			timeOut = null;
		}
		timeOut = setTimeout(() => {
			timeOut = null;
			callback(...args);
		}, delay);
	}
}