import { log, error, debug } from "../../../../repo/js/libs/logger.js";

function initMainSlider(thumbsSlider) {
	new Swiper("#product-card-slider", {
		observer: true,
		resizeObserver: true,
		slidesPerView: 1,
		grabCursor: true,
		loop: true,
		autoplay: {
			delay: 3000,
		},
		thumbs: {
			swiper: thumbsSlider
		}
	});
}
function initMainSliderThumbs() {
	return new Swiper("#product-card-slider-thumbs", {
		observer: true,
		resizeObserver: true,
		slidesPerView: 3,
		spaceBetween: 20,
		grabCursor: true,
		navigation: {
			prevEl: "#product-card-slider-thumbs-prev-btn",
			nextEl: "#product-card-slider-thumbs-next-btn",
		}
	});
}
function initOptionsSlider(prefix) {
	return new Swiper(`#${prefix}-options-slider`, {
		observer: true,
		resizeObserver: true,
		slidesPerView: "auto",
		spaceBetween: 20,
		grabCursor: true,
	});
}
function initProductsOverviewSlider(prefix) {
	new Swiper(`#${prefix}-slider`, {
		observer: true,
		resizeObserver: true,
		slidesPerView: 1,
		spaceBetween: 60,
		grabCursor: true,
		loop: true,
		autoplay: {
			delay: 3000,
		},
		breakpoints: {
			"575": {
				slidesPerView: 2,
			},
			"768": {
				slidesPerView: 3,
			},
			"1120": {
				slidesPerView: 4,
			}
		}
	});
}
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
	initMainSlider(initMainSliderThumbs());
	initOptionsSlider("design");
	initOptionsSlider("model");
	initOptionsSlider("color");
	initProductsOverviewSlider("consumables");
	initProductsOverviewSlider("recomended");
	initBreadcrumbsSlider();
}