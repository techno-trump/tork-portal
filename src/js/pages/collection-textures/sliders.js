import Swiper, { Pagination, Scrollbar, Navigation } from 'swiper';

function initCatalogueSlider() {
	new Swiper('.main-gallery__slider', {
		modules: [Navigation, Pagination],
		resizeObserver: true,
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		grabCursor: true,
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
	});
}
function initTexturesSlider() {
	const setBreakpoints = (swiper) => {
		if (window.innerWidth < 992) {
			swiper.params.breakpoints = {
				480: {
					slidesPerView: 3.5,
					spaceBetween: 25,
				},
				650: {
					slidesPerView: 4.5,
					spaceBetween: 25,
				},
				880: {
					slidesPerView: 5.5,
					spaceBetween: 30,
				}
			};
		} else {
			swiper.params.breakpoints = {
				0: {
					slidesPerView: 3.5,
					spaceBetween: 25,
				},
				650: {
					slidesPerView: 4.5,
					spaceBetween: 25,
				},
				880: {
					slidesPerView: 5.5,
					spaceBetween: 30,
				}
			};
		}
	};

	const slider = new Swiper('.content__products-slider', {
		modules: [Navigation, Scrollbar],
		resizeObserver: true,
		slidesPerView: 1,
		spaceBetween: 0,
		breakpointsBase: "container",
		grabCursor: true,
		navigation: {
			prevEl: '.products-slider__btn-prev',
			nextEl: '.products-slider__btn-next',
		},
		scrollbar: {
			el: ".products-slider__scrollbar",
			draggable: true,
		},
		on: {
			beforeResize: setBreakpoints,
			beforeInit: setBreakpoints,
		}
	});
	const mediaMatch = window.matchMedia("(max-width: 480px)");
	const handleMatch = ({matches}) => {
		if (matches) {
			slider.disable();
		} else {
			slider.enable();
		}
	}
	mediaMatch.addListener(handleMatch);
	handleMatch(mediaMatch);
}

window.addEventListener("load", function (e) {
	initCatalogueSlider();
	initTexturesSlider();
});