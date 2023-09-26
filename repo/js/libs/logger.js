const onlyErrorsToConsole = true;
const consoleLogs = true;
const consoleDebug = true;
const alertOnError = false;
const alertOnLog = false;

export function log(...args) {
	if (!onlyErrorsToConsole) {
		if (consoleLogs) console.log(...args);
		if (alertOnLog) alert(args.join(" :: "));
	}
}
export function debug(...args) {
	if (!onlyErrorsToConsole && consoleDebug) console.debug(...args);
}
export function error(...args) {
	if (!onlyErrorsToConsole && consoleDebug) console.error(...args);
	if (alertOnError) alert(args.join(" :: "));
}