'use strict';

angular.module('myApp.interactive', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/interactive', {
            templateUrl: 'components/interactive/interactive.html',
            controller: 'InteractiveCtrl'
        });
    }])
    .controller('InteractiveCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
        var self = this;
        $scope.mtds = [];
        $scope.zoommode = false;
        var backupMtds;
        var stop;

        self.modeChanged = function () {
            //stop timer , zoooom
            if ($scope.zoommode) {
                self.stopTimer();
                backupMtds = $scope.mtds;
            }
        };

        self.zoomBack = function () {
            $scope.mtds = backupMtds;
        };

        self.startTimer = function () {
            if (angular.isDefined(stop)) return;
            stop = $interval(function () {
                getData().then(
                    function (resp) {
                        if (self.mtds === undefined) {
                            self.mtds = resp.data;
                            $scope.mtds = self.mtds;
                        } else {
                            self.mtds = self.mtds.concat(resp.data);
                            $scope.mtds = self.mtds;
                        }
                    }
                );
            }, 500);
        };
        self.stopTimer = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };

        self.getPack = function () {
            if (angular.isDefined(stop)) return;
            getData().then(
                function (resp) {
                    if (self.mtds === undefined) {
                        self.mtds = resp.data;
                        $scope.mtds = self.mtds;
                    } else {
                        self.mtds = self.mtds.concat(resp.data);
                        $scope.mtds = self.mtds;
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
            mtds: '=',
            zoommode: '='
        };
        dir.link = function (scope, element) {
            var w = 700;
            var h = 700;
            var ctx = element[0].getContext('2d');
            element[0].setAttribute('width', w);
            element[0].setAttribute('height', h);
            drawZoom.init(document.getElementById('zoomlayer'), w, h);

            scope.$watch(
                function () {
                    return scope.zoommode;
                },
                function () {
                    console.log("I see a zoommode change!");
                    drawZoom.doZoom(scope.zoommode);
                }
            );

            scope.$watch(
                function () {
                    return scope.mtds;
                },
                function (obj) {
                    console.log("I see a data change!");
                    if (obj != undefined && obj[0] != undefined) {
                        var str = models.buildClassStructure(obj);
                        str = models.buildXIndex(w, str);
                        var tmmin = models.getTimeMin(obj);
                        var tmmax = models.getTimeMax(obj);
                        drawItems.redraw(ctx, str, obj, tmmin, tmmax, w, h);
                    }
                }, true
            );
        };

        return dir;
    }]);