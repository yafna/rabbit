'use strict';
angular.module('myApp.interactiveFactory', [])
    .factory('interactiveFactory', function (interactiveFactory) {
        var page = {};

        page.loadVersions = function () {
            return interactiveFactory.getData();
        };

        return page;
    });