const imitList = [
	{
		id: 1,
		href: ".?shape=upon&texture=Cobalt blue&diam=40&height=60",
		imgPath: "img/store/catalogue/colonna_group_gold 1.jpg",
		hoveredImgPath: "img/store/catalogue/colonna_group_gold 1.jpg",
		group: "rectangular",
		type: "for-desk",
		placing: "inside",
		length: 30,
		width: 40,
		height: 50,
		shape: "Colonna",
		texture: "Gold",
		availability: true,
		price: 15090,
		name: "COLONNA Gold"
	},
	{
		id: 2,
		href: ".?shape=conus&texture=cobalt_blue&diam=50&height=70",
		imgPath: "img/store/catalogue/cone_group_nero.jpg",
		hoveredImgPath: "img/store/catalogue/cone_group_nero.jpg",
		group: "round",
		type: "for-desk",
		placing: "outside",
		diameter: 50,
		height: 70,
		shape: "CONUS",
		texture: "COBALT BLUE",
		availability: true,
		price: 5070,
		name: "CONUS COBALT BLUE"
	},
	{
		id: 3,
		href: ".?shape=barrel&texture=gold&diam=50&height=30",
		imgPath: "img/store/catalogue/conus_group_oliva 1.jpg",
		hoveredImgPath: "img/store/catalogue/conus_group_oliva 1.jpg",
		group: "round",
		type: "for-desk",
		placing: "inside",
		diameter: 70,
		height: 90,
		shape: "Conus",
		texture: "Olive",
		availability: true,
		price: 55090,
		name: "Conus Olive"
	},
	{
		id: 4,
		href: ".?shape=colonna&texture=gold&width=50&height=30&length=40",
		imgPath: "img/store/catalogue/crater_group_sahara 1.jpg",
		hoveredImgPath: "img/store/catalogue/crater_group_sahara 1.jpg",
		group: "round",
		type: "for-desk",
		placing: "inside",
		diameter: 30,
		height: 20,
		shape: "Crater",
		texture: "Sahara",
		availability: true,
		price: 5090,
		name: "Crater Sahara"
	},
	{
		id: 5,
		href: ".?shape=cube&texture=gold&width=30&height=30&length=30",
		imgPath: "img/store/catalogue/cube_group_santorini 1.jpg",
		hoveredImgPath: "img/store/catalogue/cube_group_santorini 1.jpg",
		group: "rectangular",
		type: "for-desk",
		placing: "inside",
		height: 30,
		width: 30,
		length: 30,
		shape: "CUBE",
		texture: "Santorini",
		availability: true,
		price: 55090,
		name: "CUBE Santorini"
	},
	{
		id: 6,
		href: ".?shape=cube&texture=gold&width=30&height=30&length=30",
		imgPath: "img/store/catalogue/cylinder_group_shale 1.jpg",
		hoveredImgPath: "img/store/catalogue/cylinder_group_shale 1.jpg",
		group: "rectangular",
		type: "for-desk",
		placing: "inside",
		height: 30,
		width: 30,
		length: 30,
		shape: "CUBE",
		texture: "COBALT BLUE",
		availability: true,
		price: 5070,
		name: "CUBE COBALT BLUE"
	},
	{
		id: 7,
		href: ".?shape=cube&texture=gold&width=30&height=30&length=30",
		imgPath: "img/store/catalogue/cylinder_xl_group_terra 1.jpg",
		hoveredImgPath: "img/store/catalogue/cylinder_xl_group_terra 1.jpg",
		group: "rectangular",
		type: "for-desk",
		placing: "inside",
		height: 30,
		width: 30,
		length: 30,
		shape: "CUBE",
		texture: "COBALT BLUE",
		availability: true,
		price: 5070,
		name: "CUBE COBALT BLUE"
	},
	{
		id: 8,
		href: ".?shape=cube&texture=gold&width=30&height=30&length=30",
		imgPath: "img/store/catalogue/devider_group_sahara 1.jpg",
		hoveredImgPath: "img/store/catalogue/devider_group_sahara 1.jpg",
		group: "rectangular",
		type: "for-desk",
		placing: "inside",
		height: 30,
		width: 30,
		length: 30,
		shape: "CUBE",
		texture: "COBALT BLUE",
		availability: true,
		price: 5070,
		name: "CUBE COBALT BLUE"
	},
	{
		id: 9,
		href: ".?shape=cube&texture=gold&width=30&height=30&length=30",
		imgPath: "img/store/catalogue/duet_group_nero 1.jpg",
		hoveredImgPath: "img/store/catalogue/duet_group_nero 1.jpg",
		group: "rectangular",
		type: "for-desk",
		placing: "inside",
		height: 30,
		width: 30,
		length: 30,
		shape: "CUBE",
		texture: "COBALT BLUE",
		availability: true,
		price: 5070,
		name: "CUBE COBALT BLUE"
	},
	{
		id: 10,
		href: ".?shape=cube&texture=gold&width=30&height=30&length=30",
		imgPath: "img/store/catalogue/duet_group_nero 1.jpg",
		hoveredImgPath: "img/store/catalogue/duet_group_nero 1.jpg",
		group: "rectangular",
		type: "for-desk",
		placing: "inside",
		height: 30,
		width: 30,
		length: 30,
		shape: "CUBE",
		texture: "COBALT BLUE",
		availability: true,
		price: 5070,
		name: "CUBE COBALT BLUE"
	},
	{
		id: 11,
		href: ".?shape=cube&texture=gold&width=30&height=30&length=30",
		imgPath: "img/store/catalogue/duet_group_nero 1.jpg",
		hoveredImgPath: "img/store/catalogue/duet_group_nero 1.jpg",
		group: "rectangular",
		type: "for-desk",
		placing: "inside",
		height: 30,
		width: 30,
		length: 30,
		shape: "CUBE",
		texture: "COBALT BLUE",
		availability: true,
		price: 5070,
		name: "CUBE COBALT BLUE"
	}		
];
export function getDataFaker(filters, productsPerPage, page) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const foundProducts = imitList.filter(data => {
				if (filters.hasOwnProperty("search")) {
					if (!data.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
				}
				if (filters.availability && !data.availability) return false;
				if (filters.shapeGroupRound) {
					if (data.group !== "round" && !filters.shapeGroupRectangular) return false;
					if (filters.hasOwnProperty("roundDiameterFrom")) {
						if (filters.roundDiameterFrom > data.diameter) return false;
					}
					if (filters.hasOwnProperty("roundDiameterTo")) {
						if (filters.roundDiameterTo < data.diameter) return false;
					}
					if (filters.hasOwnProperty("roundHeightFrom")) {
						if (filters.roundHeightFrom > data.height) return false;
					}
					if (filters.hasOwnProperty("roundHeightTo")) {
						if (filters.roundHeightTo < data.height) return false;
					}
				}
				if (filters.shapeGroupRectangular) {
					if (data.group !== "rectangular" && !filters.shapeGroupRound) return false;
					if (filters.hasOwnProperty("rectangularHeightFrom")) {
						if (filters.rectangularHeightFrom > data.height) return false;
					}
					if (filters.hasOwnProperty("rectangularHeightTo")) {
						if (filters.rectangularHeightTo < data.height) return false;
					}
					if (filters.hasOwnProperty("rectangularWidthFrom")) {
						if (filters.rectangularWidthFrom > data.width) return false;
					}
					if (filters.hasOwnProperty("rectangularWidthTo")) {
						if (filters.roundWidthTo < data.width) return false;
					}
					if (filters.hasOwnProperty("rectangularLengthFrom")) {
						if (filters.rectangularLengthFrom > data.length) return false;
					}
					if (filters.hasOwnProperty("rectangularLengthTo")) {
						if (filters.rectangularLengthTo < data.length) return false;
					}
				}
				if (filters.hasOwnProperty("priceFrom")) {
					if (filters.priceFrom > data.price) return false;
				}
				if (filters.hasOwnProperty("priceTo")) {
					if (filters.priceTo < data.price) return false;
				}
				return true;
			});
			const offset = (page - 1) * productsPerPage;
			resolve({
				totalNumber: foundProducts.length,
				onPage: foundProducts.slice(offset, offset + productsPerPage)
			});
		}, 500);
	});
}

export function requestGalleryMediaByFilters(filters) {
	return Promise.resolve([
		{ imgUrl: "img/store/001.jpg", href: "." },
		{ imgUrl: "img/store/002.jpg", href: "." }
	]);
}