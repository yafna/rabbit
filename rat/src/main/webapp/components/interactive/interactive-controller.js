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
            var ctx = element[0].getContext('2d');

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
                    redraw(clNames);
                }, true
            );

            function redraw(clNames) {
                //clearup
                ctx.clearRect(0,0,500,500);

                var gap = 0;
                if (clNames.length > 0) {
                    gap = (400 / clNames.length) - 10;
                }

                var i = 0;
                var currentLinePos = 10;
                while (i < clNames.length) {
                    if (clNames[i] != undefined) {
                        i++;
                        draw(currentLinePos, 30, currentLinePos, 470, clNames[i]);
                        currentLinePos += gap;
                    }
                }
            }


            function draw(lX, lY, cX, cY, text) {
                // line from
                ctx.moveTo(lX, lY + 5);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = "#4bf";
                // draw it
                ctx.stroke();
                //text
                ctx.font = "10px Arial";
                ctx.fillText(text, lX, lY);
            }
        };

        return dir;
    }]);