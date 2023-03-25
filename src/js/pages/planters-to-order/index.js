import "./sliders.js";
import { setBlockSizeVars } from "../../libs/blockSizeVars.js";
import { SelectConstructor } from "../../libs/select.js";
import { initFileSelectInputs } from "../../libs/fileSelectInput.js";
import { attachFormValidator } from "../../libs/formValidator.js";
import { NativeSelectWrap } from "../../libs/mySelect.js";

//const { lock, unlock } = bodyScrollLock;

window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	const selects = new SelectConstructor({}, "[data-select]");
	setBlockSizeVars(".contacts");
	initFileSelectInputs();
	initForm();
}

function initForm() {
	const form = attachFormValidator("form[name='planters-request'");
	form.on("submit", ({ formData }) => {
			console.log("planters-request data", formData);
		Promise.resolve()
			.then(() => {
				form.reset();
				drawers.open("contact-request-confirm");
			});
	});

	const countrySelect = new NativeSelectWrap("#form-country-select", {
	});
}