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
                    if (self.mtds === undefined) {
                        self.mtds = resp.data;
                    } else {
                        self.mtds = self.mtds.concat(resp.data);
                    }
                    $scope.mtds = self.mtds;
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
            //var h = element[0].style.height;
            //var w = element[0].style.width;
            var h = 650;
            var w = 300;
            var gap = 20;
            var thNames = [];
            var clNames = [];
            var a = {};
            var threadSrcW = 5;
            var blocksClrs = ['#00cc44', '#006600', '#004d00', '#208000', '#1f7a7a'];
            var threadClrs = ['#ff1a1a', '#ff3333', '#ff4d4d', '#cc0000', '#b30000'];
            var threadSrcClr = '#FF0000';
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
                        if (!(obj[i].className in a)) {
                            a[obj[i].className] = [];
                        }
                        if (a[obj[i].className].indexOf(obj[i].methodName) == -1) {
                            a[obj[i].className].push(obj[i].methodName);
                        }
                        i++;
                    }
                    redraw(clNames, a);
                }, true
            );

            function redraw(clNames, a) {
                //clearup
                ctx.clearRect(0, 0, h, w);

                draw(threadSrcW, gap, threadSrcW, h - gap, threadSrcClr);

                var gaplines = 0;
                if (clNames.length > 0) {
                    gaplines = ((w - gap) / clNames.length);
                }
                var lineBlk = gaplines * 4 / 5;
                var i = 0;
                var currentLinePos = threadSrcW + gap / 2;

                while (i < clNames.length) {

                    drawText(clNames[i], currentLinePos, gap - 14);
                    draw(currentLinePos, gap, currentLinePos + lineBlk, gap, blocksClrs[i]);
                    var j = 0;
                    var x = 0;
                    while (j < a[clNames[i]].length) {
                        drawText(a[clNames[i]][j], currentLinePos + x - 5, gap-2);
                        draw(currentLinePos + x, gap, currentLinePos + x, h - gap, blocksClrs[i]);
                        x += 40;
                        j++;
                    }
                    currentLinePos += gaplines;
                    i++;
                }
            }

            function drawText(text, lX, lY) {
                ctx.font = "10px Arial";
                ctx.fillText(text, lX, lY);
            }

            function draw(lX, lY, cX, cY, color) {
                ctx.beginPath();
                // line from
                ctx.moveTo(lX, lY);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = color;
                // draw it
                ctx.stroke();
                ctx.closePath();
            }
        };

        return dir;
    }]);