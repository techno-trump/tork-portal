import { throttle } from "./throttle.js";

export function initRootFontSizeScaling(designWidth, designHeight, threshold = 0) {
	const htmlElem = document.querySelector("html");
	const computedStyle = window.getComputedStyle(htmlElem);
	const rootFontSize = parseInt(computedStyle.fontSize, 10);
	const handleResize = throttle(() => {
		const windowWidth = document.documentElement.clientWidth; // window.outerWidth;
		const windowHeight =document.documentElement.clientHeight;
		const widthScale = windowWidth / designWidth;
		const heightScale = windowHeight / designHeight;
		const heightRatio = heightScale / widthScale;
		htmlElem.style.setProperty("--height-ratio", Math.min(Math.max(heightRatio, 0.75), 1));
		if (windowWidth <= threshold) {
			htmlElem.style.fontSize = `${rootFontSize}px`;
			htmlElem.style.setProperty("--scale", 1);
			return;
		}
		const scale = Math.min(Math.max(0.8 * widthScale, heightScale), widthScale);
		const scaledFontSize = rootFontSize * scale;
		htmlElem.style.fontSize = `${scaledFontSize < 12 ? 12 : scaledFontSize}px`;
		htmlElem.style.setProperty("--scale", scale);
	}, 50);
	window.addEventListener("resize", handleResize);
	handleResize();
}