import initAccordeon from "../../../../repo/components/accordeon/index.js";
import initSliders from "./sliders.js";
import { log, error, debug } from "../../../../repo/js/libs/logger.js";

window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	initSliders();
	initAccordeon("#product-card-accordeon");
	//$.fancybox.defaults.backFocus = false;
}