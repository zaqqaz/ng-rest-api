/******/ (function(modules) { // webpackBootstrap
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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _api = __webpack_require__(1);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = angular.module('ng-rest-api', ['ngResource', 'angular-cache']).provider('api', _api2.default);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _api_endpoint_config = __webpack_require__(2);

	var _api_endpoint_config2 = _interopRequireDefault(_api_endpoint_config);

	var _api_endpoint = __webpack_require__(3);

	var _api_endpoint2 = _interopRequireDefault(_api_endpoint);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ApiProvider = function () {
	    function ApiProvider() {
	        _classCallCheck(this, ApiProvider);

	        this.baseRoute = '';
	        this.httpParamSerializerJQLikeMode = false;
	        this.endpoints = {};
	    }

	    _createClass(ApiProvider, [{
	        key: 'setBaseRoute',
	        value: function setBaseRoute(route) {
	            this.baseRoute = route;
	        }
	    }, {
	        key: 'setCacheDefaultLifetime',
	        value: function setCacheDefaultLifetime(time) {
	            this.cacheDefaultLifetime = time;
	        }
	    }, {
	        key: 'setCacheDefaultStorageMode',
	        value: function setCacheDefaultStorageMode(time) {
	            this.cacheDefaultStorageMode = time;
	        }
	    }, {
	        key: 'enableHttpParamSerializerJQLikeMode',
	        value: function enableHttpParamSerializerJQLikeMode() {
	            this.httpParamSerializerJQLikeMode = true;
	        }
	    }, {
	        key: 'endpoint',
	        value: function endpoint(name) {
	            var endpointConfig = new _api_endpoint_config2.default();
	            this.endpoints[name] = endpointConfig;
	            return endpointConfig;
	        }
	    }, {
	        key: '$get',
	        value: ["$injector", function $get($injector) {
	            'ngInject';

	            var _this = this;

	            var api = {};

	            angular.forEach(this.endpoints, function (endpointConfig, name) {
	                api[name] = $injector.instantiate(_api_endpoint2.default, {
	                    baseRoute: _this.baseRoute,
	                    cacheDefaultLifetime: _this.cacheDefaultLifetime,
	                    cacheDefaultStorageMode: _this.cacheDefaultStorageMode,
	                    httpParamSerializerJQLikeMode: _this.httpParamSerializerJQLikeMode,
	                    endpointConfig: endpointConfig
	                });
	            });

	            return api;
	        }]
	    }]);

	    return ApiProvider;
	}();

	exports.default = ApiProvider;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ApiEndpointConfig = function () {
	    function ApiEndpointConfig() {
	        var _this = this;

	        _classCallCheck(this, ApiEndpointConfig);

	        this.actions = {};
	        this.modelClass = false;

	        /** Default actions */
	        var defaultActions = {
	            'GET': 'get',
	            'PUT': 'update',
	            'POST': 'save',
	            'PATCH': 'patch',
	            'DELETE': 'remove'
	        };

	        angular.forEach(defaultActions, function (alias, method) {
	            _this.addHttpAction(method, alias);
	        });
	    }

	    /** URI after base route **/


	    _createClass(ApiEndpointConfig, [{
	        key: 'route',
	        value: function route(_route) {
	            this.route = _route;
	            return this;
	        }
	    }, {
	        key: 'model',
	        value: function model(_model) {
	            this.modelClass = _model;
	            return this;
	        }
	    }, {
	        key: 'addHttpAction',


	        /**
	         * @param {string} method - HTTP method (GET, POST, etc.)
	         * @param {string} name - Name for action which will be call
	         * @param {Object=} params - params for action (also include params for $resource)
	         */
	        value: function addHttpAction(method, name, params) {
	            this.actions[name] = angular.merge({ method: method.toUpperCase() }, params);
	            return this;
	        }
	    }]);

	    return ApiEndpointConfig;
	}();

	exports.default = ApiEndpointConfig;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _cache = __webpack_require__(4);

	var _cache2 = _interopRequireDefault(_cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ApiEndpoint = function () {
	    ApiEndpoint.$inject = ["baseRoute", "httpParamSerializerJQLikeMode", "endpointConfig", "$httpParamSerializerJQLike", "cacheDefaultLifetime", "cacheDefaultStorageMode", "$injector", "$resource", "$q", "CacheFactory"];
	    function ApiEndpoint(baseRoute, httpParamSerializerJQLikeMode, endpointConfig, $httpParamSerializerJQLike, cacheDefaultLifetime, cacheDefaultStorageMode, $injector, $resource, $q, CacheFactory) {
	        'ngInject';

	        var _this = this;

	        _classCallCheck(this, ApiEndpoint);

	        this.config = endpointConfig;
	        this.$injector = $injector;
	        this.$q = $q;
	        this.resource = $resource(baseRoute + endpointConfig.route, {}, endpointConfig.actions);
	        this.httpParamSerializerJQLikeMode = httpParamSerializerJQLikeMode;
	        this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;

	        if (angular.isString(this.config.modelClass)) {
	            this.config.modelClass = $injector.get(this.config.modelClass);
	        }

	        // Set behavior for actions
	        angular.forEach(endpointConfig.actions, function (action, actionName) {
	            var availableActions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	            action.method = action.method.toUpperCase();

	            var actionMethod = _this.request,
	                params = availableActions[actionName] ? availableActions[actionName] : {},
	                actionParams = {
	                name: actionName,
	                instantiateModel: params.instantiateModel !== false,
	                headersForReading: params.headersForReading || false,
	                isSaveRequest: action.method === 'PUT' || action.method === 'POST' || action.method === 'PATCH'
	            };

	            if (endpointConfig.model) {
	                actionMethod = actionParams.isSaveRequest ? _this.saveRequestWithModel : _this.getRequestWithModel;
	            }

	            var lifetime = _typeof(params.$cache) === 'object' ? params.$cache.lifetime : null;
	            action['$cache'] = new _cache2.default({
	                name: 'api.' + actionName,
	                active: !!params.$cache,
	                lifetime: typeof lifetime === 'number' ? lifetime : cacheDefaultLifetime,
	                storageMode: (_typeof(params.$cache) === 'object' ? params.$cache.storageMode : null) || cacheDefaultStorageMode,
	                Cache: CacheFactory
	            });

	            _this[actionName] = angular.bind(_this, actionMethod, actionParams);
	            _this[actionName]['$cache'] = action['$cache'];
	        });
	    }

	    _createClass(ApiEndpoint, [{
	        key: 'instantiateModel',
	        value: function instantiateModel(data) {
	            var model = this.config.modelClass ? new this.config.modelClass(data) : data;

	            if (model && angular.isFunction(model.afterLoad)) {
	                model.afterLoad();
	            }

	            return model;
	        }
	    }, {
	        key: 'request',
	        value: function request(actionParams) {
	            var _this2 = this;

	            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	            var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	            if (this.httpParamSerializerJQLikeMode && actionParams.httpParamSerializerJQLikeMode !== false || actionParams.httpParamSerializerJQLikeMode) {
	                data = this.cleanObject(data);
	                data = this.$httpParamSerializerJQLike(data);
	            }

	            var _headersForReturn = false;
	            var $cache = this.config.actions[actionParams.name]['$cache'];
	            var $cache_key = JSON.stringify(_extends({}, actionParams.name, params, data));
	            var $cache_result = null;

	            this.config.actions[actionParams.name].transformResponse = function (response, headers) {
	                if (actionParams.headersForReading && Array.isArray(actionParams.headersForReading)) {
	                    var responseHeaders = headers() || $cache.headers($cache_key);
	                    _headersForReturn = {};
	                    actionParams.headersForReading.map(function (header) {
	                        if (responseHeaders[header]) {
	                            _headersForReturn[header] = responseHeaders[header];
	                        }
	                    });
	                }

	                var result = actionParams.instantiateModel && response ? angular.fromJson(response) : { data: response };

	                if ($cache.isActive()) {
	                    $cache.put($cache_key, result, _headersForReturn);
	                }

	                return result;
	            };

	            if ($cache.isActive()) {
	                $cache_result = $cache.get($cache_key);
	                _headersForReturn = $cache.headers($cache_key);
	            }

	            var resultPromise = $cache_result ? new Promise(function (resolve) {
	                return resolve($cache_result);
	            }) : this.resource[actionParams.name](params, data).$promise;

	            return resultPromise.then(function (response) {

	                var result = null;

	                if (!actionParams.instantiateModel) {
	                    result = response.data;
	                } else if (angular.isArray(response)) {
	                    result = response.map(function (element) {
	                        return _this2.instantiateModel(element);
	                    });
	                } else {
	                    result = function () {
	                        return _this2.instantiateModel(response);
	                    }();
	                }

	                result = !!_headersForReturn ? [result, _headersForReturn] : result;

	                return result;
	            });
	        }
	    }, {
	        key: 'getRequestWithModel',


	        // For GET requests
	        value: function getRequestWithModel(action, params) {
	            return this.request(action, params);
	        }
	    }, {
	        key: 'saveRequestWithModel',


	        // For POST and PUT request
	        value: function saveRequestWithModel(action, params, data) {

	            // if empty data - assume that the parameters have not been transferred
	            if (!data) {
	                data = params;
	                params = {};
	            }

	            var model = angular.copy(data);

	            if (model && angular.isFunction(model.beforeSave)) {
	                model.beforeSave();
	            }

	            return this.request(action, params, model);
	        }
	    }, {
	        key: 'cleanObject',


	        // Remove undefined and null
	        value: function cleanObject(obj) {
	            var _this3 = this;

	            return Object.keys(obj).filter(function (k) {
	                return obj[k] !== null && obj[k] !== undefined;
	            }).reduce(function (newObj, k) {
	                return _typeof(obj[k]) === 'object' ? _extends(newObj, _defineProperty({}, k, _this3.cleanObject(obj[k]))) : _extends(newObj, _defineProperty({}, k, obj[k]));
	            }, {});
	        }
	    }]);

	    return ApiEndpoint;
	}();

	exports.default = ApiEndpoint;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $cache = function () {
	    function $cache(_ref) {
	        var name = _ref.name,
	            active = _ref.active,
	            storageMode = _ref.storageMode,
	            lifetime = _ref.lifetime,
	            Cache = _ref.Cache;

	        _classCallCheck(this, $cache);

	        this.name = name;
	        this.active = active;
	        this.lifetime = lifetime;
	        this.lastCacheTime = {};
	        this.cacher = Cache.get(name) || Cache.createCache(name, { storageMode: storageMode || 'localStorage' });
	        this._headerPostfix = '.headers';
	    }

	    _createClass($cache, [{
	        key: '_isValid',
	        value: function _isValid(key) {
	            var now = new Date().getTime();
	            return !this.lifetime || this.lastCacheTime[key] + this.lifetime > now;
	        }
	    }, {
	        key: 'isActive',
	        value: function isActive() {
	            return !!this.active;
	        }
	    }, {
	        key: 'enable',
	        value: function enable(active) {
	            this.active = active;
	        }
	    }, {
	        key: 'setLifetime',
	        value: function setLifetime(time) {
	            this.lifetime = time;
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.cacher.removeAll();
	        }
	    }, {
	        key: 'get',
	        value: function get(key) {
	            return this._isValid(key) ? this.cacher.get(key) : null;
	        }
	    }, {
	        key: 'headers',
	        value: function headers(key) {
	            return this._isValid(key) ? this.cacher.get(key + this._headerPostfix) : null;
	        }
	    }, {
	        key: 'put',
	        value: function put(key, response, headers) {
	            this.cacher.put(key, response);
	            this.cacher.put(key + this._headerPostfix, headers);
	            this.lastCacheTime[key] = new Date().getTime();
	        }
	    }]);

	    return $cache;
	}();

	exports.default = $cache;

/***/ })
/******/ ]);