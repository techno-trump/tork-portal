export const throttle = (callback, delay) => {
	let timeOut = null, argsMemo;

	return (...args) => {
		if(timeOut) {
			argsMemo = args;
		} else {
			callback(...args);
			timeOut = setTimeout(() => {
				if (argsMemo) {
					callback(...argsMemo);
					argsMemo = null;
				}
				timeOut = null;
			}, delay);
		}
	}
}
export const throttleByKey = (callback, delay) => {
	const memo = new Map();
	let timeOut = null, argsMemo;

	return (key, ...args) => {
		if (timeOut) {
			memo.set(key, args);
		} else {
			callback(...args);
			timeOut = setTimeout(() => {
				memo.forEach((args) => {
					callback(...args);
				});
				memo.clear();
				timeOut = null;
			}, delay);
		}
	}
}