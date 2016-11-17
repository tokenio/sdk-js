(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("babel-regenerator-runtime"), require("tweetnacl"), require("fast-sha256"), require("base64url"), require("json-stable-stringify"), require("axios"), require("es6-promise"));
	else if(typeof define === 'function' && define.amd)
		define("token-io.node", ["babel-regenerator-runtime", "tweetnacl", "fast-sha256", "base64url", "json-stable-stringify", "axios", "es6-promise"], factory);
	else if(typeof exports === 'object')
		exports["token-io.node"] = factory(require("babel-regenerator-runtime"), require("tweetnacl"), require("fast-sha256"), require("base64url"), require("json-stable-stringify"), require("axios"), require("es6-promise"));
	else
		root["token-io.node"] = factory(root["babel-regenerator-runtime"], root["tweetnacl"], root["fast-sha256"], root["base64url"], root["json-stable-stringify"], root["axios"], root["es6-promise"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_21__, __WEBPACK_EXTERNAL_MODULE_28__) {
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

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("babel-regenerator-runtime");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Crypto = __webpack_require__(3);

	var _Crypto2 = _interopRequireDefault(_Crypto);

	var _Util = __webpack_require__(8);

	var _Util2 = _interopRequireDefault(_Util);

	var _Member = __webpack_require__(9);

	var _Member2 = _interopRequireDefault(_Member);

	var _KeyLevel = __webpack_require__(16);

	var _KeyLevel2 = _interopRequireDefault(_KeyLevel);

	var _LocalStorage = __webpack_require__(10);

	var _LocalStorage2 = _interopRequireDefault(_LocalStorage);

	var _HttpClient = __webpack_require__(26);

	var _HttpClient2 = _interopRequireDefault(_HttpClient);

	var _TokenOperationResult = __webpack_require__(22);

	var _TokenOperationResult2 = _interopRequireDefault(_TokenOperationResult);

	var _AuthHttpClientUsername = __webpack_require__(27);

	var _AuthHttpClientUsername2 = _interopRequireDefault(_AuthHttpClientUsername);

	__webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Promise polyfill for IE and older browsers
	__webpack_require__(28).polyfill();

	// Main entry object
	var Token = function () {
	    function Token() {
	        var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'prd';

	        _classCallCheck(this, Token);

	        this._env = env;
	        this._unauthenticatedClient = new _HttpClient2.default(env);
	        this.Crypto = _Crypto2.default;
	        this.Util = _Util2.default;
	        this.KeyLevel = _KeyLevel2.default;
	        this.TokenOperationResult = _TokenOperationResult2.default;
	    }

	    /**
	     * Checks if a given username already exists
	     * @param {string} username - username to check
	     * @return {Promise} result - true if username exists, false otherwise
	     */


	    _createClass(Token, [{
	        key: "usernameExists",
	        value: function usernameExists(username) {
	            var _this = this;

	            return _Util2.default.tryToDo(this.usernameExists, function _callee() {
	                var res;
	                return regeneratorRuntime.async(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                _context.next = 2;
	                                return regeneratorRuntime.awrap(_this._unauthenticatedClient.usernameExists(username));

	                            case 2:
	                                res = _context.sent;
	                                return _context.abrupt("return", res.data.exists ? res.data.exists : false);

	                            case 4:
	                            case "end":
	                                return _context.stop();
	                        }
	                    }
	                }, null, _this);
	            });
	        }

	        /**
	         * Creates a member with an username and a keypair
	         * @param  {string} username - username to set for member
	         * @return {Promise} member - Promise of created Member
	         */

	    }, {
	        key: "createMember",
	        value: function createMember(username) {
	            var _this2 = this;

	            return _Util2.default.tryToDo(this.createMember, function _callee2() {
	                var keys, response, member;
	                return regeneratorRuntime.async(function _callee2$(_context2) {
	                    while (1) {
	                        switch (_context2.prev = _context2.next) {
	                            case 0:
	                                keys = _Crypto2.default.generateKeys();
	                                _context2.next = 3;
	                                return regeneratorRuntime.awrap(_this2._unauthenticatedClient.createMemberId());

	                            case 3:
	                                response = _context2.sent;
	                                _context2.next = 6;
	                                return regeneratorRuntime.awrap(_this2._unauthenticatedClient.addFirstKey(keys, response.data.memberId));

	                            case 6:
	                                member = new _Member2.default(_this2._env, response.data.memberId, keys);
	                                _context2.next = 9;
	                                return regeneratorRuntime.awrap(member.addUsername(username));

	                            case 9:
	                                return _context2.abrupt("return", member);

	                            case 10:
	                            case "end":
	                                return _context2.stop();
	                        }
	                    }
	                }, null, _this2);
	            });
	        }

	        /**
	         * Log in a member (Instantiate a member object from keys and Id)
	         * @param  {string} memberId - id of the member
	         * @param  {object} keys - member's keys
	         * @return {Promise} member - Promise of instantiated Member
	         */

	    }, {
	        key: "login",
	        value: function login(memberId, keys) {
	            var _this3 = this;

	            return _Util2.default.tryToDo(this.login, function _callee3() {
	                return regeneratorRuntime.async(function _callee3$(_context3) {
	                    while (1) {
	                        switch (_context3.prev = _context3.next) {
	                            case 0:
	                                return _context3.abrupt("return", new _Member2.default(_this3._env, memberId, keys));

	                            case 1:
	                            case "end":
	                                return _context3.stop();
	                        }
	                    }
	                }, null, _this3);
	            });
	        }

	        /**
	         * Log in a member by keys and username. This is useful for checking whether we are
	         * authenticated, after requesting to add a key (by notification). Can call this
	         * every n seconds until it succeeds
	         * @param  {object} keys - Member keys
	         * @param  {string} username - username to authenticate with
	         * @return {Promise} member - instantiated Member, if successful
	         */

	    }, {
	        key: "loginWithUsername",
	        value: function loginWithUsername(keys, username) {
	            var _this4 = this;

	            return _Util2.default.tryToDo(this.loginWithUsername, function _callee4() {
	                var res;
	                return regeneratorRuntime.async(function _callee4$(_context4) {
	                    while (1) {
	                        switch (_context4.prev = _context4.next) {
	                            case 0:
	                                _context4.next = 2;
	                                return regeneratorRuntime.awrap(new _AuthHttpClientUsername2.default(_this4._env, username, keys).getMemberByUsername());

	                            case 2:
	                                res = _context4.sent;
	                                return _context4.abrupt("return", new _Member2.default(_this4._env, res.data.member.id, keys));

	                            case 4:
	                            case "end":
	                                return _context4.stop();
	                        }
	                    }
	                }, null, _this4);
	            });
	        }

	        /**
	         * Logs a member in from keys stored in localStorage
	         * @return {Promise} member - instantiated member
	         */

	    }, {
	        key: "loginFromLocalStorage",
	        value: function loginFromLocalStorage() {
	            var _this5 = this;

	            return _Util2.default.tryToDo(this.loginFromLocalStorage, function _callee5() {
	                return regeneratorRuntime.async(function _callee5$(_context5) {
	                    while (1) {
	                        switch (_context5.prev = _context5.next) {
	                            case 0:
	                                return _context5.abrupt("return", _LocalStorage2.default.loadMember(_this5._env));

	                            case 1:
	                            case "end":
	                                return _context5.stop();
	                        }
	                    }
	                }, null, _this5);
	            });
	        }

	        /**
	         * Notifies subscribers that accounts should be linked, and passes the bank id and
	         * payload
	         * @param {string} username - username to notify
	         * @param {string} bankId - ID of the bank owning the accounts
	         * @param {string} bankName - name of the bank owning the accounts
	         * @param {string} accountLinkPayloads - accountLinkPayloads retrieved from the bank
	         * @return {Promise} NotifyStatus - status
	         */

	    }, {
	        key: "notifyLinkAccounts",
	        value: function notifyLinkAccounts(username, bankId, bankName, accountLinkPayloads) {
	            var _this6 = this;

	            var notification = {
	                linkAccounts: {
	                    bankId: bankId,
	                    bankName: bankName,
	                    accountLinkPayloads: accountLinkPayloads
	                }
	            };
	            return _Util2.default.tryToDo(this.notifyLinkAccounts, function _callee6() {
	                var res;
	                return regeneratorRuntime.async(function _callee6$(_context6) {
	                    while (1) {
	                        switch (_context6.prev = _context6.next) {
	                            case 0:
	                                _context6.next = 2;
	                                return regeneratorRuntime.awrap(_this6._unauthenticatedClient.notify(username, notification));

	                            case 2:
	                                res = _context6.sent;
	                                return _context6.abrupt("return", res.data.status);

	                            case 4:
	                            case "end":
	                                return _context6.stop();
	                        }
	                    }
	                }, null, _this6);
	            });
	        }

	        /**
	         * Notifies subscribers that a key should be added and passes the public Key and
	         * optional name
	         * @param {string} username - username to notify
	         * @param {string} publicKey - public
	         * @param {string} name - name for the new key, (e.g Chrome 53.0)
	         * @return {Promise} NotifyStatus - status
	         */

	    }, {
	        key: "notifyAddKey",
	        value: function notifyAddKey(username, publicKey) {
	            var _this7 = this;

	            var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

	            var notification = {
	                addKey: {
	                    publicKey: _Crypto2.default.strKey(publicKey),
	                    name: name
	                }
	            };
	            return _Util2.default.tryToDo(this.notifyAddKey, function _callee7() {
	                var res;
	                return regeneratorRuntime.async(function _callee7$(_context7) {
	                    while (1) {
	                        switch (_context7.prev = _context7.next) {
	                            case 0:
	                                _context7.next = 2;
	                                return regeneratorRuntime.awrap(_this7._unauthenticatedClient.notify(username, notification));

	                            case 2:
	                                res = _context7.sent;
	                                return _context7.abrupt("return", res.data.status);

	                            case 4:
	                            case "end":
	                                return _context7.stop();
	                        }
	                    }
	                }, null, _this7);
	            });
	        }

	        /**
	         * Notifies subscribed devices that accounts should be linked, and passes the bank id and
	         * payload
	         * @param {string} username - username to notify
	         * @param {string} bankId - ID of the bank owning the accounts
	         * @param {string} bankName - name of the bank owning the accounts
	         * @param {string} accountLinkPayloads - accountsLinkPayload retrieved from the bank
	         * @param {string} publicKey - public
	         * @param {array} name - name for the new key, (e.g Chrome 53.0)
	         * @return {Promise} NotifyStatus - status
	         */

	    }, {
	        key: "notifyLinkAccountsAndAddKey",
	        value: function notifyLinkAccountsAndAddKey(username, bankId, bankName, accountLinkPayloads, publicKey) {
	            var _this8 = this;

	            var name = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";

	            var notification = {
	                linkAccountsAndAddKey: {
	                    linkAccounts: {
	                        bankId: bankId,
	                        bankName: bankName,
	                        accountLinkPayloads: accountLinkPayloads
	                    },
	                    addKey: {
	                        publicKey: _Crypto2.default.strKey(publicKey),
	                        name: name
	                    }
	                }
	            };
	            return _Util2.default.tryToDo(this.notifyLinkAccountsAndAddKey, function _callee8() {
	                var res;
	                return regeneratorRuntime.async(function _callee8$(_context8) {
	                    while (1) {
	                        switch (_context8.prev = _context8.next) {
	                            case 0:
	                                _context8.next = 2;
	                                return regeneratorRuntime.awrap(_this8._unauthenticatedClient.notify(username, notification));

	                            case 2:
	                                res = _context8.sent;
	                                return _context8.abrupt("return", res.data.status);

	                            case 4:
	                            case "end":
	                                return _context8.stop();
	                        }
	                    }
	                }, null, _this8);
	            });
	        }
	    }]);

	    return Token;
	}();

	;

	module.exports = Token;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _tweetnacl = __webpack_require__(4);

	var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

	var _fastSha = __webpack_require__(5);

	var _fastSha2 = _interopRequireDefault(_fastSha);

	var _base64url = __webpack_require__(6);

	var _base64url2 = _interopRequireDefault(_base64url);

	var _jsonStableStringify = __webpack_require__(7);

	var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Crypto = function () {
	    function Crypto() {
	        _classCallCheck(this, Crypto);
	    }

	    _createClass(Crypto, null, [{
	        key: "generateKeys",

	        /**
	         * Generates a keypair to use with the token System
	         * @return {object} keyPair - keyPair
	         */
	        value: function generateKeys() {
	            var keyPair = _tweetnacl2.default.sign.keyPair();
	            keyPair.keyId = (0, _base64url2.default)((0, _fastSha2.default)(keyPair.publicKey)).substring(0, 16);
	            return keyPair;
	        }

	        /**
	         * Signs a json object and returns the signature
	         * @param {object} json - object to sign
	         * @param {object} keys - keys to sign with
	         * @return {string} signature - signature
	         */

	    }, {
	        key: "signJson",
	        value: function signJson(json, keys) {
	            return Crypto.sign((0, _jsonStableStringify2.default)(json), keys);
	        }

	        /**
	         * Signs a string and returns the signature
	         * @param {string} message - message to sign
	         * @param {object} keys - keys to sign with
	         * @return {string} signature - signature
	         */

	    }, {
	        key: "sign",
	        value: function sign(message, keys) {
	            var msg = new Buffer(message);
	            return (0, _base64url2.default)(_tweetnacl2.default.sign.detached(msg, keys.secretKey));
	        }

	        /**
	         * Converts a key to string
	         * @param {Buffer} key - key to encode
	         * @return {string} string - encoded key
	         */

	    }, {
	        key: "strKey",
	        value: function strKey(key) {
	            return (0, _base64url2.default)(key);
	        }

	        /**
	         * Converts a key from a string to buffer.
	         * @param {string} key - base64Url encoded key
	         * @return {Buffer} key - key in Buffer form
	         */

	    }, {
	        key: "bufferKey",
	        value: function bufferKey(key) {
	            return _base64url2.default.toBuffer(key);
	        }
	    }]);

	    return Crypto;
	}();

	exports.default = Crypto;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("tweetnacl");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("fast-sha256");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("base64url");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("json-stable-stringify");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _tweetnacl = __webpack_require__(4);

	var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

	var _base64url = __webpack_require__(6);

	var _base64url2 = _interopRequireDefault(_base64url);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Util = function () {
	    function Util() {
	        _classCallCheck(this, Util);
	    }

	    _createClass(Util, null, [{
	        key: "generateNonce",

	        /**
	         * Generates a random nonce
	         *
	         * @returns string nonce
	         */
	        value: function generateNonce() {
	            return (0, _base64url2.default)(_tweetnacl2.default.sign.keyPair().publicKey);
	        }

	        /**
	         * Count the number of decimal points in a number
	         *
	         * @param value: number
	         * @returns {number} number of decimals
	         */

	    }, {
	        key: "countDecimals",
	        value: function countDecimals(value) {
	            if (Math.floor(value) === value) {
	                return 0;
	            }
	            return value.toString().split(".")[1].length || 0;
	        }

	        /**
	         * Helper method to handle promise exceptions. The function will be executed, and if
	         * anything fails, a rejected promise is returned, with the method name that failed,
	         * included in the rejection.
	         *
	         * @param method: outside method that is being executed
	         * @param fn: function to try to execute
	         * @returns successful or rejected promise
	         */

	    }, {
	        key: "tryToDo",
	        value: function tryToDo(method, fn) {
	            return regeneratorRuntime.async(function tryToDo$(_context) {
	                while (1) {
	                    switch (_context.prev = _context.next) {
	                        case 0:
	                            _context.prev = 0;
	                            _context.next = 3;
	                            return regeneratorRuntime.awrap(fn());

	                        case 3:
	                            return _context.abrupt("return", _context.sent);

	                        case 6:
	                            _context.prev = 6;
	                            _context.t0 = _context["catch"](0);
	                            return _context.abrupt("return", Promise.reject({
	                                type: method.name,
	                                error: _context.t0,
	                                reason: _context.t0.response !== undefined && _context.t0.response.data !== undefined ? _context.t0.response.data : "UNKNOWN"
	                            }));

	                        case 9:
	                        case "end":
	                            return _context.stop();
	                    }
	                }
	            }, null, this, [[0, 6]]);
	        }
	    }]);

	    return Util;
	}();

	exports.default = Util;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Crypto = __webpack_require__(3);

	var _Crypto2 = _interopRequireDefault(_Crypto);

	var _LocalStorage = __webpack_require__(10);

	var _LocalStorage2 = _interopRequireDefault(_LocalStorage);

	var _Account = __webpack_require__(11);

	var _Account2 = _interopRequireDefault(_Account);

	var _Subscriber = __webpack_require__(14);

	var _Subscriber2 = _interopRequireDefault(_Subscriber);

	var _Address = __webpack_require__(15);

	var _Address2 = _interopRequireDefault(_Address);

	var _KeyLevel = __webpack_require__(16);

	var _KeyLevel2 = _interopRequireDefault(_KeyLevel);

	var _AuthHttpClient = __webpack_require__(17);

	var _AuthHttpClient2 = _interopRequireDefault(_AuthHttpClient);

	var _PagedResult = __webpack_require__(12);

	var _PagedResult2 = _interopRequireDefault(_PagedResult);

	var _TokenOperationResult = __webpack_require__(22);

	var _TokenOperationResult2 = _interopRequireDefault(_TokenOperationResult);

	var _TransferToken = __webpack_require__(23);

	var _TransferToken2 = _interopRequireDefault(_TransferToken);

	var _AccessToken = __webpack_require__(24);

	var _AccessToken2 = _interopRequireDefault(_AccessToken);

	var _Transfer = __webpack_require__(25);

	var _Transfer2 = _interopRequireDefault(_Transfer);

	var _Util = __webpack_require__(8);

	var _Util2 = _interopRequireDefault(_Util);

	var _constants = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Member object. Allows member-wide actions. Some calls return a promise, and some return
	 * objects
	 */
	var Member = function () {

	    /**
	     * Represents a Member
	     * @constructor
	     * @param {string} memberId - The id of this memberId
	     * @param {object} keys - An object representing the keypair of the user
	     */
	    function Member(env, memberId, keys) {
	        _classCallCheck(this, Member);

	        this._id = memberId;
	        this._keys = keys;
	        this._client = new _AuthHttpClient2.default(env, memberId, keys);
	    }

	    /**
	     * Gets the memberId
	     * @return {string} memberId
	     */


	    _createClass(Member, [{
	        key: "saveToLocalStorage",


	        /**
	         * Save the member to localStorage, to be loaded in the future. Only works on browsers
	         */
	        value: function saveToLocalStorage() {
	            _LocalStorage2.default.saveMember(this);
	        }

	        /**
	         * Sets the access token id to be used with this client.
	         *
	         * @param {string} accessTokenId - the access token id
	         */

	    }, {
	        key: "useAccessToken",
	        value: function useAccessToken(accessTokenId) {
	            this._client.useAccessToken(accessTokenId);
	        }

	        /**
	         * Clears the access token id used with this client.
	         */

	    }, {
	        key: "clearAccessToken",
	        value: function clearAccessToken() {
	            this._client.clearAccessToken();
	        }

	        /**
	         * Approves a new key for this member
	         * @param {Buffer} publicKey - key to add
	         * @param {string} keyLevel - Security level of this new key. PRIVILEGED is root security
	         * @return {Promise} empty - empty promise
	         */

	    }, {
	        key: "approveKey",
	        value: function approveKey(publicKey) {
	            var _this = this;

	            var keyLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _KeyLevel2.default.PRIVILEGED;

	            return _Util2.default.tryToDo(this.approveKey, function _callee() {
	                var prevHash;
	                return regeneratorRuntime.async(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                _context.next = 2;
	                                return regeneratorRuntime.awrap(_this._getPreviousHash());

	                            case 2:
	                                prevHash = _context.sent;
	                                _context.next = 5;
	                                return regeneratorRuntime.awrap(_this._client.addKey(prevHash, _Crypto2.default.bufferKey(publicKey), keyLevel));

	                            case 5:
	                                return _context.abrupt("return");

	                            case 6:
	                            case "end":
	                                return _context.stop();
	                        }
	                    }
	                }, null, _this);
	            });
	        }

	        /**
	         * Removes a key from this member
	         * @param {string} keyId - keyId to remove. Note, keyId is the hash of the pk
	         * @return {Promise} empty empty promise
	         */

	    }, {
	        key: "removeKey",
	        value: function removeKey(keyId) {
	            var _this2 = this;

	            return _Util2.default.tryToDo(this.removeKey, function _callee2() {
	                var prevHash;
	                return regeneratorRuntime.async(function _callee2$(_context2) {
	                    while (1) {
	                        switch (_context2.prev = _context2.next) {
	                            case 0:
	                                _context2.next = 2;
	                                return regeneratorRuntime.awrap(_this2._getPreviousHash());

	                            case 2:
	                                prevHash = _context2.sent;
	                                _context2.next = 5;
	                                return regeneratorRuntime.awrap(_this2._client.removeKey(prevHash, keyId));

	                            case 5:
	                                return _context2.abrupt("return");

	                            case 6:
	                            case "end":
	                                return _context2.stop();
	                        }
	                    }
	                }, null, _this2);
	            });
	        }

	        /**
	         * Adds an username to this member
	         * @param {string} username - username to add
	         * @return {Promise} empty empty promise
	         */

	    }, {
	        key: "addUsername",
	        value: function addUsername(username) {
	            var _this3 = this;

	            return _Util2.default.tryToDo(this.addUsername, function _callee3() {
	                var prevHash;
	                return regeneratorRuntime.async(function _callee3$(_context3) {
	                    while (1) {
	                        switch (_context3.prev = _context3.next) {
	                            case 0:
	                                _context3.next = 2;
	                                return regeneratorRuntime.awrap(_this3._getPreviousHash());

	                            case 2:
	                                prevHash = _context3.sent;
	                                _context3.next = 5;
	                                return regeneratorRuntime.awrap(_this3._client.addUsername(prevHash, username));

	                            case 5:
	                                return _context3.abrupt("return");

	                            case 6:
	                            case "end":
	                                return _context3.stop();
	                        }
	                    }
	                }, null, _this3);
	            });
	        }

	        /**
	         * Removes an username from the memberId
	         * @param {string} username - username to remove
	         * @return {Promise} empty - empty promise
	         */

	    }, {
	        key: "removeUsername",
	        value: function removeUsername(username) {
	            var _this4 = this;

	            return _Util2.default.tryToDo(this.removeUsername, function _callee4() {
	                var prevHash;
	                return regeneratorRuntime.async(function _callee4$(_context4) {
	                    while (1) {
	                        switch (_context4.prev = _context4.next) {
	                            case 0:
	                                _context4.next = 2;
	                                return regeneratorRuntime.awrap(_this4._getPreviousHash());

	                            case 2:
	                                prevHash = _context4.sent;
	                                _context4.next = 5;
	                                return regeneratorRuntime.awrap(_this4._client.removeUsername(prevHash, username));

	                            case 5:
	                                return _context4.abrupt("return");

	                            case 6:
	                            case "end":
	                                return _context4.stop();
	                        }
	                    }
	                }, null, _this4);
	            });
	        }

	        /**
	         * Links bank accounts to the member
	         * @param {string} bankId - bank to link
	         * @param {string} accountLinkPayloads - accountLinkPayload obtained from bank
	         * @return {Promise} accounts - Promise resolving the the Accounts linked
	         */

	    }, {
	        key: "linkAccounts",
	        value: function linkAccounts(bankId, accountLinkPayloads) {
	            var _this5 = this;

	            return _Util2.default.tryToDo(this.linkAccounts, function _callee5() {
	                var res;
	                return regeneratorRuntime.async(function _callee5$(_context5) {
	                    while (1) {
	                        switch (_context5.prev = _context5.next) {
	                            case 0:
	                                _context5.next = 2;
	                                return regeneratorRuntime.awrap(_this5._client.linkAccounts(bankId, accountLinkPayloads));

	                            case 2:
	                                res = _context5.sent;
	                                return _context5.abrupt("return", res.data.accounts.map(function (acc) {
	                                    return new _Account2.default(_this5, acc);
	                                }));

	                            case 4:
	                            case "end":
	                                return _context5.stop();
	                        }
	                    }
	                }, null, _this5);
	            });
	        }

	        /**
	         * Looks up the member's accounts
	         * @return {Promise} accounts - Promise resolving to the accounts
	         */

	    }, {
	        key: "getAccounts",
	        value: function getAccounts() {
	            var _this6 = this;

	            return _Util2.default.tryToDo(this.getAccounts, function _callee6() {
	                var res;
	                return regeneratorRuntime.async(function _callee6$(_context6) {
	                    while (1) {
	                        switch (_context6.prev = _context6.next) {
	                            case 0:
	                                _context6.next = 2;
	                                return regeneratorRuntime.awrap(_this6._client.getAccounts());

	                            case 2:
	                                res = _context6.sent;
	                                return _context6.abrupt("return", res.data.accounts.map(function (acc) {
	                                    return new _Account2.default(_this6, acc);
	                                }));

	                            case 4:
	                            case "end":
	                                return _context6.stop();
	                        }
	                    }
	                }, null, _this6);
	            });
	        }

	        /**
	         * Creates a subscriber to receive notifications of member events, such as step up auth,
	         * new device requests, linking account requests, or transfer notifications
	         * @param {string} target - the notification target for this device. (e.g iOS push token)
	         * @param {string} platform - platform of the devices (IOS, ANDROID, WEB, etc)
	         * @return {Promise} subscriber - Subscriber object
	         */

	    }, {
	        key: "subscribeToNotifications",
	        value: function subscribeToNotifications(target) {
	            var _this7 = this;

	            var platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "IOS";

	            return _Util2.default.tryToDo(this.subscribeToNotifications, function _callee7() {
	                var res;
	                return regeneratorRuntime.async(function _callee7$(_context7) {
	                    while (1) {
	                        switch (_context7.prev = _context7.next) {
	                            case 0:
	                                _context7.next = 2;
	                                return regeneratorRuntime.awrap(_this7._client.subscribeToNotifications(target, platform));

	                            case 2:
	                                res = _context7.sent;
	                                return _context7.abrupt("return", new _Subscriber2.default(res.data.subscriber));

	                            case 4:
	                            case "end":
	                                return _context7.stop();
	                        }
	                    }
	                }, null, _this7);
	            });
	        }

	        /**
	         * Gets all subscribers for this member
	         *
	         * @return {Promise} - subscribers
	         */

	    }, {
	        key: "getSubscribers",
	        value: function getSubscribers() {
	            var _this8 = this;

	            return _Util2.default.tryToDo(this.getSubscribers, function _callee8() {
	                var res;
	                return regeneratorRuntime.async(function _callee8$(_context8) {
	                    while (1) {
	                        switch (_context8.prev = _context8.next) {
	                            case 0:
	                                _context8.next = 2;
	                                return regeneratorRuntime.awrap(_this8._client.getSubscribers());

	                            case 2:
	                                res = _context8.sent;
	                                return _context8.abrupt("return", res.data.subscribers.map(function (s) {
	                                    return new _Subscriber2.default(s);
	                                }));

	                            case 4:
	                            case "end":
	                                return _context8.stop();
	                        }
	                    }
	                }, null, _this8);
	            });
	        }

	        /**
	         * Gets a specific subscriber by Id
	         *
	         * @param {string} subscriberId - id of the subscriber
	         * @return {Promise} - subscriber
	         */

	    }, {
	        key: "getSubscriber",
	        value: function getSubscriber(subscriberId) {
	            var _this9 = this;

	            return _Util2.default.tryToDo(this.getSubscriber, function _callee9() {
	                var res;
	                return regeneratorRuntime.async(function _callee9$(_context9) {
	                    while (1) {
	                        switch (_context9.prev = _context9.next) {
	                            case 0:
	                                _context9.next = 2;
	                                return regeneratorRuntime.awrap(_this9._client.getSubscriber(subscriberId));

	                            case 2:
	                                res = _context9.sent;
	                                return _context9.abrupt("return", new _Subscriber2.default(res.data.subscriber));

	                            case 4:
	                            case "end":
	                                return _context9.stop();
	                        }
	                    }
	                }, null, _this9);
	            });
	        }

	        /**
	         * Unsubscribes from notifications (removes a subscriber)
	         * @param {string} subscriberId - subscriber to remove
	         * @return {Promise} empty - empty promise
	         */

	    }, {
	        key: "unsubscribeFromNotifications",
	        value: function unsubscribeFromNotifications(subscriberId) {
	            var _this10 = this;

	            return _Util2.default.tryToDo(this.unsubscribeFromNotifications, function _callee10() {
	                return regeneratorRuntime.async(function _callee10$(_context10) {
	                    while (1) {
	                        switch (_context10.prev = _context10.next) {
	                            case 0:
	                                _context10.next = 2;
	                                return regeneratorRuntime.awrap(_this10._client.unsubscribeFromNotifications(subscriberId));

	                            case 2:
	                                return _context10.abrupt("return");

	                            case 3:
	                            case "end":
	                                return _context10.stop();
	                        }
	                    }
	                }, null, _this10);
	            });
	        }

	        /**
	         * Creates an address for this member, and saves it
	         * @param {string} name - name of the address (e.g 'Home')
	         * @param {object} address - address
	         * @return {Promise} empty - empty promise
	         */

	    }, {
	        key: "addAddress",
	        value: function addAddress(name, address) {
	            var _this11 = this;

	            return _Util2.default.tryToDo(this.addAddress, function _callee11() {
	                var res;
	                return regeneratorRuntime.async(function _callee11$(_context11) {
	                    while (1) {
	                        switch (_context11.prev = _context11.next) {
	                            case 0:
	                                _context11.next = 2;
	                                return regeneratorRuntime.awrap(_this11._client.addAddress(name, address));

	                            case 2:
	                                res = _context11.sent;
	                                return _context11.abrupt("return", new _Address2.default(res.data.address));

	                            case 4:
	                            case "end":
	                                return _context11.stop();
	                        }
	                    }
	                }, null, _this11);
	            });
	        }

	        /**
	         * Gets the member's addresse
	         *
	         * @param {string} addressId - the address id
	         * @return {Promise} address - the address
	         */

	    }, {
	        key: "getAddress",
	        value: function getAddress(addressId) {
	            var _this12 = this;

	            return _Util2.default.tryToDo(this.getAddress, function _callee12() {
	                var res;
	                return regeneratorRuntime.async(function _callee12$(_context12) {
	                    while (1) {
	                        switch (_context12.prev = _context12.next) {
	                            case 0:
	                                _context12.next = 2;
	                                return regeneratorRuntime.awrap(_this12._client.getAddress(addressId));

	                            case 2:
	                                res = _context12.sent;
	                                return _context12.abrupt("return", new _Address2.default(res.data.address));

	                            case 4:
	                            case "end":
	                                return _context12.stop();
	                        }
	                    }
	                }, null, _this12);
	            });
	        }

	        /**
	         * Gets the member's addresses
	         * @return {Promise} addresses - Addresses
	         */

	    }, {
	        key: "getAddresses",
	        value: function getAddresses() {
	            var _this13 = this;

	            return _Util2.default.tryToDo(this.getAddresses, function _callee13() {
	                var res;
	                return regeneratorRuntime.async(function _callee13$(_context13) {
	                    while (1) {
	                        switch (_context13.prev = _context13.next) {
	                            case 0:
	                                _context13.next = 2;
	                                return regeneratorRuntime.awrap(_this13._client.getAddresses());

	                            case 2:
	                                res = _context13.sent;
	                                return _context13.abrupt("return", res.data.addresses.map(function (address) {
	                                    return new _Address2.default(address);
	                                }));

	                            case 4:
	                            case "end":
	                                return _context13.stop();
	                        }
	                    }
	                }, null, _this13);
	            });
	        }

	        /**
	         * Gets all of the member's usernames
	         * @return {Promise} usernames - member's usernames
	         */

	    }, {
	        key: "getAllUsernames",
	        value: function getAllUsernames() {
	            var _this14 = this;

	            return _Util2.default.tryToDo(this.getAllUsernames, function _callee14() {
	                var member;
	                return regeneratorRuntime.async(function _callee14$(_context14) {
	                    while (1) {
	                        switch (_context14.prev = _context14.next) {
	                            case 0:
	                                _context14.next = 2;
	                                return regeneratorRuntime.awrap(_this14._getMember());

	                            case 2:
	                                member = _context14.sent;
	                                return _context14.abrupt("return", member.usernames);

	                            case 4:
	                            case "end":
	                                return _context14.stop();
	                        }
	                    }
	                }, null, _this14);
	            });
	        }

	        /**
	         * Creates a new unendorsed access token.
	         *
	         * @param {AccessToken} accessToken - the access token configuration
	         * @return {Promise} token - promise of a created AccessToken
	         */

	    }, {
	        key: "createAccessToken",
	        value: function createAccessToken(accessToken) {
	            var _this15 = this;

	            return _Util2.default.tryToDo(this.createAccessToken, function _callee15() {
	                var res;
	                return regeneratorRuntime.async(function _callee15$(_context15) {
	                    while (1) {
	                        switch (_context15.prev = _context15.next) {
	                            case 0:
	                                _context15.next = 2;
	                                return regeneratorRuntime.awrap(_this15._client.createToken(accessToken.from(_this15).json));

	                            case 2:
	                                res = _context15.sent;
	                                return _context15.abrupt("return", _AccessToken2.default.createFromToken(res.data.token));

	                            case 4:
	                            case "end":
	                                return _context15.stop();
	                        }
	                    }
	                }, null, _this15);
	            });
	        }

	        /**
	         * Cancels the existing token and creates a replacement for it.
	         *
	         * @param {AccessToken} tokenToCancel - the old token to cancel
	         * @param {AccessToken} tokenToCreate - the new token to create
	         * @returns {Promise} operationResult - the result of the operation
	         */

	    }, {
	        key: "replaceAccessToken",
	        value: function replaceAccessToken(tokenToCancel, tokenToCreate) {
	            var _this16 = this;

	            return _Util2.default.tryToDo(this.replaceAccessToken, function _callee16() {
	                var res;
	                return regeneratorRuntime.async(function _callee16$(_context16) {
	                    while (1) {
	                        switch (_context16.prev = _context16.next) {
	                            case 0:
	                                _context16.next = 2;
	                                return regeneratorRuntime.awrap(_this16._client.replaceToken(tokenToCancel, tokenToCreate));

	                            case 2:
	                                res = _context16.sent;
	                                return _context16.abrupt("return", new _TokenOperationResult2.default(res.data.result, _AccessToken2.default.createFromToken(res.data.result.token)));

	                            case 4:
	                            case "end":
	                                return _context16.stop();
	                        }
	                    }
	                }, null, _this16);
	            });
	        }

	        /**
	         * Cancels the existing token, creates a replacement and endorses it.
	         *
	         * @param {AccessToken} tokenToCancel - the old token to cancel
	         * @param {AccessToken} tokenToCreate - the new token to create
	         * @returns {Promise} operationResult - the result of the operation
	         */

	    }, {
	        key: "replaceAndEndorseAccessToken",
	        value: function replaceAndEndorseAccessToken(tokenToCancel, tokenToCreate) {
	            var _this17 = this;

	            return _Util2.default.tryToDo(this.replaceAndEndorseAccessToken, function _callee17() {
	                var res;
	                return regeneratorRuntime.async(function _callee17$(_context17) {
	                    while (1) {
	                        switch (_context17.prev = _context17.next) {
	                            case 0:
	                                _context17.next = 2;
	                                return regeneratorRuntime.awrap(_this17._client.replaceAndEndorseToken(tokenToCancel, tokenToCreate));

	                            case 2:
	                                res = _context17.sent;
	                                return _context17.abrupt("return", new _TokenOperationResult2.default(res.data.result, _AccessToken2.default.createFromToken(res.data.result.token)));

	                            case 4:
	                            case "end":
	                                return _context17.stop();
	                        }
	                    }
	                }, null, _this17);
	            });
	        }

	        /**
	         * Creates an unendorsed Transfer Token
	         *
	         * @param {string} accountId - id of the source account
	         * @param {double} amount - amount limit on the token
	         * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
	         * @param {string} username - username of the redeemer of this token
	         * @param {string} description - optional description for the token
	         * @return {Promise} token - promise of a created TransferToken
	         */

	    }, {
	        key: "createToken",
	        value: function createToken(accountId, amount, currency, username) {
	            var _this18 = this;

	            var description = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

	            var token = _TransferToken2.default.create(this, accountId, amount, currency, username, description);
	            return _Util2.default.tryToDo(this.createToken, function _callee18() {
	                var res;
	                return regeneratorRuntime.async(function _callee18$(_context18) {
	                    while (1) {
	                        switch (_context18.prev = _context18.next) {
	                            case 0:
	                                _context18.next = 2;
	                                return regeneratorRuntime.awrap(_this18._client.createToken(token.json));

	                            case 2:
	                                res = _context18.sent;
	                                return _context18.abrupt("return", _TransferToken2.default.createFromToken(res.data.token));

	                            case 4:
	                            case "end":
	                                return _context18.stop();
	                        }
	                    }
	                }, null, _this18);
	            });
	        }

	        /**
	         * Looks up a token by its Id
	         * @param {string} tokenId - id of the token
	         * @return {Promise} token - TransferToken
	         */

	    }, {
	        key: "getToken",
	        value: function getToken(tokenId) {
	            var _this19 = this;

	            return _Util2.default.tryToDo(this.getToken, function _callee19() {
	                var res;
	                return regeneratorRuntime.async(function _callee19$(_context19) {
	                    while (1) {
	                        switch (_context19.prev = _context19.next) {
	                            case 0:
	                                _context19.next = 2;
	                                return regeneratorRuntime.awrap(_this19._client.getToken(tokenId));

	                            case 2:
	                                res = _context19.sent;

	                                if (!(res.data.token.payload.access !== undefined)) {
	                                    _context19.next = 7;
	                                    break;
	                                }

	                                return _context19.abrupt("return", _AccessToken2.default.createFromToken(res.data.token));

	                            case 7:
	                                return _context19.abrupt("return", _TransferToken2.default.createFromToken(res.data.token));

	                            case 8:
	                            case "end":
	                                return _context19.stop();
	                        }
	                    }
	                }, null, _this19);
	            });
	        }

	        /**
	         * Looks up all transfer tokens (not just for this account)
	         * @param {string} offset - where to start looking
	         * @param {int} limit - how many to look for
	         * @return {TransferToken} tokens - returns a list of Transfer Tokens
	         */

	    }, {
	        key: "getTransferTokens",
	        value: function getTransferTokens(offset, limit) {
	            var _this20 = this;

	            return _Util2.default.tryToDo(this.getTransferTokens, function _callee20() {
	                var res;
	                return regeneratorRuntime.async(function _callee20$(_context20) {
	                    while (1) {
	                        switch (_context20.prev = _context20.next) {
	                            case 0:
	                                _context20.next = 2;
	                                return regeneratorRuntime.awrap(_this20._client.getTokens('TRANSFER', offset, limit));

	                            case 2:
	                                res = _context20.sent;
	                                return _context20.abrupt("return", new _PagedResult2.default(res.data.tokens === undefined ? [] : res.data.tokens.map(function (tk) {
	                                    return _TransferToken2.default.createFromToken(tk);
	                                }), res.data.offset));

	                            case 4:
	                            case "end":
	                                return _context20.stop();
	                        }
	                    }
	                }, null, _this20);
	            });
	        }

	        /**
	         * Looks up all access tokens (not just for this account)
	         * @param {string} offset - where to start looking
	         * @param {int} limit - how many to look for
	         * @return {Promise} AccessTokens - returns a list of Access Tokens
	         */

	    }, {
	        key: "getAccessTokens",
	        value: function getAccessTokens(offset, limit) {
	            var _this21 = this;

	            return _Util2.default.tryToDo(this.getAccessTokens, function _callee21() {
	                var res;
	                return regeneratorRuntime.async(function _callee21$(_context21) {
	                    while (1) {
	                        switch (_context21.prev = _context21.next) {
	                            case 0:
	                                _context21.next = 2;
	                                return regeneratorRuntime.awrap(_this21._client.getTokens('ACCESS', offset, limit));

	                            case 2:
	                                res = _context21.sent;
	                                return _context21.abrupt("return", new _PagedResult2.default(res.data.tokens === undefined ? [] : res.data.tokens.map(function (tk) {
	                                    return _AccessToken2.default.createFromToken(tk);
	                                }), res.data.offset));

	                            case 4:
	                            case "end":
	                                return _context21.stop();
	                        }
	                    }
	                }, null, _this21);
	            });
	        }

	        /**
	         * Endorses a token
	         * @param {Token} token - Transfer token to endorse. Can also be a {string} tokenId
	         * @return {Promise} token - Promise of endorsed transfer token
	         */

	    }, {
	        key: "endorseToken",
	        value: function endorseToken(token) {
	            var _this22 = this;

	            return _Util2.default.tryToDo(this.endorseToken, function _callee22() {
	                var finalToken, endorsed;
	                return regeneratorRuntime.async(function _callee22$(_context22) {
	                    while (1) {
	                        switch (_context22.prev = _context22.next) {
	                            case 0:
	                                _context22.next = 2;
	                                return regeneratorRuntime.awrap(_this22._resolveToken(token));

	                            case 2:
	                                finalToken = _context22.sent;
	                                _context22.next = 5;
	                                return regeneratorRuntime.awrap(_this22._client.endorseToken(finalToken));

	                            case 5:
	                                endorsed = _context22.sent;

	                                if (typeof token !== 'string' && !(token instanceof String)) {
	                                    token.payloadSignatures = endorsed.data.result.token.payloadSignatures;
	                                }
	                                return _context22.abrupt("return", new _TokenOperationResult2.default(endorsed.data.result, token));

	                            case 8:
	                            case "end":
	                                return _context22.stop();
	                        }
	                    }
	                }, null, _this22);
	            });
	        }

	        /**
	         * Cancels a token. (Called by the payer or the redeemer)
	         * @param {Token} token - token to cancel. Can also be a {string} tokenId
	         * @return {Promise} TokenOperationResult.js - cancelled token
	         */

	    }, {
	        key: "cancelToken",
	        value: function cancelToken(token) {
	            var _this23 = this;

	            return _Util2.default.tryToDo(this.cancelToken, function _callee23() {
	                var finalToken, cancelled;
	                return regeneratorRuntime.async(function _callee23$(_context23) {
	                    while (1) {
	                        switch (_context23.prev = _context23.next) {
	                            case 0:
	                                _context23.next = 2;
	                                return regeneratorRuntime.awrap(_this23._resolveToken(token));

	                            case 2:
	                                finalToken = _context23.sent;
	                                _context23.next = 5;
	                                return regeneratorRuntime.awrap(_this23._client.cancelToken(finalToken));

	                            case 5:
	                                cancelled = _context23.sent;

	                                if (typeof token !== 'string' && !(token instanceof String)) {
	                                    token.payloadSignatures = cancelled.data.result.token.payloadSignatures;
	                                }
	                                return _context23.abrupt("return", new _TokenOperationResult2.default(cancelled.data.result, token));

	                            case 8:
	                            case "end":
	                                return _context23.stop();
	                        }
	                    }
	                }, null, _this23);
	            });
	        }

	        /**
	         * Redeems a token. (Called by the payee or redeemer)
	         * @param {BankTransferToken} token - token to redeem. Can also be a {string} tokenId
	         * @param {int} amount - amount to redeemer
	         * @param {string} currency - currency to redeem
	         * @param {string} description - optional transfer description
	         * @param {arr} destinations - transfer destinations
	         * @return {Promise} transfer - Transfer created as a result of this redeem call
	         */

	    }, {
	        key: "createTransfer",
	        value: function createTransfer(token, amount, currency, description) {
	            var _this24 = this;

	            var destinations = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

	            return _Util2.default.tryToDo(this.createTransfer, function _callee24() {
	                var finalToken, res;
	                return regeneratorRuntime.async(function _callee24$(_context24) {
	                    while (1) {
	                        switch (_context24.prev = _context24.next) {
	                            case 0:
	                                _context24.next = 2;
	                                return regeneratorRuntime.awrap(_this24._resolveToken(token));

	                            case 2:
	                                finalToken = _context24.sent;

	                                if (amount === undefined) {
	                                    amount = finalToken.payload.transfer.amount;
	                                }
	                                if (currency === undefined) {
	                                    currency = finalToken.payload.transfer.currency;
	                                }

	                                if (!(_Util2.default.countDecimals(amount) > _constants.maxDecimals)) {
	                                    _context24.next = 7;
	                                    break;
	                                }

	                                throw new Error("Number of decimals in amount should be at most " + _constants.maxDecimals);

	                            case 7:
	                                _context24.next = 9;
	                                return regeneratorRuntime.awrap(_this24._client.createTransfer(finalToken, amount, currency, description, destinations));

	                            case 9:
	                                res = _context24.sent;
	                                return _context24.abrupt("return", new _Transfer2.default(res.data.transfer));

	                            case 11:
	                            case "end":
	                                return _context24.stop();
	                        }
	                    }
	                }, null, _this24);
	            });
	        }

	        /**
	         * Looks up a transfer
	         * @param {string} transferId - id to look up
	         * @return {Transfer} transfer - transfer if found
	         */

	    }, {
	        key: "getTransfer",
	        value: function getTransfer(transferId) {
	            var _this25 = this;

	            return _Util2.default.tryToDo(this.getTransfer, function _callee25() {
	                var res;
	                return regeneratorRuntime.async(function _callee25$(_context25) {
	                    while (1) {
	                        switch (_context25.prev = _context25.next) {
	                            case 0:
	                                _context25.next = 2;
	                                return regeneratorRuntime.awrap(_this25._client.getTransfer(transferId));

	                            case 2:
	                                res = _context25.sent;
	                                return _context25.abrupt("return", new _Transfer2.default(res.data.transfer));

	                            case 4:
	                            case "end":
	                                return _context25.stop();
	                        }
	                    }
	                }, null, _this25);
	            });
	        }

	        /**
	         * Looks up all of the member's transfers
	         * @param {string} tokenId - token to use for lookup
	         * @param {string} offset - where to start looking
	         * @param {int} limit - how many to retrieve
	         * @return {Promise} transfers - Transfers
	         */

	    }, {
	        key: "getTransfers",
	        value: function getTransfers(tokenId, offset, limit) {
	            var _this26 = this;

	            return _Util2.default.tryToDo(this.getTransfers, function _callee26() {
	                var res;
	                return regeneratorRuntime.async(function _callee26$(_context26) {
	                    while (1) {
	                        switch (_context26.prev = _context26.next) {
	                            case 0:
	                                _context26.next = 2;
	                                return regeneratorRuntime.awrap(_this26._client.getTransfers(tokenId, offset, limit));

	                            case 2:
	                                res = _context26.sent;
	                                return _context26.abrupt("return", new _PagedResult2.default(res.data.transfers.map(function (pt) {
	                                    return new _Transfer2.default(pt);
	                                }), res.data.offset));

	                            case 4:
	                            case "end":
	                                return _context26.stop();
	                        }
	                    }
	                }, null, _this26);
	            });
	        }

	        /**
	         * Gets the member's public keys
	         * @return {Promise} keys - keys objects
	         */

	    }, {
	        key: "getPublicKeys",
	        value: function getPublicKeys() {
	            var _this27 = this;

	            return _Util2.default.tryToDo(this.getPublicKeys, function _callee27() {
	                var member;
	                return regeneratorRuntime.async(function _callee27$(_context27) {
	                    while (1) {
	                        switch (_context27.prev = _context27.next) {
	                            case 0:
	                                _context27.next = 2;
	                                return regeneratorRuntime.awrap(_this27._getMember());

	                            case 2:
	                                member = _context27.sent;
	                                return _context27.abrupt("return", member.keys);

	                            case 4:
	                            case "end":
	                                return _context27.stop();
	                        }
	                    }
	                }, null, _this27);
	            });
	        }
	    }, {
	        key: "_getPreviousHash",
	        value: function _getPreviousHash() {
	            var _this28 = this;

	            return _Util2.default.tryToDo(this._getPreviousHash, function _callee28() {
	                var member;
	                return regeneratorRuntime.async(function _callee28$(_context28) {
	                    while (1) {
	                        switch (_context28.prev = _context28.next) {
	                            case 0:
	                                _context28.next = 2;
	                                return regeneratorRuntime.awrap(_this28._getMember());

	                            case 2:
	                                member = _context28.sent;
	                                return _context28.abrupt("return", member.lastHash);

	                            case 4:
	                            case "end":
	                                return _context28.stop();
	                        }
	                    }
	                }, null, _this28);
	            });
	        }
	    }, {
	        key: "_getMember",
	        value: function _getMember() {
	            var _this29 = this;

	            return _Util2.default.tryToDo(this._getMember, function _callee29() {
	                var res;
	                return regeneratorRuntime.async(function _callee29$(_context29) {
	                    while (1) {
	                        switch (_context29.prev = _context29.next) {
	                            case 0:
	                                _context29.next = 2;
	                                return regeneratorRuntime.awrap(_this29._client.getMember());

	                            case 2:
	                                res = _context29.sent;
	                                return _context29.abrupt("return", res.data.member);

	                            case 4:
	                            case "end":
	                                return _context29.stop();
	                        }
	                    }
	                }, null, _this29);
	            });
	        }
	    }, {
	        key: "_resolveToken",
	        value: function _resolveToken(token) {
	            var _this30 = this;

	            return new Promise(function (resolve, reject) {
	                if (typeof token === 'string' || token instanceof String) {
	                    _this30.getToken(token).then(function (lookedUp) {
	                        return resolve(lookedUp);
	                    });
	                } else {
	                    resolve(token);
	                }
	            });
	        }
	    }, {
	        key: "id",
	        get: function get() {
	            return this._id;
	        }

	        /**
	         * Returns the member's key pair
	         * @return {object} keyPair
	         */

	    }, {
	        key: "keys",
	        get: function get() {
	            return this._keys;
	        }
	    }]);

	    return Member;
	}();

	exports.default = Member;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Member = __webpack_require__(9);

	var _Member2 = _interopRequireDefault(_Member);

	var _Crypto = __webpack_require__(3);

	var _Crypto2 = _interopRequireDefault(_Crypto);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LocalStorage = function () {
	    function LocalStorage() {
	        _classCallCheck(this, LocalStorage);
	    }

	    _createClass(LocalStorage, null, [{
	        key: "saveMember",
	        value: function saveMember(member) {
	            if (true) {
	                throw new Error("Browser Only");
	            }
	            var payload = {
	                memberId: member.id,
	                keys: {
	                    publicKey: _Crypto2.default.strKey(member.keys.publicKey),
	                    secretKey: _Crypto2.default.strKey(member.keys.secretKey),
	                    keyId: member.keys.keyId
	                }
	            };
	            window.localStorage.member = JSON.stringify(payload);
	        }
	    }, {
	        key: "loadMember",
	        value: function loadMember(env) {
	            if (true) {
	                throw new Error("Browser Only");
	            }
	            var loaded = JSON.parse(window.localStorage.member);
	            var correctKeys = {
	                publicKey: _Crypto2.default.bufferKey(loaded.keys.publicKey),
	                secretKey: _Crypto2.default.bufferKey(loaded.keys.secretKey),
	                keyId: loaded.keys.keyId
	            };
	            return new _Member2.default(env, loaded.memberId, correctKeys);
	        }
	    }]);

	    return LocalStorage;
	}();

	exports.default = LocalStorage;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _PagedResult = __webpack_require__(12);

	var _PagedResult2 = _interopRequireDefault(_PagedResult);

	var _Transaction = __webpack_require__(13);

	var _Transaction2 = _interopRequireDefault(_Transaction);

	var _Util = __webpack_require__(8);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Account class. Allows the member to make account specific operations, move money, etc
	 */
	var Account = function () {
	    /**
	     * Represents the account
	     * @constructor
	     * @param {Member} member - member that owns this account
	     * @param {object} acc - account json object retrieved from server
	     */
	    function Account(member, acc) {
	        _classCallCheck(this, Account);

	        this._member = member;
	        this._id = acc.id;
	        this._name = acc.name;
	        this._bankId = acc.bankId;
	    }

	    /**
	     * return the member
	     * @return {Member} member - member
	     */


	    _createClass(Account, [{
	        key: "getBalance",


	        /**
	         * Looks up the balance of the account
	         * @return {Promise} balance - Promise of balance object
	         */
	        value: function getBalance() {
	            var _this = this;

	            return _Util2.default.tryToDo(this.getBalance, function _callee() {
	                var res;
	                return regeneratorRuntime.async(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                _context.next = 2;
	                                return regeneratorRuntime.awrap(_this._member._client.getBalance(_this._id));

	                            case 2:
	                                res = _context.sent;
	                                return _context.abrupt("return", res.data);

	                            case 4:
	                            case "end":
	                                return _context.stop();
	                        }
	                    }
	                }, null, _this);
	            });
	        }

	        /**
	         * Looks up a transaction for the account
	         * @param {string} transactionId - which transaction to look up
	         * @return {Promise} transaction - the Transaction
	         */

	    }, {
	        key: "getTransaction",
	        value: function getTransaction(transactionId) {
	            var _this2 = this;

	            return _Util2.default.tryToDo(this.getTransaction, function _callee2() {
	                var res;
	                return regeneratorRuntime.async(function _callee2$(_context2) {
	                    while (1) {
	                        switch (_context2.prev = _context2.next) {
	                            case 0:
	                                _context2.next = 2;
	                                return regeneratorRuntime.awrap(_this2._member._client.getTransaction(_this2._id, transactionId));

	                            case 2:
	                                res = _context2.sent;
	                                return _context2.abrupt("return", new _Transaction2.default(res.data.transaction));

	                            case 4:
	                            case "end":
	                                return _context2.stop();
	                        }
	                    }
	                }, null, _this2);
	            });
	        }

	        /**
	         * Looks up all of the member's transactions
	         * @param {string} offset - where to start looking
	         * @param {int} limit - how many to retrieve
	         * @return {Promise} transactions - Transactions
	         */

	    }, {
	        key: "getTransactions",
	        value: function getTransactions(offset, limit) {
	            var _this3 = this;

	            return _Util2.default.tryToDo(this.getTransactions, function _callee3() {
	                var res;
	                return regeneratorRuntime.async(function _callee3$(_context3) {
	                    while (1) {
	                        switch (_context3.prev = _context3.next) {
	                            case 0:
	                                _context3.next = 2;
	                                return regeneratorRuntime.awrap(_this3._member._client.getTransactions(_this3._id, offset, limit));

	                            case 2:
	                                res = _context3.sent;
	                                return _context3.abrupt("return", new _PagedResult2.default(res.data.transactions.map(function (tr) {
	                                    return new _Transaction2.default(tr);
	                                }), res.data.offset));

	                            case 4:
	                            case "end":
	                                return _context3.stop();
	                        }
	                    }
	                }, null, _this3);
	            });
	        }
	    }, {
	        key: "member",
	        get: function get() {
	            return this._member;
	        }

	        /**
	         * return the account Id
	         * @return {string} accountId - accountId
	         */

	    }, {
	        key: "id",
	        get: function get() {
	            return this._id;
	        }

	        /**
	         * return the name of the account
	         * @return {string} accountName - name
	         */

	    }, {
	        key: "name",
	        get: function get() {
	            return this._name;
	        }

	        /**
	         * return bank Id
	         * @returns {string} bankId - bank id
	         */

	    }, {
	        key: "bankId",
	        get: function get() {
	            return this._bankId;
	        }
	    }]);

	    return Account;
	}();

	exports.default = Account;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PagedResult = function () {
	  function PagedResult(data, offset) {
	    _classCallCheck(this, PagedResult);

	    this._data = data;
	    this._offset = offset;
	  }

	  _createClass(PagedResult, [{
	    key: "data",
	    get: function get() {
	      return this._data;
	    }
	  }, {
	    key: "offset",
	    get: function get() {
	      return this._offset;
	    }
	  }]);

	  return PagedResult;
	}();

	exports.default = PagedResult;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Transaction = function () {
	    function Transaction(transactionObj) {
	        _classCallCheck(this, Transaction);

	        this._id = transactionObj.id;
	        this._type = transactionObj.type;
	        this._currency = transactionObj.amount.currency;
	        this._amount = parseFloat(transactionObj.amount.value);
	        this._description = transactionObj.description;
	        this._tokenId = transactionObj.tokenId;
	        this._tokenTransferId = transactionObj.tokenTransferId;
	    }

	    _createClass(Transaction, [{
	        key: "id",
	        get: function get() {
	            return this._id;
	        }
	    }, {
	        key: "type",
	        get: function get() {
	            return this._type;
	        }
	    }, {
	        key: "amount",
	        get: function get() {
	            return this._amount;
	        }
	    }, {
	        key: "currency",
	        get: function get() {
	            return this._currency;
	        }
	    }, {
	        key: "description",
	        get: function get() {
	            return this._description;
	        }
	    }, {
	        key: "tokenId",
	        get: function get() {
	            return this._tokenId;
	        }
	    }, {
	        key: "tokenTransferId",
	        get: function get() {
	            return this._tokenTransferId;
	        }
	    }]);

	    return Transaction;
	}();

	exports.default = Transaction;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Subscriber = function () {
	    function Subscriber(subscriberObj) {
	        _classCallCheck(this, Subscriber);

	        this._id = subscriberObj.id;
	        this._target = subscriberObj.target;
	        this._platform = subscriberObj.platform;
	    }

	    _createClass(Subscriber, [{
	        key: "id",
	        get: function get() {
	            return this._id;
	        }
	    }, {
	        key: "target",
	        get: function get() {
	            return this._target;
	        }
	    }, {
	        key: "platform",
	        get: function get() {
	            return this._platform;
	        }
	    }]);

	    return Subscriber;
	}();

	exports.default = Subscriber;

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Address = function () {
	    function Address(addressObj) {
	        _classCallCheck(this, Address);

	        this._id = addressObj.id;
	        this._name = addressObj.name;
	        this._address = addressObj.address;
	        this._addressSignature = addressObj.addressSignature;
	    }

	    _createClass(Address, [{
	        key: "id",
	        get: function get() {
	            return this._id;
	        }
	    }, {
	        key: "name",
	        get: function get() {
	            return this._name;
	        }
	    }, {
	        key: "address",
	        get: function get() {
	            return this._address;
	        }
	    }, {
	        key: "addressSignature",
	        get: function get() {
	            return this._addressSignature;
	        }
	    }]);

	    return Address;
	}();

	exports.default = Address;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    PRIVILEGED: 'PRIVILEGED',
	    STANDARD: 'STANDARD',
	    LOW: 'LOW'
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Crypto = __webpack_require__(3);

	var _Crypto2 = _interopRequireDefault(_Crypto);

	var _Util = __webpack_require__(8);

	var _Util2 = _interopRequireDefault(_Util);

	var _AuthHeader = __webpack_require__(18);

	var _AuthHeader2 = _interopRequireDefault(_AuthHeader);

	var _AuthContext = __webpack_require__(20);

	var _AuthContext2 = _interopRequireDefault(_AuthContext);

	var _constants = __webpack_require__(19);

	var _KeyLevel = __webpack_require__(16);

	var _KeyLevel2 = _interopRequireDefault(_KeyLevel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var stringify = __webpack_require__(7);
	var axios = __webpack_require__(21);

	/**
	 * Authenticated client for making requests to the Token gateway
	 */

	var AuthHttpClient = function () {
	    function AuthHttpClient(env, memberId, keys) {
	        _classCallCheck(this, AuthHttpClient);

	        this._instance = axios.create({
	            baseURL: _constants.urls[env]
	        });
	        this._memberId = memberId;
	        this._keys = keys;
	        this._context = new _AuthContext2.default();
	        this._authHeader = new _AuthHeader2.default(_constants.urls[env], keys);
	        this._resetInterceptor();
	    }

	    _createClass(AuthHttpClient, [{
	        key: "_resetInterceptor",
	        value: function _resetInterceptor() {
	            var _this = this;

	            this._instance.interceptors.request.eject(this._interceptor);

	            this._interceptor = this._instance.interceptors.request.use(function (config) {
	                _this._authHeader.addAuthorizationHeaderMemberId(_this._memberId, config, _this._context);
	                return config;
	            });
	        }
	    }, {
	        key: "useAccessToken",
	        value: function useAccessToken(accessTokenId) {
	            this._context.onBehalfOf = accessTokenId;
	            this._resetInterceptor();
	        }
	    }, {
	        key: "clearAccessToken",
	        value: function clearAccessToken() {
	            this._context.onBehalfOf = undefined;
	            this._resetInterceptor();
	        }
	    }, {
	        key: "subscribeToNotifications",
	        value: function subscribeToNotifications(target, platform) {
	            var req = {
	                target: target,
	                platform: platform
	            };
	            var config = {
	                method: 'post',
	                url: "/subscribers",
	                data: req
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getSubscribers",
	        value: function getSubscribers() {
	            var config = {
	                method: 'get',
	                url: "/subscribers"
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getSubscriber",
	        value: function getSubscriber(subscriberId) {
	            var config = {
	                method: 'get',
	                url: "/subscribers/" + subscriberId
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "unsubscribeFromNotifications",
	        value: function unsubscribeFromNotifications(subscriberId) {
	            var config = {
	                method: 'delete',
	                url: "/subscribers/" + subscriberId
	            };
	            return this._instance(config);
	        }

	        //
	        // ADDRESSES
	        //

	    }, {
	        key: "addAddress",
	        value: function addAddress(name, address) {
	            var req = {
	                name: name,
	                address: address,
	                addressSignature: {
	                    memberId: this._memberId,
	                    keyId: this._keys.keyId,
	                    signature: _Crypto2.default.signJson(address, this._keys)
	                }
	            };
	            var config = {
	                method: 'post',
	                url: "/addresses",
	                data: req
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getAddress",
	        value: function getAddress(addressId) {
	            var config = {
	                method: 'get',
	                url: "/addresses/" + addressId
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getAddresses",
	        value: function getAddresses() {
	            var config = {
	                method: 'get',
	                url: "/addresses"
	            };
	            return this._instance(config);
	        }

	        //
	        // ACCOUNTS
	        //

	    }, {
	        key: "linkAccounts",
	        value: function linkAccounts(bankId, accountLinkPayloads) {
	            var req = {
	                bankId: bankId,
	                accountLinkPayloads: accountLinkPayloads
	            };
	            var config = {
	                method: 'post',
	                url: "/accounts",
	                data: req
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getAccounts",
	        value: function getAccounts() {
	            var config = {
	                method: 'get',
	                url: "/accounts"
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "setAccountName",
	        value: function setAccountName(accountId, name) {
	            var config = {
	                method: 'patch',
	                url: "/accounts/" + accountId + "?name=" + name
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getBalance",
	        value: function getBalance(accountId) {
	            var config = {
	                method: 'get',
	                url: "/accounts/" + accountId + "/balance"
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getTransaction",
	        value: function getTransaction(accountId, transactionId) {
	            var config = {
	                method: 'get',
	                url: "/accounts/" + accountId + "/transactions/" + transactionId
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getTransactions",
	        value: function getTransactions(accountId, offset, limit) {
	            var config = {
	                method: 'get',
	                url: "/accounts/" + accountId + "/transactions?offset=" + offset + "&limit=" + limit
	            };
	            return this._instance(config);
	        }

	        //
	        // Tokens
	        //

	    }, {
	        key: "createToken",
	        value: function createToken(payload) {
	            var config = {
	                method: 'post',
	                url: "/tokens",
	                data: {
	                    payload: payload
	                }
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "replaceToken",
	        value: function replaceToken(tokenToCancel, tokenToCreate) {
	            var cancelTokenId = tokenToCancel.id;
	            var cancelReq = this._tokenOperationRequest(tokenToCancel, 'cancelled');

	            var createReq = {
	                payload: tokenToCreate.json
	            };

	            var config = {
	                method: 'post',
	                url: "/tokens/" + cancelTokenId + "/replace",
	                data: {
	                    cancel_token: cancelReq,
	                    create_token: createReq
	                }
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "replaceAndEndorseToken",
	        value: function replaceAndEndorseToken(tokenToCancel, tokenToCreate) {
	            var cancelTokenId = tokenToCancel.id;
	            var cancelReq = this._tokenOperationRequest(tokenToCancel, 'cancelled');

	            var createReq = {
	                payload: tokenToCreate.json,
	                payload_signature: this._tokenOperationSignature(tokenToCreate, 'endorsed')
	            };

	            var config = {
	                method: 'post',
	                url: "/tokens/" + cancelTokenId + "/replace",
	                data: {
	                    cancel_token: cancelReq,
	                    create_token: createReq
	                }
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "endorseToken",
	        value: function endorseToken(token) {
	            return this._tokenOperation(token, 'endorse', 'endorsed');
	        }
	    }, {
	        key: "cancelToken",
	        value: function cancelToken(transferToken) {
	            return this._tokenOperation(transferToken, 'cancel', 'cancelled');
	        }
	    }, {
	        key: "createTransfer",
	        value: function createTransfer(transferToken, amount, currency, description, destinations) {
	            var payload = {
	                nonce: _Util2.default.generateNonce(),
	                tokenId: transferToken.id,
	                amount: {
	                    value: amount.toString(),
	                    currency: currency
	                }
	            };

	            if (description) {
	                payload.description = description;
	            }

	            if (destinations !== undefined && destinations.length > 0) {
	                payload.destinations = destinations;
	            }

	            var req = {
	                payload: payload,
	                payloadSignature: {
	                    memberId: this._memberId,
	                    keyId: this._keys.keyId,
	                    signature: _Crypto2.default.signJson(payload, this._keys)
	                }
	            };
	            var config = {
	                method: 'post',
	                url: "/transfers",
	                data: req
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getToken",
	        value: function getToken(tokenId) {
	            var config = {
	                method: 'get',
	                url: "/tokens/" + tokenId
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getTokens",
	        value: function getTokens(type, offset, limit) {
	            var config = {
	                method: 'get',
	                url: "/tokens?type=" + type + "&offset=" + offset + "&limit=" + limit
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "_tokenOperation",
	        value: function _tokenOperation(token, operation, suffix) {
	            var tokenId = token.id;
	            var config = {
	                method: 'put',
	                url: "/tokens/" + tokenId + "/" + operation,
	                data: this._tokenOperationRequest(token, suffix)
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "_tokenOperationRequest",
	        value: function _tokenOperationRequest(token, suffix) {
	            return {
	                tokenId: token.id,
	                signature: this._tokenOperationSignature(token, suffix)
	            };
	        }
	    }, {
	        key: "_tokenOperationSignature",
	        value: function _tokenOperationSignature(token, suffix) {
	            var payload = stringify(token.json) + ("." + suffix);
	            return {
	                memberId: this._memberId,
	                keyId: this._keys.keyId,
	                signature: _Crypto2.default.sign(payload, this._keys)
	            };
	        }

	        //
	        // Transfers
	        //

	    }, {
	        key: "getTransfer",
	        value: function getTransfer(transferId) {
	            var config = {
	                method: 'get',
	                url: "/transfers/" + transferId
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "getTransfers",
	        value: function getTransfers(tokenId, offset, limit) {
	            var config = {
	                method: 'get',
	                url: "/transfers?tokenId=" + tokenId + "&offset=" + offset + "&limit=" + limit
	            };
	            return this._instance(config);
	        }

	        //
	        // Directory
	        //

	    }, {
	        key: "getMember",
	        value: function getMember() {
	            var config = {
	                method: 'get',
	                url: "/members"
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "addKey",
	        value: function addKey(prevHash, publicKey, keyLevel) {
	            var update = {
	                memberId: this._memberId,
	                addKey: {
	                    publicKey: _Crypto2.default.strKey(publicKey)
	                }
	            };

	            // Do this because default this._keys are invisible in protos
	            if (keyLevel !== _KeyLevel2.default.PRIVILEGED) {
	                update.addKey.level = keyLevel;
	            }

	            return this._memberUpdate(update, prevHash);
	        }
	    }, {
	        key: "removeKey",
	        value: function removeKey(prevHash, keyId) {
	            var update = {
	                memberId: this._memberId,
	                removeKey: {
	                    keyId: keyId
	                }
	            };
	            return this._memberUpdate(update, prevHash);
	        }
	    }, {
	        key: "addUsername",
	        value: function addUsername(prevHash, username) {
	            var update = {
	                memberId: this._memberId,
	                addUsername: {
	                    username: username
	                }
	            };
	            return this._memberUpdate(update, prevHash);
	        }
	    }, {
	        key: "removeUsername",
	        value: function removeUsername(prevHash, username) {
	            var update = {
	                memberId: this._memberId,
	                removeUsername: {
	                    username: username
	                }
	            };
	            return this._memberUpdate(update, prevHash);
	        }
	    }, {
	        key: "_memberUpdate",
	        value: function _memberUpdate(update, prevHash) {
	            if (prevHash !== '') {
	                update.prevHash = prevHash;
	            }

	            var req = {
	                update: update,
	                updateSignature: {
	                    memberId: this._memberId,
	                    keyId: this._keys.keyId,
	                    signature: _Crypto2.default.signJson(update, this._keys)
	                }
	            };
	            var config = {
	                method: 'post',
	                url: "/members/" + this._memberId + "/updates",
	                data: req
	            };
	            return this._instance(config);
	        }
	    }]);

	    return AuthHttpClient;
	}();

	exports.default = AuthHttpClient;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constants = __webpack_require__(19);

	var _Crypto = __webpack_require__(3);

	var _Crypto2 = _interopRequireDefault(_Crypto);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var stringify = __webpack_require__(7);

	var AuthHeader = function () {
	    function AuthHeader(baseUrl, keys) {
	        _classCallCheck(this, AuthHeader);

	        this._baseUrl = baseUrl;
	        this._keys = keys;
	    }
	    /*
	     * Adds an authorization header with the identity set as the memberId. This is preferrable
	     * to username identity, because it reduces trust required (no username lookup)
	     */


	    _createClass(AuthHeader, [{
	        key: "addAuthorizationHeaderMemberId",
	        value: function addAuthorizationHeaderMemberId(memberId, config, context) {
	            var identity = 'member-id=' + memberId;
	            this.addAuthorizationHeader(identity, config, context);
	        }

	        /*
	         * Adds an authorization header with identity set as the username. Useful when
	         * on a browser that doesn't yet have a memberId
	         */

	    }, {
	        key: "addAuthorizationHeaderUsername",
	        value: function addAuthorizationHeaderUsername(username, config, context) {
	            var identity = 'username=' + username;
	            this.addAuthorizationHeader(identity, config, context);
	        }

	        /*
	         * Adds an authorization header to an HTTP request. The header is built
	         * using the request info and the keys. The config is the axios request configuration,
	         * right before it is sent to the server
	         */

	    }, {
	        key: "addAuthorizationHeader",
	        value: function addAuthorizationHeader(identity, config, context) {
	            // Parses out the base uri
	            var uriPath = config.url.replace(this._baseUrl, '');

	            // Makes sure the uri is formatted correctly
	            uriPath = uriPath.substring(0, 1) === '/' ? uriPath : uriPath + '/';
	            uriPath = uriPath.substring(uriPath.length - 1) === '/' ? uriPath.substring(0, uriPath.length - 1) : uriPath;

	            // Path should not include query parameters
	            if (uriPath.indexOf("?") >= 0) {
	                uriPath = uriPath.substring(0, uriPath.indexOf("?"));
	            }

	            // Creates the payload from the config info
	            var payload = {
	                method: config.method.toUpperCase(),
	                uriHost: this._baseUrl.replace('http://', '').replace('https://', ''),
	                uriPath: uriPath
	            };

	            if (config.data !== undefined && config.data !== '') {
	                payload.requestBody = stringify(config.data);
	            }

	            // Signs the query string as well, if it exists
	            if (config.url.indexOf("?") !== -1) {
	                payload.queryString = config.url.substring(config.url.indexOf("?") + 1);
	            }

	            // Signs the Json string
	            var signature = _Crypto2.default.signJson(payload, this._keys);

	            // Creates the authorization header, ands adds it to the request
	            var header = _constants.signatureScheme + ' ' + identity + ',' + 'key-id=' + this._keys.keyId + ',' + 'signature=' + signature + AuthHeader._onBehalfOfHeader(context);

	            config.headers = {
	                Authorization: header
	            };
	        }
	    }], [{
	        key: "_onBehalfOfHeader",
	        value: function _onBehalfOfHeader(context) {
	            if (context !== undefined && context.onBehalfOf !== undefined && context.onBehalfOf !== '') {
	                return ',on-behalf-of=' + context.onBehalfOf;
	            }
	            return '';
	        }
	    }]);

	    return AuthHeader;
	}();

	exports.default = AuthHeader;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// Signature scheme to use
	var signatureScheme = 'Token-Ed25519-SHA512';

	// Hosts of the gateway
	var urls = {
	    local: 'http://localhost:8000',
	    dev: 'http://dev.api.token.io',
	    stg: 'http://stg.api.token.io',
	    prd: 'http://prd.api.token.io'
	};

	// Scheme for transfer tokens
	var transferTokenVersion = '1.0';

	// Scheme for transfer tokens
	var accessTokenVersion = '1.0';

	// Default currency to use
	var defaultCurrency = 'EUR';

	// Max number of decimal points to accept for amounts
	var maxDecimals = 4;

	exports.signatureScheme = signatureScheme;
	exports.urls = urls;
	exports.transferTokenVersion = transferTokenVersion;
	exports.accessTokenVersion = accessTokenVersion;
	exports.defaultCurrency = defaultCurrency;
	exports.maxDecimals = maxDecimals;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AuthContext = function () {
	    function AuthContext() {
	        _classCallCheck(this, AuthContext);

	        this._onBehalfOf = undefined;
	    }

	    _createClass(AuthContext, [{
	        key: "onBehalfOf",
	        set: function set(onBehalfOf) {
	            this._onBehalfOf = onBehalfOf;
	        },
	        get: function get() {
	            return this._onBehalfOf;
	        }
	    }]);

	    return AuthContext;
	}();

	exports.default = AuthContext;

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("axios");

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TokenOperationResult = function () {
	    function TokenOperationResult(resultObj, newToken) {
	        _classCallCheck(this, TokenOperationResult);

	        this._status = resultObj.status;
	        this._token = newToken;
	    }

	    _createClass(TokenOperationResult, [{
	        key: 'status',
	        get: function get() {
	            return this._status;
	        }
	    }, {
	        key: 'token',
	        get: function get() {
	            return this._token;
	        }
	    }], [{
	        key: 'Status',
	        get: function get() {
	            return {
	                INVALID: 'INVALID',
	                SUCCESS: 'SUCCESS',
	                MORE_SIGNATURES_NEEDED: 'MORE_SIGNATURES_NEEDED'
	            };
	        }
	    }]);

	    return TokenOperationResult;
	}();

	exports.default = TokenOperationResult;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Util = __webpack_require__(8);

	var _Util2 = _interopRequireDefault(_Util);

	var _constants = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BankTransferToken = function () {
	    _createClass(BankTransferToken, null, [{
	        key: "createFromToken",
	        value: function createFromToken(token) {
	            var id = token.id;
	            var from = token.payload.from;
	            var instructions = token.payload.transfer.instructions;
	            var amount = parseFloat(token.payload.transfer.amount);
	            var currency = token.payload.transfer.currency;
	            var redeemer = token.payload.transfer.redeemer;
	            var description = token.payload.description;
	            var version = token.payload.version;
	            var issuer = token.payload.issuer;
	            var nonce = token.payload.nonce;
	            var payloadSignatures = token.payloadSignatures;
	            return new BankTransferToken(id, from, instructions, amount, currency, redeemer, description, version, issuer, nonce, payloadSignatures);
	        }
	    }, {
	        key: "create",
	        value: function create(member, accountId, amount, currency, username, description) {
	            var from = {
	                id: member.id
	            };
	            var redeemer = {
	                username: username
	            };
	            var instructions = {
	                source: {
	                    accountId: accountId
	                }
	            };
	            return new BankTransferToken(undefined, from, instructions, amount, currency, redeemer, description);
	        }
	    }]);

	    function BankTransferToken(id, from, instructions, amount, currency, redeemer, description) {
	        var version = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : _constants.transferTokenVersion;
	        var issuer = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : undefined;
	        var nonce = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : undefined;
	        var payloadSignatures = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : [];

	        _classCallCheck(this, BankTransferToken);

	        if (_Util2.default.countDecimals(amount) > _constants.maxDecimals) {
	            throw new Error("Number of decimals in amount should be at most " + _constants.maxDecimals);
	        }
	        this._id = id;
	        this._from = from;
	        this._instructions = instructions;
	        this._amount = amount;
	        this._currency = currency;
	        this._redeemer = redeemer;
	        this._description = description;
	        this._version = version;
	        this._issuer = issuer;
	        this._nonce = nonce;
	        this._payloadSignatures = payloadSignatures;
	        if (nonce === undefined) {
	            this._nonce = _Util2.default.generateNonce();
	        }
	    }

	    _createClass(BankTransferToken, [{
	        key: "payloadSignatures",
	        set: function set(sigs) {
	            this._payloadSignatures = [];
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = sigs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var sig = _step.value;

	                    this._payloadSignatures.push(sig);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        },
	        get: function get() {
	            return this._payloadSignatures;
	        }

	        // Creates a standardized json object for the TransferToken, to be used for signing

	    }, {
	        key: "id",
	        get: function get() {
	            return this._id;
	        }
	    }, {
	        key: "from",
	        get: function get() {
	            return this._from;
	        }
	    }, {
	        key: "amount",
	        get: function get() {
	            return this._amount;
	        }
	    }, {
	        key: "currency",
	        get: function get() {
	            return this._currency;
	        }
	    }, {
	        key: "redeemer",
	        get: function get() {
	            return this._redeemer;
	        }
	    }, {
	        key: "description",
	        get: function get() {
	            return this._description;
	        }
	    }, {
	        key: "version",
	        get: function get() {
	            return this._version;
	        }
	    }, {
	        key: "issuer",
	        get: function get() {
	            return this._issuer;
	        }
	    }, {
	        key: "nonce",
	        get: function get() {
	            return this._nonce;
	        }
	    }, {
	        key: "json",
	        get: function get() {
	            var json = {
	                version: this._version,
	                nonce: this._nonce,
	                from: this._from,
	                transfer: {
	                    currency: this._currency,
	                    amount: this._amount.toString(),
	                    instructions: this._instructions
	                }
	            };
	            if (this._redeemer !== undefined) {
	                json.transfer.redeemer = this._redeemer;
	            }
	            if (this._description !== '') {
	                json.description = this._description;
	            }
	            if (this._issuer !== undefined) {
	                json.issuer = this._issuer;
	            }
	            return json;
	        }
	    }]);

	    return BankTransferToken;
	}();

	exports.default = BankTransferToken;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Util = __webpack_require__(8);

	var _Util2 = _interopRequireDefault(_Util);

	var _constants = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AccessToken = function () {
	    _createClass(AccessToken, null, [{
	        key: "grantTo",

	        /**
	         * Creates an instance of AccessToken and sets the "to" field on the payload.
	         *
	         * @param {string} redeemerUsername - redeemer username
	         * @returns {AccessToken} - the access token created
	         */
	        value: function grantTo(redeemerUsername) {
	            return new AccessToken({ username: redeemerUsername });
	        }

	        /**
	         * Creates an instance of AccessToken from a given token.
	         *
	         * @param {Token} token - token to populate from
	         * @returns {AccessToken} - the access token created
	         */

	    }, {
	        key: "createFromToken",
	        value: function createFromToken(token) {
	            return new AccessToken(token.payload.to, token.payload.from, token.payload.access.resources, token.id, token.payload.version, token.payload.nonce, token.payload.issuer, token.payloadSignatures);
	        }

	        /**
	         * Creates a new AccessToken from existing AccessToken by copying fields
	         * only relevant to the new token.
	         *
	         * @param {AccessToken} accessToken - existing access token to copy some fields from.
	         * @returns {AccessToken} - new access token initialized from the old one.
	         */

	    }, {
	        key: "createFromAccessToken",
	        value: function createFromAccessToken(accessToken) {
	            return new AccessToken(accessToken.toMember, accessToken.fromMember, [], undefined, _constants.accessTokenVersion, undefined, accessToken.issuer, []);
	        }
	    }]);

	    function AccessToken(to) {
	        var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	        var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	        var id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
	        var version = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _constants.accessTokenVersion;
	        var nonce = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
	        var issuer = arguments[6];
	        var payloadSignatures = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [];

	        _classCallCheck(this, AccessToken);

	        this._to = to;
	        this._from = from;
	        this._resources = resources;
	        this._id = id;
	        this._version = version;
	        this._nonce = nonce;
	        this._issuer = issuer;
	        this._payloadSignatures = payloadSignatures;

	        if (nonce === undefined) {
	            this._nonce = _Util2.default.generateNonce();
	        }
	    }

	    /**
	     * Grants access to all addresses.
	     *
	     * @returns {AccessToken} - the access token
	     */


	    _createClass(AccessToken, [{
	        key: "forAllAddresses",
	        value: function forAllAddresses() {
	            var resource = {
	                allAddresses: {}
	            };

	            this._resources.push(resource);
	            return this;
	        }

	        /**
	         * Grants access to a given address.
	         *
	         * @param {string} addressId - address to grant access to
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "forAddress",
	        value: function forAddress(addressId) {
	            var resource = {
	                address: {
	                    addressId: addressId
	                }
	            };

	            this._resources.push(resource);
	            return this;
	        }

	        /**
	         * Grants access to all accounts.
	         *
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "forAllAccounts",
	        value: function forAllAccounts() {
	            var resource = {
	                allAccounts: {}
	            };

	            this._resources.push(resource);
	            return this;
	        }

	        /**
	         * Grants access to a given account.
	         *
	         * @param {string} accountId - account to grant access to
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "forAccount",
	        value: function forAccount(accountId) {
	            var resource = {
	                account: {
	                    accountId: accountId
	                }
	            };

	            this._resources.push(resource);
	            return this;
	        }

	        /**
	         * Grants access to all transactions.
	         *
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "forAllTransactions",
	        value: function forAllTransactions() {
	            var resource = {
	                allTransactions: {}
	            };

	            this._resources.push(resource);
	            return this;
	        }

	        /**
	         * Grants access to a given account transactions.
	         *
	         * @param {string} accountId - account to grant access to transactions
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "forAccountTransactions",
	        value: function forAccountTransactions(accountId) {
	            var resource = {
	                transactions: {
	                    accountId: accountId
	                }
	            };

	            this._resources.push(resource);
	            return this;
	        }

	        /**
	         * Grants access to all balances.
	         *
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "forAllBalances",
	        value: function forAllBalances() {
	            var resource = {
	                allBalances: {}
	            };

	            this._resources.push(resource);
	            return this;
	        }

	        /**
	         * Grants access to a given account balances.
	         *
	         * @param {string} accountId - account to grant access to balances
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "forAccountBalances",
	        value: function forAccountBalances(accountId) {
	            var resource = {
	                balance: {
	                    accountId: accountId
	                }
	            };

	            this._resources.push(resource);
	            return this;
	        }

	        /**
	         * Grants access to ALL resources (aka wildcard permissions).
	         *
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "forAll",
	        value: function forAll() {
	            return this.forAllAddresses().forAllAccounts().forAllBalances().forAllTransactions();
	        }

	        /**
	         * Sets "from" field on a payload.
	         *
	         * @param {Member} member - member granting access
	         * @returns {AccessToken} - the access token
	         */

	    }, {
	        key: "from",
	        value: function from(member) {
	            this._from = { id: member.id };
	            return this;
	        }
	    }, {
	        key: "payloadSignatures",
	        set: function set(sigs) {
	            this._payloadSignatures = [];
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = sigs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var sig = _step.value;

	                    this._payloadSignatures.push(sig);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }

	        /**
	         * Creates a standardized json object for the AccessToken payload, to be used for signing
	         *
	         * @returns json representation of the TokenPayload
	         */
	        ,
	        get: function get() {
	            return this._payloadSignatures;
	        }
	    }, {
	        key: "json",
	        get: function get() {
	            return {
	                version: this._version,
	                nonce: this._nonce,
	                from: this._from,
	                to: this._to,
	                issuer: this._issuer,
	                access: {
	                    resources: this._resources
	                }
	            };
	        }
	    }, {
	        key: "id",
	        get: function get() {
	            return this._id;
	        }
	    }, {
	        key: "version",
	        get: function get() {
	            return this._version;
	        }
	    }, {
	        key: "nonce",
	        get: function get() {
	            return this._nonce;
	        }
	    }, {
	        key: "fromMember",
	        get: function get() {
	            return this._from;
	        }
	    }, {
	        key: "toMember",
	        get: function get() {
	            return this._to;
	        }
	    }, {
	        key: "issuer",
	        get: function get() {
	            return this._issuer;
	        }
	    }, {
	        key: "resources",
	        get: function get() {
	            return this._resources;
	        }
	    }]);

	    return AccessToken;
	}();

	exports.default = AccessToken;

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Transfer = function () {
	    function Transfer(transferObj) {
	        _classCallCheck(this, Transfer);

	        this._id = transferObj.id;
	        this._referenceId = transferObj.referenceId;
	        this._payload = JSON.parse(JSON.stringify(transferObj.payload));
	        this._payloadSignatures = JSON.parse(JSON.stringify(transferObj.payloadSignatures));
	        this._description = transferObj.description;
	    }

	    _createClass(Transfer, [{
	        key: "id",
	        get: function get() {
	            return this._id;
	        }
	    }, {
	        key: "referenceId",
	        get: function get() {
	            return this._referenceId;
	        }
	    }, {
	        key: "payload",
	        get: function get() {
	            return this._payload;
	        }
	    }, {
	        key: "amount",
	        get: function get() {
	            return this._payload.amount.value;
	        }
	    }, {
	        key: "currency",
	        get: function get() {
	            return this._payload.amount.currency;
	        }
	    }, {
	        key: "instructions",
	        get: function get() {
	            return this._payload.instructions;
	        }
	    }, {
	        key: "payloadSignatures",
	        get: function get() {
	            return this._payloadSignatures;
	        }
	    }, {
	        key: "description",
	        get: function get() {
	            return this._description;
	        }
	    }]);

	    return Transfer;
	}();

	exports.default = Transfer;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Crypto = __webpack_require__(3);

	var _Crypto2 = _interopRequireDefault(_Crypto);

	var _KeyLevel = __webpack_require__(16);

	var _KeyLevel2 = _interopRequireDefault(_KeyLevel);

	var _constants = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var axios = __webpack_require__(21);

	var HttpClient = function () {
	    function HttpClient(env) {
	        _classCallCheck(this, HttpClient);

	        this._instance = axios.create({
	            baseURL: _constants.urls[env]
	        });
	    }

	    _createClass(HttpClient, [{
	        key: "createMemberId",
	        value: function createMemberId() {
	            var config = {
	                method: 'post',
	                url: '/members'
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "usernameExists",
	        value: function usernameExists(username) {
	            var config = {
	                method: 'get',
	                url: "/username-exists?username=" + username
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "notify",
	        value: function notify(username, notification) {
	            var req = {
	                username: username,
	                notification: notification
	            };
	            var config = {
	                method: 'post',
	                url: "/notify",
	                data: req
	            };
	            return this._instance(config);
	        }
	    }, {
	        key: "addFirstKey",
	        value: function addFirstKey(keys, memberId) {
	            var keyLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _KeyLevel2.default.PRIVILEGED;

	            var update = {
	                memberId: memberId,
	                addKey: {
	                    publicKey: _Crypto2.default.strKey(keys.publicKey)
	                }
	            };

	            if (keyLevel !== _KeyLevel2.default.PRIVILEGED) {
	                update.addKey.level = keyLevel;
	            }

	            var req = {
	                update: update,
	                updateSignature: {
	                    memberId: memberId,
	                    keyId: keys.keyId,
	                    signature: _Crypto2.default.signJson(update, keys)
	                }
	            };
	            var config = {
	                method: 'post',
	                url: "/members/" + memberId + "/updates",
	                data: req
	            };
	            return this._instance(config);
	        }
	    }]);

	    return HttpClient;
	}();

	exports.default = HttpClient;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _AuthHeader = __webpack_require__(18);

	var _AuthHeader2 = _interopRequireDefault(_AuthHeader);

	var _constants = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var stringify = __webpack_require__(7);
	var axios = __webpack_require__(21);

	/**
	 * Authenticated client for making requests to the Token gateway
	 */

	var AuthHttpClientUsername = function () {
	    function AuthHttpClientUsername(env, username, keys) {
	        _classCallCheck(this, AuthHttpClientUsername);

	        this._instance = axios.create({
	            baseURL: _constants.urls[env]
	        });

	        var authHeader = new _AuthHeader2.default(_constants.urls[env], keys);

	        this._instance.interceptors.request.use(function (config) {
	            authHeader.addAuthorizationHeaderUsername(username, config, undefined);
	            return config;
	        });
	    }

	    _createClass(AuthHttpClientUsername, [{
	        key: "getMemberByUsername",
	        value: function getMemberByUsername() {
	            var config = {
	                method: 'get',
	                url: "/members"
	            };
	            return this._instance(config);
	        }
	    }]);

	    return AuthHttpClientUsername;
	}();

	exports.default = AuthHttpClientUsername;

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("es6-promise");

/***/ }
/******/ ])
});
;