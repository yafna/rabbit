'use strict';
(function (drawItems, $, undefined) {
    var ctx, w, h;
    var thclr = '#ff0000';
    var fadedClr = '#e6ffe6';
    var timeClr = '#c2d6d6';
    var white = '#ffffff';
    var black = '#0d0d0d';
    var thGap = 20;
    var upperGapClz = 30;
    var upperGapTime = 40;
    var visibleStr;  //state

    drawItems.init = function (zmEl, width, height) {
        ctx = zmEl.getContext('2d');
        w = width;
        h = height;
        zmEl.setAttribute('width', w);
        zmEl.setAttribute('height', h);
    };

    drawItems.drawPkgs = function (pkgs) {
        ctx.clearRect(0, 0, w, h);
        var i = 0;
        drawAction.drawRect(ctx, pkgs.xS, 0,  pkgs.xE, h, pkgs.clr);
        drawAction.drawTxt(ctx, pkgs.xS, pkgs.y, pkgs.name);
        drawAction.drawRect(ctx, pkgs.xE-10, pkgs.y-10, pkgs.xE, pkgs.y, white);
        if(pkgs.collapsed){
            drawAction.draw(ctx, pkgs.xE-8, pkgs.y-5, pkgs.xE-2, pkgs.y-5, black);
            drawAction.draw(ctx, pkgs.xE-5, pkgs.y-2, pkgs.xE-5, pkgs.y-8, black);
            drawItems.drawPkgClassLines(pkgs.y, pkgs.pkgs, pkgs.clzs, pkgs.classlineClr, pkgs.lineClr);
        }else{
            drawAction.draw(ctx, pkgs.xE-8, pkgs.y-5, pkgs.xE-2, pkgs.y-5, black);
        }
    };

    drawItems.drawPkgClassLines = function(y, pkgs, clzs , classlineClr, pkgLineClr){
        var j;
        for (j = 0; j < pkgs.length; j++) {
            drawAction.draw(ctx, pkgs[j].x, y, pkgs[j].x, h, pkgLineClr);
        }
        for (j = 0; j < clzs.length; j++) {
            drawAction.draw(ctx, clzs[j].x, y, clzs[j].x, h, classlineClr);
        }
    };

    drawItems.drawclzz = function (str) {
        var i = 0;
        while (i < str.length) {
            drawAction.drawTxt(ctx, str[i].prX, 10, str[i].clzName);
            drawAction.draw(ctx, str[i].prX, upperGapClz, str[i].lstX, upperGapClz, str[i].clr);
            drawAction.drawRect(ctx, str[i].prX, upperGapClz, str[i].lstX, h, fadedClr);
            var j = 0;
            while (j < str[i].mtds.length) {
                drawAction.drawTxt(ctx, str[i].mtds[j].posX, 20, str[i].mtds[j].name);
                drawAction.draw(ctx, str[i].mtds[j].posX, upperGapClz, str[i].mtds[j].posX, h, str[i].clr);
                j++;
            }
            i++;
        }
        return str;
    };

    drawItems.drawThreads = function (threads) {
        var i = 0;
        while (i < threads.length) {
            var startT, endT;
            if (threads[i].sy === undefined) {
                startT = upperGapTime;
            } else {
                startT = threads[i].sy;
                drawAction.drawHorizontalCurve(ctx, thGap / 2, threads[i].sy, threads[i].xend, threads[i].sy, thclr, true);
            }
            if (threads[i].ey === undefined) {
                endT = h;
            } else {
                endT = threads[i].ey;
                drawAction.drawHorizontalCurve(ctx, thGap / 2, threads[i].ey, threads[i].xend, threads[i].ey, thclr, false);
            }
            drawAction.draw(ctx, threads[i].xend, startT, threads[i].xend, endT, thclr);
            i++;
        }
    };

    drawItems.drawTime = function (tmmin, tmmax) {
        var timeitem = (h - upperGapTime - 10) / (tmmax - tmmin);
        var i = 0;
        var delimiters = tmmax - tmmin > 7 ? 7 : tmmax - tmmin;
        var tmItem = tmmin;
        while (i < delimiters) {
            var currtime = upperGapTime + (tmItem == tmmin ? 0 : (tmItem - tmmin) * timeitem);
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
    };

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