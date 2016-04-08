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
        var upperGap = 140;
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

    function findCorrespondedX(pkgs, clazz, hash) {
        var strs = clazz.split('/');
        var j = 0, root = pkgs, lastmv = false;
        while (j < strs.length - 1) {
            var pInd = models.containsPkgName(root, strs[j]);
            if (lastmv) {
                return root.x;
            }
            if (pInd !== -1) {
                if (root.collapsed) {
                    lastmv = true;
                }
                root = root.pkgs[pInd];
                j++;
            } else {
                return -1;
            }
        }
        if (lastmv) {
            return root.x;
        }
        var cleanName = strs[strs.length - 1].indexOf('$') === -1 ? strs[strs.length - 1] : strs[strs.length - 1].substring(0, strs[strs.length - 1].indexOf('$'));
        var cInd = models.containsClzName(root, cleanName);
        if (cInd !== -1) {
            var box = strs[strs.length - 1].indexOf('$') === -1 ? root.clzs[cInd].insts : root.clzs[cInd].anonymous;
            var hInd = models.containsClzInstance(box, hash);
            if (hInd !== -1) {
                return box[hInd].x;
            }
        }
        return -1;
    }

    models.buildThreads = function (obj, pkgs) {
        var i = 0, thInd = 0;
        var threads = [];
        while (i < obj.length) {
            var x = findCorrespondedX(pkgs, obj[i].className, obj[i].hash);
            if (x != -1) {
                var thFound = models.findUnfinishedThreadByClzNameMethodName(threads, obj[i].className, obj[i].methodName, obj[i].thName);
                if (thFound == -1) {
                    threads[thInd] = {};
                    threads[thInd].name = obj[i].thName;
                    threads[thInd].xend = x;
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
            i++;
        }
        return threads;
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
            result.clrBox = {
                clr: pkgClr,
                lineClr: pkgLineClr,
                classclr: clzClr,
                classlineClr: clzLineClr,
                mtdlineClr: mtdLineClr
            };
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
            var box = strs[strs.length - 1].indexOf('$') === -1 ? root.clzs[cInd].insts : root.clzs[cInd].anonymous;
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
        resetXWhereVisible(result, 40, w, 0);
        return result;
    };

    var collapsedSize = 39;

    function resetXWhereVisible(result, xs, xe, y) {
        result.y = y + 15;
        result.xS = xs;
        result.xE = xe;
        var allNum;
        if (result.collapsed) {
            if ((xe - xs) > collapsedSize) {
                result.xS = (xe - xs) / 2 - 20;
                result.xE = (xe - xs) / 2 + 20;
            }
            var j;
            if (result.pkgs !== undefined) {
                allNum = result.pkgs.length + result.clzs.length;
                var gap = (result.xE - result.xS) < allNum ? -1 : Math.floor((result.xE - result.xS) / allNum);
                if (gap === -1) {
                    for (j = 0; j < result.clzs.length; j++) {
                        result.clzs[j].x = result.xS + 3;
                    }
                    for (j = 0; j < result.pkgs.length; j++) {
                        result.pkgs[j].x = result.xE - 3;
                    }
                } else {
                    for (j = 0; j < result.clzs.length; j++) {
                        result.clzs[j].x = result.xS + gap * j;
                    }
                    for (j = 0; j < result.pkgs.length; j++) {
                        result.pkgs[j].x = result.xS + gap * result.clzs.length + gap * j;
                    }
                }
            } else {
                allNum = result.insts.length + result.anonymous.length;
                var gapH = (result.xE - result.xS) < allNum ? -1 : Math.floor((result.xE - result.xS) / allNum);
                if (gapH === -1) {
                    for (j = 0; j < result.insts.length; j++) {
                        result.insts[j].x = result.xS + 3;
                    }
                    for (j = 0; j < result.anonymous.length; j++) {
                        result.anonymous[j].x = result.xS + 3;
                    }
                } else {
                    for (j = 0; j < result.insts.length; j++) {
                        result.insts[j].x = result.xS + gapH * j;
                    }
                    for (j = 0; j < result.anonymous.length; j++) {
                        result.anonymous[j].x = result.xS + gapH * j;
                    }
                }
            }
        } else {
            allNum = result.pkgs.length + result.clzs.length;
            var mingap = (result.xE - result.xS) / allNum;
            if (mingap < collapsedSize) {
                //too tiny blocks. do not allow expand further , rollback expansion and return
                result.collapsed = true;
                resetXWhereVisible(result, xs, xe, y);
                return;
            }
            var allExpanded = 0;
            for (j = 0; j < result.pkgs.length; j++) {
                if (!result.pkgs[j].collapsed) {
                    allExpanded++;
                }
            }
            var expandedSize = ((xe - xs) - (allNum - allExpanded) * 40) / allExpanded;
            var position = xs;
            for (j = 0; j < result.clzs.length; j++) {
                if (result.clzs[j].collapsed) {
                    resetXWhereVisible(result.clzs[j], position, position + collapsedSize, result.y);
                    position = position + collapsedSize + 1;
                }
            }
            for (j = 0; j < result.pkgs.length; j++) {
                if (result.pkgs[j].collapsed) {
                    resetXWhereVisible(result.pkgs[j], position, position + collapsedSize, result.y);
                    position = position + collapsedSize + 1;
                } else {
                    resetXWhereVisible(result.pkgs[j], position, position + expandedSize, result.y);
                    position = position + expandedSize + 1;
                }
            }
        }
    }

    models.checkActionAndDo = function (pkgs, x, y, w) {
        if (findAndDoCollapseAction(pkgs, x, y)) {
            resetXWhereVisible(pkgs, 40, w, 0);
            return true;
        }
        return false;
    };

    function findAndDoCollapseAction(itms, x, y) {
        if (inActionSquare(itms.xE, itms.y, x, y)) {
            itms.collapsed = !itms.collapsed;
            return true;
        } else if (y > itms.y) {
            var j;
            if (itms.pkgs !== undefined) {
                for (j = 0; j < itms.clzs.length; j++) {
                    if (findAndDoCollapseAction(itms.clzs[j], x, y)) {
                        return true;
                    }
                }
                for (j = 0; j < itms.pkgs.length; j++) {
                    if (findAndDoCollapseAction(itms.pkgs[j], x, y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function inActionSquare(xe, ye, x, y) {
        return x < xe && y < ye && (xe - x) < 10 && (ye - y) < 10;
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