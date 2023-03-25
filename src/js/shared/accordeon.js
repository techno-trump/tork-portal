import _ from "lodash";
const resetHeight = _.throttle(({ target }) => {
		console.log(target);
	const parentItem = target.closest(".accordeon-item");
	if (parentItem.contains)
	target.parentElement.style.height = `${target.offsetHeight}px`;
}, 25);
const observer = new ResizeObserver((entries) => {
	entries.forEach(resetHeight);
});

export function initAccordeon (rootSelector) {
	const rootElem = document.querySelector(rootSelector);

	rootElem.addEventListener("click", ({target}) => {
		if (!target.closest(".accordeon-header")) return;
		const itemElem = target.closest(".accordeon-item");
		const bodyElem = itemElem.querySelector(".accordeon-body");
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