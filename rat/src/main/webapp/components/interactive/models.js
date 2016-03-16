'use strict';
(function(models, $, undefined ) {

    var thGap = 20;
    var clzclrs = ['#206020', '#336600', '#446600', '#008000', '#006633', '#004d00', '#009900'];
    var allData;

    //-1 if nothing found
    function findIndByMethodName(mtds, name){
        var mind = 0;
        while (mind < mtds.length && mtds[mind].name != name) {
            mind++
        }
        return (mtds.length == mind)? -1 : mind
    }

    //-1 if nothing found
    function findIndByClazzName(str, name){
        var ind = 0;
        while (str[ind].clzName != name) {
            ind++
        }
        return (str.length == ind)? -1 : ind
    }

    models.getTimeMin = function(obj){
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
    models.getTimeMax = function(obj){
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
    models.buildClassStructure = function(obj){
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
                var ind = findIndByClazzName(str, obj[i].className);
                var mind = findIndByMethodName(str[ind].mtds,  obj[i].methodName);
                if ( mind == -1) {
                    str[ind].mtds.push({'name': obj[i].methodName});
                }
            }
            i++;
        }
        allData = str;
        return str;
    };

    models.buildXIndex = function(w, str){
        var gap = 0;
        if (str.length > 0) {
            gap = (w - thGap) / (str.length + 1);
        }

        var i = 0;
        while (i < str.length) {
            str[i].prX = thGap + gap * i;
            str[i].lstX = thGap + gap * (i + 1) - 15;
            i++;
        }
        return str;
    }

}(window.models = window.models || {}, jQuery ));