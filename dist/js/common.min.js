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
;// CONCATENATED MODULE: ./repo/js/libs/utils.js
function isEmpty(value) {
  return value === null || value === undefined || value === "";
}
function getTargetElem(target) {
  if (target instanceof HTMLElement) {
    return target;
  } else {
    const elem = document.querySelector(target);
    if (!elem) new Error("Cannot find the target by selector: ".concat(target));
    return elem;
  }
}
function formatPrice(value) {
  const normalizedValue = typeof value === "string" ? value.trim().replace(" ", "") : String(value);
  const result = [];
  const tmp = normalizedValue.split("");
  // return normalizedValue.split(/\B(?=(\d{3})+$)/).join(" ");
  while (tmp.length > 0) {
    result.unshift(tmp.splice(-3).join(""));
  }
  return result.join(" ");
}
function forEachProp(obj, callback) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    callback(keys[i], obj[keys[i]]);
  }
}
;
const createElem = (name, attrs, container) => {
  var el = document.createElement(name);
  if (attrs) forEachProp(attrs, function (key, value) {
    return el.setAttribute(key, value);
  });
  if (container) container.appendChild(el);
  return el;
};
const normalizeString = value => {
  return String(value).toLowerCase().trim();
};
;// CONCATENATED MODULE: ./repo/components/drawers/index.js
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }


