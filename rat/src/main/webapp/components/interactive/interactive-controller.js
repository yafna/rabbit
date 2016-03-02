'use strict';

angular.module('myApp.interactive', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/interactive', {
            templateUrl: 'components/interactive/interactive.html',
            controller: 'InteractiveCtrl'
        });
    }])
    .controller('InteractiveCtrl', ['$scope', '$http', function ($scope, $http) {
        var self = this;
        $scope.mtds = [];
        self.getPack = function () {
            getData().then(
                function (resp) {
                    if ($scope.mtds === undefined) {
                        $scope.mtds = resp.data;
                    } else {
                        $scope.mtds = $scope.mtds.concat(resp.data);
                    }
                }
            );
        };
        function getData() {
            return $http.get("/data/pack");
        }
    }]).directive('drawing', [function () {
        var dir = {};
        dir.restrict = "AEC";
        dir.scope = {
            mtds: '='
        };
        dir.link = function (scope, element) {
            var thNames = [];
            var clNames = [];
            scope.$watch(
                function () {
                    return scope.mtds;
                },
                function (obj) {
                    console.log("I see a data change!");
                    var i = 0;
                    while (i < obj.length) {
                        if (thNames.indexOf(obj[i].thName) == -1) {
                            thNames.push(obj[i].thName)
                        }
                        if (clNames.indexOf(obj[i].className) == -1) {
                            clNames.push(obj[i].className)
                        }
                        i++;
                    }
                }, true);

            function draw(lX, lY, cX, cY) {
                // line from
                ctx.moveTo(lX, lY);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = "#4bf";
                // draw it
                ctx.stroke();
            }
        };

        return dir;
    }]);