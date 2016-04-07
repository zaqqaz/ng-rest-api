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

        angular.forEach(this.endpoints, (endpointConfig, name) => {
            api[name] = $injector.instantiate(ApiEndpoint, {
                baseRoute: this.baseRoute,
                endpointConfig: endpointConfig
            });
        });

        return api;
    };
}

export default ApiProvider;