log("Started loading drawers api to global scope");
const {
  lock,
  unlock
} = bodyScrollLock;
const isAsync = target => target.constructor.name === "AsyncFunction";
const initialLayerZIndex = 200;
const defaultOptions = {
  overlapping: true,
  static: false,
  closeOnEsc: true,
  closeOnOutsideClick: true,
  closeConfirm: drawer => {
    return true;
  }
};
var _state = /*#__PURE__*/new WeakMap();
class Drawer {
  static get upperOpenDrawer() {
    return Drawer.openDrawersList[Drawer.openDrawersList.length - 1];
  }
  static get upperOverlapping() {
    return Drawer.state.upperOverlapping;
  }
  static set upperOverlapping(drawer) {
    return Drawer.state.upperOverlapping = drawer;
  }
  static resetUpperOverlapping() {
    if (Drawer.upperOverlapping) {
      Drawer.upperOverlapping.upperOverlapping = false;
    }
    const upperOverlapping = Drawer.openDrawersList.find(drawer => drawer.overlapping);
    if (upperOverlapping) {
      upperOverlapping.upperOverlapping = true;
      Drawer.upperOverlapping = upperOverlapping;
    }
  }
  static get upperZIndex() {
    if (Drawer.openDrawersList.length) {
      return Drawer.upperOpenDrawer.zIndex;
    } else {
      return initialLayerZIndex;
    }
  }
  constructor(elem, alias) {
    let userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classPrivateFieldInitSpec(this, _state, {
      writable: true,
      value: {
        zIndex: null,
        focus: false,
        open: false,
        locked: false,
        upperOverlapping: false
      }
    });
    _defineProperty(this, "subscribers", {
      close: [],
      open: []
    });
    _defineProperty(this, "components", {
      openBtnElems: [],
      closeBtnElems: []
    });
    const options = {
      __proto__: defaultOptions,
      on: {}
    };
    this.elem = elem;
    this.alias = alias;
    this.params = Object.assign(options, userOptions);
    debug("Drawer has been initialized: ", alias);
  }
  set zIndex(val) {
    _classPrivateFieldGet(this, _state).zIndex = val;
    this.elem.style.setProperty("z-index", val);
  }
  get zIndex() {
    return _classPrivateFieldGet(this, _state).zIndex;
  }
  set focus(value) {
    _classPrivateFieldGet(this, _state).focus = value;
    if (value) {
      this.elem.classList.add("focus");
    } else {
      this.elem.classList.remove("focus");
    }
  }
  set upperOverlapping(value) {
    _classPrivateFieldGet(this, _state).upperOverlapping = value;
    if (value) {
      this.elem.classList.add("upper-overlapping");
    } else {
      this.elem.classList.remove("upper-overlapping");
    }
  }
  get upperOverlapping() {
    return _classPrivateFieldGet(this, _state).upperOverlapping;
  }
  get focus() {
    return _classPrivateFieldGet(this, _state).focus;
  }
  set locked(value) {
    _classPrivateFieldGet(this, _state).locked = value;
    if (value) lock(this.elem);else unlock(this.elem);
  }
  get locked() {
    return _classPrivateFieldGet(this, _state).locked;
  }
  on(type, callback) {
    if (type in this.subscribers) {
      this.subscribers[type].push(callback);
    }
  }
  set overlapping(value) {
    this.params.overlapping = value;
    if (value) this.elem.classList.add("drawer_overlapping");else this.elem.classList.remove("drawer_overlapping");
    Drawer.resetUpperOverlapping();
  }
  get overlapping() {
    return this.params.overlapping;
  }
  addOpenBtn(target) {
    const openBtnElem = getTargetElem(target);
    this.components.openBtnElems.push(openBtnElem);
    openBtnElem.addEventListener("click", event => {
      event.__drawerOpen = true;
      this.open(openBtnElem);
    });
  }
  addCloseBtn(target) {
    const closeBtnElem = getTargetElem(target);
    this.components.closeBtnElems.push(closeBtnElem);
    closeBtnElem.addEventListener("click", event => {
      event.__drawerClose = true;
      this.close(closeBtnElem);
    });
  }
  open(initiator) {
    console.log("Open Drawer Native", this, initiator);
    if (_classPrivateFieldGet(this, _state).open) return;
    this.components.openBtnElems.forEach(elem => {
      if (elem instanceof HTMLElement) {
        elem.classList.add("active");
      }
    });
    this.components.closeBtnElems.forEach(elem => {
      if (elem instanceof HTMLElement) {
        elem.classList.add("active");
      }
    });
    if (this.params.overlapping || this.params.static) {
      // Add event listeners
      this.locked = true;
      if (Drawer.upperOverlapping) {
        Drawer.upperOverlapping.upperOverlapping = false;
      }
      this.upperOverlapping = true;
      Drawer.upperOverlapping = this;
    }
    // Get upper overlapping
    this.zIndex = Drawer.upperZIndex + 1;
    this.elem.classList.add("open");
    this.initiator = initiator;
    _classPrivateFieldGet(this, _state).open = true;
    Drawer.openDrawersList.push(this);
    this.subscribers.open.forEach(callback => callback(this));
  }
  close() {
    console.log("Close Drawer Native", this);
    if (!_classPrivateFieldGet(this, _state).open) return;
    this.components.openBtnElems.forEach(elem => {
      if (elem instanceof HTMLElement) {
        elem.classList.remove("active");
      }
    });
    this.components.closeBtnElems.forEach(elem => {
      if (elem instanceof HTMLElement) {
        elem.classList.remove("active");
      }
    });
    this.elem.classList.remove("open");
    this.locked = false;
    _classPrivateFieldGet(this, _state).open = false;
    const drawerIdx = Drawer.openDrawersList.findIndex(drawer => drawer.alias === this.alias);
    Drawer.openDrawersList.splice(drawerIdx, 1);
    Drawer.resetUpperOverlapping();
    this.subscribers.close.forEach(callback => callback(this));
  }
  async handleEsc(event) {
    if (this.params.closeOnEsc && !this.params.static) {
      if (await this.params.closeConfirm(this)) this.close();
    }
  }
  async handleOutsideClick(event) {
    if (event.target === this.initiator) return;
    if (this.params.closeOnOutsideClick && !this.params.static) {
      if (await this.params.closeConfirm(this)) this.close();
    }
  }
  async handleUnderlayClick(event) {
    if (this.params.closeOnOutsideClick && !this.params.static) {
      if (await this.params.closeConfirm(this)) this.close();
    }
  }
}
_defineProperty(Drawer, "openDrawersList", []);
_defineProperty(Drawer, "state", {
  upperOverlapping: null
});
if (!window.drawers) {
  window.drawers = (() => {
    const kitchen = {};
    const drawersMap = {};
    kitchen.init = function (options) {
      debug("Start drawers initialization");
      const drawerElems = document.querySelectorAll("[data-drawer]");
      const controlElems = document.querySelectorAll("[data-drawer-open], [data-drawer-close]");
      drawerElems.forEach(elem => {
        const drawerAlias = elem.getAttribute("data-drawer");
        drawersMap[drawerAlias] = new Drawer(elem, drawerAlias, options);
      });
      controlElems.forEach(elem => {
        if (elem.hasAttribute("data-drawer-open")) {
          const drawerAlias = elem.getAttribute("data-drawer-open");
          if (!drawersMap[drawerAlias]) return;
          drawersMap[drawerAlias].addOpenBtn(elem);
        } else {
          const drawerAlias = elem.getAttribute("data-drawer-close");
          if (!drawersMap[drawerAlias]) return;
          drawersMap[drawerAlias].addCloseBtn(elem);
        }
      });
      document.addEventListener("click", event => {
        if (event.__drawerOpen || event.__drawerClose) return;
        const {
          target
        } = event;
        const drawerPanelElem = target.closest(".drawer__panel");
        if (drawerPanelElem) {// Inside click
        } else {
          const drawerElem = target.closest(".drawer");
          if (drawerElem) {
            var _drawersMap$alias;
            // Underlay click
            const alias = drawerElem.getAttribute("data-drawer");
            (_drawersMap$alias = drawersMap[alias]) === null || _drawersMap$alias === void 0 ? void 0 : _drawersMap$alias.handleUnderlayClick(event);
          } else {
            // Outside click
            Drawer.openDrawersList.forEach(drawer => drawer.handleOutsideClick(event));
          }
        }
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
          if (!Drawer.openDrawersList.length) return;
          Drawer.upperOpenDrawer.handleEsc(event);
        }
      });
    };
    kitchen.assign = function (target, alias, options) {
      if (alias in drawersMap) throw new Error("There is drawer already created with given alias: \"".concat(alias, "\""));
      const drawerElem = target instanceof HTMLElement ? target : document.querySelector(target);
      if (drawerElem) throw new Error("There is no element has been found by given selector: \"".concat(target, "\""));
      return drawersMap[alias] = new Drawer(drawerElem, alias, options);
    };
    kitchen.open = function (alias, initiator) {
      console.log("Open Drawer Kitchen", alias, initiator);
      if (!(alias in drawersMap)) throw new Error("There is no drawer created with given alias: \"".concat(alias, "\""));
      drawersMap[alias].open(initiator);
    };
    kitchen.close = function (alias) {
      console.log("Close Drawer Kitchen", alias);
      if (!(alias in drawersMap)) throw new Error("There is no drawer created with given alias: \"".concat(alias, "\""));
      drawersMap[alias].close();
    };
    kitchen.get = function (alias) {
      return drawersMap[alias];
    };
    kitchen.on = (alias, type, callback) => {
      var _kitchen$get;
      return (_kitchen$get = kitchen.get(alias)) === null || _kitchen$get === void 0 ? void 0 : _kitchen$get.on(type, callback);
    };
    return kitchen;
  })();
}
function bodyLock(targetElem) {
  lock(targetElem);
  const bodyElem = document.querySelector("body");
  bodyElem.classList.add("lock");
  const scrollableElems = targetElem.querySelectorAll("[data-scrollable]");
  scrollableElems.forEach(elem => lock(elem));
}
function bodyUnlock(targetElem) {
  let removeUnderlay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
  const bodyElem = document.querySelector("body");
  setTimeout(() => {
    if (removeUnderlay) {
      bodyElem.classList.remove("lock");
    }
    unlock(targetElem);
    const scrollableElems = targetElem.querySelectorAll("[data-scrollable]");
    scrollableElems.forEach(elem => unlock(elem));
  }, delay);
}
;// CONCATENATED MODULE: ./repo/js/libs/portals.js


