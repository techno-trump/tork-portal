import Mustache from "mustache";

const template = `<div class="simple-select__caption">{{caption}}</div>
									<div class="simple-select__panel-wrap">
										<ul class="simple-select__panel">
											{{#options}}
												<li class="simple-select__option {{#active}}active{{/active}}"
													data-value="{{value}}"
													{{#captionValue}}
														data-caption-value="{{captionValue}}"
													{{/captionValue}}
													>
													{{visibleValue}}
													<div class="simple-select__indicator"></div>
												</li>
											{{/options}}
										</ul>
									</div>`;

export const initSimpleSelects = () => {
	const elems = document.querySelectorAll("[data-simple-select]");
	elems?.forEach(init);

	let activeSelectElem;
	const outsideClickHandler = (event) => {
		if (!event.target.closest(".simple-select__caption")) {
			if (activeSelectElem) {
				deactivateSelect(activeSelectElem);
			}
			document.removeEventListener("click", outsideClickHandler);
		}
	}

	function activateSelect(component, openedBy) {
		if (activeSelectElem !== component) {
			if (activeSelectElem) deactivateSelect(activeSelectElem);
			component.classList.add("active");
			activeSelectElem = component;
		}
		component.setAttribute("data-opened-by", openedBy);
		document.addEventListener("click", outsideClickHandler);
	}
	function deactivateSelect(component) {
		component.removeAttribute("data-opened-by");
		component.classList.remove("active");
		if (activeSelectElem === component) {
			activeSelectElem = null;
			document.removeEventListener("click", outsideClickHandler);
		}
	}
	
	function init(elem) {
		let enterTimeout, exitTimeout;
		let selectedIndex = elem.selectedIndex, caption;
		const data = { caption, options: [] };
		for (const child of elem.children) {
			const captionValue = child.getAttribute("data-caption-value");
			data.options.push({ value: child.value, captionValue, visibleValue: child.textContent });
		}
		if (selectedIndex > -1) {
			const captionValue = elem.children[selectedIndex].getAttribute("data-caption-value");
			data.caption = captionValue ? captionValue : elem.children[selectedIndex].textContent;
			data.options[selectedIndex].active = true;
		} else {
			data.caption = "";
		}

		const component = document.createElement("div");
		component.classList.add("simple-select");
		component.innerHTML = Mustache.render(template, data);
		const captionElem = component.querySelector(".simple-select__caption");
		const optionElems = component.querySelectorAll(".simple-select__option");

		elem.replaceWith(component);
		component.prepend(elem);

		component.addEventListener("click", (event) => {
			if (event.target.closest(".simple-select__caption")) {
				if (component.classList.contains("active")) {
					deactivateSelect(component);
				} else {
					activateSelect(component, "click");
				}
			} else {
				const optionElem = event.target.closest(".simple-select__option");
				if (optionElem) {
					elem.value = optionElem.getAttribute("data-value");
					const changeEvent = new Event("change");
					changeEvent.__simpleSelectChange = true;
					elem.dispatchEvent(changeEvent);
				}
			}
		});
		component.addEventListener("pointerenter", (event) => {
			if (exitTimeout) {
				clearTimeout(exitTimeout);
			}
			if (activeSelectElem === component) return;
			enterTimeout = setTimeout(() => {
					enterTimeout = null;
					activateSelect(component, "hover");
				}, 1000);
		});
		component.addEventListener("pointerleave", (event) => {
			if (enterTimeout) {
				clearTimeout(enterTimeout);
				enterTimeout = null;
			}
			const openedBy = component.getAttribute("data-opened-by");
			if (openedBy === "click") return;
			if (openedBy === "hover") {
				exitTimeout = setTimeout(() => {
					exitTimeout = null;
					deactivateSelect(component);
				}, 1000);
			}
		});
		elem.addEventListener("change", (event) => {
			if (typeof selectedIndex === "number" && selectedIndex > -1) {
				if (selectedIndex !== elem.selectedIndex) {
					deactivateOption(selectedIndex);
					activateOption(elem.selectedIndex);
				}
			} else {
				activateOption(elem.selectedIndex);
			}
			function activateOption(index) {
				captionElem.textContent = optionElems[index]?.getAttribute("data-caption-value") || "";
				optionElems[index]?.classList.add("active");
				selectedIndex = index;
			}
			function deactivateOption(index) {
				optionElems[index]?.classList.remove("active");
			}
		});
	}
};