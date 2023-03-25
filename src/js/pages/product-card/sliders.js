
import Swiper, { Thumbs, Navigation } from 'swiper';
import Mustache from "mustache";

function initCatalogueSlider(thumbsSlider) {
	new Swiper('.main-gallery__slider', {
		modules: [Navigation, Thumbs],
		resizeObserver: true,
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		grabCursor: true,
		thumbs: {
			swiper: thumbsSlider
		},
		navigation: {
			nextEl: '.main-gallery__next-btn',
			prevEl: '.main-gallery__prev-btn',
		},
	});
}
function initCatalogueThumbsSlider() {
	return new Swiper('.main-gallery-thumbs__slider', {
		modules: [Navigation, Thumbs],
		observer: true,
		resizeObserver: true,
		slidesPerView: "auto",
		spaceBetween: 10,
		navigation: {
			nextEl: '.main-gallery-thumbs__next-btn',
			prevEl: '.main-gallery-thumbs__prev-btn',
		},
		breakpoints: {
			"768": {
				spaceBetween: 20,
			}
		}
	});
}
function initSamplesThumbs(category) {
	const rootClass = `${category}-samples-thumbs-drawer`;
	return new Swiper(`.${rootClass}__slider`, {
		modules: [Thumbs],
		observer: true,
		resizeObserver: true,
		slidesPerView: "auto",
		on: {
			click: (swiper, event) => {
				drawers.open(`${category}-samples-gallery`);
			}
		}
	});
}
function initShapeSamplesSlider(rootClass, thumbsSlider, productSelectSlider) {
	const productsSliderWrap = productSelectSlider.el.querySelector(`.swiper-wrapper`);
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
	new Swiper(`.${rootClass}__slider`, {
		modules: [Thumbs, Navigation],
		resizeObserver: true,
		slidesPerView: 1,
		spaceBetween: 0,
		grabCursor: true,
		loop: true,
		navigation: {
			prevEl: `.${rootClass}__prev-btn`,
			nextEl: `.${rootClass}__next-btn`,
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
function initProductSelectSlider(rootClass) {
	return new Swiper(`.${rootClass}__slider`, {
		modules: [Navigation],
		observer: true,
		resizeObserver: true,
		slidesPerView: "auto",
		spaceBetween: 25,
		centeredSlides: true,
		navigation: {
			prevEl: `.${rootClass}__prev-btn`,
			nextEl: `.${rootClass}__next-btn`,
		},
		breakpoints: {
			"720": {
				spaceBetween: 50,
			}
		}
	});
}

window.addEventListener("load", function (e) {
	const catalogueThumsSlider = initCatalogueThumbsSlider();
	initCatalogueSlider(catalogueThumsSlider);
	const shapeSamplesThumbs = initSamplesThumbs("shape");
	const shapeProductSelectSlider = initProductSelectSlider("shape-samples-product-select");
	initShapeSamplesSlider("shape-samples-gallery-drawer", shapeSamplesThumbs, shapeProductSelectSlider);
	const textureSamplesThumbs = initSamplesThumbs("texture");
	const textureProductSelectSlider = initProductSelectSlider("texture-samples-product-select");
	initShapeSamplesSlider("texture-samples-gallery-drawer", textureSamplesThumbs, textureProductSelectSlider);
});