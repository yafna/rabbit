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
            var thGap = 20;
            var clzclrs = ['#206020', '#336600', '#446600', '#008000', '#006633', '#004d00', '#009900'];
            var ctx = element[0].getContext('2d');
            var zoomEl = document.getElementById('zoomlayer');
            var ctxZoom = zoomEl.getContext('2d');
            var zoomModeEnabled = false;
            var rect = zoomEl.getBoundingClientRect();

            element[0].setAttribute('width', w);
            element[0].setAttribute('height', h);
            zoomEl.setAttribute('width', w);
            zoomEl.setAttribute('height', h);


            var zoomState = {
                selecting: false,
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0
            };

           var onMouseDown = function(event) {
                if (scope.zoommode) {
                    zoomState.selecting = true;
                    zoomState.startX = event.pageX - rect.left;
                    zoomState.startY = event.pageY - rect.top;
                }
            };
            var onMouseMove =  function(event) {
                if (scope.zoommode && zoomState.selecting) {
                    console.log('mv+');
                    zoomState.endX = event.pageX - rect.left;
                    zoomState.endY = event.pageY- rect.top;
                    ctxZoom.clearRect(0, 0, w, h);
                    drawAction.drawEmptyRect(ctxZoom, zoomState.startX, zoomState.startY, zoomState.endX, zoomState.endY);
                }
            };
            var onMouseUp = function(event) {
                if (scope.zoommode && zoomState.selecting) {
                    console.log('up+');
                    zoomState.selecting = false;
                    ctxZoom.clearRect(0, 0, w, h);

                }
            };

            zoomEl.addEventListener('mousemove', onMouseMove, true);
            zoomEl.addEventListener('mousedown', onMouseDown, true);
            zoomEl.addEventListener('mouseup', onMouseUp, true);
            zoomEl.addEventListener('selectstart', function (e) {
                e.preventDefault();
                return false;
            }, false);
            scope.$watch(
                function () {
                    return scope.zoommode;
                },
                function () {
                    console.log("I see a zoommode change!");
                    zoomModeEnabled = scope.zoommode;
                }
            );
            scope.$watch(
                function () {
                    return scope.mtds;
                },
                function (obj) {
                    console.log("I see a data change!");
                    if (obj != undefined && obj[0] != undefined) {
                        ctxZoom.clearRect(0, 0, w, h);
                        var i = 0;
                        var str = [];
                        var thNames = [];
                        var clNames = [];
                        var thclrind = 0;
                        var tmmin = obj[0].time;
                        var tmmax = obj[0].time;
                        while (i < obj.length) {
                            if (tmmin > obj[i].time) {
                                tmmin = obj[i].time;
                            }
                            if (tmmax < obj[i].time) {
                                tmmax = obj[i].time;
                            }

                            if (thNames.indexOf(obj[i].thName) == -1) {
                                thNames.push(obj[i].thName)
                            }
                            if (clNames.indexOf(obj[i].className) == -1) {
                                clNames.push(obj[i].className);
                                str[thclrind] = {};
                                str[thclrind].clr = clzclrs[thclrind];
                                str[thclrind].clzName = obj[i].className;
                                str[thclrind].mtds = [{'name': obj[i].methodName}];
                                thclrind++;
                            } else {
                                var ind = 0;
                                while (str[ind].clzName != obj[i].className) {
                                    ind++
                                }
                                var mind = 0;
                                while (mind < str[ind].mtds.length && str[ind].mtds[mind].name != obj[i].methodName) {
                                    mind++
                                }
                                if (str[ind].mtds.length == mind) {
                                    str[ind].mtds.push({'name': obj[i].methodName});
                                }
                            }
                            i++;
                        }

                        var gap = 0;
                        if (clNames.length > 0) {
                            gap = (w - thGap) / (clNames.length + 1);
                        }

                        i = 0;
                        while (i < str.length) {
                            str[i].prX = thGap + gap * i;
                            str[i].lstX = thGap + gap * (i + 1) - 15;
                            i++;
                        }
                        drawItems.redraw(ctx, str, obj, tmmin, tmmax, w, h);
                    }
                }, true
            );
        };

        return dir;
    }]);