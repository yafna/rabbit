'use strict';
angular.module('myApp.interactiveSrv', [])

    .service('availableHttpFactory', function ($http) {
        return({
            getData: getData
        });

        function getData() {
            return $http.get("/data/pack");
        }
    });