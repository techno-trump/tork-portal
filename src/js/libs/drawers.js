import { getTargetElem } from "./utils.js";

const { lock, unlock } = bodyScrollLock;

const isAsync = (target) => target.constructor.name === "AsyncFunction";
const initialLayerZIndex = 200;
const defaultOptions = {
	overlapping: true,
	static: false,
	closeOnEsc: true,
	closeOnOutsideClick: true,
	closeConfirm: (drawer) => { return true; },
}
class Drawer {
	static openDrawersList = [];
	static state = {
		upperOverlapping: null,
	};
	static get upperOpenDrawer() {
		return Drawer.openDrawersList[Drawer.openDrawersList.length - 1];
	}
	static get upperOverlapping() {
		return Drawer.state.upperOverlapping;
	}
	static set upperOverlapping(drawer) {
		return Drawer.state.upperOverlapping = drawer;
	}
	static resetUpperOverlapping() {
		if (Drawer.upperOverlapping) {
			Drawer.upperOverlapping.upperOverlapping = false;
		}
		const upperOverlapping = Drawer.openDrawersList.find(drawer => drawer.overlapping);
		if (upperOverlapping) {
			upperOverlapping.upperOverlapping = true;
			Drawer.upperOverlapping = upperOverlapping;
		}
	}
	static get upperZIndex() {
		if (Drawer.openDrawersList.length) {
			return Drawer.upperOpenDrawer.zIndex;
		} else {
			return initialLayerZIndex;
		}
	}
	#state = {
		zIndex: null,
		focus: false,
		open: false,
		locked: false,
		upperOverlapping: false,
	};
	subscribers = {
		close: [],
		open: [],
	};
	components = {
		openBtnElems: [],
		closeBtnElems: [],
	}
	
	constructor(elem, alias, userOptions = {}) {
		const options = { __proto__: defaultOptions, on: {} };
		this.elem = elem;
		this.alias = alias;
		this.params = Object.assign(options, userOptions);
	}
	set zIndex(val) {
		this.#state.zIndex = val;
		this.elem.style.setProperty("z-index", val);
	}
	get zIndex() {
		return this.#state.zIndex;
	}
	set focus(value) {
		this.#state.focus = value;
		if (value) {
			this.elem.classList.add("focus");
		} else {
			this.elem.classList.remove("focus");
		}
	}
	set upperOverlapping(value) {
		this.#state.upperOverlapping = value;
		if (value) {
			this.elem.classList.add("upper-overlapping");
		} else {
			this.elem.classList.remove("upper-overlapping");
		}
	}
	get upperOverlapping() {
		return this.#state.upperOverlapping;
	}
	get focus() {
		return this.#state.focus;
	}
	set locked(value) {
		this.#state.locked = value;
		if (value) lock(this.elem);
		else unlock(this.elem);
	}
	get locked() {
		return this.#state.locked;
	}
	on(type, callback) {
		if (type in this.subscribers) {
			this.subscribers[type].push(callback);
		}
	}
	set overlapping(value) {
		this.params.overlapping = value;
		if (value) this.elem.classList.add("drawer_overlapping");
		else this.elem.classList.remove("drawer_overlapping");
		Drawer.resetUpperOverlapping();
	}
	get overlapping() {
		return this.params.overlapping;
	}
	addOpenBtn(target) {
		const openBtnElem = getTargetElem(target);
		this.components.openBtnElems.push(openBtnElem);
		openBtnElem.addEventListener("click", (event) => {
			event.__drawerOpen = true;
			this.open(openBtnElem);
		});
	}
	addCloseBtn(target) {
		const closeBtnElem = getTargetElem(target);
		this.components.closeBtnElems.push(closeBtnElem);

		closeBtnElem.addEventListener("click", (event) => {
			event.__drawerClose = true;
			this.close(closeBtnElem);
		});
	}
	open(initiator) {
			console.log("Open Drawer Native", this, initiator);
		if (this.#state.open) return;

		this.components.openBtnElems.forEach(elem => {
			if (elem instanceof HTMLElement) {
				elem.classList.add("active");
			}
		});
		
		if (this.params.overlapping || this.params.static) { // Add event listeners
			this.locked = true;
			if (Drawer.upperOverlapping) {
				Drawer.upperOverlapping.upperOverlapping = false;
			}
			this.upperOverlapping = true;
			Drawer.upperOverlapping = this;
		}
		// Get upper overlapping
		this.zIndex = Drawer.upperZIndex + 1;
		this.elem.classList.add("open");
		this.initiator = initiator;
		this.#state.open = true;
		Drawer.openDrawersList.push(this);
		this.subscribers.open.forEach(callback => callback(this));
	}
	close() {
			console.log("Close Drawer Native", this);
		if (!this.#state.open) return;

		this.components.openBtnElems.forEach(elem => {
			if (elem instanceof HTMLElement) {
				elem.classList.remove("active");
			}
		});

		this.elem.classList.remove("open");
		this.locked = false;
		this.#state.open = false;

		const drawerIdx = Drawer.openDrawersList.findIndex(drawer => drawer.alias === this.alias);
		Drawer.openDrawersList.splice(drawerIdx, 1);
		Drawer.resetUpperOverlapping();

		this.subscribers.close.forEach(callback => callback(this));
	}
	async handleEsc(event) {
		if (this.params.closeOnEsc && !this.params.static) {
			if (await this.params.closeConfirm(this)) this.close();
		}
	}
	async handleOutsideClick(event) {
		if (event.target === this.initiator) return;
		if (this.params.closeOnOutsideClick && !this.params.static) {
			if (await this.params.closeConfirm(this)) this.close();
		}
	}
	async handleUnderlayClick(event) {
		if (this.params.closeOnOutsideClick && !this.params.static) {
			if (await this.params.closeConfirm(this)) this.close();
		}
	}
}
if (!window.drawers) {
	window.drawers = (() => {
		const kitchen = {};
		const drawersMap = {};
		
		kitchen.init = function(options) {
			const drawerElems = document.querySelectorAll("[data-drawer]");
			const controlElems = document.querySelectorAll("[data-drawer-open], [data-drawer-close]");
			drawerElems.forEach(elem => {
				const drawerAlias = elem.getAttribute("data-drawer");
				drawersMap[drawerAlias] = new Drawer(elem, drawerAlias, options);
			});
			controlElems.forEach(elem => {
				if (elem.hasAttribute("data-drawer-open")) {
					const drawerAlias = elem.getAttribute("data-drawer-open");
					if (!drawersMap[drawerAlias]) return;
					drawersMap[drawerAlias].addOpenBtn(elem);
				} else {
					const drawerAlias = elem.getAttribute("data-drawer-close");
					if (!drawersMap[drawerAlias]) return;
					drawersMap[drawerAlias].addCloseBtn(elem);
				}
			});

			document.addEventListener("click", (event) => {
				if (event.__drawerOpen || event.__drawerClose) return;
				const { target } = event;
				const drawerPanelElem = target.closest(".drawer__panel");
				if (drawerPanelElem) { // Inside click

				} else {
					const drawerElem = target.closest(".drawer");
					if (drawerElem) { // Underlay click
						const alias = drawerElem.getAttribute("data-drawer");
						drawersMap[alias]?.handleUnderlayClick(event);
					} else { // Outside click
						Drawer.openDrawersList.forEach(drawer => drawer.handleOutsideClick(event));
					}
				}
			});
		}
		kitchen.assign = function(target, alias, options) {
			if (alias in drawersMap) throw new Error(`There is drawer already created with given alias: "${alias}"`);
			const drawerElem = target instanceof HTMLElement ? target : document.querySelector(target);
			if (drawerElem) throw new Error(`There is no element has been found by given selector: "${target}"`);
			return drawersMap[alias] = new Drawer(drawerElem, alias, options);
		}
		kitchen.open = function(alias, initiator) {
				console.log("Open Drawer Kitchen", alias, initiator);
			if (!(alias in drawersMap)) throw new Error(`There is no drawer created with given alias: "${alias}"`);
			drawersMap[alias].open(initiator);
		}
		kitchen.close = function(alias) {
				console.log("Close Drawer Kitchen", alias);
				if (!(alias in drawersMap)) throw new Error(`There is no drawer created with given alias: "${alias}"`);
			drawersMap[alias].close();
		}
		kitchen.get = function(alias) {
			return drawersMap[alias];
		}
		kitchen.on = (alias, type, callback) => kitchen.get(alias)?.on(type, callback);
		return kitchen;
	})();
}
function bodyLock(targetElem) {
	lock(targetElem);
	const bodyElem = document.querySelector("body");
	bodyElem.classList.add("lock");
	const scrollableElems = targetElem.querySelectorAll("[data-scrollable]");
	scrollableElems.forEach(elem => lock(elem));
}
function bodyUnlock(targetElem, removeUnderlay = true, delay = 300) {
	const bodyElem = document.querySelector("body");
	setTimeout(() => {
		if (removeUnderlay) {
			bodyElem.classList.remove("lock");
		}
		unlock(targetElem);
		const scrollableElems = targetElem.querySelectorAll("[data-scrollable]");
		scrollableElems.forEach(elem => unlock(elem));
	}, delay);
}