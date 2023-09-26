import { h, render, Fragment, createRef, createContext } from "preact";
import { effect, signal } from "@preact/signals";
import { memo, useEffect, useCallback, useRef, useState, useMemo, useContext, useReducer } from "preact/compat";
import { html } from "htm/preact";

import { getTargetElem, createElem, isEmpty, normalizeString } from "./utils.js";

const log = (...args) => {
	return console.log(...args);
}

const rootClass = "select";
const wrapRootClass = "select-wrap";
const Context = createContext({});

const Body = ({ focus, children }) => {
	const { toggle, setFocus, addClasses, state: { withNativeInput } } = useContext(Context);
	const classes = [`${rootClass}__body`];
		log("withNativeInput: ", withNativeInput);
	const clickHandler = (event) => {
		if (withNativeInput) {
			setFocus(true);
		} else {
			toggle(event.target);
		}
	}
	if (addClasses && addClasses.body) {
		classes.push(addClasses.body);
	}
	return html`<div class=${classes.join(" ")} onclick=${clickHandler}>${children}</div>`;
}
const SelectedOption = ({ data, children }) => {
	const classes = [`${rootClass}__selected-option`];
	return html`<div class=${classes.join(" ")}>${children}</div>`;
}
const Placeholder = ({ placeholder }) => {
	const classes = [`${rootClass}__placeholder`];
	return html`<div class=${classes.join(" ")}>${placeholder}</div>`;
}
const List = ({ focus, children }) => {
	const { addClasses } = useContext(Context);
	const classes = [`${rootClass}__list`];
	if (addClasses && addClasses.list) {
		classes.push(addClasses.list);
	}
	return html`<ul class=${classes.join(" ")} aria-hidden="${String(!focus)}">${children}</ul>`;
}
const Option = ({ data, selected, children }) => {
	const { value } = data;
	const { optionClickHandler } = useContext(Context);
	const classes = useMemo(() => {
		const list = [`${rootClass}__option`];
		if (selected) list.push(`${rootClass}__option_selected`);
		return list;
	}, [selected]);

	const clickHandler = (event) => {
		optionClickHandler({ event, data });
	}

	return html`<li class=${classes.join(" ")} onclick=${clickHandler}>
								${children}
							</li>`;
}
const OptionContent = ({ data }) => {
	const { state: { filterOptionsByUserInput, userInput } } = useContext(Context);
	const { caption } = data;

	const formatCaption = () => {
		const trimedCaption = caption.trim();
		const normalizedInput = normalizeString(userInput);
		const normalizedCaption = normalizeString(caption);
		if (isEmpty(userInput)) return caption;
		if (normalizedInput === normalizedCaption) return html`<mark>${caption}</mark>`;
		const result = [];
		let foundIdx, edgeIdx = 0;
		while ((foundIdx = normalizedCaption.indexOf(normalizedInput, edgeIdx)) > -1) {
			if (foundIdx > edgeIdx) {
				result.push(html`${trimedCaption.slice(edgeIdx, foundIdx)}`);
			}
			edgeIdx = foundIdx + normalizedInput.length;
			result.push(html`<mark>${trimedCaption.slice(foundIdx, edgeIdx)}</mark>`);
		}
		if (edgeIdx < normalizedCaption.length) {
			result.push(html`${trimedCaption.slice(edgeIdx)}`);
		}
		return result;
	}

	return html`<${Fragment}>${filterOptionsByUserInput ? formatCaption() : caption}</${Fragment}>`;
}
const SelectBodyContent = ({ OptionContent }) => {
	const { state: { selected }, placeholder } = useContext(Context);
	const renderSelectedOption = () => {
		return html`<${SelectedOption} data=${selected[0]}><${OptionContent} data=${selected[0]}/></${SelectedOption}>`;
	}
	return html`${selected?.length > 0 ? renderSelectedOption() : html`<${Placeholder} placeholder=${placeholder} />`}`;
}
export const InputBodyContent = ({ }) => {
	const wrapRef = useRef(null);
	const { nativeInput, setUserInput, setFocus } = useContext(Context);
	// const inputHandler = (event) => {
	// 	setUserInput(event.target.value);
	// }

	useEffect(() => {
		const inputHandler = (event) => {
				log("InputBodyContent :  onInput", event);
			setUserInput(event.target.value);
		}
		const focusHandler = (event) => {
			setFocus(true, false, nativeInput);
		}
		if (!wrapRef.current) return;
		nativeInput.addEventListener("input", inputHandler);
		nativeInput.addEventListener("change", inputHandler);
		nativeInput.addEventListener("focus", focusHandler);
		wrapRef.current.appendChild(nativeInput);
		return () => {
			nativeInput.removeEventListener("input", inputHandler);
			nativeInput.removeEventListener("change", inputHandler);
			nativeInput.removeEventListener("focus", focusHandler);
		}
	}, []);

	return html`<div class="${rootClass}__native-input-wrap" ref=${wrapRef}></div>`;
		//return html`<input type="text" ref=${inputRef} placeholder=${placeholder} value=${userInput} oninput=${inputHandler}/>`;
}

