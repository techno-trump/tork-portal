import "./sliders.js";
import { initAccordeon } from "../../shared/accordeon.js";
import { initAmountSelectors } from "../../shared/initAmountSelectors.js";


window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	initAccordeon("#product-card-accordeon");
	initAmountSelectors();
	initOrderSubmit();

	onDrawerInputChange("textures", getOnTextureChangeHandler());
	onDrawerCardClick("textures", () => window.drawers.close("textures"));
	const shapeSamplesThumbsDrawer = drawers.get("shape-samples-thumbs");
	shapeSamplesThumbsDrawer.on("close", () => {
		drawers.close("shape-samples-gallery");
	});
	const textureSamplesThumbsDrawer = drawers.get("texture-samples-thumbs");
	textureSamplesThumbsDrawer.on("close", () => {
		drawers.close("texture-samples-gallery");
	});
	initDrawersOverlappingControl();
}
function onDrawerCardClick(alias, callback) {
	const drawerElem = document.querySelector(`[data-drawer=${alias}]`);
	if (drawerElem) {
		drawerElem.addEventListener("click", (event) => {
			const { target } = event;
			if (target.closest(".drawer-palette__item-inner")) callback(event);
		});
	}
}
function onDrawerInputChange(alias, callback) {
	const drawerElem = document.querySelector(`[data-drawer=${alias}]`);
	if (drawerElem) {
		drawerElem.addEventListener("change", (event) => {
			callback(event);
		});
	}
}
function initOrderSubmit() {
	const formElem = document.forms["order-options"];
	formElem.addEventListener("submit", (event) => {
		event.preventDefault();
		const formData = new FormData(formElem);

		Promise.resolve()
			.then(() => drawers.open("quick-cart"));
	});
}
function getOnTextureChangeHandler() {
	const buttonElem = document.querySelector("#texture-select");
	return ({ target }) => {
		const newValue = document.forms["order-options-form"].texture.value;
		if (!newValue) {
			buttonElem.firstElementChild.textContent = buttonElem.firstElementChild.getAttribute("data-default-text");
		} else {
			const newVisibleValue = target.parentElement.lastElementChild.textContent;
			buttonElem.firstElementChild.textContent = newVisibleValue;
		}
	}
};
function initDrawersOverlappingControl() {
	const mediaMatch = window.matchMedia("(max-width: 992px)");
	const handler = ({ matches }) => {
		drawers.get("shape-samples-gallery").overlapping = matches;
		drawers.get("texture-samples-gallery").overlapping = matches;
	}
	mediaMatch.addListener(handler);
	handler(mediaMatch);
}