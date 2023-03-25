import "./sliders.js";
import { setBlockSizeVars } from "../../libs/blockSizeVars.js";
//import { SelectConstructor } from "../../libs/select.js";


const { lock, unlock } = bodyScrollLock;

window.addEventListener("DOMContentLoaded", onLoaded);

function error(msg) {
	alert("В приложении произошла ошибка: " + msg);
}


function onLoaded() {
	//const selects = new SelectConstructor({}, "[data-select]");
	setBlockSizeVars(".contacts");
}