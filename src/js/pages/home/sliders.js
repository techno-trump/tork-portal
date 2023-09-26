import { log, error, debug } from "../../../../repo/js/libs/logger.js";

function initWelcomeSliders() {
		log("initWelcomeSliders");
	const sectionsSlider = new Swiper("#welcome-slider", {
		observer: true,
		resizeObserver: true,
		slidesPerView: 1,
		grabCursor: true,
		autoplay: {
			delay: 3000,
		},
		pagination: {
			el: "#welcome-slider-pagination",
			clickable: true,
		}
	});
}

export default function initSliders() {
	initWelcomeSliders();
}