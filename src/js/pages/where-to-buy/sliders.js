import Swiper, { Pagination, Scrollbar, Navigation } from 'swiper';

function initCatalogueSlider() {
	const handleWidth = (swiper) => {
		swiper.enable();
		if (window.innerWidth < 768) {
			swiper.slideTo(1);
		} else {
			swiper.slideTo(0);
		}
		swiper.update();
		swiper.disable();
	};

	new Swiper('.main-gallery__slider', {
		modules: [Navigation, Scrollbar, Pagination],
		resizeObserver: true,
		slidesPerView: 1,
		spaceBetween: 0,
		enabled: false,
		navigation: {
			nextEl: '.main-gallery__next-btn',
			prevEl: '.main-gallery__prev-btn',
		},
		pagination: {
			el: '.main-gallery__paggination',
    	type: 'bullets',
			clickable: true,
		},
		on: {
			"resize": handleWidth,
			"init": handleWidth,
		}
	});
}
function initCountrySelectSlider() {
	return new Swiper('.radio-select-slider', {
		modules: [],
		resizeObserver: true,
		slidesPerView: "auto",
		spaceBetween: 15,
	});
}

window.addEventListener("load", function (e) {
	initCatalogueSlider();
	initCountrySelectSlider();
});