const portalsIndexByMedia = {};
const mediaIndex = {};
const onClassIndex = {};
const indexByName = {};
class Portal {
  constructor(name, src, dest) {
    this.name = name;
    this.src = src;
    this.dest = dest;
    this.state = {
      active: false
    };
  }
  send() {
    if (this.state.active) return this;
    this.dest.append(...this.src.childNodes);
    this.src.setAttribute("data-portal-active", "true");
    this.dest.setAttribute("data-portal-active", "true");
    this.state.active = true;
    debug("Portal has been activated: ", this);
    return this;
  }
  return() {
    if (!this.state.active) return this;
    this.src.append(...this.dest.childNodes);
    this.src.removeAttribute("data-portal-active");
    this.dest.removeAttribute("data-portal-active");
    this.state.active = false;
    debug("Portal has been de-activated: ", this.name);
    return this;
  }
  swap() {
    return this.state.active ? this.return() : this.send();
  }
}
function initPortals() {
  log("Start portals initialization");
  const sourceElems = document.querySelectorAll("[data-portal-src]");
  const destElems = document.querySelectorAll("[data-portal-dest]");
  const destMap = [].reduce.call(destElems, (result, elem) => {
    result[elem.getAttribute("data-portal-dest")] = elem;
    return result;
  }, {});

  // Activate portal on user defined class added
  initMutationObserver();
  sourceElems.forEach(elem => {
    const portalName = elem.getAttribute("data-portal-src");
    const portalMedia = elem.getAttribute("data-portal-media");
    const portalOnClass = elem.getAttribute("data-portal-on-class");
    debug("Initialize portal:: portalName: ", portalName, ", portalMedia: ", portalMedia, ", portalOnClass: ", portalOnClass);
    if (!destMap[portalName]) {
      debug("No destination for portal:: portalName: ", portalName);
      return;
    }
    indexByName[portalName] = new Portal(portalName, elem, destMap[portalName]);
    if (portalMedia) return addTriggerByMedia(portalName, portalMedia);
    if (portalOnClass) return initPortalDrivenByClass(portalName, portalOnClass);
  });
  debug("indexByName: ", indexByName, "portalsIndexByMedia: ", portalsIndexByMedia);
  Object.entries(mediaIndex).forEach(_ref => {
    let [media, mediaMatch] = _ref;
    return swapByMedia(mediaMatch);
  });
  window.portals = {
    getByName: name => indexByName[name]
  };
  function addTriggerByMedia(portalName, portalMedia) {
    debug("addTriggerByMedia: ", portalName, portalMedia);
    if (!mediaIndex[portalMedia]) {
      const mediaMatch = window.matchMedia(portalMedia);
      mediaIndex[portalMedia] = mediaMatch;
      portalsIndexByMedia[mediaMatch.media] = {
        mediaMatch,
        stack: [portalName]
      };
      mediaMatch.addListener(swapByMedia);
    } else {
      const trueMedia = mediaIndex[portalMedia].media;
      portalsIndexByMedia[trueMedia].stack.push(portalName);
    }
  }
  function initMutationObserver() {
    return new MutationObserver((mutationsList, observer) => {
      log(mutationsList);
    });
  }
  function initPortalDrivenByClass(className) {}
  function swapByMedia(_ref2) {
    let {
      matches,
      media
    } = _ref2;
    debug("Manipulate portals by media: ", media, ", matches: ", matches);
    if (matches) {
      portalsIndexByMedia[media].stack.forEach(portalName => indexByName[portalName].send());
    } else {
      portalsIndexByMedia[media].stack.forEach(portalName => indexByName[portalName].return());
    }
  }
}
;// CONCATENATED MODULE: ./repo/js/libs/onHoverAnimationFinalization.js

