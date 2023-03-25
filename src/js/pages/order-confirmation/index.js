import "./sliders.js";
import { attachFormValidator } from "../../libs/formValidator.js";
import IMask from "imask";
import { NativeSelectWrap, NativeInputWrap, CountrySelectOptionContent, InputBodyContent } from "../../libs/mySelect.js";

window.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
	const formValidator = initOrderConfirmation();
	initLanguageSelect(formValidator);
	initPhoneNumberInput(formValidator);
	initCountrySelect();
	initCitySelect();
	initOrganizationFieldsCtrl(formValidator);
	initOrderChangeBtns();
	const quizControl = initQuizMode(formValidator);
	initAutoCollectSummary(quizControl);
}
function initCountrySelect(formValidator) {
	const countrySelect = new NativeSelectWrap("#country-select", {
			stripData: elem => {
				return {
					value: elem.getAttribute("value"),
					id: elem.getAttribute("id"),
					caption: elem.textContent,
					selected: typeof elem.getAttribute("selected") === "string",
					flagImgSrc: elem.getAttribute("data-flag-img-src"),
				};
			},
			addClasses: {
				root: "country-select",
				body: "country-select__body",
				list: "country-select__list",
			},
			components: {
				OptionContent: CountrySelectOptionContent,
			}
		});
}
function initCitySelect(formValidator) {
	const citySelect = new NativeInputWrap("#city-select", {
			components: {
				BodyContent: InputBodyContent,
			}
		});

	// Здесь прописую логику получения городов реагируя на изменения выбранной страны, могу слушать ивенды  нативного селекта
	// В API получаю список городов и отдаю в обвертку
	const countrySelectElem = document.querySelector("#country-select");
	const setAvailableCities = () => {
		const selectedCountryName = countrySelectElem.value;
			console.log("selectedCountryName: ", selectedCountryName);
		const list = selectedCountryName === "rs" ? [
				{ value: "Красноград", caption: "Красноград" },
				{ value: "Ворохта", caption: "Ворохта" },
				{ value: "Кривой Рог", caption: "Кривой Рог" },
				{ value: "Москва", caption: "Москва" },
				{ value: "Красноград", caption: "Красноград" },
				{ value: "Ворохта", caption: "Ворохта" },
				{ value: "Кривой Рог", caption: "Кривой Рог" },
				{ value: "Москва", caption: "Москва" },
			] : [
				{ value: "Красноград 1", caption: "Красноград 1" },
				{ value: "Ворохта 2", caption: "Ворохта 2" },
				{ value: "Кривой Рог 3", caption: "Кривой Рог 3" },
				{ value: "Москва 4", caption: "Москва 4" },
				{ value: "Красноград 1", caption: "Красноград 1" },
				{ value: "Ворохта 2", caption: "Ворохта 2" },
				{ value: "Кривой Рог 3", caption: "Кривой Рог 3" },
				{ value: "Москва 4", caption: "Москва 4" },
			];
		Promise.resolve(list)
		.then(data => {
			citySelect.setOptions(data);
		});
	}
	countrySelectElem.addEventListener("change", () => {
			console.log("Selected country has been changed.");
		// Facked data loading
		setAvailableCities();
	});
	setAvailableCities();
}
function initLanguageSelect(formValidator) {
	const languageSelect = new NativeSelectWrap("#language-select", {
	});
}
function initPhoneNumberInput(formValidator) {
	const localizedCountries = { "ae": "ОАЕ", "rs": "Сербия", "it": "Италия" };
	const phoneInputElem = document.querySelector("#phone-input");
	const telField = formValidator.getField("phone");
	let telMaskRef = {};
	const countryData = window.intlTelInputGlobals.getCountryData();
	countryData.forEach(country => country.name = country.name.replace(/.+\((.+)\)/,"$1"));

	const iti = intlTelInput(phoneInputElem, {
		localizedCountries,
		descDropdownOnly: true,
		customContainer: "field__input-wrap",
		autoHideDialCode: true,
		autoPlaceholder: "aggressive",
		customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) { // Можно использовать для установки формата для автоформаттера
			const countryCodeLength = selectedCountryData.dialCode.toString().length + 1;
			let restOfNumber = selectedCountryPlaceholder.substring(countryCodeLength);
			const maskOptions = { mask: `+{${selectedCountryData.dialCode}}${restOfNumber.replace(/\d/g, "0")}`, lazy: false };
			if (telMaskRef.current) {
				telMaskRef.current.updateOptions(maskOptions);
			} else {
				telMaskRef.current = IMask(phoneInputElem, maskOptions);
				telMaskRef.current.on("complete", () => {
					telField.validate({ silentMode: true });
				});
			}
			setTimeout(() => telMaskRef.current.alignCursor(), 0);
			return selectedCountryPlaceholder;
		},
		nationalMode: false,
		onlyCountries: ["ae", "rs", "it"],
		utilsScript: "./js/libs/itiUtils.js"
	});

	telField.updateValidator("required", { test: () => {
		if (!telMaskRef.current) return true;
		return String(telMaskRef.current.masked.rawInputValue).length > 0;
	}});
	telField.updateValidator("valid", { test: (value) => {
		if (!telMaskRef.current) return true;
		return telMaskRef.current.masked.isComplete;
	}});
}
function initOrderConfirmation() {
	const formElem = document.forms["order-confirmation"];
	const formValidator = attachFormValidator(formElem)
		.on("submit", (formData) => {
			Promise.resolve()
			.then(() => {
				console.log(formData);
				drawers.open("order-confirm");
			});
		})
		.on("errors", ({ errors }) => {
				console.log(errors);
			errors[0].field.focus();
		});
	return formValidator;
}
function initOrganizationFieldsCtrl(formValidator) {
	const formElem = document.forms["order-confirmation"];
	const organizationInfoRootElem = document.querySelector("#organization-info");

	formElem.addEventListener("change", ({ target }) => {
		formValidator.clearErrors();
		if (target.getAttribute("name") === "organization-type") {
			resetVisibility();
		}
	});
	resetVisibility();

	function resetVisibility() {
		if (formElem["organization-type"].value === "corporate") {
			organizationInfoRootElem.classList.remove("hidden");
		} else {
			organizationInfoRootElem.classList.add("hidden");
		}
	}
}
function initOrderChangeBtns() {
	const btnElems = document.querySelectorAll("button[data-order-change-btn]");
	const handler = (event) => {
		Promise.resolve()
			.then(() => {
				location.assign("./cart.html");
			});
	};
	btnElems.forEach(elem => elem.addEventListener("click", handler));
}
function initAutoCollectSummary(quizControl) {
	const docElem = document.documentElement;
	const formElem = document.forms["order-confirmation"];
	const summaryRootElem = document.querySelector(".order-confirmation-summary__customer-input-summary");
	const customerTypeSummElem = summaryRootElem.querySelector("#customer-input-summary--type");
	const customerInfoSummElem = summaryRootElem.querySelector("#customer-input-summary--info");
	const shippingAddressSummElem = summaryRootElem.querySelector("#customer-input-summary--shipping-address");
	const spaymentMethodSummElem = summaryRootElem.querySelector("#customer-input-summary--payment-method");

	const resetSummary = () => {
		const checkedTypeInput = Array.from(formElem["organization-type"]).find(elem => elem.checked);
		customerTypeSummElem.innerHTML = checkedTypeInput.parentElement.nextElementSibling.textContent;
		customerInfoSummElem.innerHTML = `<p>${formElem["name"].value}</p>
			<p>${formElem["email"].value}</p>`;
		shippingAddressSummElem.innerHTML = `${formElem["full-name"].value}, ${formElem["street"].value}
			${formElem["building"].value}, ${formElem["post-code"].value}`;
		const checkedPaymentMethodInput = Array.from(formElem["payment-method"]).find(elem => elem.checked);
		spaymentMethodSummElem.innerHTML = checkedPaymentMethodInput.parentElement.nextElementSibling.textContent;
	};

	docElem.addEventListener("change", resetSummary);
	quizControl.on("stepChange", () => {
		resetSummary();
	});
}
function initQuizMode(formValidator) {
	const subscribers = {
		stepChange: [],
	};
	let currentStep = 1;
	const map = {};
	const docElem = document.documentElement;
	const stepElems = document.querySelectorAll("[data-step]");
	stepElems.forEach(elem => {
		const stepNumbers = elem.getAttribute("data-step").split(",");
		stepNumbers.forEach(stepNumberStr => {
			const stepNumber = stepNumberStr.trim();
			if (stepNumber in map) {
				map[stepNumber].push(elem);
			} else {
				map[stepNumber] = [elem];
			}
		})
	});
	const nextStepBtnElems = document.querySelectorAll("[data-next-step-btn]");
	const prevStepBtnElems = document.querySelectorAll("[data-prev-step-btn]");
	const toStartBtnElems = document.querySelectorAll("[data-to-start-btn]");
	const indicatorElem = document.querySelector("#quiz-current-step");
	const mediaMatch = matchMedia("(max-width: 768px)");
	const handleMatch = ({ matches }) => {
		if (matches) {
			docElem.classList.add("quiz-mode");
			activateElements(setStep(1));
		} else {
			docElem.classList.remove("quiz-mode");
			deactivateElements(currentStep);
		}
	}
	mediaMatch.addListener(handleMatch);
	handleMatch(mediaMatch);

	const handlePrevStep = (event) => {
		event.preventDefault();
		event.currentTarget.disabled = true;
		deactivateElements(currentStep);
		if ((currentStep - 1).toString() in map) activateElements(setStep(currentStep - 1));
	}
	const handleNextStep = async (event) => {
		event.preventDefault();
		event.currentTarget.disabled = true;
		const errors = await formValidator.validate(true);
		if (!errors.length) {
			deactivateElements(currentStep);
			if ((currentStep + 1).toString() in map) activateElements(setStep(currentStep + 1));
		} else {
			errors[0].field.focus();
			event.currentTarget.disabled = false;
		}
	}
	const handleToStart = (event) => {
		event.preventDefault();
		event.currentTarget.disabled = true;
		deactivateElements(currentStep);
		activateElements(setStep(1));
	}
	nextStepBtnElems.forEach(elem => elem.addEventListener("click", handleNextStep));
	prevStepBtnElems.forEach(elem => elem.addEventListener("click", handlePrevStep));
	toStartBtnElems.forEach(elem => elem.addEventListener("click", handleToStart));

	return {
		on: (event, callback) => {
			switch(event) {
				case "stepChange":
					subscribers.stepChange.push(callback);
					break;
			}
		}
	};
	
	function setStep(step) {
		currentStep = step;
		docElem.setAttribute("data-current-step", currentStep);
		indicatorElem.textContent = currentStep;
		try {
			subscribers.stepChange.forEach(callback => callback(currentStep));
		} catch (ex) {
		}
		return currentStep;
	}
	function activateElements(step) {
		map[step].forEach(elem => {
			elem.classList.add("quiz-active-elem");
			if (elem.hasAttribute("data-next-step-btn") || elem.hasAttribute("data-prev-step-btn")) {
				elem.disabled = false;
			}
		});
	}
	function deactivateElements(step) {
		map[step].forEach(elem => elem.classList.remove("quiz-active-elem"));
	}
}
