import { throttleByKey } from "./throttle.js";

const isHtmlElem = (elem) => {
	return elem && typeof elem === "object" && "tagName" in elem || false;
}
const stack = new Map();
const setVars = (elem, prefix, width, height) => {
	elem.style.setProperty(`--${prefix}block-width`, width);
	elem.style.setProperty(`--${prefix}block-height`, height);
};
const handleResize = throttleByKey((target) => {
	if (!stack.has(target)) return;
	const { elem, prefix, container } = stack.get(target);
	const holder = isHtmlElem(container) ? container : elem;
	setVars(holder, prefix, elem.clientWidth, elem.clientHeight);
}, 100);
const observer = new ResizeObserver((entries) => {
	entries.forEach(({ target }) => {
		handleResize(target, target);
	});
});
const registerElem = (elem, prefix, containerElemOrSelector) => {
	const normalizedPrefix = prefix ? `${prefix}-` : "";
	if (isHtmlElem(containerElemOrSelector)) {
		stack.set(elem, { elem, prefix: normalizedPrefix, container: containerElemOrSelector });
	} else {
		const container = elem.closest(containerElemOrSelector);
		stack.set(elem, { elem, prefix: normalizedPrefix, container });
	}
	observer.observe(elem);
}
export const setBlockSizeVars = (elemOrSelector, prefix, containerElemOrSelector) => {
	if (typeof elemOrSelector === "string") {
		const elems = document.querySelectorAll(elemOrSelector);

		elems.forEach(elem => registerElem(elem, prefix, containerElemOrSelector));
	} else {
		registerElem(elemOrSelector, prefix, containerElemOrSelector);
	}
};