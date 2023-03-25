import { h, render, Fragment } from "preact";
import { effect, signal } from "@preact/signals";
import { memo, useEffect, useCallback, useRef, useState } from "preact/compat";
import { html } from "htm/preact";
import { isEmpty } from "../../libs/utils.js";

export function initSearchInput() {
	const query = signal("");
	const inFocus = signal(false);
	const searchRootElem = document.querySelector("#filters-search");
	//const resetBtnElem = searchRootElem.querySelector(".search-control__reset-btn");
	const searchBtnElem = searchRootElem.querySelector(".search-control__search-btn");
	const inputElem = searchRootElem.querySelector(".search-control__input");
	const predictionsElem = searchRootElem.querySelector(".search-control__predictions");

	const createChangeEvent = () => {
		const event = new Event("change", { bubbles: true });
		event.__synteticEvent = true;
		return event;
	}
	const handleChange = _.debounce(event => {
		query.value = inputElem.value;
	}, 200);
	inputElem.addEventListener("change", event => {
		handleChange(event);
		if (!event.__synteticEvent) {
			event.preventDefault();
			event.stopPropagation();
		}
	});
	inputElem.addEventListener("blur", event => {
		inFocus.value = false;
	});
	inputElem.addEventListener("input", handleChange);
	inputElem.addEventListener("focus", () =>  inFocus.value = true);

	predictionsElem.addEventListener("click", (event) => {
		const predictionBtnElem = event.target.closest(".search-control__prediction-btn");
		if (predictionBtnElem) {
			inputElem.value = predictionBtnElem.getAttribute("data-value");
			inputElem.dispatchEvent(createChangeEvent());
		}
	});
	inputElem.addEventListener("keypress", event => {
		if (event.keyCode === 13) {
			inputElem.dispatchEvent(createChangeEvent());
		}
	});
	// resetBtnElem.addEventListener("click", event => {
	// 	inputElem.value = "";
	// 	inputElem.dispatchEvent(createChangeEvent());
	// });
	searchBtnElem.addEventListener("click", event => {
		inputElem.dispatchEvent(createChangeEvent());
	});
	const PredictionItem = memo(function PredictionItem({ query, prediction, onClick }) {
		const lowerCaseQuery = query.toLowerCase();
		const lowerCasePrediction = prediction.toLowerCase();
		const formatPrediction = () => {
			if (isEmpty(query)) return html`${prediction}`;
			if (lowerCaseQuery === lowerCasePrediction) return html`<mark>${prediction}</mark>`;
			const result = [];
			let foundIdx, edgeIdx = 0;
			while ((foundIdx = lowerCasePrediction.indexOf(lowerCaseQuery, edgeIdx)) > -1) {
				if (foundIdx > edgeIdx) {
					result.push(html`${prediction.slice(edgeIdx, foundIdx)}`);
				}
				edgeIdx = foundIdx + query.length;
				result.push(html`<mark>${prediction.slice(foundIdx, edgeIdx)}</mark>`);
			}
			if (edgeIdx < prediction.length) {
				result.push(html`${prediction.slice(edgeIdx)}`);
			}
			return result;
		}
		return html`<li class="search-control__prediction-item">
									<button type="button" class="search-control__prediction-btn" onclick=${onClick} data-value="${prediction}">
										${formatPrediction()}
									</button>
								</li>`;
	});
	const Predictions = function Predictions({ query, inFocus }) {
		const prevProps = useRef({});
		const [state, setState] = useState({
			query: query.value,
			predictions: [],
			hidden: true,
		});
		const predictionClickHandler = useCallback(() => {
			setState((state) => {
				return {
					...state,
					hidden: true,
				}
			});
		}, []);
		useEffect(() => {
			const queryStr = query.value;
			if (inFocus.value && prevProps.current.inFocus !== inFocus.value) {
				setState((state) => {
					return {
						...state,
						hidden: false,
					}
				});
			}
			if (queryStr !== prevProps.current.query) {
				if (!isEmpty(queryStr) && queryStr.length > 1) {
					requestPredictions(queryStr)
						.then((predictions) => {
							if (queryStr === query.value) {
								setState((state) => {
									return {
										...state,
										hidden: false,
										query: queryStr,
										predictions,
									};
								});
							}
						})
						.catch(reason => {
							console.log("Error requesting search predictions: ", reason);
						});
				} else {
					setState((state) => {
						return {
							...state,
							hidden: true,
							predictions: [],
						}
					});
				}
			}
			prevProps.current = { query: query.value, inFocus: inFocus.value };
		}, [query.value, inFocus.value]);
		
		const classList = ["search-control__predictions-list"];
		if (!state.hidden && inFocus.value && state.predictions.length > 0) classList.push("show");
		return html`<ul class=${classList.join(" ")}>
									${state.predictions.map(prediction => html`<${PredictionItem}
										key=${prediction}
										query=${state.query}
										prediction=${prediction}
										onClick=${predictionClickHandler}
									/>`)}
								</ul>`;
	};
	render(html`<${Predictions} query=${query} inFocus=${inFocus}/>`, predictionsElem);

	function requestPredictions(query) {
		const imitList = ["CONE", "CONUS", "COLLONA", "CONIC"];
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (query.length === 0) return resolve([]);
				resolve(imitList.filter(value => value.indexOf(query) > -1));
			}, 100);
		});
		return fetch("/ajax/search-predictions.php", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query }),
		}).then(response => response.json().predictions)
	}
}