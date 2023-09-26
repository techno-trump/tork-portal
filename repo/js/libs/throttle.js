export const throttle = (callback, delay, options = {}) => {
	let timeOut = null, argsMemo;

	return (...args) => {
		if(timeOut) {
			argsMemo = args;
		} else {
			if (options.noLeadingCall) {
				argsMemo = args;
			} else {
				callback(...args);
			}
			schedule();
		}
		function schedule() {
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
export const throttleByKey = (callback, delay, { noLeadingCall } = {}) => {
	const memo = new Map();
	let timeOut = null, argsMemo;

	return (key, ...args) => {
		if (timeOut) {
			memo.set(key, args);
		} else {
			if (noLeadingCall) {
				memo.set(key, args);
			} else {
				callback(...args);
			}
			schedule();
		}
		function schedule() {
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