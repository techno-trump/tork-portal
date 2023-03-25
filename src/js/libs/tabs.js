const rootClass = "tabs";
const classes = {
	root: rootClass,
	controls: `${rootClass}__controls`,
	select: `${rootClass}__select`,
	panelsGroup: `${rootClass}__panels-group`,
};
class Tabs {
	map = new Map();
	selectElems = [];
	tabElems = [];
	activeTabSelectElem = null;

	constructor(rootElem) {
		this.controlsElem = rootElem.querySelector(`.${classes.controls}`);
		this.selectElems = rootElem.querySelectorAll(`.${classes.select}`);
		this.panelsGroupElem = rootElem.querySelector(`.${classes.panelsGroup}`);
		this.tabElems = this.panelsGroupElem.children;

		this.selectElems.forEach((selectElem, idx) => {
			if (!this.tabElems[idx]) return;
			this.map.set(selectElem, this.tabElems[idx]);
			if (selectElem.checked) {
				this.tabElems[idx].classList.add("active");
				this.activeTabSelectElem = selectElem;
			}
		});
		this.controlsElem.addEventListener("change", ({ target }) => {
			if (!this.map.has(target)) return;
			const tabToActivateElem = this.map.get(target);
			tabToActivateElem.classList.add("active");
			if (this.activeTabSelectElem !== target) {
				if (this.activeTabSelectElem instanceof HTMLElement) {
					const activeTabElem = this.map.get(this.activeTabSelectElem);
					activeTabElem.classList.remove("active");
				}
				this.activeTabSelectElem = target;
			}
		});
	}
}
export function initTabs() {
	const rootElems = document.querySelectorAll(`.${classes.root}`);
	rootElems.forEach(init);

	function init(rootElem) {
		new Tabs(rootElem);
	}
}