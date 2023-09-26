import { log, debug } from "./logger.js";
export default function() {
		log("[Init] On hover animation finalization");
	const targetElems = document.querySelectorAll("[data-finalize-animation]");

	targetElems.forEach(elem => {
		elem.addEventListener("pointerenter", ({ currentTarget }) => {
				log("On hover animation finalization::pointerenter:target: ", currentTarget);
			currentTarget.classList.add("animation-finalization");
			currentTarget.setAttribute("data-anim-cycle-parity", false);
		});

		elem.addEventListener("animationiteration", iterationHandler);
		elem.addEventListener("webkitAnimationIteration", iterationHandler);
		
		function iterationHandler({ currentTarget, type }) {
			const parity = currentTarget.getAttribute("data-anim-cycle-parity"); // Парность выполенного цикла
			if (currentTarget.closest(":hover") !== currentTarget) {
				const mode = currentTarget.getAttribute("data-finalize-animation");
				if (mode !== "parity" || parity === "true") {
					currentTarget.classList.remove("animation-finalization");
				}
			};
			currentTarget.setAttribute("data-anim-cycle-parity", parity === "false"); // Флаг для следующей итерации
		}
	});
}