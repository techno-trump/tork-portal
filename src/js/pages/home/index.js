import initSliders from "./sliders.js";
import { log, error, debug } from "../../../../repo/js/libs/logger.js";

window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	initSliders();
}
