(() => {
  var __webpack_modules__ = [,
    // commonjs
    module => {
      /* js code */
      module.exports = {
        num,
        increase
      }
    },
    // es6
    (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        num: () => /* binding */ num,
        increase: () => /* binding */ increase,
      });
      /* js code */
    },
  ]
  var __webpack_modules_cache__ = {}

  function __webpack_require__(moduleId) {
    if (__webpack_modules_cache__[moduleId]) {
      return __webpack_modules_cache__[moduleId].exports
    }
    var module = (__webpack_modules_cache__[moduleId] = {
      exports: {}
    })
    __webpack_modules__[moduleId].call(module, module.exports, __webpack_require__)
    return module.exports
  }

  // commonjs
  (() => {
    const {
      num,
      increase
    } = __webpack_require__(1)
  })()

  // es6
  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  (() => {
    var _counter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
    const {
      num,
      increase
    } = _counter__WEBPACK_IMPORTED_MODULE_0__
  })();
})()