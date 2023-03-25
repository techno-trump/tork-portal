import Swiper, { Navigation, Thumbs } from 'swiper';
import Mustache from "mustache";

function initYearSelectSlider() {
	return new Swiper('.content__year-select-slider', {
		modules: [],
		resizeObserver: true,
		slidesPerView: "auto",
		spaceBetween: 15,
		grabCursor: true,
	});
}
function initGalleryThumbsSlider() {
	return new Swiper('.content__gallery-thumbs', {
		modules: [Thumbs],
		resizeObserver: true,
		slidesPerView: "auto",
		spaceBetween: 0,
		allowTouchMove: false,
		on: {
			"click": (swiper, event) => {
				if (window.innerWidth < 993) {
					window.drawers.open("gallery", event.target);	
				}
			}
		}
	});
}
function initGallerySlider(thumbsSlider, productSelectSlider) {
	const productsSliderWrap = document.querySelector(".product-select__slider > .swiper-wrapper");
	const productsSliderTemplate = `{{#products}}
																		<a href="{{href}}" target="_blank" class="swiper-slide product-select__link">
																			<span>{{title}}</span>
																			<span>{{price}}</span>
																		</a>
																	{{/products}}`;
	const setProductsList = (swiper) => {
			const activeSlide = swiper.slides[swiper.realIndex];
			const productsRawData = activeSlide.getAttribute("data-products");
			try {
				const productsData = { products: JSON.parse(productsRawData) };
				const listRender = Mustache.render(productsSliderTemplate, productsData);
				productsSliderWrap.innerHTML = listRender;
			} catch (ex) {
				console.log("Error mounting product data: ", ex);
			}
			productSelectSlider.slideTo(0, 1000, false);
		};
	new Swiper('.projects-gallery__slider', {
		modules: [Thumbs, Navigation],
		resizeObserver: true,
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		grabCursor: true,
		navigation: {
			prevEl: ".projects-gallery__prev-btn",
			nextEl: ".projects-gallery__next-btn",
		},
		thumbs: {
			swiper: thumbsSlider
		},
		on: {
			"activeIndexChange": setProductsList,
			"afterInit": setProductsList,
		}
	});
}
function initProductSelectSlider() {
	return new Swiper('.product-select__slider', {
		modules: [Navigation],
		observer: true,
		resizeObserver: true,
		slidesPerView: "auto",
		spaceBetween: 25,
		centeredSlides: true,
		grabCursor: true,
		navigation: {
			prevEl: ".product-select__prev-btn",
			nextEl: ".product-select__next-btn",
		},
		breakpoints: {
			"720": {
				spaceBetween: 50,
			}
		}
	});
}



window.addEventListener("load", function (e) {
	initYearSelectSlider();
	const thumbsSlider = initGalleryThumbsSlider();
	const productSelectSlider = initProductSelectSlider();
	initGallerySlider(thumbsSlider, productSelectSlider);
	
});