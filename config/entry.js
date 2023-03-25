function getEntryPoints (base = "", mode) {
	return {
		"common": [`${base}/js/common/index.js`, `${base}/scss/common/index.scss`],
		"home": [`${base}/js/pages/home/index.js`, `${base}/scss/pages/home/index.scss`],
		"shapes": [`${base}/js/pages/shapes/index.js`, `${base}/scss/pages/shapes/index.scss`],
		"shape-catalogue": [`${base}/js/pages/shape-catalogue/index.js`, `${base}/scss/pages/shape-catalogue/index.scss`],
		"collections": [`${base}/js/pages/collections/index.js`, `${base}/scss/pages/collections/index.scss`],
		"collection-textures": [`${base}/js/pages/collection-textures/index.js`, `${base}/scss/pages/collection-textures/index.scss`],
		"projects": [`${base}/js/pages/projects/index.js`, `${base}/scss/pages/projects/index.scss`],
		"contacts": [`${base}/js/pages/contacts/index.js`, `${base}/scss/pages/contacts/index.scss`],
		"dealers": [`${base}/js/pages/dealers/index.js`, `${base}/scss/pages/dealers/index.scss`],
		"partnership": [`${base}/js/pages/partnership/index.js`, `${base}/scss/pages/partnership/index.scss`],
		"planters-to-order": [`${base}/js/pages/planters-to-order/index.js`, `${base}/scss/pages/planters-to-order/index.scss`],
	  "catalogue": [`${base}/js/pages/catalogue/index.js`, `${base}/scss/pages/catalogue/index.scss`],
		"where-to-buy": [`${base}/js/pages/where-to-buy/index.js`, `${base}/scss/pages/where-to-buy/index.scss`],
		"store": [`${base}/js/pages/store/index.js`, `${base}/scss/pages/store/index.scss`],
		"product-card": [`${base}/js/pages/product-card/index.js`, `${base}/scss/pages/product-card/index.scss`],
		"cart": [`${base}/js/pages/cart/index.js`, `${base}/scss/pages/cart/index.scss`],
		"order-confirmation": [`${base}/js/pages/order-confirmation/index.js`, `${base}/scss/pages/order-confirmation/index.scss`],
		"404": [`${base}/scss/pages/404/index.scss`],
	};
}
export default getEntryPoints;