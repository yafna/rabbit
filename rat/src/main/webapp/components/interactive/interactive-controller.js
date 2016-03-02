'use strict';

angular.module('myApp.interactive', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/interactive', {
            templateUrl: 'components/interactive/interactive.html',
            controller: 'InteractiveCtrl'
        });
    }])
    .controller('InteractiveCtrl', ['$http', function ($http) {
        var self = this;
        var thNames = [];
        self.getPack = function () {
            getData().then(
                function (resp) {
                    if (self.mtds === undefined) {
                        self.mtds = resp.data;
                    } else {
                        self.mtds = self.mtds.concat(resp.data);
                    }
                    var i = 0;
                    while (i < resp.data.length) {
                        if (thNames.indexOf(resp.data[i].thName) == -1) {
                            thNames.push(resp.data[i].thName)
                        }
                        i++;
                    }
                }
            );
        };
        function getData() {
            return $http.get("/data/pack");
        }
    }]);