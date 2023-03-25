import "./sliders.js";
import { initAmountSelectors } from "../../shared/initAmountSelectors.js";
import { attachFormValidator } from "../../libs/formValidator.js";
import { throttle } from "../../libs/throttle.js";

window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	initAmountSelectors();
	initFooterDynamicLocation();
	initFooterLinkControl();
	initQuickOrderForm();
}
function initQuickOrderForm() {
	const form = attachFormValidator("form[name='quick-order'");
	drawers.on("quick-order", "close", () => form.reset());
	form.on("submit", ({ formData }) => {
			console.log("quick-order data", formData);
		Promise.resolve()
			.then(() => {
				drawers.close("quick-order");
				drawers.open("quick-order-confirm");
			});
	});
}
// function initFooterDynamicLocation() {
// 	const listElem = document.querySelector("#cart-order-list");
// 	const footerElem = document.querySelector("#cart-footer");
// 	const hanleListSize = () => {
// 			console.log("Handle cart order list size");
// 		if (listElem.children.length > 2) {
// 			footerElem.classList.add("cart-is-overloaded");
// 		} else {
// 			footerElem.classList.remove("cart-is-overloaded");
// 		}
// 	}
// 	const observer = new MutationObserver((mutations) => {
// 		mutations.forEach(mutation => {
// 			if (mutation.type !== "childList") return;
// 			hanleListSize();
// 		})
// 	});
// 	observer.observe(listElem, { childList: true });
// 	hanleListSize();
// }
function createFooterController() {
	const outsideElem = document.querySelector("#cart-outside-footer-area");
	const insideElem = document.querySelector("#cart-footer-area");
	const cartFooterElem = document.querySelector("#cart-footer");
	let isOutside = false;
	
	return {
		setOutside: function(value) {
			if (value) {
				if (isOutside) return;
				outsideElem.appendChild(cartFooterElem);
				outsideElem.classList.add("active");
			} else if (isOutside) {
				insideElem.appendChild(cartFooterElem);
				outsideElem.classList.remove("active");
			}
			isOutside = value;
		}
	}
}
function initFooterDynamicLocation() {
	const cartRootElem = document.querySelector("#cart");
	const cartHeaderElem = document.querySelector("#cart-header");
	const cartBodyElem = document.querySelector("#cart-body");
	const footerController = createFooterController();
	
	const mediaMatch = window.matchMedia("(max-width: 992px)");
	const handleResize = throttle(() => {
		if (mediaMatch.matches) {
			footerController.setOutside(false);
		} else {
			const prependingBlocksHeight = cartHeaderElem.offsetHeight + cartBodyElem.offsetHeight;
			if (prependingBlocksHeight > window.innerHeight - 160 - 60 - 50) { // Высота экрана - top-padding - main-footer - пространство для cart-footer
				footerController.setOutside(true);
			} else {
				footerController.setOutside(false);
			}
		}
	}, 50);
	window.addEventListener("resize", handleResize);
	handleResize();

	
}
function initFooterLinkControl() {
	const scrollableElem = document.querySelector("#scrollable");
	const cartFooterElem = document.querySelector("#cart-footer");
	const footerLink = document.querySelector("#footer-link");
	const btnElem = footerLink.querySelector(".footer-link__btn");
	const intersectionOptions = {
		threshold: 0.35,
	}
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(({ target, isIntersecting }) => {
			if (target === cartFooterElem) {
				if (isIntersecting) {
					footerLink.classList.remove("active");
				} else {
					footerLink.classList.add("active");
				}
			}
		})
	}, intersectionOptions);
	observer.observe(cartFooterElem);

	btnElem.addEventListener("click", () => {
		console.log(scrollableElem, scrollableElem.scrollHeight);
		scrollableElem.scrollTo({ top: scrollableElem.scrollHeight, behavior: "smooth" });
	});
}