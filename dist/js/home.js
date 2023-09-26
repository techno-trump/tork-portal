/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {

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
;// CONCATENATED MODULE: ./src/js/pages/home/sliders.js

function initWelcomeSliders() {
  log("initWelcomeSliders");
  const sectionsSlider = new Swiper("#welcome-slider", {
    observer: true,
    resizeObserver: true,
    slidesPerView: 1,
    grabCursor: true,
    autoplay: {
      delay: 3000
    },
    pagination: {
      el: "#welcome-slider-pagination",
      clickable: true
    }
  });
}
function initSliders() {
  initWelcomeSliders();
}
;// CONCATENATED MODULE: ./src/js/pages/home/index.js


window.addEventListener("DOMContentLoaded", onLoaded);
function onLoaded() {
  initSliders();
}
}();
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {
// extracted by mini-css-extract-plugin

}();
/******/ })()
;