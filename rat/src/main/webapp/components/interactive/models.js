'use strict';
(function (models, $, undefined) {

    var thGap = 20;
    var pkgClr = '#f7ffe6';
    var pkgLineClr = '#466600';
    var clzClr = '#e6ffff';
    var clzLineClr = '#006666';
    var mtdLineClr = '#2929a3';
    var clzclrs = ['#206020', '#336600', '#446600', '#008000', '#006633', '#004d00', '#009900'];

    //-1 if nothing found
    models.findIndByMethodName = function (mtds, name) {
        var mind = 0;
        while (mind < mtds.length && mtds[mind].name != name) {
            mind++
        }
        return (mtds.length == mind) ? -1 : mind
    };

    //-1 if nothing found
    models.findIndByClazzName = function (str, name) {
        var ind = 0;
        while (ind < str.length && str[ind].clzName != name) {
            ind++
        }
        return (str.length == ind) ? -1 : ind
    };

    models.findUnfinishedThreadByClzNameMethodName = function (ths, clzName, mtdName, thName) {
        var ind = 0;
        while (ind < ths.length && !(ths[ind].clzName === clzName && ths[ind].mtdName === mtdName
        && ths[ind].name === thName && (ths[ind].startTime === undefined || ths[ind].endTime === undefined))) {
            ind++
        }
        return (ths.length == ind) ? -1 : ind
    };

    models.getTimeBorders = function (trds) {
        var i = 0;
        var tmmin = trds[0].startTime;
        var tmmax = trds[0].endTime;
        while (i < trds.length) {
            if (tmmin > trds[i].startTime) {
                tmmin = trds[i].startTime;
            }
            if (tmmax < trds[i].endTime) {
                tmmax = trds[i].endTime;
            }
            i++;
        }
        return {tmin: tmmin, tmax: tmmax};
    };

    models.filterThreads = function (thrs, startY, endY, startX, endX) {
        var i = 0;
        var threads = [];
        while (i < thrs.length) {
            if ((thrs[i].xend > startX && thrs[i].xend < endX) &&
                ((thrs[i].sy > startY && thrs[i].sy < endY) || (thrs[i].ey > startY && thrs[i].ey < endY))) {
                threads.push(thrs[i]);
                if (thrs[i].sy < startY || thrs[i].sy > endY) {
                    thrs[i].sy = undefined;
                }
                if (thrs[i].ey < startY || thrs[i].ey > endY) {
                    thrs[i].ey = undefined;
                }
            }
            i++;
        }
        return threads;
    };

    models.updateThreadX = function (thrds, str) {
        var i = 0;
        while (i < thrds.length) {
            var ind = models.findIndByClazzName(str, thrds[i].clzName);
            if (ind != -1) {
                var mind = models.findIndByMethodName(str[ind].mtds, thrds[i].mtdName);
                thrds[i].xend = str[ind].mtds[mind].posX;
            }
            i++;
        }
        return thrds;
    };

    models.setThreadY = function (thrds, tmmin, tmmax, h) {
        var upperGap = 40;
        var timeitem = (h - upperGap - 10) / (tmmax - tmmin);
        var i = 0;
        while (i < thrds.length) {
            if (thrds[i].startTime != undefined) {
                var stime = (thrds[i].startTime - tmmin) * timeitem;
                thrds[i].sy = upperGap + stime;
            }
            if (thrds[i].endTime != undefined) {
                var etime = (thrds[i].endTime - tmmin) * timeitem;
                thrds[i].ey = upperGap + etime;
            }
            i++;
        }
        return thrds;
    };

    models.buildThreads = function (obj, str) {
        var i = 0, thInd = 0;
        var threads = [];
        while (i < obj.length) {
            var ind = models.findIndByClazzName(str, obj[i].className);
            if (ind != -1) {
                var mind = models.findIndByMethodName(str[ind].mtds, obj[i].methodName);
                if (mind != -1) {
                    var thFound = models.findUnfinishedThreadByClzNameMethodName(threads, obj[i].className, obj[i].methodName, obj[i].thName);
                    if (thFound == -1) {
                        threads[thInd] = {};
                        threads[thInd].name = obj[i].thName;
                        threads[thInd].xend = str[ind].mtds[mind].posX;
                        threads[thInd].clzName = obj[i].className;
                        threads[thInd].mtdName = obj[i].methodName;
                        thFound = thInd;
                        thInd++;
                    }
                    if (obj[i].start) {
                        threads[thFound].startTime = obj[i].time;
                    } else {
                        threads[thFound].endTime = obj[i].time;
                    }
                }
            }
            i++;
        }
        return threads;
    };
    //var str = {
    //    clr: '',            color
    //    clzName : '',       classname
    //    mtds: []            methods
    //    hash: 0             class hash
    //};
    models.buildClassStructure = function (obj) {
        var i = 0;
        var str = [];
        var thclrind = 0;
        var thNames = [];
        var clNames = [];
        while (i < obj.length) {
            if (thNames.indexOf(obj[i].thName) == -1) {
                thNames.push(obj[i].thName)
            }
            if (clNames.indexOf(obj[i].className) == -1) {
                clNames.push(obj[i].className);
                str[thclrind] = {};
                str[thclrind].clr = clzclrs[thclrind];
                str[thclrind].clzName = obj[i].className;
                str[thclrind].hash = obj[i].hash;
                str[thclrind].mtds = [{'name': obj[i].methodName}];
                thclrind++;
            } else {
                var ind = models.findIndByClazzName(str, obj[i].className);
                var mind = models.findIndByMethodName(str[ind].mtds, obj[i].methodName);
                if (mind == -1) {
                    str[ind].mtds.push({'name': obj[i].methodName});
                }
            }
            i++;
        }
        return str;
    };

    models.containsPkgName = function (root, name) {
        var ind = 0;
        while (ind < root.pkgs.length && root.pkgs[ind].name !== name) {
            ind++;
        }
        return (root.pkgs.length == ind) ? -1 : ind
    };
    models.containsClzName = function (root, name) {
        var ind = 0;
        while (ind < root.clzs.length && root.clzs[ind].name !== name) {
            ind++;
        }
        return (root.clzs.length == ind) ? -1 : ind
    };
    models.containsClzInstance = function (instances, hash) {
        var ind = 0;
        while (ind < instances.length && instances[ind].hash !== hash) {
            ind++;
        }
        return (instances.length == ind) ? -1 : ind
    };

    //build recursive tree structure of package - class - method
    // {
    //    name: '',
    //    collapsed : true,
    //    pkgs: [{
    //        name: 'com'
    //        collapsed : true,
    //        pkgs: [
    //            {}
    //        ],
    //        clzs: [
    //            {
    //                name: 'Main',
    //                collapsed : true,
    //                insts: [
    //                    {
    //                        hash: 0,
    //                        mtds: [
    //                            {
    //                                name: 'doStuff'
    //                            }
    //                        ]
    //                    }
    //                ],
    //                anonymous: [
    //                    {
    //                        hash: 0,
    //                        name: '',
    //                        mtds: [
    //                            {
    //                                name: 'actionPerform'
    //                            }
    //                        ]
    //                    }
    //                ]
    //            }
    //        ]
    //    }
    //    ],
    //    clzs: []
    //}
    models.collapseByPackage = function (w, pkgs, obj) {
        var result = pkgs;
        if (result.collapsed === undefined) {
            result.collapsed = true;
            result.clr = pkgClr;
            result.lineClr = pkgLineClr;
            result.classclr = clzClr;
            result.classlineClr = clzLineClr;
            result.mtdlineClr = mtdLineClr;
            result.name = 'root';
            result.pkgs = [];
            result.clzs = [];
        }
        var i = 0;
        while (i < obj.length) {
            var strs = obj[i].className.split('/');
            var j = 0;
            var root = result;
            while (j < strs.length - 1) {
                var pInd = models.containsPkgName(root, strs[j]);
                if (pInd === -1) {
                    pInd = root.pkgs.length;
                    root.pkgs[pInd] = {};
                    root.pkgs[pInd].collapsed = true;
                    root.pkgs[pInd].name = strs[j];
                    root.pkgs[pInd].pkgs = [];
                    root.pkgs[pInd].clzs = [];
                }
                root = root.pkgs[pInd];
                j++;
            }
            var cleanName = strs[strs.length - 1].indexOf('$') === -1 ? strs[strs.length - 1] : strs[strs.length - 1].substring(0, strs[strs.length - 1].indexOf('$'));
            var cInd = models.containsClzName(root, cleanName);
            if (cInd === -1) {
                cInd = root.clzs.length;
                root.clzs[cInd] = {};
                root.clzs[cInd].name = cleanName;
                root.clzs[cInd].collapsed = true;
                root.clzs[cInd].insts = [];
                root.clzs[cInd].anonymous = [];
            }
            var box = strs[strs.length - 1].indexOf('$') == -1 ? root.clzs[cInd].insts : root.clzs[cInd].anonymous = [];
            var hInd = models.containsClzInstance(box, obj[i].hash);
            if (hInd === -1) {
                hInd = box.length;
                box[hInd] = {};
                box[hInd].hash = obj[i].hash;
                box[hInd].name = strs[strs.length - 1];
                box[hInd].mtds = [{'name': obj[i].methodName}];
            } else {
                var mind = models.findIndByMethodName(box[hInd].mtds, obj[i].methodName);
                if (mind == -1) {
                    box[hInd].mtds.push({'name': obj[i].methodName});
                }
            }
            i++;
        }
        return resetXWhereVisible(result, 10, w);
    };

    function resetXWhereVisible(result, xs, xe) {
        if (result.xS === undefined) {
            result.xS = (xe - xs) / 2 - 20;
            result.xE = (xe - xs) / 2 + 20;
            result.y = 15;
        }
        if (result.collapsed) {
            var j;
            var allNum = result.pkgs.length + result.clzs.length;
            var gap = (result.xE - result.xS) < allNum ? -1 : Math.floor((result.xE - result.xS) / allNum);
            if (gap === -1) {
                for (j = 0; j < result.clzs.length; j++) {
                    result.clzs[j].x = result.xS + 3;
                }
                for (j = 0; j < result.pkgs.length; j++) {
                    result.pkgs[j].x = result.xS - 3;
                }
            } else {
                for (j = 0; j < result.clzs.length; j++) {
                    result.clzs[j].x = result.xS + gap*j;
                }
                for (j = 0; j < result.pkgs.length; j++) {
                    result.pkgs[j].x = result.xS + gap*result.clzs.length + gap*j;
                }
            }
        }else{

        }
        return result;
    }

    models.getClassStructure = function (strFrom, startX, endX) {
        var i = 0;
        var str = [];
        while (i < strFrom.length) {
            if (strFrom[i].prX > startX && strFrom[i].prX < endX) {
                str.push(strFrom[i]);
            } else if (strFrom[i].lstX > startX && strFrom[i].lstX < endX) {
                str.push(strFrom[i]);
            }
            i++;
        }
        return str;
    };

    function getNewXIndex(itemX, w, startX, endX, zoomPc) {
        if (itemX <= startX) {
            return 0;
        } else if (itemX >= endX) {
            return w;
        } else {
            return (itemX - startX) * zoomPc;
        }
    }

    models.recalculateX = function (strFrom, w, startX, endX) {
        var i = 0;
        var zoomPc = w / ( endX - startX);
        while (i < strFrom.length) {
            strFrom[i].prX = getNewXIndex(strFrom[i].prX, w, startX, endX, zoomPc);
            strFrom[i].lstX = getNewXIndex(strFrom[i].lstX, w, startX, endX, zoomPc);
            var j = 0;
            while (j < strFrom[i].mtds.length) {
                strFrom[i].mtds[j].posX = getNewXIndex(strFrom[i].mtds[j].posX, w, startX, endX, zoomPc);
                j++;
            }
            i++;
        }
        return strFrom;
    };

    //var str = {
    //    clr: '',            color
    //    clzName : '',       classname
    //    mtds: [name, posX]  methods,
    //    prX: 0,             x-start-coordinate
    //    lstX: 0             x-end-coordinate
    //};
    models.buildXIndex = function (w, str) {
        var gap = 0;
        if (str.length > 0) {
            gap = (w - thGap) / (str.length + 1);
        }
        if (gap < 30) {
            // need repack, visual data will be in mess
        } else {
            var i = 0;
            while (i < str.length) {
                var mgap = (gap - 15) / str[i].mtds.length;
                str[i].prX = thGap + gap * i;
                str[i].lstX = thGap + gap * (i + 1) - 15 - mgap + 1;
                var j = 0;
                while (j < str[i].mtds.length) {
                    str[i].mtds[j].posX = str[i].prX + mgap * j;
                    j++;
                }
                i++;
            }
        }
        return str;
    }

}(window.models = window.models || {}, jQuery));