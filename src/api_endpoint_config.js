class ApiEndpointConfig {
    constructor() {
        this.actions = {};

        /** Экшены по умолчанию для всех */
        let defaultActions = {
            'GET': 'get',
            'PUT': 'update',
            'POST': 'save',
            'PATCH': 'patch',
            'DELETE': 'remove'
        };


        angular.forEach(defaultActions, (alias, method) => {
            this.addHttpAction(method, alias);
        });
    }

    /** URI после base route **/
    route(route) {
        this.route = route;
        return this;
    };

    model(model) {
        this.model = model;
        return this;
    };

    /**
     * @param {string} method - HTTP медот для этого экшена (GET, POST, etc.)
     * @param {string} name - Имя экшена которое будет вызываться
     * @param {Object=} params - параметры для данного метода
     */
    addHttpAction(method, name, params) {
        this.actions[name] = angular.merge({method: method.toUpperCase()}, params);
        return this;
    };
}

export default ApiEndpointConfig;