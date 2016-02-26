'use strict';

// A lot of nice pre-written angular directives  https://angular-ui.github.io/bootstrap/
angular.module('myApp.interactive', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.tpls', 'myApp.spinner'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/interactive', {
            templateUrl: 'components/interactive/interactive.html',
            controller: 'InteractiveCtrl'
        });
    }])
    .controller('InteractiveCtrl', ['interactiveFactory', function (interactiveFactory) {
        var self = this;

        self.getPack = function () {
            interactiveFactory.getData().then(
                function (resp) {
                    self.products = resp.data;
                }
            );
        };
    }]);