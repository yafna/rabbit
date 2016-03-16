'use strict';
(function (models, $, undefined) {

    var thGap = 20;
    var clzclrs = ['#206020', '#336600', '#446600', '#008000', '#006633', '#004d00', '#009900'];

    //-1 if nothing found
    models.findIndByMethodName = function(mtds, name) {
        var mind = 0;
        while (mind < mtds.length && mtds[mind].name != name) {
            mind++
        }
        return (mtds.length == mind) ? -1 : mind
    };

    //-1 if nothing found
    models.findIndByClazzName = function(str, name) {
        var ind = 0;
        while (ind < str.length && str[ind].clzName != name) {
            ind++
        }
        return (str.length == ind) ? -1 : ind
    };

    models.getTimeMin = function (obj) {
        var i = 0;
        var tmmin = obj[0].time;
        while (i < obj.length) {
            if (tmmin > obj[i].time) {
                tmmin = obj[i].time;
            }
            i++;
        }
        return tmmin;
    };
    models.getTimeMax = function (obj) {
        var i = 0;
        var tmmax = obj[0].time;
        while (i < obj.length) {
            if (tmmax < obj[i].time) {
                tmmax = obj[i].time;
            }
            i++;
        }
        return tmmax;
    };

    //var str = {
    //    clr: '',            color
    //    clzName : '',       classname
    //    mtds: []            methods
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