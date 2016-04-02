import ApiEndpointConfig from './api_endpoint_config';
import ApiEndpoint from './api_endpoint';

/**
 * Angular провайдер для настройки api сервиса
 */
class ApiProvider {
    constructor() {
        this.baseRoute = '';
        this.endpoints = {};
    }

    setBaseRoute(route) {
        this.baseRoute = route;
    };

    endpoint(name) {
        let endpointConfig = new ApiEndpointConfig();
        this.endpoints[name] = endpointConfig;
        return endpointConfig;
    };

    $get($injector) {
        "ngInject";

        let api = {};

        let self = this;
        angular.forEach(this.endpoints, function (endpointConfig, name) {
            api[name] = $injector.instantiate(ApiEndpoint, {
                baseRoute: self.baseRoute,
                endpointConfig: endpointConfig
            });
        });

        return api;
    };
}

export default ApiProvider;