export const CountrySelectOptionContent = ({ data }) => {
	const { flagImgSrc, caption } = data;
	return html`<${Fragment}><img src=${flagImgSrc} alt=${flagImgSrc} class="country-select__flag-img" />${caption}</${Fragment}>`;
}

const initialState = {
	silentMode: false,
	userInput: "",
	focus: false,
	options: [],
	selected: [],
	selectedSet: new Set(),
};
const selectReducer = (state, { type, payload }) => {
	switch(type) {
		case "focus":
			return { ...state, focus: payload };
		case "toggle":
			return { ...state, focus: !state.focus };
		case "setAsSelected":
			return setAsSelected();
		case "removeFromSelected":
			return removeFromSelected();
		case "setOptions":
				log("setOptions");
			return { ...state, options: payload.data };
		case "setUserInput":
			return {
				...state,
				silentMode: payload.silentMode,
				userInput: payload.value,
			};
		case "resetSelected":
				log("resetSelected");
			return {
				...state,
				silentMode: payload.silentMode,
				selected: [],
				selectedSet: new Set(),
			};
		case "copySelectedToUserInput":
			return {
				...state,
				silentMode: payload.silentMode,
				userInput: state.selected.map(dataItem => dataItem.caption).join(" "),
			};
	}
	function setAsSelected() {
		const { silentMode } = payload;
		const data = payload.data instanceof Array ? payload.data : [payload.data];
		const { selected, selectedSet } = state;
		const newState = { ...state, silentMode: Boolean(silentMode) };
		const itemsToAdd = data.filter(dataItem => !selectedSet.has(dataItem));

		if (itemsToAdd.length) {
			newState.selected = [...selected, ...itemsToAdd];
			newState.selectedSet = new Set(newState.selected);
		}
		return newState;
	}
	function removeFromSelected() {
		const { silentMode } = payload;
		const newState = { ...state, silentMode: Boolean(silentMode) };
		const data = payload.data instanceof Array ? payload.data : [payload.data];
		const { selected, selectedSet } = state;
		const itemsToRemoveSet = new Set(data.filter(dataItem => selectedSet.has(dataItem)));
		if (itemsToRemoveSet.size > 0) {
			newState.selected = selected.filter(dataItem => !itemsToRemoveSet.has(dataItem));
			newState.selectedSet = new Set(newState.selected);
		}
		return newState;
	}
}
// const combineReducers = (...args) => {
// 	return (state, action) => {
// 		let newState;
// 		args.find(reducer => (newState = reducer(state, action)));
// 		return newState || state;
// 	}
// }
const Select = ({ nativeInput, ctxRef, initComplete, initialOptions, multiselect,
									placeholder, components, className, addClasses, setSelectedAsUserInput,
									filterOptionsByUserInput
								}) => {
		log("nativeInput (initial): ", nativeInput);
	const withNativeInput = nativeInput.tagName === "INPUT";
	const initStateRef = useRef(true);
	const listContainerRef = useRef(null);
	const rootContainerRef = useRef(null);
	const inputRef = useRef(null);
	
	const [state, dispatch] = useReducer(selectReducer, initialState, (state) => {
			return { ...state, setSelectedAsUserInput, filterOptionsByUserInput, withNativeInput };
		});
		log("State: ", state);
	const { options, userInput, focus, selected, selectedSet, silentMode } = state;
	const filteredOptions = useMemo(() => {
		if (!filterOptionsByUserInput) return options;
		return options.filter(dataItem => normalizeString(dataItem.caption).includes(normalizeString(userInput)));
	}, [options, userInput, filterOptionsByUserInput]);

	const { Body, SelectedOption, List, Option, OptionContent, BodyContent } = components;

	const toggle = useCallback(() => dispatch({ type: "toggle" }), [dispatch]);
	const setFocus = useCallback((value) => {
		dispatch({ type: "focus", payload: value });
		if (value && withNativeInput) nativeInput.focus();
	}, [dispatch]);
	const leave = (initiator) => {
			log("leave initiator: ", initiator);
		setFocus(false);
	}
	const setSelected = (data, silentMode) => dispatch({ type: "setAsSelected", payload: { data, silentMode } });
	const resetSelected = (silentMode) => dispatch({ type: "resetSelected", payload: { silentMode } });
	const removeFromSelected = (data, silentMode) => dispatch({ type: "removeFromSelected", payload: { data, silentMode } });
	const copySelectedToUserInput = (data, silentMode) => dispatch({ type: "copySelectedToUserInput", payload: { data, silentMode } });
	const setOptions = (data) => {
		dispatch({ type: "setOptions", payload: { data } });
	};
	const setUserInput = (value, silentMode) => {
			log("Set user Input: ", value, silentMode);
		dispatch({ type: "setUserInput", payload: { value, silentMode } });
	};

	// Изменение набора опций может вести за собой изменения ввода пользователем, если в новом списке нет такой опции


	// Пересчитываем выбранное

	// Инициализация изначального списка опций, если таковой был передан
	useEffect(() => {
		if (!initialOptions) return;
		setOptions(initialOptions);
		const selected = initialOptions.filter(({ selected }) => selected);
			log("selected: ", initialOptions.filter(data => selected.indexOf(data) > -1));
		setSelected(selected, true);
	}, [initialOptions]);

	// Имитируем ивенты, что бы можно было привязаться снаружи к нативному инпуту
	// Здесь реагируем на изменение выбора из списка
	useEffect(() => {
			log("Отображаем значения в нативном поле: ", nativeInput, silentMode, initStateRef.current);
		if (!nativeInput) return;
		if (nativeInput.tagName === "SELECT") { // Иницализирован с селекта
				log("Имитация выбора опции для селекта", multiselect, selected, selectedSet);
			if (!multiselect) { // Без множественного выбора
				if (selectedSet.size > 0) { // есть выбранные опции
					// Ищем индекс выбранной опции в нативном селекте
					const selectedItemIdx = Array.from(nativeInput.options).findIndex(elem => {
						const id = elem.getAttribute("id");
						if (!isEmpty(id)) return selected[0].id === id;
						const value = elem.getAttribute("value");
						const caption = elem.textContent;
						return selected[0].value === value || selected[0].caption === caption;
					});
					// Устанавливаем опцию в нативном селекте как выбранную
						log("selectedIndex: ", selectedItemIdx, selected[0]);
					nativeInput.options.selectedIndex = selectedItemIdx;
				} else {
					// Сбрасываем выбор нативного селекта
					nativeInput.options.selectedIndex = -1;
				}
			}
		} else { // Инициализирован с обычного input
			nativeInput.value = selectedSet.size > 0 && selected[0].value || "";
		}
		if (silentMode || initStateRef.current) return;
			log("Имитируем ивент, что бы можно было привязаться снаружи к нативному инпуту");
		const changeEvent = new Event("change", { bubbles: true });
		changeEvent.__synteticEvent = true;
		nativeInput.dispatchEvent(changeEvent);
	}, [selectedSet]);

	const optionClickHandler = useCallback(({ event, data }) => {
		if (multiselect) {
			//
		} else {
			resetSelected(true, event.target);
			setSelected(data, false, event.target);
			copySelectedToUserInput(); // Если используется нативный инпут, скопировать выбранные опции в инпут
			leave();
		}
	}, [selectedSet]);

	// Собираем контекст
	const ctx = useMemo(() => {
		return { setSelected, setFocus, leave, toggle, optionClickHandler, placeholder, setOptions, resetSelected, setUserInput, addClasses, state, nativeInput };
	}, [optionClickHandler, placeholder, setOptions, resetSelected, setUserInput, addClasses, state]);
	// Отдаем контекст наверх
	ctxRef.current = ctx;

	// Обрабатываем нажатия клавиатуры внутри основного блока
	useEffect(() => {
		if (rootContainerRef.current) {
			rootContainerRef.current.addEventListener("keydown", (event) => {
				if (event.keyCode == 13) {
					toggle();
				} else if (event.keyCode == 27 || event.keyCode == 9) {
					leave();
				}
			});
		}
	}, [rootContainerRef]);

	// Отслеживаем blur нативного инпута
	useEffect(() => {
		if (!withNativeInput) return;
		const blurHandler = (event) => {
			if (!userInput) {
				resetSelected(nativeInput);
			}
		}
		nativeInput.addEventListener("blur", blurHandler);
		return () => nativeInput.removeEventListener("blur", blurHandler);
	}, [withNativeInput, userInput]);

	// Отслеживаем клик за границами поля
	useEffect(() => {
		if (initStateRef.current) return; // 
		const docClickHandler = (event) => {
			const composedPath = event.composedPath();
			const isOutsideClick = !composedPath.find(elem => elem === listContainerRef.current || elem === rootContainerRef.current);
			if (isOutsideClick) {
				leave(event.target);
			}
		};
		const removeDocClickListener = () => {
			document.removeEventListener("click", docClickHandler);
		};
		if (focus) {
			document.addEventListener("click", docClickHandler);
		} else {
			if (!withNativeInput) nativeInput.dispatchEvent(new Event("blur", { bubbles: true }));
		}
		return removeDocClickListener;
	}, [focus]);

	useEffect(() => {
		const optionByInput = state.selected.find(dataItem => normalizeString(dataItem.caption) === normalizeString(userInput));
		if (optionByInput) {
			nativeInput.setAttribute("data-complete", true);
		} else {
			nativeInput.removeAttribute("data-complete");
		}
	}, [userInput]);

	// Первый рендеринг и все связанные эффекты завершены
	useEffect(() => {
		initStateRef.current = false;
		initComplete && initComplete();
		
	}, []);

	const classes = [rootClass, className];
	if (focus) classes.push(`focus`);
	if (withNativeInput) classes.push(`${rootClass}_as-input`);
		log("Selected check: ", options.filter(data => selectedSet.has(data)));
	return html`<${Context.Provider} value=${ctx}>
								<div ref=${rootContainerRef} class=${classes.join(" ")} role="combobox" tabindex="${withNativeInput ? -1 : 0}">
									<${Body} focus=${focus}>
										<${BodyContent} OptionContent=${OptionContent} />
									</${Body}>
									<${List} ref=${listContainerRef} focus=${focus}>
										${filteredOptions.map((data, idx) => {
											return html`<${Option} key=${idx} data=${data} selected=${selectedSet.has(data)}>
																		<${OptionContent} data=${data}/>
																	</${Option}>`;
										})}
									</${List}>
								</div>
							</${Context.Provider}>
						`;
}
const defaultConfig = {
	rootClass,
	addClasses: {},
	stripData: elem => {
		return {
			value: elem.getAttribute("value"),
			id: elem.getAttribute("id"),
			caption: elem.textContent,
			selected: typeof elem.getAttribute("selected") === "string",
		};
	},
	components: {
		Body,
		BodyContent: SelectBodyContent,
		SelectedOption,
		List,
		Option,
		OptionContent,
		Placeholder,
	}
}

