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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _api = __webpack_require__(1);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = angular.module('ng-rest-api', ['ngResource']).provider('api', _api2.default);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ApiEndpoint = function () {
	    ApiEndpoint.$inject = ["baseRoute", "httpParamSerializerJQLikeMode", "endpointConfig", "$httpParamSerializerJQLike", "$injector", "$resource", "$q"];
	    function ApiEndpoint(baseRoute, httpParamSerializerJQLikeMode, endpointConfig, $httpParamSerializerJQLike, $injector, $resource, $q) {
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
	            var availableActions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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

	            _this[actionName] = angular.bind(_this, actionMethod, actionParams);
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

	            var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	            var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            var _headersForReturn = false;

	            if (this.httpParamSerializerJQLikeMode && actionParams.httpParamSerializerJQLikeMode !== false || actionParams.httpParamSerializerJQLikeMode) {
	                data = this.$httpParamSerializerJQLike(data);
	            }

	            this.config.actions[actionParams.name].transformResponse = function (response, headers) {
	                if (actionParams.headersForReading && Array.isArray(actionParams.headersForReading)) {
	                    (function () {
	                        var responseHeaders = headers();
	                        _headersForReturn = {};
	                        actionParams.headersForReading.map(function (header) {
	                            if (responseHeaders[header]) {
	                                _headersForReturn[header] = responseHeaders[header];
	                            }
	                        });
	                    })();
	                }

	                return actionParams.instantiateModel && response ? angular.fromJson(response) : { data: response };
	            };

	            return this.resource[actionParams.name](params, data).$promise.then(function (response) {
	                var data = response;
	                var result = null;

	                if (!actionParams.instantiateModel) {
	                    result = response.data;
	                } else if (angular.isArray(data)) {
	                    result = data.map(function (element) {
	                        return _this2.instantiateModel(element);
	                    });
	                } else {
	                    result = function () {
	                        return _this2.instantiateModel(data);
	                    }();
	                }

	                return !!_headersForReturn ? [result, _headersForReturn] : result;
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
	    }]);

	    return ApiEndpoint;
	}();

	exports.default = ApiEndpoint;

/***/ }
/******/ ]);