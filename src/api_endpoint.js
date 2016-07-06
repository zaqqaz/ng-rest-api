class ApiEndpoint {
    constructor(baseRoute, httpParamSerializerJQLikeMode, endpointConfig, $httpParamSerializerJQLike, $injector, $resource, $q, CacheFactory) {
        'ngInject';

        this.config = endpointConfig;
        this.$injector = $injector;
        this.$q = $q;
        this.resource = $resource(baseRoute + endpointConfig.route, {}, endpointConfig.actions);
        this.httpParamSerializerJQLikeMode = httpParamSerializerJQLikeMode;
        this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
        this.CacheFactory = CacheFactory;
        this.cacher = false;

        if (angular.isString(this.config.modelClass)) {
            this.config.modelClass = $injector.get(this.config.modelClass);
        }

        // Set behavior for actions
        angular.forEach(endpointConfig.actions, (action, actionName, availableActions = {}) => {
            action.method = action.method.toUpperCase();

            let actionMethod = this.request,
                params = availableActions[actionName] ? availableActions[actionName] : {},
                actionParams = {
                    name: actionName,
                    instantiateModel: params.instantiateModel !== false,
                    headersForReading: params.headersForReading || false,
                    isSaveRequest: (action.method === 'PUT' || action.method === 'POST' || action.method === 'PATCH')
                };

            if (endpointConfig.model) {
                actionMethod = (actionParams.isSaveRequest) ? this.saveRequestWithModel : this.getRequestWithModel;
            }

            this[actionName] = angular.bind(this, actionMethod, actionParams);
        });
    }

    instantiateModel(data) {
        let model = this.config.modelClass ? new this.config.modelClass(data) : data;

        if (model && angular.isFunction(model.afterLoad)) {
            model.afterLoad();
        }

        return model;
    };

    request(actionParams, params = {}, data = {}) {
        let _headersForReturn = false;

        if ((this.httpParamSerializerJQLikeMode && actionParams.httpParamSerializerJQLikeMode !== false) || actionParams.httpParamSerializerJQLikeMode) {
            data = this.$httpParamSerializerJQLike(data);
        }

        this.config.actions[actionParams.name].transformResponse = (response, headers) => {
            if (actionParams.headersForReading && Array.isArray(actionParams.headersForReading)) {
                let responseHeaders = headers();
                _headersForReturn = {};
                actionParams.headersForReading.map((header) => {
                    if (responseHeaders[header]) {
                        _headersForReturn[header] = responseHeaders[header];
                    }
                });
            }

            return (actionParams.instantiateModel && response) ? angular.fromJson(response) : {data: response};
        };

        let cacheResult = false;
        let cacheKey = angular.isString(this.config.actions[actionParams.name].cache) ? this.config.actions[actionParams.name].cache : false;
        let force = params['force'];

        // everytime remove force param;
        delete params['force'];

        if (cacheKey) {
            this.cacher = this.CacheFactory.get(cacheKey) || this.CacheFactory.createCache(cacheKey, { storageMode: 'localStorage' });
            if (force) {
                this.cacher.destroy();
            } else {
                cacheResult = this.cacher.get(JSON.stringify(Object.assign({}, actionParams.name, params, data)));
            }
        }

        let resultPromise = (cacheResult) ? new Promise((resolve) => resolve(cacheResult)) : this.resource[actionParams.name](params, data).$promise

        return resultPromise.then((response) => {

            if (this.cacher && !cacheResult) {
                this.cacher.put(JSON.stringify(Object.assign({}, actionParams.name, params, data)), response);
            }

            let result = null;

            if (!actionParams.instantiateModel) {
                result = response.data;
            } else if (angular.isArray(response)) {
                result = response.map((element) => this.instantiateModel(element))
            } else {
                result = (() => this.instantiateModel(response))()
            }

            result = !!_headersForReturn ? [result, _headersForReturn] : result;

            return result;
        });
    };

    // For GET requests
    getRequestWithModel(action, params) {
        return this.request(action, params);
    };

    // For POST and PUT request
    saveRequestWithModel(action, params, data) {

        // if empty data - assume that the parameters have not been transferred
        if (!data) {
            data = params;
            params = {};
        }

        let model = angular.copy(data);

        if (model && angular.isFunction(model.beforeSave)) {
            model.beforeSave();
        }

        return this.request(action, params, model);
    };
}

export default ApiEndpoint;