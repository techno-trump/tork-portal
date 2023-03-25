import "./sliders.js";
import { initRootFontSizeScaling } from "../../libs/adaptiveFontSize.js";
import { throttle } from "../../libs/throttle.js";
import { initPortals } from "../../libs/portal.js";
import { initDrawersControl } from "../../libs/drawers.js";
import { initSimpleSelects } from "../../libs/simpleSelect.js";


const { lock, unlock } = bodyScrollLock;

window.addEventListener("DOMContentLoaded", onLoaded);

function error(msg) {
	alert("В приложении произошла ошибка: " + msg);
}


function onLoaded() {

}