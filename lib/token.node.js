(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("supercop.js"), require("es6-promise"), require("axios"));
	else if(typeof define === 'function' && define.amd)
		define("token.node", ["supercop.js", "es6-promise", "axios"], factory);
	else if(typeof exports === 'object')
		exports["token.node"] = factory(require("supercop.js"), require("es6-promise"), require("axios"));
	else
		root["token.node"] = factory(root["supercop.js"], root["es6-promise"], root["axios"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _TokenIO = __webpack_require__(1);

	var _TokenIO2 = _interopRequireDefault(_TokenIO);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Token = {
	  createMember: function createMember(alias) {
	    return _TokenIO2.default.createMember(alias);
	  }

	};

	module.exports = Token;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Member = __webpack_require__(2);

	var _Member2 = _interopRequireDefault(_Member);

	var _Crypto = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Promise polyfill for IE and older browsers
	__webpack_require__(5).polyfill();
	var axios = __webpack_require__(6);
	var instance = axios.create({
	  baseURL: 'http://localhost:8000'
	});

	var TokenIO = function () {
	  function TokenIO() {
	    _classCallCheck(this, TokenIO);
	  }

	  _createClass(TokenIO, null, [{
	    key: "createMember",
	    value: function createMember(alias) {
	      console.log("Creating member");

	      var keys = (0, _Crypto.generateKeys)();
	      return instance({
	        method: "post",
	        url: "/members"
	      }).then(function (response) {
	        return new _Member2.default(response.data.memberId, [], [keys]);
	      }).catch(function (error) {
	        console.log("Error: ", error);
	      });
	    }
	  }]);

	  return TokenIO;
	}();

	exports.default = TokenIO;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Member = function () {
	  function Member(memberId, aliases, privateKeys) {
	    _classCallCheck(this, Member);

	    this._memberId = memberId;
	    this._aliases = aliases;
	    this._privateKeys = privateKeys;
	  }

	  _createClass(Member, [{
	    key: "doSomething",
	    value: function doSomething() {
	      console.log("Doing something in member");
	    }
	  }, {
	    key: "memberId",
	    get: function get() {
	      return this._memberId;
	    }
	  }]);

	  return Member;
	}();

	exports.default = Member;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	window = {};
	var lib = __webpack_require__(4);

	function generateKeys() {
	  var seed = lib.createSeed();
	  return lib.createKeyPair(seed);
	}

	exports.generateKeys = generateKeys;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("supercop.js");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("es6-promise");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("axios");

/***/ }
/******/ ])
});
;