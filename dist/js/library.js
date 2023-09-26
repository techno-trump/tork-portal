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
;// CONCATENATED MODULE: ./src/js/pages/library/sliders.js

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
  initBreadcrumbsSlider();
}
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
;// CONCATENATED MODULE: ./repo/js/libs/blockSizeVars.js

const isHtmlElem = elem => {
  return elem && typeof elem === "object" && "tagName" in elem || false;
};
const stack = new Map();
const setVars = (elem, prefix, _ref) => {
  let {
    width,
    height
  } = _ref;
  if (width !== undefined) elem.style.setProperty("--".concat(prefix, "block-width"), width);
  if (height !== undefined) elem.style.setProperty("--".concat(prefix, "block-height"), height);
};
const handleResize = throttleByKey(target => {
  if (!stack.has(target)) return;
  const {
    elem,
    prefix,
    container,
    include
  } = stack.get(target);
  const holder = isHtmlElem(container) ? container : elem;
  const vars = {
    width: elem.clientWidth,
    height: elem.clientHeight
  };
  if (include !== undefined) {
    if (!include.includes("height")) delete vars.height;
    if (!include.includes("width")) delete vars.width;
  }
  setVars(holder, prefix, vars);
}, 100, {
  noLeadingCall: true
});
const observer = new ResizeObserver(entries => {
  entries.forEach(_ref2 => {
    let {
      target
    } = _ref2;
    handleResize(target, target);
  });
});
const registerElem = (elem, _ref3) => {
  let {
    prefix,
    container,
    include
  } = _ref3;
  // prefix, containerElemOrSelector
  const normalizedPrefix = prefix ? "".concat(prefix, "-") : "";
  const containerElem = isHtmlElem(container) ? container : elem.closest(container);
  stack.set(elem, {
    elem,
    prefix: normalizedPrefix,
    container,
    include
  });
  observer.observe(elem);
};
const setBlockSizeVars = (target, options) => {
  // { prefix, container, include }
  if (typeof target === "string") {
    const elems = document.querySelectorAll(target);
    elems.forEach(elem => registerElem(elem, options));
  } else {
    registerElem(target, options);
  }
};
;// CONCATENATED MODULE: ./src/js/pages/library/index.js



window.addEventListener("DOMContentLoaded", onLoaded);
function onLoaded() {
  initSliders();
  setCardsWidth();
}
function setCardsWidth() {
  const elems = document.querySelectorAll(".category-card");
  elems.forEach(elem => {
    setBlockSizeVars(elem, {
      include: ["width"]
    });
  });
}
}();
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {
// extracted by mini-css-extract-plugin

}();
/******/ })()
;