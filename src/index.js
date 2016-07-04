import apiProvider from './api.provider';

export default angular
    .module('ng-rest-api', ['ngResource', 'angular-cache'])
    .provider('api', apiProvider);