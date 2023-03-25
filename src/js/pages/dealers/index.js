import "./sliders.js";
import { setBlockSizeVars } from "../../libs/blockSizeVars.js";
import { SelectConstructor } from "../../libs/select.js";
import { initFileSelectInputs } from "../../libs/fileSelectInput.js";
import { attachFormValidator } from "../../libs/formValidator.js";
import { initTabs } from "../../libs/tabs.js";

//const { lock, unlock } = bodyScrollLock;

window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	const selects = new SelectConstructor({}, "[data-select]");
	setBlockSizeVars(".contacts");
	initFileSelectInputs();
	initPartnershipForm();
	initTabs();
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
}