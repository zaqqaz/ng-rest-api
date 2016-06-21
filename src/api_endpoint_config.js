class ApiEndpointConfig {
    constructor() {
        this.actions = {};
        this.modelClass = false;

        /** Default actions */
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

    /** URI after base route **/
    route(route) {
        this.route = route;
        return this;
    };

    model(model) {
        this.modelClass = model;
        return this;
    };

    /**
     * @param {string} method - HTTP method (GET, POST, etc.)
     * @param {string} name - Name for action which will be call
     * @param {Object=} params - params for action (also include params for $resource)
     */
    addHttpAction(method, name, params) {
        this.actions[name] = angular.merge({method: method.toUpperCase()}, params);
        return this;
    };
}

export default ApiEndpointConfig;