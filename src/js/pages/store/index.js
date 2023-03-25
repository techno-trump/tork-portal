import "./sliders.js";
import { isMobile } from "../../files/functions.js";
import { initDoubleRangeInputs, initMultiInputs } from "../../libs/double-range-input.js";
import { initSearchInput } from "./searchInput.js";
import { initInputCheckTracking } from "../../libs/input-service-classes.js";
import { initOptionsListSummary } from "../../shared/initOptionsListSummary.js";
import { List, Item } from "linked-list";
import { render, Fragment } from "preact";
import { memo, useCallback } from "preact/compat";
import { effect, signal } from "@preact/signals";
import { html } from "htm/preact";
import { isEmpty, formatPrice } from "../../libs/utils.js";
import { getDataFaker, requestGalleryMediaByFilters } from "./faker.js";

window.addEventListener("DOMContentLoaded", onLoaded);

const isRunningOnMobile = isMobile.any();

function onLoaded() {
	initInputCheckTracking();
	// Filter
	initDescFilterPanel();
	initDoubleRangeInputs("#FE693A");
	initMultiInputs();
	initSearchInput();
	onDrawerInputChange("shapes", getShapeChangeHandler());
	onDrawerInputChange("textures", getTextureChangeHandler());
	onDrawerCardClick("textures", () => window.drawers.close("textures"));
	onDrawerCardClick("shapes", () => window.drawers.close("shapes"));
	initTextureCloneSelectMirroring();
	initOptionsListSummary();
	// Catalogue
	initOptionSelect("products-filter", "order", isRunningOnMobile);
	initAppliedFiltersRendering();
	initExcludingFilters();
	initCatalogue();
}