/* harmony default export */ function onHoverAnimationFinalization() {
  log("[Init] On hover animation finalization");
  const targetElems = document.querySelectorAll("[data-finalize-animation]");
  targetElems.forEach(elem => {
    elem.addEventListener("pointerenter", _ref => {
      let {
        currentTarget
      } = _ref;
      log("On hover animation finalization::pointerenter:target: ", currentTarget);
      currentTarget.classList.add("animation-finalization");
      currentTarget.setAttribute("data-anim-cycle-parity", false);
    });
    elem.addEventListener("animationiteration", iterationHandler);
    elem.addEventListener("webkitAnimationIteration", iterationHandler);
    function iterationHandler(_ref2) {
      let {
        currentTarget,
        type
      } = _ref2;
      const parity = currentTarget.getAttribute("data-anim-cycle-parity"); // Парность выполенного цикла
      if (currentTarget.closest(":hover") !== currentTarget) {
        const mode = currentTarget.getAttribute("data-finalize-animation");
        if (mode !== "parity" || parity === "true") {
          currentTarget.classList.remove("animation-finalization");
        }
      }
      ;
      currentTarget.setAttribute("data-anim-cycle-parity", parity === "false"); // Флаг для следующей итерации
    }
  });
}
;// CONCATENATED MODULE: ./repo/js/libs/functions.js
/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
function isWebp() {
  // Проверка поддержки webp 
  function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  // Добавление класса _webp или _no-webp для HTML
  testWebP(function (support) {
    let className = support === true ? 'webp' : 'no-webp';
    document.documentElement.classList.add(className);
  });
}
/* Проверка мобильного браузера */
let isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
  }
};
/* Добавление класса touch для HTML если браузер мобильный */
function addTouchClass() {
  // Добавление класса _touch для HTML если браузер мобильный
  if (isMobile.any()) document.documentElement.classList.add('touch');
}
// Добавление loaded для HTML после полной загрузки страницы
function addLoadedClass() {
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.documentElement.classList.add('loaded');
    }, 0);
  });
}
// Получение хеша в адресе сайта
function getHash() {
  if (location.hash) {
    return location.hash.replace('#', '');
  }
}
// Указание хеша в адресе сайта
function setHash(hash) {
  hash = hash ? "#".concat(hash) : window.location.href.split('#')[0];
  history.pushState('', '', hash);
}
// Учет плавающей панели на мобильных устройствах при 100vh
function fullVHfix() {
  const fullScreens = document.querySelectorAll('[data-fullscreen]');
  if (fullScreens.length && isMobile.any()) {
    window.addEventListener('resize', fixHeight);
    function fixHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
    }
    fixHeight();
  }
}
// Вспомогательные модули плавного расскрытия и закрытия объекта ======================================================================================================================================================================
let _slideUp = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  let showmore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = "".concat(target.offsetHeight, "px");
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? "".concat(showmore, "px") : "0px";
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty('height') : null;
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      !showmore ? target.style.removeProperty('overflow') : null;
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // Создаем событие 
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
};
let _slideDown = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  let showmore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty('height') : null;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? "".concat(showmore, "px") : "0px";
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // Создаем событие 
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
};
let _slideToggle = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};
// Вспомогательные модули блокировки прокрутки и скочка ====================================================================================================================================================================================================================================================================================
let bodyLockStatus = true;
let bodyLockToggle = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (document.documentElement.classList.contains('lock')) {
    functions_bodyUnlock(delay);
  } else {
    functions_bodyLock(delay);
  }
};
let functions_bodyUnlock = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = '0px';
      }
      body.style.paddingRight = '0px';
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
let functions_bodyLock = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    }
    body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
