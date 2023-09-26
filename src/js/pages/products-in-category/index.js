import initSliders from "./sliders.js";
import { setBlockSizeVars } from "../../../../repo/js/libs/blockSizeVars.js";
import { log, error, debug } from "../../../../repo/js/libs/logger.js";

window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	initSliders();
	setCardsWidth();
}
function setCardsWidth() {
	const elems = document.querySelectorAll(".category-card");
	elems.forEach(elem => {
		setBlockSizeVars(elem, { include: ["width"] });
	});
}