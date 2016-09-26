import ApiEndpointConfig from './api_endpoint_config';
import ApiEndpoint from './api_endpoint';

class ApiProvider {
    constructor() {
        this.baseRoute = '';
        this.httpParamSerializerJQLikeMode = false;
        this.endpoints = {};
    }

    setBaseRoute(route) {
        this.baseRoute = route;
    };

    setCacheDefaultLifetime(time) {
        this.cacheDefaultLifetime = time;
    }

    setCacheDefaultStorageMode(time) {
        this.cacheDefaultStorageMode = time;
    }

    enableHttpParamSerializerJQLikeMode() {
        this.httpParamSerializerJQLikeMode = true;
    };

    endpoint(name) {
        let endpointConfig = new ApiEndpointConfig();
        this.endpoints[name] = endpointConfig;
        return endpointConfig;
    };

    $get($injector) {
        'ngInject';

        let api = {};

        angular.forEach(this.endpoints, (endpointConfig, name) => {
            api[name] = $injector.instantiate(ApiEndpoint, {
                baseRoute: this.baseRoute,
                cacheDefaultLifetime: this.cacheDefaultLifetime,
                cacheDefaultStorageMode: this.cacheDefaultStorageMode,
                httpParamSerializerJQLikeMode: this.httpParamSerializerJQLikeMode,
                endpointConfig: endpointConfig
            });
        });

        return api;
    };
}

export default ApiProvider;