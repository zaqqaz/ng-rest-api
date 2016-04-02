import apiProvider from './api.provider';

export default angular
    .module('ng-rest-api', [])
    .provider('api', apiProvider);