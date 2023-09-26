function getEntryPoints (base = "", mode) {
	return {
		"common": [`${base}/js/common/index.js`, `${base}/scss/common/index.scss`],
		"home": [`${base}/js/pages/home/index.js`, `${base}/scss/pages/home/index.scss`],
		"product-card": [`${base}/js/pages/product-card/index.js`, `${base}/scss/pages/product-card/index.scss`],
		"product-categories": [`${base}/js/pages/product-categories/index.js`], // `${base}/scss/pages/product-categories/index.scss`
		"products-in-category": [`${base}/js/pages/products-in-category/index.js`, `${base}/scss/pages/products-in-category/index.scss`],
		"library": [`${base}/js/pages/library/index.js`, `${base}/scss/pages/library/index.scss`],
		"marketing-materials-post": [`${base}/js/pages/marketing-materials-post/index.js`, `${base}/scss/pages/marketing-materials-post/index.scss`],
		"service": [`${base}/js/pages/service/index.js`, `${base}/scss/pages/service/index.scss`],
		"news-list": [`${base}/js/pages/news-list/index.js`, `${base}/scss/pages/news-list/index.scss`],
		"news-post": [`${base}/js/pages/news-post/index.js`, `${base}/scss/pages/news-post/index.scss`],
	};
}
export default getEntryPoints;