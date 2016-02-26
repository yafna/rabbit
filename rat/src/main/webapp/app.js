'use strict';
//Basics of angular video - https://www.youtube.com/watch?v=i9MHigUZKEM

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.interactiveSrv',
    'myApp.interactiveFactory',
    'myApp.interactive'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/available'});
    }]);