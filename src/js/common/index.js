import "../../../repo/components/drawers/index.js";
import { initPortals } from "../../../repo/js/libs/portals.js";
import initOnHoverAnimationFinalization from "../../../repo/js/libs/onHoverAnimationFinalization.js";
import { isMobile } from "../../../repo/js/libs/functions.js";
import { log, error, debug } from "../../../repo/js/libs/logger.js";


window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	try {
		initPortals();
		drawers.init();
		initOnHoverAnimationFinalization();
		initCloseDrawersOnResize();
		initMarkOnScroll();
		addIsMobileClass();
	} catch (ex) {
		error(ex);
	}
}
function addIsMobileClass() {
	if (isMobile.any()) {
		document.documentElement.classList.add("is-mobile");
	}
}
function initCloseDrawersOnResize() {
	const close = ({ matches }) => {
		drawers.get("main-menu").close();
	}
	const mediaMatch = window.matchMedia("(max-width: 1050px)");
	mediaMatch.addListener(close);
}
function initMarkOnScroll() {
	document.addEventListener("scroll", () => {
		if (window.scrollY > 80) {
			document.documentElement.classList.add("scroll-80-plus");
		} else {
			document.documentElement.classList.remove("scroll-80-plus");
		}
	});
}