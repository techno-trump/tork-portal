export function isEmpty(value) {
	return value === null || value === undefined || value === "";
}
export function getTargetElem(target) {
	if (target instanceof HTMLElement) {
		return target;
	} else {
		const elem = document.querySelector(target);
		if (!elem) new Error(`Cannot find the target by selector: ${target}`);
		return elem;
	}
}
export function formatPrice(value) {
	const normalizedValue = typeof value === "string" ? value.trim().replace(" ", "") : String(value);
	const result = [];
	const tmp = normalizedValue.split("");
	// return normalizedValue.split(/\B(?=(\d{3})+$)/).join(" ");
	while (tmp.length > 0) {
		result.unshift(tmp.splice(-3).join(""));
	}
	return result.join(" ");
}
export function forEachProp(obj, callback) {
	var keys = Object.keys(obj);
	for (var i = 0; i < keys.length; i++) {
			callback(keys[i], obj[keys[i]]);
	}
};
export const createElem = (name, attrs, container) => {
	var el = document.createElement(name);
	if (attrs) forEachProp(attrs, function(key, value) {
			return el.setAttribute(key, value);
	});
	if (container) container.appendChild(el);
	return el;
}
export const normalizeString = (value) => {
	return String(value).toLowerCase().trim();
}