
import { throttle } from "../../js/libs/throttle.js";
import { log } from "../../js/libs/logger.js";

const resetHeight = throttle(({ target }) => {
	const parentItem = target.closest(".accordeon__item");
	if (parentItem.classList.contains("open")) target.parentElement.style.height = `${target.offsetHeight}px`;
}, 25);

const observer = new ResizeObserver((entries) => {
	entries.forEach(resetHeight);
});

export default function initAccordeon (rootSelector) {
		log("initAccordeon::start: ", rootSelector);
	const rootElem = document.querySelector(rootSelector);

	rootElem.addEventListener("click", ({target}) => {
		if (!target.closest(".accordeon__item-header")) return;
		const itemElem = target.closest(".accordeon__item");
		const bodyElem = itemElem.querySelector(".accordeon__item-body");
		const bodyInnerElem = bodyElem.firstElementChild;
		if (itemElem.classList.contains("open")) {
			bodyElem.style.height = '';
			itemElem.classList.remove("open");
			observer.unobserve(bodyInnerElem);
		} else {
			bodyElem.style.height = `${bodyInnerElem.offsetHeight}px`;
			itemElem.classList.add("open");
			observer.observe(bodyInnerElem);
		}
	});
}