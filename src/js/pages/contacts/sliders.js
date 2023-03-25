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
function initProductsSlider() {
		console.log("initProductsSlider");
	const setBreakpoints = (swiper) => {
		if (window.innerWidth < 992) {
				console.log("setBreakpoints < 992")
			swiper.params.breakpoints = {
				580: {
					slidesPerView: 2.5,
				},
				800: {
					slidesPerView: 3.5,
				}
			};
		} else {
			swiper.params.breakpoints = {
				0: {
					slidesPerView: 2.5,
				},
				650: {
					slidesPerView: 2.5,
				},
				800: {
					slidesPerView: 3.5,
				}
			};
		}
	};
	const slider = new Swiper('.contacts__products-slider', {
		modules: [Scrollbar],
		resizeObserver: true,
		slidesPerView: 1.2,
		spaceBetween: 20,
		breakpointsBase: "container",
		grabCursor: true,
		scrollbar: {
			el: ".products-slider__scrollbar",
			draggable: true,
		},
		on: {
			beforeResize: setBreakpoints,
			beforeInit: setBreakpoints,
		}
	});
}

window.addEventListener("load", function (e) {
	initProductsSlider();
	initCatalogueSlider();
});