import { initRootFontSizeScaling } from "../libs/adaptiveFontSize.js";
import { throttle } from "../libs/throttle.js";
import { initPortals } from "../libs/portal.js";
import "../libs/drawers.js";
import { initSimpleSelects } from "../libs/simpleSelect.js";
import { setBlockSizeVars } from "../libs/blockSizeVars.js";
import { attachFormValidator } from "../libs/formValidator.js";
import { NativeSelectWrap } from "../libs/mySelect.js";
import { initCopyToClipboard } from "../shared/copyToClipboard.js";

const { lock, unlock } = bodyScrollLock;

const debug = false;
const iOSDebug = false;

function log(msg) {
	if (!debug) return false;
	if (iOSDebug) {
		alert(msg);
	} else {
		console.log(msg);
	}
}

window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
		initRootFontSizeScaling(1920, 1080, 992);
		initSimpleSelects();
		setBlockSizeVars("body", "body");
		setBlockSizeVars(".wrapper", "wrap");
		setBlockSizeVars(".page", "page");
		setBlockSizeVars(".content");
		initMainMenu();
		initPortals();		
		drawers.init();
		initContactForm();
		initCopyToClipboard({ preventDefault: true });
}
function initContactForm() {
	const form = attachFormValidator("form[name='feedback-order'");
	drawers.on("contact-form", "close", () => form.reset());
	form.on("submit", ({ formData }) => {
		Promise.resolve()
			.then(() => {
				drawers.close("contact-form");
				drawers.open("contact-request-confirm");
			});
	});

	const countrySelect = new NativeSelectWrap("#drawer-country-select", {
	});
}
function initMainMenu() {
	const btnElem = document.querySelector(".main-menu__btn");
	const menuElem = document.querySelector(".footer__main-menu");
	const navPanel = document.querySelector(".footer__nav-panel");
	const removeOutsideClickListener = () => {
		document.removeEventListener("click", handleOutsideClick);
	}
	const close = () => {
		if (mobileMatch.matches) {
			unlock(navPanel);
		}
		btnElem.classList.remove("active");
		menuElem.classList.remove("active");
		removeOutsideClickListener();
	}
	const handleOutsideClick = (event) => {
		if (event.target.closest(".main-menu__nav-wrap, .menu-btn")) return;
		close();
	}
	const mobileMatch = window.matchMedia("(max-width: 720px)");

	mobileMatch.addListener((match) => {
		if (btnElem.classList.contains("active")) {
			lock(navPanel);
		} else {
			unlock(navPanel);
		}
	});
	
	btnElem.addEventListener("click", () => {
		console.log("click");
		if (btnElem.classList.contains("active")) {
			close();
		} else {
			if (mobileMatch.matches) {
				lock(navPanel);
			}
			btnElem.classList.add("active");
			menuElem.classList.add("active");
			document.addEventListener("click", handleOutsideClick);
		}
	});
}
const setViewPortRatioClass = () => {
	const htmlElem = document.querySelector("html");
	const handleResize = throttle(() => {
		const ration = window.clientWidth / window.clientHeight;

	}, 50);

	window.addEventListener("resize", handleResize);
	handleResize();
};