// Модуль работы со спойлерами =======================================================================================================================================================================================================================
/*
Документация по работе в шаблоне: https://template.fls.guru/template-docs/modul-spojlery.html
Сниппет (HTML): spollers
*/
function spollers() {
  const spollersArray = document.querySelectorAll('[data-spollers]');
  if (spollersArray.length > 0) {
    // Получение обычных слойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    });
    // Инициализация обычных слойлеров
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    // Получение слойлеров с медиа запросами
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // Событие
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    // Инициализация
    function initSpollers(spollersArray) {
      let matchMedia = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      spollersArray.forEach(spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add('_spoller-init');
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);
        } else {
          spollersBlock.classList.remove('_spoller-init');
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      });
    }
    // Работа с контентом
    function initSpollerBody(spollersBlock) {
      let hideSpollerBody = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter(item => item.closest('[data-spollers]') === spollersBlock);
        spollerTitles.forEach(spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute('tabindex');
            if (!spollerTitle.classList.contains('_spoller-active')) {
              spollerTitle.nextElementSibling.hidden = true;
            }
          } else {
            spollerTitle.setAttribute('tabindex', '-1');
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest('[data-spoller]')) {
        const spollerTitle = el.closest('[data-spoller]');
        const spollersBlock = spollerTitle.closest('[data-spollers]');
        const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        if (!spollersBlock.querySelectorAll('._slide').length) {
          if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
            hideSpollersBody(spollersBlock);
          }
          spollerTitle.classList.toggle('_spoller-active');
          _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
        }
        e.preventDefault();
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
        spollerActiveTitle.classList.remove('_spoller-active');
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }
    // Закрытие при клике вне спойлера
    const spollersClose = document.querySelectorAll('[data-spoller-close]');
    if (spollersClose.length) {
      document.addEventListener("click", function (e) {
        const el = e.target;
        if (!el.closest('[data-spollers]')) {
          spollersClose.forEach(spollerClose => {
            const spollersBlock = spollerClose.closest('[data-spollers]');
            if (spollersBlock.classList.contains('_spoller-init')) {
              const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
              spollerClose.classList.remove('_spoller-active');
              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
            }
          });
        }
      });
    }
  }
}
// Модуь работы с табами =======================================================================================================================================================================================================================
/*
Документация по работе в шаблоне: https://template.fls.guru/template-docs/modul-taby.html
Сниппет (HTML): tabs
*/
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];
  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });

    // Получение слойлеров с медиа запросами
    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // Событие
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
  // Установка позиций заголовков
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }
  // Работа с контентом
  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');
        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_tab-active');
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    function isTabsAnamate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_tab-active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash("tab-".concat(tabsBlockIndex, "-").concat(index));
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
        let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
        tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
        tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
        tabTitle.classList.add('_tab-active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
// Модуль работы с меню (бургер) =======================================================================================================================================================================================================================
/*
Документация по работе в шаблоне: https://template.fls.guru/template-docs/menu-burger.html
Сниппет (HTML): menu
*/
function menuInit() {
  if (document.querySelector(".icon-menu")) {
    document.addEventListener("click", function (e) {
      if (bodyLockStatus && e.target.closest('.icon-menu')) {
        bodyLockToggle();
        document.documentElement.classList.toggle("menu-open");
      }
    });
  }
  ;
}
function menuOpen() {
  functions_bodyLock();
  document.documentElement.classList.add("menu-open");
}
function menuClose() {
  functions_bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}
// Модуль "показать еще" =======================================================================================================================================================================================================================
/*
Документация по работе в шаблоне: https://template.fls.guru/template-docs/modul-pokazat-eshhjo.html
Сниппет (HTML): showmore
*/
function showMore() {
  window.addEventListener("load", function (e) {
    const showMoreBlocks = document.querySelectorAll('[data-showmore]');
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
      // Получение обычных объектов
      showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
        return !item.dataset.showmoreMedia;
      });
      // Инициализация обычных объектов
      showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
      document.addEventListener("click", showMoreActions);
      window.addEventListener("resize", showMoreActions);

      // Получение объектов с медиа запросами
      mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach(mdQueriesItem => {
          // Событие
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
        });
        initItemsMedia(mdQueriesArray);
      }
    }
    function initItemsMedia(mdQueriesArray) {
      mdQueriesArray.forEach(mdQueriesItem => {
        initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    function initItems(showMoreBlocks, matchMedia) {
      showMoreBlocks.forEach(showMoreBlock => {
        initItem(showMoreBlock, matchMedia);
      });
    }
    function initItem(showMoreBlock) {
      let matchMedia = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
      let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
      let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
      showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
      if (matchMedia.matches || !matchMedia) {
        if (hiddenHeight < getOriginalHeight(showMoreContent)) {
          _slideUp(showMoreContent, 0, hiddenHeight);
          showMoreButton.hidden = false;
        } else {
          _slideDown(showMoreContent, 0, hiddenHeight);
          showMoreButton.hidden = true;
        }
      } else {
        _slideDown(showMoreContent, 0, hiddenHeight);
        showMoreButton.hidden = true;
      }
    }
    function getHeight(showMoreBlock, showMoreContent) {
      let hiddenHeight = 0;
      const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size';
      if (showMoreType === 'items') {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
        const showMoreItems = showMoreContent.children;
        for (let index = 1; index < showMoreItems.length; index++) {
          const showMoreItem = showMoreItems[index - 1];
          hiddenHeight += showMoreItem.offsetHeight;
          if (index == showMoreTypeValue) break;
        }
      } else {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
        hiddenHeight = showMoreTypeValue;
      }
      return hiddenHeight;
    }
    function getOriginalHeight(showMoreContent) {
      let parentHidden;
      let hiddenHeight = showMoreContent.offsetHeight;
      showMoreContent.style.removeProperty('height');
      if (showMoreContent.closest("[hidden]")) {
        parentHidden = showMoreContent.closest("[hidden]");
        parentHidden.hidden = false;
      }
      let originalHeight = showMoreContent.offsetHeight;
      parentHidden ? parentHidden.hidden = true : null;
      showMoreContent.style.height = "".concat(hiddenHeight, "px");
      return originalHeight;
    }
    function showMoreActions(e) {
      const targetEvent = e.target;
      const targetType = e.type;
      if (targetType === 'click') {
        if (targetEvent.closest('[data-showmore-button]')) {
          const showMoreButton = targetEvent.closest('[data-showmore-button]');
          const showMoreBlock = showMoreButton.closest('[data-showmore]');
          const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
          const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : '500';
          const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
          if (!showMoreContent.classList.contains('_slide')) {
            showMoreBlock.classList.contains('_showmore-active') ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
            showMoreBlock.classList.toggle('_showmore-active');
          }
        }
      } else if (targetType === 'resize') {
        showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
        mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
      }
    }
  });
}

