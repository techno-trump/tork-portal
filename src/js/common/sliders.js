import { throttle } from "../libs/throttle.js";
import Swiper, { Pagination, Autoplay, Scrollbar, Navigation, Manipulation, Mousewheel } from 'swiper';

const scrollControllStack = new Map();
const disableManipulations = (swiper) => {
		console.log("disableManipulations");
	swiper.mousewheel.disable();
	swiper.allowTouchMove = false;
};
const enableManipulations = (swiper) => {
		console.log("enableManipulations");
	swiper.mousewheel.enable();
	swiper.allowTouchMove = true;
};
window.addEventListener("resize", throttle(() => {
	for (const [swiper, context] of scrollControllStack) {
		const { container, listener } = context;
		const hasVerticalScrollbar = container.scrollHeight > container.clientHeight;
		if (hasVerticalScrollbar) {	
			if (!listener) {
				context.listener = (event) => {
					// On edges
						console.log(container.scrollTop, container.scrollHeight, container.clientHeight);
					if (container.scrollTop <= 0  || container.scrollTop >= (container.scrollHeight - container.clientHeight)) {
						enableManipulations(swiper);
					}
				}
				container.addEventListener("scroll", context.listener);
				disableManipulations(swiper);
			}
		} else if (listener) {
			container.removeEventListener("scroll", listener);
			context.listener = null;
			enableManipulations(swiper);
		}
	}
}), 50);

const allowScroll = (swiper, container) => {
	disableManipulations(swiper);
	//scrollControllStack.set(swiper, { container });
};

// Инициализация слайдеров
function initCatalogueSlider() {
	// Перечень слайдеров
	// Проверяем, есть ли слайдер на стронице
	new Swiper('.main-gallery__slider', { // Указываем скласс нужного слайдера
		// Подключаем модули слайдера
		// для конкретного случая
		resizeObserver: true,
		modules: [Navigation, Scrollbar, Pagination],
		slidesPerView: 1,
		spaceBetween: 0,
		//autoHeight: true,
		loop: true,
		//touchRatio: 0,
		//simulateTouch: true,
		autoplay: {
			delay: 3000,
			pauseOnMouseEnter: true,
		},
		//Кнопки "влево/вправо"
		navigation: {
			nextEl: '.main-gallery__next-btn',
			prevEl: '.main-gallery__prev-btn',
		},
		pagination: {
			el: '.main-gallery__paggination',
    	type: 'bullets',
			clickable: true,
		},
		// Брейкпоинты
		breakpoints: {
			// 540: {
			// 	//autoHeight: true,
			// 	slidesPerView: 3,
			// 	spaceBetween: 23,
			// },
			// 992: {
			// 	//autoHeight: true,
			// 	slidesPerView: 4,
			// 	spaceBetween: 26,
			// },
			// 1359: {
			// 	//autoHeight: true,
			// 	slidesPerView: 5,
			// 	spaceBetween: 29,
			// },
		},
	});
}
// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSectionsSliders() {
	const sectionsSlider = new Swiper(".section-slider", {
		modules: [Mousewheel],
		observer: true,
		resizeObserver: true,
		observeParents: true,
		slidesPerView: 1,
		direction: "vertical",
		mousewheel: true,
		//allowTouchMove: false,
		//touchStartPreventDefault: true,
		breakpoints: {
			991.98: {
				slidesPerView: 2,
				direction: "horizontal",
			},
		},
	});
	//const mainContainerElem = document.querySelector(".inner");
	//allowScroll(sectionsSlider, mainContainerElem);
}
function passProductsSliderHeightToContainer() {
	const sliderContainerElem = document.querySelector(".popular-products-slider");
	const sliderElem = document.querySelector(".popular-products-slider__swiper");
	const setParentHeight = _.debounce(() => {
		sliderContainerElem.style.height = `${sliderElem.offsetHeight}px`;
	}, 300);
	const observer = new ResizeObserver((entries) => {
		if (!entries.length) return;
		setParentHeight();
	});
	observer.observe(sliderElem);
}

window.addEventListener("load", function (e) {
	initSectionsSliders();
	initCatalogueSlider();
});