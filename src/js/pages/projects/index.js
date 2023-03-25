import "./sliders.js";
import { initOptionsListSummary } from "../../shared/initOptionsListSummary.js";

window.addEventListener("DOMContentLoaded", onLoaded);

function error(msg) {
	alert("В приложении произошла ошибка: " + msg);
}
const onShapeChange = (() => {
	const labelElem = document.querySelector("#selected-shape-name");
	const buttonElem = document.querySelector("#desc-shape-select");
	return ({ target }) => {
		const newValue = document.forms["projects-filters"].shape.value;
		if (!newValue) {
			labelElem.textContent = "";
			buttonElem.firstElementChild.textContent = buttonElem.firstElementChild.getAttribute("data-default-text");
		} else {
			const newVisibleValue = target.parentElement.lastElementChild.textContent;
			labelElem.textContent = newVisibleValue;
			buttonElem.firstElementChild.textContent = newVisibleValue;
		}
	}
})();
const onTextureChange = (() => {
	const buttonElem = document.querySelector("#desc-texture-select");
	const labelElem = document.querySelector("#selected-texture-name");
	const clonesMap = getClonesMap();
	return ({ target }) => {
		const newValue = document.forms["projects-filters"].texture.value;
		labelElem.textContent = newValue;
		if (!newValue) {
			buttonElem.firstElementChild.textContent = buttonElem.firstElementChild.getAttribute("data-default-text");
		} else {
			const newVisibleValue = target.parentElement.lastElementChild.textContent;
			buttonElem.firstElementChild.textContent = newVisibleValue;
		}
		cloneChange(newValue);
	}
	function cloneChange(newValue) {
			console.log("cloneChange", newValue);
		if (newValue && newValue in clonesMap) {
			document.forms["projects-filters"]["texture-clone"].value = newValue;
		} else {
			const currentValue = document.forms["projects-filters"]["texture-clone"].value;
			if (currentValue in clonesMap) clonesMap[currentValue].checked = false;
		}
	}
	function getClonesMap() {
		const cloneElems = document.querySelectorAll(`input[name="texture-clone"]`);
		return [].reduce.call(cloneElems, (result, elem) => {
			result[elem.value] = elem;
			return result;
		}, {});
	}
})();
function onLoaded() {
	//setBlockSizeVars(".gallery-drawer", "gallery-drawer");
	//setBlockSizeVars(".main-gallery__slider", "gallery");
	closeDrawersOnWidthChange();
	initOptionsListSummary();
	onDrawerCardClick("textures", () => window.drawers.close("textures"));
	onDrawerCardClick("shapes", () => window.drawers.close("shapes"));
	onDrawerInputChange("textures", onTextureChange);
	onDrawerInputChange("shapes", onShapeChange);
	onDrawerInputChange("placing", () => window.drawers.close("placing"));
	initTextureCloneSelectMirroring();
	onPlacingChange();
	$.fancybox.defaults.backFocus = false;
}
function onPlacingChange() {
	const rootElem = document.querySelector("#placing-options");
	const indicatorElem = document.querySelector("#desc-place-select");
	const defaultLabel = indicatorElem.firstElementChild.textContent;

	rootElem.addEventListener("change", ({ target }) => {
		if (target.getAttribute("name") === "placing") {
			const newValue = document.forms["projects-filters-form"].placing.value;
			const selectedOptionElem = [].find.call(document.forms["projects-filters-form"].placing, (elem) => elem.checked);
			if (!selectedOptionElem) {
				indicatorElem.firstElementChild.textContent = defaultLabel;
			} else {
				const visibleValue = selectedOptionElem.parentElement.lastElementChild.textContent;
				indicatorElem.firstElementChild.textContent = visibleValue;
			}
		}
	});
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
function closeDrawersOnWidthChange() {
	const handleMatch992 = ({ matches }) => {
		if (!matches) {
			window.drawers.close("gallery");
		}
	}
	const handleMatch768 = ({ matches }) => {
		if (!matches) {
			window.drawers.close("filters");
		}
	}
	let mediaMatch = window.matchMedia("(max-width: 992px");
	mediaMatch.addListener(handleMatch992);
	handleMatch992(mediaMatch);
	mediaMatch = window.matchMedia("(max-width: 767px");
	mediaMatch.addListener(handleMatch768);
	handleMatch768(mediaMatch);
}
function initTextureCloneSelectMirroring() {
	const listElem = document.querySelector("#texture-clones-list");
	const originalsMap = getOriginalsMap();
	listElem.addEventListener("change", ({ target }) => {
		const newValue = target.value;
		if (newValue in originalsMap) {
			originalsMap[newValue].checked = true;
			originalsMap[newValue].dispatchEvent(new Event("change", { bubbles: true }));
		} else {
			throw new Error("There is no original texture with name: " + newValue);
		}
	});
	function getOriginalsMap() {
		const originalElems = document.forms["projects-filters"]["texture"];
		return [].reduce.call(originalElems, (result, elem) => {
			result[elem.value] = elem;
			return result;
		}, {});
	}
}