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
	initPartnershipForm();
}

function initPartnershipForm() {
	const form = attachFormValidator("form[name='partnership-request'");
	form.on("submit", ({ formData }) => {
			console.log("contact-form data", formData);
		Promise.resolve()
			.then(() => {
				form.reset();
				drawers.open("contact-request-confirm");
			});
	});

	const professionSelect = new NativeSelectWrap("#profession-select", {
	});
}