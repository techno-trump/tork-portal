import Swiper, { Pagination, Scrollbar, Navigation } from 'swiper';
function initCatalogueSlider() {
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
		}
	});
}
window.addEventListener("load", function (e) {
	initCatalogueSlider();
});