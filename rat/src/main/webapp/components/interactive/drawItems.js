'use strict';
(function (drawItems, $, undefined) {
    var ctx, w, h;
    var thclr = '#ff0000';
    var fadedClr = '#e6ffe6';
    var timeClr = '#c2d6d6';
    var thGap = 20;
    var visibleStr;  //state

    drawItems.init = function (zmEl, width, height) {
        ctx = zmEl.getContext('2d');
        w = width;
        h = height;
        zmEl.setAttribute('width', w);
        zmEl.setAttribute('height', h);
    };

    drawItems.redrawByZoom = function (startX, startY, endX, endY) {
        var obj = state.rawData;
        ctx.clearRect(0, 0, w, h);
        var str = models.getClassStructure(state.visibleStr, startX < endX ? startX : endX, startX > endX ? startX : endX);
        str = models.recalculateX(str, w, startX < endX ? startX : endX, startX > endX ? startX : endX);
        var tmmin = models.getTimeMin(obj);
        var tmmax = models.getTimeMax(obj);
        state.visibleStr = str;

        drawclzz(ctx, str);
        drawTime(ctx, tmmin, tmmax);
        drawThreads(ctx, obj, str, tmmin, tmmax);
    };

    drawItems.redrawByTimer = function () {
        var obj = state.rawData;
        ctx.clearRect(0, 0, w, h);
        var str = models.buildClassStructure(obj);
        str = models.buildXIndex(w, str);
        var tmmin = models.getTimeMin(obj);
        var tmmax = models.getTimeMax(obj);
        state.visibleStr = str;

        drawclzz(ctx, str);
        drawTime(ctx, tmmin, tmmax);
        drawThreads(ctx, obj, str, tmmin, tmmax);
    };


    function drawclzz(ctx, str) {
        var i = 0;
        var upperGap = 30;
        while (i < str.length) {
            drawAction.drawTxt(ctx, str[i].prX, 10, str[i].clzName);
            drawAction.draw(ctx, str[i].prX, upperGap, str[i].lstX, upperGap, str[i].clr);
            drawAction.drawRect(ctx, str[i].prX, upperGap, str[i].lstX, h, fadedClr);
            var j = 0;
            while (j < str[i].mtds.length) {
                drawAction.drawTxt(ctx, str[i].mtds[j].posX, 20, str[i].mtds[j].name);
                drawAction.draw(ctx, str[i].mtds[j].posX, upperGap, str[i].mtds[j].posX, h, str[i].clr);
                j++;
            }
            i++;
        }
        return str;
    }

    function drawThreads(ctx, obj, str, tmmin, tmmax) {
        var upperGap = 40;
        var timeitem = (h - upperGap - 10) / (tmmax - tmmin);
        var i = 0;
        while (i < obj.length) {
            var currtime = (obj[i].time - tmmin) * timeitem;
            var ind = models.findIndByClazzName(str, obj[i].className);
            if (ind != -1) {
                var mind = models.findIndByMethodName(str[ind].mtds, obj[i].methodName);
                if (mind != -1) {
                    drawAction.drawHorizontalCurve(ctx, thGap / 2, upperGap + currtime, str[ind].mtds[mind].posX, upperGap + currtime, thclr, obj[i].start);
                }
            }
            i++;
        }
        drawAction.draw(ctx, thGap / 2, 0, thGap / 2, h, thclr);
    }

    function drawTime(ctx, tmmin, tmmax) {
        var upperGap = 40;
        var timeitem = (h - upperGap - 10) / (tmmax - tmmin);
        var i = 0;
        var delimiters = tmmax - tmmin > 7 ? 7 : tmmax - tmmin;
        var tmItem = tmmin;
        while (i < delimiters) {
            var currtime = upperGap + (tmItem == tmmin ? 0 : (tmItem - tmmin) * timeitem);
            drawAction.drawTxt(ctx, thGap / 2, currtime - 5, wraptime(tmItem));
            drawAction.draw(ctx, thGap / 2, currtime, w, currtime, timeClr);
            i++;
            if (i == delimiters - 1) {
                tmItem = tmmax;
            } else {
                tmItem += i * ((tmmax - tmmin) / delimiters);
            }
        }
        drawAction.draw(ctx, thGap / 2, 0, thGap / 2, h, thclr);
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
}(window.drawItems = window.drawItems || {}, jQuery));