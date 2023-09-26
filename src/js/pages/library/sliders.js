import { log, error, debug } from "../../../../repo/js/libs/logger.js";

function initBreadcrumbsSlider() {
	new Swiper(`#breadcrumbs-slider`, {
		resizeObserver: true,
		slidesPerView: "auto",
		grabCursor: true,
		freeMode: true,
	});
}

export default function initSliders() {
		log("init page sliders");
	initBreadcrumbsSlider();
}