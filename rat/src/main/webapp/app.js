'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.interactive',
    'myApp.filetrrr'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/filetrrr'});
    }]);