export function initOptionsListSummary() {
	const inputGroupElems = document.querySelectorAll(`[data-options-list]`);
	const indicatorElems = document.querySelectorAll(`button[data-options-indicator]`);
	const indicatorsMap = [].reduce.call(indicatorElems, (result, elem) => {
		result[elem.getAttribute("data-options-indicator")] = { elem, initialText: elem.textContent };
		return result;
	}, {});
		// console.log(inputGroupElems, indicatorElems, indicatorsMap);
		// console.log("indicatorsMap", indicatorsMap);
	const setSummary = (groupAlias, summary) => {
		if (indicatorsMap[groupAlias]) {
			const { elem, initialText } = indicatorsMap[groupAlias];
			elem.firstElementChild.innerHTML = summary ? summary + "&nbsp;" : initialText;
		}
	}
	const resetSummary = (groupAlias) => {
		if (indicatorsMap[groupAlias]) {
			const { elem, initialText } = indicatorsMap[groupAlias];
			elem.firstElementChild.innerHTML = initialText + "&nbsp;";
		}
	}
	inputGroupElems.forEach(groupElem => {
		const groupAlias = groupElem.getAttribute("data-options-list");
		groupElem.addEventListener("change", () => {
			const checkedInputElems = groupElem.querySelectorAll("input:checked");
				console.log(checkedInputElems);
			const list = [].map.call(checkedInputElems, (elem) => {
				const captionElem = elem.parentElement.lastElementChild;
				return captionElem.textContent.trim();
			});
			if (list.length) {
				setSummary(groupAlias, list.join(", "));
			} else {
				resetSummary(groupAlias);
			}
		});
	});
}