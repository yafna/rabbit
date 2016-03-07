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
            mtds: '='
        };
        dir.link = function (scope, element) {
            var w = 700;
            var h = 700;
            var thGap = 20;
            var thclr = '#ff0000';
            var fadedClr ='#e6ffe6';
            var timeClr = '#c2d6d6';
            var clzclrs = ['#206020', '#336600', '#446600', '#008000', '#006633', '#004d00', '#009900'];
            var ctx = element[0].getContext('2d');
            element[0].setAttribute('width', w);
            element[0].setAttribute('height', h);
            scope.$watch(
                function () {
                    return scope.mtds;
                },
                function (obj) {
                    console.log("I see a data change!");
                    if (obj != undefined && obj[0] != undefined) {
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
                        redraw(str, obj, tmmin, tmmax);
                    }
                }, true
            );

            function redraw(str, obj, tmmin, tmmax) {
                ctx.clearRect(0, 0, w, h);
                var str2 = drawclzz(str);
                drawTime(tmmin, tmmax);
                drawThreads(obj, str2, tmmin, tmmax);
            }


            function drawclzz(str) {
                var i = 0;
                var upperGap = 30;
                while (i < str.length) {
                    var mgap = (str[i].lstX - str[i].prX) / str[i].mtds.length;
                    drawTxt(str[i].prX, 10, str[i].clzName);
                    draw(str[i].prX, upperGap, str[i].lstX - mgap + 1, upperGap, str[i].clr);
                    drawRect(str[i].prX, upperGap, str[i].lstX - mgap + 1, h, fadedClr);
                    var j = 0;
                    while (j < str[i].mtds.length) {
                        str[i].mtds[j].posX = str[i].prX + mgap * j;
                        drawTxt(str[i].mtds[j].posX, 20, str[i].mtds[j].name);
                        draw(str[i].mtds[j].posX, upperGap, str[i].mtds[j].posX, h, str[i].clr);
                        j++;
                    }
                    i++;
                }
                return str;
            }

            function drawThreads(obj, str, tmmin, tmmax){
                var upperGap = 40;
                var timeitem = (h - upperGap - 10) / (tmmax - tmmin);
                var i = 0;
                while (i < obj.length) {
                    var currtime = (obj[i].time - tmmin) * timeitem;
                    var ind = 0;
                    while (str[ind].clzName != obj[i].className) {
                        ind++
                    }
                    var mind = 0;
                    while (str[ind].mtds[mind].name != obj[i].methodName) {
                        mind++
                    }
                    drawHorixontalCurve(thGap / 2, upperGap + currtime, str[ind].mtds[mind].posX, upperGap + currtime, thclr, obj[i].start);
                    i++;
                }
                draw(thGap / 2, 0, thGap / 2, h, thclr);
            }

            function drawTime(tmmin, tmmax) {
                var upperGap = 40;
                var timeitem = (h - upperGap - 10) / (tmmax - tmmin);
                var i = 0;
                var delimiters = tmmax - tmmin > 7? 7 : tmmax - tmmin;
                var tmItem = tmmin;
                while (i < delimiters) {
                    var currtime = upperGap + (tmItem == tmmin ? 0 : (tmItem - tmmin) * timeitem);
                    drawTxt(thGap / 2, currtime - 5, wraptime(tmItem));
                    draw(thGap / 2, currtime, w, currtime, timeClr);
                    i++;
                    if(i == delimiters-1){
                        tmItem = tmmax;
                    }else{
                        tmItem += i* ((tmmax - tmmin) / delimiters);
                    }
                }
                draw(thGap / 2, 0, thGap / 2, h, thclr);
            }


            function drawTxt(lx, ly, text) {
                ctx.font = "10px Arial";
                ctx.fillStyle = '#000000';
                ctx.fillText(text, lx, ly);
            }

            function drawHorixontalCurve(lX, lY, cX, cY, clr, up) {
                ctx.beginPath();
                ctx.moveTo(lX, lY);
                var crv = 5 * (up ? -1 : 1);
                ctx.bezierCurveTo(lX, lY + crv, cX, lY + crv, cX, cY);
                ctx.strokeStyle = clr;
                ctx.stroke();
                ctx.closePath();
            }

            function draw(lX, lY, cX, cY, clr) {
                ctx.beginPath();
                ctx.moveTo(lX, lY);
                ctx.lineTo(cX, cY);
                ctx.strokeStyle = clr;
                ctx.stroke();
                ctx.closePath();
            }

            function drawRect(lX, lY, cX, cY, clr) {
                ctx.beginPath();
                ctx.rect(lX, lY, cX-lX, cY-lY);
                ctx.fillStyle = clr;
                ctx.fill();
                ctx.closePath();
            }

            function wraptime(millis) {
                var today = new Date(millis),
                    h = checkTime(today.getHours()),
                    m = checkTime(today.getMinutes()),
                    s = checkTime(today.getSeconds()),
                    mm = checkTime(today.getMilliseconds());
                return h + ":" + m + ":" + s + "." + mm;
            }

            function checkTime(i) {
                return (i < 10) ? "0" + i : i;
            }
        };

        return dir;
    }]);