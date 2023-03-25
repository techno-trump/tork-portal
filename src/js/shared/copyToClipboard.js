export const initCopyToClipboard = ({ preventDefault } = {}) => {
	if (!isSecureContext) return;
	const inputElems = document.querySelectorAll("[data-to-clipboard]");

	const clickHandler = (event) => {
		if (preventDefault) event.preventDefault();
		const { currentTarget } = event;
		const value = stripValue(currentTarget);

		//navigator.clipboard.writeText(value);

		currentTarget.classList.add("with-tooltip_visible");
		// currentTarget.style.setProperty("--tooltip-top", "10px");
		// currentTarget.style.setProperty("--tooltip-left", "10px");

		setTimeout(() => {
			currentTarget.classList.remove("with-tooltip_visible");
		}, 3000);
	}

	inputElems.forEach(elem => {
		elem.classList.add("with-tooltip");
		elem.addEventListener("click", clickHandler);
	});
}
function stripValue(elem) {
	const href = elem.getAttribute("href");
	if (href) return href.startsWith("mailto:") ? href.slice(7) : href;
	return "";
}