//================================================================================================================================================================================================================================================================================================================
// Прочие полезные функции ================================================================================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================================================================================
// FLS (Full Logging System)
function FLS(message) {
  setTimeout(() => {
    if (window.FLS) {
      console.log(message);
    }
  }, 0);
}
// Получить цифры из строки
function getDigFromString(item) {
  return parseInt(item.replace(/[^\d]/g, ''));
}
// Форматирование цифр типа 100 000 000
function getDigFormat(item) {
  return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}
// Убрать класс из всех элементов массива
function removeClasses(array, className) {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className);
  }
}
// Уникализация массива
function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}
// Функция получения индекса внутри родителя
function indexInParent(parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
}
;
// Обработа медиа запросов из атрибутов 
function dataMediaQueries(array, dataSetValue) {
  // Получение объектов с медиа запросами
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(",")[0];
    }
  });
  // Инициализация объектов с медиа запросами
  if (media.length) {
    const breakpointsArray = [];
    media.forEach(item => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // Получаем уникальные брейкпоинты
    let mdQueries = breakpointsArray.map(function (item) {
      return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
    });
    mdQueries = uniqArray(mdQueries);
    const mdQueriesArray = [];
    if (mdQueries.length) {
      // Работаем с каждым брейкпоинтом
      mdQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // Объекты с нужными условиями
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia
        });
      });
      return mdQueriesArray;
    }
  }
}
//================================================================================================================================================================================================================================================================================================================
;// CONCATENATED MODULE: ./src/js/common/index.js





window.addEventListener("DOMContentLoaded", onLoaded);
function onLoaded() {
  try {
    initPortals();
    drawers.init();
    onHoverAnimationFinalization();
    initCloseDrawersOnResize();
    initMarkOnScroll();
    addIsMobileClass();
  } catch (ex) {
    error(ex);
  }
}
function addIsMobileClass() {
  if (isMobile.any()) {
    document.documentElement.classList.add("is-mobile");
  }
}
function initCloseDrawersOnResize() {
  const close = _ref => {
    let {
      matches
    } = _ref;
    drawers.get("main-menu").close();
  };
  const mediaMatch = window.matchMedia("(max-width: 1050px)");
  mediaMatch.addListener(close);
}
function initMarkOnScroll() {
  document.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      document.documentElement.classList.add("scroll-80-plus");
    } else {
      document.documentElement.classList.remove("scroll-80-plus");
    }
  });
}
}();
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {
// extracted by mini-css-extract-plugin

}();
/******/ })()
;