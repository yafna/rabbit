'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.interactive'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/interactive'});
    }]);