export class NativeSelectWrap {
	constructor(target, config) {
		let components = Object.assign({}, defaultConfig.components);
		if (config.components) {
			Object.assign(components, config.components);
		}
		this.config = Object.assign({}, defaultConfig, config, { components });
		this._ctx = createRef();
		this._elems = {};
		this._elems.nativeSelect = getTargetElem(target);
		this._elems.root = createElem("div", { class: wrapRootClass });
		this._elems.nativeSelect.replaceWith(this._elems.root);
		this._elems.nativeSelect.setAttribute("data-native-select", true);
		this._elems.root.appendChild(this._elems.nativeSelect);
		this._elems.mountPoint = createElem("div", { class: `${wrapRootClass}__mp` });
		this._elems.root.appendChild(this._elems.mountPoint);
		
		const options = Array.from(this._elems.nativeSelect.options).map(this.config.stripData);
			log("Initial options (after strip): ", options);
		const placeholder = this._elems.nativeSelect.getAttribute("data-placeholder");
		const className = this._elems.nativeSelect.getAttribute("data-class");

		render(html`<${Select}
					ctxRef=${this._ctx}
					nativeInput=${this._elems.nativeSelect}
					initialOptions=${options}
					placeholder=${placeholder}
					components=${this.config.components}
					addClasses=${this.config.addClasses}
					className=${className}
				/>`, this._elems.mountPoint);
	}
}
export class NativeInputWrap {
	constructor(target, config) {
		let components = Object.assign({}, defaultConfig.components);
		if (config.components) {
			Object.assign(components, config.components);
		}
		this.config = Object.assign({}, defaultConfig, config, { components });
		this._ctx = createRef();
		this._elems = {};
		this._elems.nativeInput = getTargetElem(target);
		this._elems.root = createElem("div", { class: wrapRootClass });
		this._elems.nativeInput.replaceWith(this._elems.root);
		this._elems.nativeInput.setAttribute("data-native-input", true);
		this._elems.root.appendChild(this._elems.nativeInput);
		this._elems.mountPoint = createElem("div", { class: `${wrapRootClass}__mp` });
		this._elems.root.appendChild(this._elems.mountPoint);
		
		const placeholder = this._elems.nativeInput.getAttribute("placeholder");
		const className = this._elems.nativeInput.getAttribute("data-class");
	
		render(html`<${Select}
					ctxRef=${this._ctx}
					nativeInput=${this._elems.nativeInput}
					placeholder=${placeholder}
					components=${this.config.components}
					className=${className}
					addClasses=${this.config.addClasses}
					setSelectedAsUserInput=${true}
					filterOptionsByUserInput=${true}
					withNativeInput=${true}
				/>`, this._elems.mountPoint);
	}
	setOptions(data) {
		this._ctx.current.setOptions(data);
	}
	resetSelected() {
		this._ctx.current.resetSelected();
	}
}