function initDescFilterPanel() {
	const rootElem = document.querySelector(".desc-filters");
	const switchElem = rootElem.querySelector(".desc-filters__switch");
	switchElem.addEventListener("click", () => {
		if (rootElem.classList.contains("open")) {
			rootElem.classList.remove("open");
			switchElem.classList.remove("active");
		} else {
			rootElem.classList.add("open");
			switchElem.classList.add("active");
		}
	});
}
function getShapeChangeHandler() {
	const labelElem = document.querySelector("#selected-shape-name");
	return ({ target }) => {
		const newValue = document.forms["products-filter-form"].shape.value;
		if (!newValue) {
			labelElem.textContent = "";
		} else {
			const newVisibleValue = target.parentElement.lastElementChild.textContent;
			labelElem.textContent = newVisibleValue;
		}
	}
};
function getTextureChangeHandler() {
	const labelElem = document.querySelector("#selected-texture-name");
	const clonesMap = getClonesMap();
	return ({ target }) => {
		const newValue = document.forms["products-filter-form"].texture.value;
		const newVisibleValue = target.parentElement.lastElementChild.textContent;
		labelElem.textContent = newValue;
		cloneChange(newValue);
	}
	function cloneChange(newValue) {
			console.log("cloneChange", newValue);
		if (newValue && newValue in clonesMap) {
			document.forms["products-filter-form"]["texture-clone"].value = newValue;
		} else {
			const currentValue = document.forms["products-filter-form"]["texture-clone"].value;
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
};
function onDrawerInputChange(alias, callback) {
	const drawerElem = document.querySelector(`[data-drawer=${alias}]`);
	if (drawerElem) {
		drawerElem.addEventListener("change", (event) => {
			callback(event);
		});
	}
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
		const originalElems = document.forms["products-filter-form"]["texture"];
		return [].reduce.call(originalElems, (result, elem) => {
			result[elem.value] = elem;
			return result;
		}, {});
	}
}
function initOptionSelect(formName, fieldName, isMobile = false) {
	let memo = {};
	let activeOptionNode;
	const inputNodes = document.forms[formName]?.[fieldName];
	if (!inputNodes || !inputNodes.length) return error(`No elements found for initOptionSelect: formName::${formName}, fieldName::${fieldName}`);
	const selectNode = inputNodes[0].closest(".option-select");
	const optionsNode = inputNodes[0].closest(".option-select__options");
	const fieldElem = selectNode.firstElementChild;

	if (isMobile) {
		selectNode.addEventListener("click", (e) => {
			const path = e.composedPath();
			if (!path.length || !path[0].closest(".option-select__options")) {
				e.stopPropagation();
				setToggle();
				document.addEventListener("click", onOutsideClickHandler);
			}
		});
	} else {
		selectNode.addEventListener("mouseenter", (e) => {
			setOpen();
		});
		selectNode.addEventListener("mouseleave", (e) => {
			setClosed();
		});
	}
	
	setClosed();
	
	inputNodes.forEach(node => {
		if (node.checked) {
			activeOptionNode = node.closest(".option-select__option");
			activeOptionNode.classList.add("option-select__option_active");
			fieldElem.textContent = node.nextElementSibling.textContent;
		}
		node.addEventListener("click", (e) => {
			const value = e.currentTarget.value;
			fieldElem.textContent = e.currentTarget.nextElementSibling.textContent;
			if (!memo[value]) {
				memo[value] = e.currentTarget.closest(".option-select__option");
			}
			if (!memo[value].classList.contains("option-select__option_active")) {
				if (activeOptionNode) {
					activeOptionNode.classList.remove("option-select__option_active");
				}
				memo[value].classList.add("option-select__option_active");
			}
			activeOptionNode = memo[value];
			setClosed();
		});
	});
	function onOutsideClickHandler(e) {
		if (!e.target.closest(".option-select__options-wrapper") && selectNode.classList.contains("option-select_open")) {
			setClosed();
			document.removeEventListener("click", onOutsideClickHandler);
		}
	}
	function setToggle() {
		if (selectNode.classList.contains("option-select_open")) {
			setClosed();
		} else {
			setOpen();
		}
	}
	function setOpen() {
		selectNode.classList.add("option-select_open");
		optionsNode.removeAttribute("aria-hidden");
	}
	function setClosed() {
		selectNode.classList.remove("option-select_open");
		optionsNode.setAttribute("aria-hidden", "true");
	}
}
function initAppliedFiltersRendering() {
	const filtersCounterElem = document.querySelector(".open-filter-btn__counter");
	const filtersForm = document.forms["products-filter"];
	const itemTemplate = document.querySelector("#applied-filter-item");
	const listElem = document.querySelector(".applied-filters__list");
	const resetItemElem = listElem.querySelector(".applied-filters__item_clear");
	const memo = {};
	const applied = {};
	const schema = new List();
	
	const fullResetHandler = (event) => {
		schema.toArray().forEach(item => {
			item.onReset(event);
		});
	}

	document.addEventListener("resetFilters", fullResetHandler);
	resetItemElem.lastElementChild.addEventListener("click", fullResetHandler);

	class AppliedFilterMeta extends Item {
		constructor({ alias, relatedOn, isApplied, render, onReset }) {
			super();
			this.alias = alias;
			this.isApplied = isApplied;
			this.relatedOn = relatedOn;
			this.render = render;
			this.onReset = onReset;
		}
	}
	schema.append(new AppliedFilterMeta({
			alias: "search",
			relatedOn: ["search"],
			isApplied: () => !isEmpty(filtersForm["search"].value),
			render: function () {
				const caption = `Поиск: ${filtersForm["search"].value}`;
				let node;
				if (memo["search"]) {
					node = memo["search"];
					node.lastElementChild.disabled = false;
				} else {
					node = memo["search"] = document.createElement("li");
					node.classList.add("applied-filters__item");
					node.innerHTML = itemTemplate.innerHTML;
					node.lastElementChild.addEventListener("click", this.onReset);
				}
				node.firstElementChild.textContent = caption;
				return node;
			},
			onReset: (event) => {
				event.currentTarget.disabled = true;
				filtersForm["search"].value = "";
				const changeEvent = new Event("change", { bubbles: true });
				changeEvent.__synteticEvent = true;
				filtersForm["search"].dispatchEvent(changeEvent);
			}
		}));
	schema.append(new AppliedFilterMeta({
			alias: "available",
			relatedOn: ["availability"],
			isApplied: () => filtersForm["availability"].checked,
			render: function () {
				const caption = `В наличии`;
				let node;
				if (memo["available"]) {
					node = memo["available"];
					node.lastElementChild.disabled = false;
				} else {
					node = memo["available"] = document.createElement("li");
					node.classList.add("applied-filters__item");
					node.innerHTML = itemTemplate.innerHTML;
					node.lastElementChild.addEventListener("click", this.onReset);
				}
				node.firstElementChild.textContent = caption;
				return node;
			},
			onReset: (event) => {
				event.currentTarget.disabled = true;
				filtersForm["availability"].checked = false;
				filtersForm["availability"].dispatchEvent(new Event("change", { bubbles: true }));
			}
		}));
	schema.append(new AppliedFilterMeta({
		alias: "shape-round",
		relatedOn: ["shape-group-round"],
		isApplied: () => filtersForm["shape-group-round"].checked,
		render: function () {
			const caption = `Форма: Крулые`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["shape-group-round"].checked = false;
			filtersForm["shape-group-round"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "shape-round-diameter",
		relatedOn: ["shape-group-round", "diameter-from", "diameter-to", "__diameter-from"],
		isApplied: () => {
			const [minValue, maxValue, valueFrom, valueTo] = getRangeValues(filtersForm["__diameter-from"], filtersForm["diameter-from"], filtersForm["diameter-to"]);
			return filtersForm["shape-group-round"].checked && (minValue < valueFrom || maxValue > valueTo);
		},
		render: function () {
			const caption = `Форма: Круглые, диаметр ${filtersForm["diameter-from"].value}-${filtersForm["diameter-to"].value} см`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["diameter-from"].value = filtersForm["__diameter-from"].getAttribute("min");
			filtersForm["diameter-to"].value = filtersForm["__diameter-from"].getAttribute("max");
			filtersForm["diameter-from"].dispatchEvent(new Event("change", { bubbles: true }));
			filtersForm["diameter-to"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "shape-round-height",
		relatedOn: ["shape-group-round", "round-height-from", "round-height-to", "__round-height-from"],
		isApplied: () => {
			const [minValue, maxValue, valueFrom, valueTo] = getRangeValues(filtersForm["__round-height-from"], filtersForm["round-height-from"], filtersForm["round-height-to"]);
			return filtersForm["shape-group-round"].checked && (minValue < valueFrom || maxValue > valueTo);
		},
		render: function () {
			const caption = `Форма: Круглые, высота ${filtersForm["round-height-from"].value}-${filtersForm["round-height-to"].value} см`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["round-height-from"].value = filtersForm["__round-height-from"].getAttribute("min");
			filtersForm["round-height-to"].value = filtersForm["__round-height-from"].getAttribute("max");
			filtersForm["round-height-from"].dispatchEvent(new Event("change", { bubbles: true }));
			filtersForm["round-height-to"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "shape-rectangular",
		relatedOn: ["shape-group-rectangular"],
		isApplied: () => filtersForm["shape-group-rectangular"].checked,
		render: function () {
			const caption = `Форма: Прямоугольные`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["shape-group-rectangular"].checked = false;
			filtersForm["shape-group-rectangular"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "shape-rectangular-length",
		relatedOn: ["shape-group-rectangular", "rectangular-length-from", "rectangular-length-to", "__rectangular-length-from"],
		isApplied: () => {
			const [minValue, maxValue, valueFrom, valueTo] = getRangeValues(filtersForm["__rectangular-length-from"], filtersForm["rectangular-length-from"], filtersForm["rectangular-length-to"]);
			return filtersForm["shape-group-rectangular"].checked && (minValue < valueFrom || maxValue > valueTo);
		},
		render: function () {
			const caption = `Форма: Прямоугольные, длина ${filtersForm["rectangular-length-from"].value}-${filtersForm["rectangular-length-to"].value} см`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["rectangular-length-from"].value = filtersForm["__rectangular-length-from"].getAttribute("min");
			filtersForm["rectangular-length-to"].value = filtersForm["__rectangular-length-from"].getAttribute("max");
			filtersForm["rectangular-length-from"].dispatchEvent(new Event("change", { bubbles: true }));
			filtersForm["rectangular-length-to"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "shape-rectangular-width",
		relatedOn: ["shape-group-rectangular", "rectangular-width-from", "rectangular-width-to", "__rectangular-width-from"],
		isApplied: () => {
			const [minValue, maxValue, valueFrom, valueTo] = getRangeValues(filtersForm["__rectangular-width-from"], filtersForm["rectangular-width-from"], filtersForm["rectangular-width-to"]);
			return filtersForm["shape-group-rectangular"].checked && (minValue < valueFrom || maxValue > valueTo);
		},
		render: function () {
			const caption = `Форма: Прямоугольные, ширина ${filtersForm["rectangular-width-from"].value}-${filtersForm["rectangular-width-to"].value} см`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["rectangular-width-from"].value = filtersForm["__rectangular-width-from"].getAttribute("min");
			filtersForm["rectangular-width-to"].value = filtersForm["__rectangular-width-from"].getAttribute("max");
			filtersForm["rectangular-width-from"].dispatchEvent(new Event("change", { bubbles: true }));
			filtersForm["rectangular-width-to"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "shape-rectangular-height",
		relatedOn: ["shape-group-rectangular", "rectangular-height-from", "rectangular-height-to", "__rectangular-height-from"],
		isApplied: () => {
			const [minValue, maxValue, valueFrom, valueTo] = getRangeValues(filtersForm["__rectangular-height-from"], filtersForm["rectangular-height-from"], filtersForm["rectangular-height-to"]);
			return filtersForm["shape-group-rectangular"].checked && (minValue < valueFrom || maxValue > valueTo);
		},
		render: function () {
			const caption = `Форма: Прямоугольные, высота ${filtersForm["rectangular-height-from"].value}-${filtersForm["rectangular-height-to"].value} см`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["rectangular-height-from"].value = filtersForm["__rectangular-height-from"].getAttribute("min");
			filtersForm["rectangular-height-to"].value = filtersForm["__rectangular-height-from"].getAttribute("max");
			filtersForm["rectangular-height-from"].dispatchEvent(new Event("change", { bubbles: true }));
			filtersForm["rectangular-height-to"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "shape",
		relatedOn: ["shape"],
		isApplied: () => {
			return Boolean(filtersForm["shape"].value);
		},
		render: function () {
			const caption = `Форма: ${filtersForm["shape"].value}`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			if (event) event.currentTarget.disabled = true;
			const checkedOptionElem = [].find.call(filtersForm["shape"], elem => elem.checked);
			if (!checkedOptionElem) return;
			checkedOptionElem.checked = false;
			checkedOptionElem.dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "texture",
		relatedOn: ["texture"],
		isApplied: () => {
			return Boolean(filtersForm["texture"].value);
		},
		render: function () {
			const caption = `Фактура: ${filtersForm["texture"].value}`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			const checkedOptionElem = [].find.call(filtersForm["texture"], elem => elem.checked);
			if (!checkedOptionElem) return;
			checkedOptionElem.checked = false;
			checkedOptionElem.dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "type--for-desk",
		relatedOn: ["type--for-desk"],
		isApplied: () => {
			return Boolean(filtersForm["type--for-desk"].checked);
		},
		render: function () {
			const caption = `Тип: Настольные`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["type--for-desk"].checked = false;
			filtersForm["type--for-desk"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "type--for-floor",
		relatedOn: ["type--for-floor"],
		isApplied: () => {
			return Boolean(filtersForm["type--for-floor"].checked);
		},
		render: function () {
			const caption = `Тип: Напольные`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["type--for-floor"].checked = false;
			filtersForm["type--for-floor"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "type--for-hanging",
		relatedOn: ["type--for-hanging"],
		isApplied: () => {
			return Boolean(filtersForm["type--for-hanging"].checked);
		},
		render: function () {
			const caption = `Тип: Подвесные`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["type--for-hanging"].checked = false;
			filtersForm["type--for-hanging"].dispatchEvent(new Event("change", { bubbles: true }));
		},
	}));
	schema.append(new AppliedFilterMeta({
		alias: "type--for-balcony",
		relatedOn: ["type--for-balcony"],
		isApplied: () => {
			return Boolean(filtersForm["type--for-balcony"].checked);
		},
		render: function () {
			const caption = `Тип: Балконеры`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["type--for-balcony"].checked = false;
			filtersForm["type--for-balcony"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "placing--outside",
		relatedOn: ["placing--outside"],
		isApplied: () => {
			return Boolean(filtersForm["placing--outside"].checked);
		},
		render: function () {
			const caption = `Размещение: Для улицы`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click",  this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["placing--outside"].checked = false;
			filtersForm["placing--outside"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "placing--inside",
		relatedOn: ["placing--inside"],
		isApplied: () => {
			return Boolean(filtersForm["placing--inside"].checked);
		},
		render: function () {
			const caption = `Размещение: Для помещения`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["placing--inside"].checked = false;
			filtersForm["placing--inside"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	schema.append(new AppliedFilterMeta({
		alias: "price",
		relatedOn: ["price-from", "price-to", "__price-from"],
		isApplied: () => {
			const [minValue, maxValue, valueFrom, valueTo] = getRangeValues(filtersForm["__price-from"], filtersForm["price-from"], filtersForm["price-to"]);
			return minValue < valueFrom || maxValue > valueTo;
		},
		render: function () {
			const caption = `Цена от ${filtersForm["price-from"].value} до ${filtersForm["price-to"].value}`;
			let node;
			if (memo[this.alias]) {
				node = memo[this.alias];
				node.lastElementChild.disabled = false;
			} else {
				node = memo[this.alias] = document.createElement("li");
				node.classList.add("applied-filters__item");
				node.innerHTML = itemTemplate.innerHTML;
				node.lastElementChild.addEventListener("click", this.onReset);
			}
			node.firstElementChild.textContent = caption;
			return node;
		},
		onReset: (event) => {
			event.currentTarget.disabled = true;
			filtersForm["price-from"].value = filtersForm["__price-from"].getAttribute("min");
			filtersForm["price-to"].value = filtersForm["__price-from"].getAttribute("max");
			filtersForm["price-from"].dispatchEvent(new Event("change", { bubbles: true }));
			filtersForm["price-to"].dispatchEvent(new Event("change", { bubbles: true }));
		}
	}));
	document.addEventListener("change", (event) => {
		const inputFormName = event.target.form.getAttribute("name");
		if (inputFormName !== "products-filter") return;
		const inputName = event.target.name;
		render(inputName);
	});
	// Initial render;
	render();

	function render(initInputName) {
			console.log(applied);
		let itemMeta = schema.head;
		do {
			if (initInputName && itemMeta.relatedOn.indexOf(initInputName) === -1) continue;
			if (itemMeta.isApplied()) {
				if (applied[itemMeta.alias]) {
					itemMeta.render();
				} else {
					insertItem();
				}
			} else {
				applied[itemMeta.alias]?.remove();
				delete applied[itemMeta.alias];
			}
		} while((itemMeta = itemMeta.next));
		const appliedFiltersCount = Object.keys(applied).length;
		if (appliedFiltersCount > 0) {
			resetItemElem.lastElementChild.disabled = false;
		}
		filtersCounterElem.textContent = appliedFiltersCount;

		function insertItem() {
			let prevItemMeta = itemMeta.prev;
			const appliedFilterItemNode = itemMeta.render();
			applied[itemMeta.alias] = appliedFilterItemNode;
			if (prevItemMeta) {
				do {
					if (applied[prevItemMeta.alias]) return applied[prevItemMeta.alias].after(appliedFilterItemNode);
				} while(prevItemMeta = prevItemMeta.prev);
			}
			listElem.prepend(appliedFilterItemNode);
		}
	}
	function getRangeValues(rangeElem, fromElem, toElem) {
		const minValue = parseInt(rangeElem.getAttribute("min"), 10);
		const maxValue = parseInt(rangeElem.getAttribute("max"), 10);
		const valueFrom = parseInt(fromElem.value, 10);
		const valueTo = parseInt(toElem.value, 10);
		return [minValue, maxValue, valueFrom, valueTo];
	}
}
function initExcludingFilters() {
	const filtersFormElem = document.forms["products-filter"];
	document.addEventListener("change", event => {
		if (event.target.form?.getAttribute("name") !== "products-filter") return;
		if (event.target.name === "shape-group-round" && filtersFormElem["shape-group-round"].checked ) {
			resetShapeFilter();
		} else if (event.target.name === "shape-group-rectangular" && filtersFormElem["shape-group-rectangular"].checked) {
			resetShapeFilter();
		} else if (event.target.name === "shape") {
			if (!isEmpty(filtersFormElem["shape"].value)) {
				if (filtersFormElem["shape-group-round"].checked) {
					filtersFormElem["shape-group-round"].checked = false;
					filtersFormElem["shape-group-round"].dispatchEvent(new Event("change", { bubbles: true }));
				}
				if (filtersFormElem["shape-group-rectangular"].checked) {
					filtersFormElem["shape-group-rectangular"].checked = false;
					filtersFormElem["shape-group-rectangular"].dispatchEvent(new Event("change", { bubbles: true }));
				}
			}
		}
		function resetShapeFilter() {
			const activeOption = [].find.call(filtersFormElem["shape"], elem => elem.checked);
			if (activeOption) {
				activeOption.checked = false;
				activeOption.dispatchEvent(new Event("change", { bubbles: true }));
			}
		}
	});
}

function initCatalogue() {
	const galleryWrapElem = document.querySelector("#gallery-wrap");
	const productsCountElem = document.querySelector(".catalogue__products-count");
	const productsPerPage = 4;
	let latestFilters = collectFilters(), previousFilters;
	const catalogueData = signal({
		onPage: [],
		totalNumber: 0,
	});
	const selectedPage = signal(1);
	const catalogueBodyElem = document.querySelector(".catalogue__body");
	const footerElem = document.querySelector(".catalogue__footer");
	const PaginationItem = memo(function PaginationItem({ pageNum, spreaded, selected, onSelect }) {
		const caption = spreaded ? "..." : pageNum;
		const classList = ["pagination__btn"];
		if (selected) {
			classList.push("pagination__btn_active");
		}
		const clickHandler = (event) => {
			event.preventDefault();
			onSelect(pageNum);
		}
		return html`<a href="${getHrefForPage(pageNum)}" class="${classList.join(" ")}" onclick=${clickHandler}>
									<span class="pagination__btn-caption">${caption}</span>
								</a>`;
	});
	const Pagination = function Pagination({ catalogueData, selectedPage }) {
		const pagesNumber = Math.ceil(catalogueData.value.totalNumber / productsPerPage);
		const paginationStack = [];
		const onSelect = useCallback((pageNum) => {
			selectedPage.value = pageNum;
		}, []);
		if (pagesNumber > 1 ) {
			if (selectedPage.value > pagesNumber) {
				selectedPage.value = pagesNumber;
			}
			if (pagesNumber <= 7) {
				fillStack(1, pagesNumber);
			} else {
				paginationStack.push(1);
				if (selectedPage.value <= 4) {
					fillStack(2, 5);
				} else if (selectedPage.value < pagesNumber - 2) {
					fillStack(selectedPage.value - 2, selectedPage.value + 2);
				} else {
					fillStack(pagesNumber - 4, pagesNumber - 1);
				}
				paginationStack.push(pagesNumber);
			}
		}
		return html`<div class="catalogue__pagination pagination">
									${paginationStack.map((pageNum, idx, initial) => {
										const selected = pageNum === selectedPage.value;
										const spreaded = idx === 1 && pageNum !== 2 || idx === initial.length - 2 && pageNum !== pagesNumber - 1;
										return html`<${PaginationItem} key=${pageNum} pageNum=${pageNum} spreaded=${spreaded} selected=${selected} onSelect=${onSelect} />`;
									})}
								</div>`;

		function fillStack(from, to) {
			for (let pageNum = from; pageNum <= to; pageNum++) {
				paginationStack.push(pageNum);
			}
		}
	}
	const ProductCard = memo(function ProductCard({ data }) {
		const { id, href, imgPath, hoveredImgPath, dimensions, shape, texture, availability, price, name } = data;
		const availMap = { "true": "В наличии", "false": "Под заказ" };
		const availClass = availability ? "warehouse" : "on-order";
		
		return html`<div class="product-card">
									<a href="${href}" target="_self" class="product-card__top">
										<div class="product-card__top-inner">
											<img src="${imgPath}" alt="Product image" class="product-card__image"/>
											<div class="product-card__product-dimensions">${dimensions}</div>
										</div>
									</a>
									<div class="product-card__middle">
										<dl class="product-card__detail">
											<dt class="product-card__detail-name">Форма</dt>
											<dd class="product-card__detail-value">${shape}</dd>
										</dl>
										<dl class="product-card__detail">
											<dt class="product-card__detail-name">Фактура</dt>
											<dd class="product-card__detail-value">${texture}</dd>
										</dl>
									</div>
									<div class="product-card__bottom">
										<div class="product-card__bottom-block">
											<p class="product-card__avail-status ${availClass}">${availMap[availability]}</p>
											<span class="product-card__price" data-currency="₽">${formatPrice(price)}\u00A0</span>
										</div>
										<a href="${href}" target="_self" class="btn btn_black product-card__btn">
											Перейти
										</a>
										<div class="product-card__product-name">
											${name}
										</div>
									</div>
								</div>`;
	}, (prev, next) => _.isEqual(prev, next));
	const Catalogue = function Catalogue({ catalogueData }) {
		const dispatchFiltersReset = () => {
			document.dispatchEvent(new CustomEvent("resetFilters"));
		}
		return html`<${Fragment}>
									<div class="catalogue__no-products">
										${catalogueData.value.totalNumber === 0 && html`<p class="catalogue__no-products-text">Нет товаров, соответствующих данным критериям. 
												Выберите другие параметры или <button class="clear-filters-btn-inline" onclick=${dispatchFiltersReset}>очистите фильтры</button>.
											</p>`}
									</div>
									<div class="catalogue-grid">
										<div class="catalogue-grid__inner">
											${catalogueData.value.onPage.map((productData, idx) => {
												if (productData.group === "round") {
													productData.dimensions = `D${productData.diameter} H${productData.height}`;
												} else {
													productData.dimensions = `H${productData.height} W${productData.width} L${productData.length}`;
												}
												return html`<div key=${productData.id} class="catalogue-grid__item">
																			<div class="catalogue-grid__item-inner">
																				<${ProductCard} data=${productData} />
																			</div>
																		</div>`;
											})}
										</div>
									</div>
								</${Fragment}>`;
	}
	const requestAndSetData = _.debounce((previousFilters, filters, page) => {
		requestCatalogueData(filters, productsPerPage, page)
			.then(result => {
				if (result.onPage.length === 0 && result.totalNumber > 0) {
						requestCatalogueData(filters, productsPerPage, Math.floor(result.totalNumber / productsPerPage))
							.then(result => {
								catalogueData.value = result;
							});
				} else {
					catalogueData.value = result;
				}
			})
			.catch(reason => {
				console.log("Error requesting catalogue data: ", reason);
			});
			replaceGalleryByFilters(previousFilters, filters);
	}, 500);

	const filtersChangeHandler = _.debounce(event => {
		if (event.target.form?.getAttribute("name") !== "products-filter") return;
		const filters = collectFilters();
		if (_.isEqual(filters, latestFilters)) return;
		previousFilters = latestFilters;
		latestFilters = filters;
		requestAndSetData(previousFilters, latestFilters, selectedPage.value);
	}, 500);
	document.addEventListener("change", filtersChangeHandler);
	effect(() => {
		requestAndSetData(previousFilters, latestFilters, selectedPage.value);
	});
	effect(() => {
		const total = catalogueData.value.totalNumber;
		const units = total % 10;
		let textPart;
		if (units === 0 || units > 4 || total === 11) {
			textPart = "товаров";
		} else if (units === 1) {
			textPart = "товар";
		} else {
			textPart = "товара";
		}
		productsCountElem.textContent = `${total} ${textPart}`;
	});

	render(html`<${Pagination} catalogueData=${catalogueData} selectedPage=${selectedPage}/>`, footerElem);
	render(html`<${Catalogue} catalogueData=${catalogueData} />`, catalogueBodyElem);
	
	function requestCatalogueData(filters, productsPerPage, page) {
		// return fetch("/ajax/request-products.php", {
		// 	method: "GET",
		// 	headers: {
		// 		"Content-Type": "application/json"
		// 	},
		// 	body: JSON.stringify({
		// 		filters,
		// 		productsPerPage,
		// 		page
		// 	})
		// }).then(response => response.json());
		return getDataFaker(filters, productsPerPage, page);
	}
	function collectFilters() {
		const filter = {};
		const formElem = document.forms["products-filter"];
		if (!isEmpty(formElem.search.value)) {
			filter.search = formElem.search.value;
		}
		if (isEmpty(formElem.shape.value)) {
			if (formElem["shape-group-round"].checked) {
				filter.shapeGroupRound = true;
				const roundDiameterFrom = getFilterEdgeValue("diameter-from", "min");
				const roundDiameterTo = getFilterEdgeValue("diameter-to", "max");
				if (roundDiameterFrom !== null) filter.roundDiameterFrom = roundDiameterFrom;
				if (roundDiameterTo !== null) filter.roundDiameterTo = roundDiameterTo;
				const roundHeightFrom = getFilterEdgeValue("round-height-from", "min");
				const roundHeightTo = getFilterEdgeValue("round-height-to", "max");
				if (roundHeightFrom !== null) filter.roundHeightFrom = roundHeightFrom;
				if (roundHeightTo !== null) filter.roundHeightTo = roundHeightTo;
			}
			if (formElem["shape-group-rectangular"].checked) {
				filter.shapeGroupRectangular = true;
				const rectangularLengthFrom = getFilterEdgeValue("rectangular-length-from", "min");
				const rectangularLengthTo = getFilterEdgeValue("rectangular-length-to", "max");
				if (rectangularLengthFrom !== null) filter.rectangularLengthFrom = rectangularLengthFrom;
				if (rectangularLengthTo !== null) filter.rectangularLengthTo = rectangularLengthTo;
				const rectangularWidthFrom = getFilterEdgeValue("rectangular-width-from", "min");
				const rectangularWidthTo = getFilterEdgeValue("rectangular-width-to", "max");
				if (rectangularWidthFrom !== null) filter.rectangularWidthFrom = rectangularWidthFrom;
				if (rectangularWidthTo !== null) filter.rectangularWidthTo = rectangularWidthTo;
				const rectangularHeightFrom = getFilterEdgeValue("rectangular-height-from", "min");
				const rectangularHeightTo = getFilterEdgeValue("rectangular-height-to", "max");
				if (rectangularHeightFrom !== null) filter.rectangularHeightFrom = rectangularHeightFrom;
				if (rectangularHeightTo !== null) filter.rectangularHeightTo = rectangularHeightTo;
			}
		} else {
			filter.shape = formElem.shape.value;
		}
		if (!isEmpty(formElem.texture.value)) {
			filter.texture = formElem.texture.value;
		}
		const checkedTypeElems = document.querySelectorAll("input[name^='type-']:checked");
		if (checkedTypeElems.length) {
			filter.types = [].map.call(checkedTypeElems, elem => elem.getAttribute("name").slice(5));
		}
		const placingElems = document.querySelectorAll("input[name^='placing-']:checked");
		if (placingElems.length) {
			filter.placing = [].map.call(placingElems, elem => elem.getAttribute("name").slice(8));
		}
		const priceFrom = getFilterEdgeValue("price-from", "min");
		const priceTo = getFilterEdgeValue("price-to", "max");
		if (priceFrom !== null) filter.priceFrom = priceFrom;
		if (priceTo !== null) filter.priceTo = priceTo;
		if (formElem.availability.checked) {
			filter.availability = true;
		}
		filter.order = formElem.order.value;
		return filter;

		function getFilterEdgeValue(name, edge) {
			const value = parseInt(formElem[name].value, 10);
			const edgeValue = parseInt(formElem[`__${name}`].getAttribute(edge), 10);
			return value === edgeValue ? null : value;
		}
	}
	function replaceGalleryByFilters(previousFilters, filters) {
		const list = ["shapeGroupRound", "shapeGroupRectangular", "shape", "texture"];
		if (compareFilters(list, previousFilters, filters)) return;

		requestGalleryMediaByFilters(filters)
			.then(media => {
				galleryWrapElem.innerHTML = media.map(getSlideHtml).join("");
			})
			.catch(reason => {
				console.log("Error requesting gallery media by filters: ", filters, "; Reason: ", reason);
			})

		function getSlideHtml({ imgUrl, href }) {
			return `<a href="${href || ""}" class="swiper-slide main-gallery__slide">
								<img src="${imgUrl}" alt="${imgUrl}" loading="lazy">
								<div class="swiper-lazy-preloader"></div>
							</a>`;
		}
	}
	
}
function compareFilters(list, prev, current) {
	if (typeof prev !== "object" || typeof current !== "object") return false;
	const result = list.filter(propName => prev[propName] !== current[propName]);
	return result.length === 0;
}
function getHrefForPage(pageNum) {
	return ".";
}