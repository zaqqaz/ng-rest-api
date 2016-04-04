import apiProvider from './api.provider';

export default angular
    .module('ng-rest-api', ['ngResource'])
    .provider('api', apiProvider);