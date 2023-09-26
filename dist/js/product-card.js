/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {

;// CONCATENATED MODULE: ./repo/js/libs/throttle.js
const throttle = function (callback, delay) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let timeOut = null,
    argsMemo;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (timeOut) {
      argsMemo = args;
    } else {
      if (options.noLeadingCall) {
        argsMemo = args;
      } else {
        callback(...args);
      }
      schedule();
    }
    function schedule() {
      timeOut = setTimeout(() => {
        if (argsMemo) {
          callback(...argsMemo);
          argsMemo = null;
        }
        timeOut = null;
      }, delay);
    }
  };
};
const throttleByKey = function (callback, delay) {
  let {
    noLeadingCall
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const memo = new Map();
  let timeOut = null,
    argsMemo;
  return function (key) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    if (timeOut) {
      memo.set(key, args);
    } else {
      if (noLeadingCall) {
        memo.set(key, args);
      } else {
        callback(...args);
      }
      schedule();
    }
    function schedule() {
      timeOut = setTimeout(() => {
        memo.forEach(args => {
          callback(...args);
        });
        memo.clear();
        timeOut = null;
      }, delay);
    }
  };
};
;// CONCATENATED MODULE: ./repo/js/libs/logger.js
const onlyErrorsToConsole = true;
const consoleLogs = true;
const consoleDebug = true;
const alertOnError = false;
const alertOnLog = false;
function log() {
  if (!onlyErrorsToConsole) {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (consoleLogs) console.log(...args);
    if (alertOnLog) alert(args.join(" :: "));
  }
}
function debug() {
  if (!onlyErrorsToConsole && consoleDebug) console.debug(...arguments);
}
function error() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  if (!onlyErrorsToConsole && consoleDebug) console.error(...args);
  if (alertOnError) alert(args.join(" :: "));
}
;// CONCATENATED MODULE: ./repo/components/accordeon/index.js


const resetHeight = throttle(_ref => {
  let {
    target
  } = _ref;
  const parentItem = target.closest(".accordeon__item");
  if (parentItem.classList.contains("open")) target.parentElement.style.height = "".concat(target.offsetHeight, "px");
}, 25);
const observer = new ResizeObserver(entries => {
  entries.forEach(resetHeight);
});
function initAccordeon(rootSelector) {
  log("initAccordeon::start: ", rootSelector);
  const rootElem = document.querySelector(rootSelector);
  rootElem.addEventListener("click", _ref2 => {
    let {
      target
    } = _ref2;
    if (!target.closest(".accordeon__item-header")) return;
    const itemElem = target.closest(".accordeon__item");
    const bodyElem = itemElem.querySelector(".accordeon__item-body");
    const bodyInnerElem = bodyElem.firstElementChild;
    if (itemElem.classList.contains("open")) {
      bodyElem.style.height = '';
      itemElem.classList.remove("open");
      observer.unobserve(bodyInnerElem);
    } else {
      bodyElem.style.height = "".concat(bodyInnerElem.offsetHeight, "px");
      itemElem.classList.add("open");
      observer.observe(bodyInnerElem);
    }
  });
}
;// CONCATENATED MODULE: ./src/js/pages/product-card/sliders.js

function initMainSlider(thumbsSlider) {
  new Swiper("#product-card-slider", {
    observer: true,
    resizeObserver: true,
    slidesPerView: 1,
    grabCursor: true,
    loop: true,
    autoplay: {
      delay: 3000
    },
    thumbs: {
      swiper: thumbsSlider
    }
  });
}
function initMainSliderThumbs() {
  return new Swiper("#product-card-slider-thumbs", {
    observer: true,
    resizeObserver: true,
    slidesPerView: 3,
    spaceBetween: 20,
    grabCursor: true,
    navigation: {
      prevEl: "#product-card-slider-thumbs-prev-btn",
      nextEl: "#product-card-slider-thumbs-next-btn"
    }
  });
}
function initOptionsSlider(prefix) {
  return new Swiper("#".concat(prefix, "-options-slider"), {
    observer: true,
    resizeObserver: true,
    slidesPerView: "auto",
    spaceBetween: 20,
    grabCursor: true
  });
}
function initProductsOverviewSlider(prefix) {
  new Swiper("#".concat(prefix, "-slider"), {
    observer: true,
    resizeObserver: true,
    slidesPerView: 1,
    spaceBetween: 60,
    grabCursor: true,
    loop: true,
    autoplay: {
      delay: 3000
    },
    breakpoints: {
      "575": {
        slidesPerView: 2
      },
      "768": {
        slidesPerView: 3
      },
      "1120": {
        slidesPerView: 4
      }
    }
  });
}
function initBreadcrumbsSlider() {
  new Swiper("#breadcrumbs-slider", {
    resizeObserver: true,
    slidesPerView: "auto",
    grabCursor: true,
    freeMode: true
  });
}
function initSliders() {
  log("init page sliders");
  initMainSlider(initMainSliderThumbs());
  initOptionsSlider("design");
  initOptionsSlider("model");
  initOptionsSlider("color");
  initProductsOverviewSlider("consumables");
  initProductsOverviewSlider("recomended");
  initBreadcrumbsSlider();
}
;// CONCATENATED MODULE: ./src/js/pages/product-card/index.js



window.addEventListener("DOMContentLoaded", onLoaded);
function onLoaded() {
  initSliders();
  initAccordeon("#product-card-accordeon");
  //$.fancybox.defaults.backFocus = false;
}
}();
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {
// extracted by mini-css-extract-plugin

}();
/******/ })()
;