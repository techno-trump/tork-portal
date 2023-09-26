
import { log, debug } from "./logger.js";
import { debounce } from "./debounce.js";
	
const portalsIndexByMedia = {};
const mediaIndex = {};
const onClassIndex = {};
const indexByName = {};

class Portal {
	constructor(name, src, dest) {
		this.name = name;
		this.src = src;
		this.dest = dest;
		this.state = { active: false };
	}
	send() {
		if (this.state.active) return this;
		this.dest.append(...this.src.childNodes);
		this.src.setAttribute("data-portal-active", "true");
		this.dest.setAttribute("data-portal-active", "true");
		this.state.active = true;
			debug("Portal has been activated: ", this);
		return this;
	}
	return() {
		if (!this.state.active) return this;
		this.src.append(...this.dest.childNodes);
		this.src.removeAttribute("data-portal-active");
		this.dest.removeAttribute("data-portal-active");
		this.state.active = false;
			debug("Portal has been de-activated: ", this.name);
		return this;
	}
	swap() {
		return this.state.active ? this.return() : this.send();
	}
}

export function initPortals() {
		log("Start portals initialization");
	const sourceElems = document.querySelectorAll("[data-portal-src]");
	const destElems = document.querySelectorAll("[data-portal-dest]");
	const destMap = [].reduce.call(destElems, (result, elem) => {
			result[elem.getAttribute("data-portal-dest")] = elem;
			return result;
		}, {});

	// Activate portal on user defined class added
	initMutationObserver();
		
	sourceElems.forEach(elem => {
		const portalName = elem.getAttribute("data-portal-src");
		const portalMedia = elem.getAttribute("data-portal-media");
		const portalOnClass = elem.getAttribute("data-portal-on-class");
			debug("Initialize portal:: portalName: ", portalName, ", portalMedia: ", portalMedia, ", portalOnClass: ", portalOnClass);
		if (!destMap[portalName]) {
			debug("No destination for portal:: portalName: ", portalName);
			return;
		}
		indexByName[portalName] = new Portal(portalName, elem, destMap[portalName]);
		if (portalMedia) return addTriggerByMedia(portalName, portalMedia);
		if (portalOnClass) return initPortalDrivenByClass(portalName, portalOnClass);

	});

		debug("indexByName: ", indexByName, "portalsIndexByMedia: ", portalsIndexByMedia);

	Object.entries(mediaIndex).forEach(([media, mediaMatch]) => swapByMedia(mediaMatch));

	window.portals = {
		getByName: (name) => indexByName[name],
	};

	function addTriggerByMedia(portalName, portalMedia) {
			debug("addTriggerByMedia: ", portalName, portalMedia);
		if (!mediaIndex[portalMedia]) {
			const mediaMatch = window.matchMedia(portalMedia);
			mediaIndex[portalMedia] = mediaMatch;
			portalsIndexByMedia[mediaMatch.media] = { mediaMatch, stack: [portalName] };
			mediaMatch.addListener(swapByMedia);
		} else {
			const trueMedia = mediaIndex[portalMedia].media;
			portalsIndexByMedia[trueMedia].stack.push(portalName);
		}
	}
	function initMutationObserver() {
		return new MutationObserver((mutationsList, observer) => {
			log(mutationsList);
		});
	}
	function initPortalDrivenByClass(className) {
	}
	function swapByMedia({ matches, media }) {
			debug("Manipulate portals by media: ", media, ", matches: ", matches);
		if (matches) {
			portalsIndexByMedia[media].stack.forEach(portalName => indexByName[portalName].send());
		} else {
			portalsIndexByMedia[media].stack.forEach(portalName => indexByName[portalName].return());
		}
	}
}