import $cache from './cache';

class ApiEndpoint {
    constructor(baseRoute, httpParamSerializerJQLikeMode, endpointConfig, $httpParamSerializerJQLike,
                cacheDefaultLifetime, cacheDefaultStorageMode, $injector, $resource, $q, CacheFactory) {
        'ngInject';

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

            let lifetime = ((typeof params.$cache === 'object') ? params.$cache.lifetime : null);
            action['$cache'] = new $cache({
                name: `api.${actionName}`,
                active: !!params.$cache,
                lifetime: (typeof lifetime === 'number') ? lifetime : cacheDefaultLifetime,
                storageMode: ((typeof params.$cache === 'object') ? params.$cache.storageMode : null) || cacheDefaultStorageMode,
                Cache: CacheFactory
            });

            this[actionName] = angular.bind(this, actionMethod, actionParams);
            this[actionName]['$cache'] = action['$cache']
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
        if ((this.httpParamSerializerJQLikeMode && actionParams.httpParamSerializerJQLikeMode !== false) || actionParams.httpParamSerializerJQLikeMode) {
            data = this.$httpParamSerializerJQLike(data);
        }

        let _headersForReturn = false;
        let $cache = this.config.actions[actionParams.name]['$cache'];
        let $cache_key = JSON.stringify(Object.assign({}, actionParams.name, params, data));
        let $cache_result = null;

        this.config.actions[actionParams.name].transformResponse = (response, headers) => {
            if (actionParams.headersForReading && Array.isArray(actionParams.headersForReading)) {
                let responseHeaders = headers() || $cache.headers($cache_key);
                _headersForReturn = {};
                actionParams.headersForReading.map((header) => {
                    if (responseHeaders[header]) {
                        _headersForReturn[header] = responseHeaders[header];
                    }
                });
            }

            let result = (actionParams.instantiateModel && response) ? angular.fromJson(response) : {data: response};

            if ($cache.isActive()) {
                $cache.put($cache_key, result, _headersForReturn);
            }

            return result;
        };

        if ($cache.isActive()) {
            $cache_result = $cache.get($cache_key);
            _headersForReturn = $cache.headers($cache_key);
        }

        let resultPromise = ($cache_result) ? new Promise((resolve) => resolve($cache_result)) : this.resource[actionParams.name](params, data).$promise;

        return resultPromise.then((response) => {

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