'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.interactive',
    'myApp.filetrrr',
    'treeControl'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/filetrrr'});
    }]);