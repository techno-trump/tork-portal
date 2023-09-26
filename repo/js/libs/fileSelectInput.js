const classes = {
	root: "input-file-select",
	nativeInput: "__input",
	label: "__label",
}
const getChildClass = (name) => {
	return classes.root + classes[name];
}

export const initFileSelectInputs = () => {
	const elems = document.querySelectorAll(`.${classes.root}`);
	elems.forEach(init);

	function init(rootElem) {
		const labelElem = rootElem.querySelector(`.${getChildClass("label")}`);
		if (!labelElem) return;
		const initialLabel = labelElem?.textContent;
		const nativeInputElem = rootElem.querySelector(`.${getChildClass("nativeInput")}`);
		nativeInputElem.addEventListener("change", function() {

			if (this.files.length) {
				labelElem.textContent = this.files[0].name;
			} else {
				labelElem.textContent = initialLabel;
			}
		});
	}
}