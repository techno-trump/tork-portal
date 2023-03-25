import "./sliders.js";
import { initRootFontSizeScaling } from "../../libs/adaptiveFontSize.js";
import { throttle } from "../../libs/throttle.js";
import { initPortals } from "../../libs/portal.js";
import { initDrawersControl } from "../../libs/drawers.js";
import { initSimpleSelects } from "../../libs/simpleSelect.js";
import { setBlockSizeVars } from "../../libs/blockSizeVars.js";


const { lock, unlock } = bodyScrollLock;

window.addEventListener("DOMContentLoaded", onLoaded);

function error(msg) {
	alert("В приложении произошла ошибка: " + msg);
}


function onLoaded() {
	setBlockSizeVars(".collections-grid__btn-area > a", "btn", ".collections-grid__card");
}