
import * as yup from "yup";
import { getTargetElem } from "./utils.js";

export const METHOD_REQUIRED = "required";
export const METHOD_EMAIL = "email";
export const METHOD_MATCHES = "matches";
export const METHOD_CHECKED = "checked";
export const METHOD_CALLBACK = "callback";
export const METHOD_TEST = "test";


function getInputValue(elem) {
	switch(elem.tagName) {
		case "INPUT":
			switch(elem.getAttribute("type")) {
				case "checkbox":
					return elem.checked;
				case "radio":
					break;
				default:
					return elem.value;
			}
			break;
		case "TEXTAREA":
			return elem.value;
		case "SELECT":
			return elem.value;
	} 
}
class FieldSchema {
	constructor() {
		this.methodsMap = {};
		this.methodsList = [];
		this._reset();
	}
	_memoizeMethod(alias, method, params) {
		const methodCtx = { alias, method, params };
		this.methodsList.push(methodCtx);
		methodCtx.order = this.methodsList.length - 1;
		this.methodsMap[alias] = methodCtx;
	}
	_reset() {
		this.schema = yup.string();
	}
	_push(alias, method, params) {
		switch(method) {
			case METHOD_REQUIRED:
			case METHOD_EMAIL:
				this.schema = this.schema[method](alias);
				break;
			case METHOD_TEST:
				this.schema = this.schema.test(alias, alias, params.test);
				break;
			case METHOD_MATCHES:
				this.schema = this.schema.matches(params.pattern, alias);
				break;
		}
	}
	addMethod(alias, method, params) {
		if (alias in this.methodsMap) throw new Error(`There is already created method with given alias: ${alias}`);
		this._memoizeMethod(alias, method, params);
		this._push(alias, method, params);
	}
	async validate(value, options) {
		return this.schema.validate(value, options);
	}
	replaceMethod(alias, newMethod, newParams) {

	}
	updateMethod(alias, newParams) {
		this.methodsMap[alias].params = newParams;
		this._reset();
		this.methodsList.forEach(({ alias, method, params }) => {
			this._push(alias, method, params);
		});
	}
}
function getFieldMainInputElem(fieldElem) {
	return fieldElem.querySelector(".field__input");
}
function getFieldErrorElems(fieldElem) {
	return fieldElem.querySelectorAll(".field__error");
}
function buildSchemaFromErrorElems(errorElems) {
	const schema = new FieldSchema();
	const errorElemsMap = {};
	errorElems.forEach(elem => {
		const alias = elem.getAttribute("data-alias");
		const method = elem.getAttribute("data-method") || alias;
		errorElemsMap[alias] = elem;
		switch(method) {
			case METHOD_CALLBACK:
				schema.addMethod(alias, "test", { test: (value) => true });
				return;
			case METHOD_REQUIRED:
			case METHOD_EMAIL:
				schema.addMethod(alias, method);
				break;
			case METHOD_CHECKED:
				schema.addMethod(alias, "test", { test: (value) => value == "true" });
				break;
			case METHOD_MATCHES:
				const pattern = elem.getAttribute("data-pattern");
				schema.addMethod(alias, method, { pattern });
				break;
		}
	});
	return [schema, errorElemsMap];
}
async function _handleInputChange(event) {

	try {
		const value = getInputValue(this.mainInputElem);
			console.log("Input value: ", event.type, value);
		await this.schema.validate(value);
		if (this.hasErrors) this.clearErrors();
	} catch (ex) {
		// Struct 
		// (2) ['value', 's']
		// (2) ['path', '']
		// (2) ['type', 'email']
		// (2) ['errors', ['email']]
		// (2) ['params', {…}]
		// (2) ['inner', Array(0)]
		// (2) ['name', 'ValidationError']
		// (2) ['message', 'email']
			//console.log(ex.errors);
		if (event.type === "input" && !this.hasErrors) return;
		if (!ex.errors) throw ex;
		this.setErrors(ex.errors);
	}
}
export class FieldValidator {
	constructor(form, target, options) {
		this.form = form;
		this.rootElem = getTargetElem(target);
		this.mainInputElem = getFieldMainInputElem(this.rootElem);
		this.state = {};
		this.errorElems = getFieldErrorElems(this.rootElem);
		const [schema, errorElemsMap] = buildSchemaFromErrorElems(this.errorElems);
		this.schema = schema;
		this.errorElemsMap = errorElemsMap;
		this.resetListeners();
	}
	resetListeners() {
		if (this._handleInputChange) {
			this.mainInputElem.removeEventListener("input", this._handleInputChange);
			this.mainInputElem.removeEventListener("change", this._handleInputChange);
			this.mainInputElem.removeEventListener("blur", this._handleInputChange);
		} else {
			this._handleInputChange = _handleInputChange.bind(this);
		}
		this.mainInputElem.addEventListener("input", this._handleInputChange);
		this.mainInputElem.addEventListener("change", this._handleInputChange);
		this.mainInputElem.addEventListener("blur", this._handleInputChange);
	}
	get hasErrors() {
		return Boolean(this.state.errors?.length);
	}
	get name() {
		return this.mainInputElem.getAttribute("name");
	}
	async validate(options) {
		try {
			let result;
			if (!this.rootElem.closest(".hidden")) {
				result = await this.schema.validate(getInputValue(this.mainInputElem));
			}
			if (this.hasErrors) this.clearErrors();
			return result;
		} catch (ex) {
				if (!ex.errors) console.log(ex.errors);
			this.setErrors(ex.errors);
				//console.log("Throw new error");
			if (typeof options !== "object" || !(silentMode in options)) {
				throw new Error({ errors: ex.errors });
			}
		}
	}
	focus() {
		this.mainInputElem.focus();
	}
	clearError(alias) {
		this.errorElemsMap[alias].classList.remove("active");
		this.state.errors.splice(this.state.errors.indexOf(alias), 1);
	}
	clearErrors() {
		this.state.errors?.forEach(alias => {
			this.errorElemsMap[alias].classList.remove("active");
		});
		this.state.errors = [];
		this.rootElem.classList.remove("error");
	}
	setErrors(errors) {
		if (this.hasErrors) this.clearErrors();
		this.state.errors = errors;
		errors.forEach(alias => {
			this.errorElemsMap[alias].classList.add("active");
		});
		this.rootElem.classList.add("error");
	}
	addValidator(alias, method, params) {
		this.schema.addMethod(alias, method, params);
	}
	updateValidator(alias, params) {
		this.schema.updateMethod(alias, params);
	}
}
function getFormFields(formElem) {
	return formElem.querySelectorAll(".field");
}
function collectFormData(formElem) {
	const formData = new FormData(formElem);
	const result = {};
	for (const [name, value] of formData.entries()) {
		result[name] = value;
	}
	return result;
}
export const attachFormValidator = (target, options) => {
	const kitchen = {};
	const fieldsMemo = {};
	const fieldsList = [];
	const errors = [];
	const subscribers = {
		submit: [],
		errors: [],
	};
	const params = {
		preventDefaultSubmit: true,
		maxErrors: 1,
	};
	const formElem = getTargetElem(target);
	const fieldElems = getFormFields(formElem);

	fieldElems.forEach(target => {
		const field = new FieldValidator(formElem, target);
		fieldsMemo[field.name] = field;
	});
	formElem.addEventListener("keydown", (event) => {
		if (event.keyCode === 13) event.preventDefault();
		return false;
	})
	formElem.addEventListener("submit", async (event) => {
		await kitchen.validate(false);

		if (errors.length) {
			formElem.classList.add("error");
			event.preventDefault();
			subscribers.errors.forEach(getCallbackWrapper({ type: "errors", errors, kitchen }));
		} else {
			formElem.classList.remove("error");
			if (params.preventDefaultSubmit) event.preventDefault();	
			subscribers.submit.forEach(getCallbackWrapper({ type: "submit", formData: collectFormData(formElem), kitchen }));
		}
	});

	// возможность добавления виртуального поля
	// addVirualField(virtualFieldInstance);
	kitchen.getField = getField;
	kitchen.clearErrors = () => {
		Object.entries(fieldsMemo).forEach(async ([name, field]) => {
			field.clearErrors();
		});
	}
	kitchen.reset = () => {
		formElem.reset();
		kitchen.clearErrors();
	}
	kitchen.validate = async (stepOnly) => {
		errors.length = 0;

		await Promise.all(getFieldsSet().map(async ([name, field]) => {
			try {
				return await field.validate();
			} catch (ex) {
				errors.push({ field, name, errors: ex.errors });
			}
		}));
		return errors;

		function getFieldsSet() {
			const allFields = Object.entries(fieldsMemo);
			if (stepOnly) {
				const docElem = document.documentElement;
				return allFields.filter(([name, field]) => {
					return field.mainInputElem.closest(`[data-step="${docElem.getAttribute("data-current-step")}"], :not(.hidden)`);
				});
			} else {
				return allFields;
			}
		}
	}
	kitchen.on = (type, callback) => {
		if (type in subscribers) {
			subscribers[type].push(callback);
		}
		return kitchen;
	}
	return kitchen;

	function getField(name) {
		if (!(name in fieldsMemo)) throw new Error(`Form ${formElem.name} has no field with given name ${name}`);
		return fieldsMemo[name];
	}
	function getCallbackWrapper(event) {
		return (callback) => {
			try {
				callback(event);
			} catch (ex) {
			}
		}
	}
}