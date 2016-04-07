class ApiEndpoint {
    constructor(baseRoute, endpointConfig, $injector, $resource, $q) {
        'ngInject';

        this.config = endpointConfig;
        this.$injector = $injector;
        if (angular.isString(this.config.model)) {
            this.config.model = $injector.get(this.config.model);
        }
        this.$q = $q;
        this.resource = $resource(baseRoute + endpointConfig.route, {},
            endpointConfig.actions);

        // В зависимости от экшена переопределяем поведение запросов
        let self = this;
        angular.forEach(endpointConfig.actions, (action, actionName, availableActions = {}) => {
            action.method = action.method.toUpperCase();

            let actionMethod = self.request,
                params = availableActions[actionName] ? availableActions[actionName] : {},
                actionParams = {
                    name: actionName,
                    instantiateModel: params.instantiateModel !== false,
                    headersForReading: params.headersForReading || false,
                    isSaveRequest: (action.method === 'PUT' || action.method === 'POST' || action.method === 'PATCH')
                };

            if (endpointConfig.model) {
                actionMethod = (actionParams.isSaveRequest) ? self.saveRequestWithModel : self.getRequestWithModel;
            }

            self[actionName] = angular.bind(self, actionMethod, actionParams);
        });
    }

    // Возвращает экземпляр модели
    instantiateModel(data) {
        let model = new this.config.model(data);

        if (model && angular.isFunction(model.afterLoad)) {
            model.afterLoad();
        }

        return model;
    };

    request(actionParams, params = {}, data = {}) {
        let _headersForReturn = false;

        if (actionParams.instantiateModel) {
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

                return (actionParams.instantiateModel && response) ? angular.fromJson(response) : response;
            };
        } else {
            this.config.actions[actionParams.name].transformResponse = function(response) {
                return {data: response}
            };
        }

        return this.resource[actionParams.name](params, data).$promise
            .then((response) => {
                let data = response;
                let result = null;

                if (!actionParams.instantiateModel) {
                    result = response.data;
                } else if (angular.isArray(data)) {
                    result = data.map((element) => this.instantiateModel(element))
                } else {
                    result = (() => this.instantiateModel(data))()
                }

                return !!_headersForReturn ? [result, _headersForReturn] : result;
            });
    };

    // Отвечает за выполнение GET
    getRequestWithModel(action, params) {
        return this.request(action, params);
    };

    // Отвечает за выполнение POST и PUT
    saveRequestWithModel(action, params, data) {
        // Если на сохранение пришла пустая data
        // полагаем что параметры не передавались,
        // а вторым параметром  передана data
        if (!data) {
            data = params;
            params = {};
        }

        //Копируем что бы не произошло неявное изменение данных
        let model = angular.copy(data);

        if (model && angular.isFunction(model.beforeSave)) {
            model.beforeSave();
        }

        return this.request(action, params, model);
    };
}

export default ApiEndpoint;