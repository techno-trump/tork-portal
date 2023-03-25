import Swiper, { Autoplay, Pagination, Scrollbar, Navigation } from 'swiper';

function initCatalogueSlider() {
	new Swiper('.main-gallery__slider', {
		modules: [Autoplay, Navigation, Scrollbar, Pagination],
		resizeObserver: true,
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		autoplay: {
			delay: 3000,
			pauseOnMouseEnter: true,
		},
		navigation: {
			nextEl: '.main-gallery__next-btn',
			prevEl: '.main-gallery__prev-btn',
		},
		pagination: {
			el: '.main-gallery__paggination',
    	type: 'bullets',
			clickable: true,
		},
	});
}

window.addEventListener("load", function (e) {
	initCatalogueSlider();
});