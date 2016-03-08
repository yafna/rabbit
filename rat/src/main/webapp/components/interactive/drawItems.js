(function (drawItems, $, undefined) {
    var w, h;
    var thclr = '#ff0000';
    var fadedClr = '#e6ffe6';
    var timeClr = '#c2d6d6';
    var thGap = 20;

    drawItems.redraw = function (ctx, str, obj, tmmin, tmmax, ww, hh) {
        w = ww;
        h = hh;
        ctx.clearRect(0, 0, w, h);
        var str2 = drawclzz(ctx, str);
        drawTime(ctx, tmmin, tmmax);
        drawThreads(ctx, obj, str2, tmmin, tmmax);
    };


    function drawclzz(ctx, str) {
        var i = 0;
        var upperGap = 30;
        while (i < str.length) {
            var mgap = (str[i].lstX - str[i].prX) / str[i].mtds.length;
            drawAction.drawTxt(ctx, str[i].prX, 10, str[i].clzName);
            drawAction.draw(ctx, str[i].prX, upperGap, str[i].lstX - mgap + 1, upperGap, str[i].clr);
            drawAction.drawRect(ctx, str[i].prX, upperGap, str[i].lstX - mgap + 1, h, fadedClr);
            var j = 0;
            while (j < str[i].mtds.length) {
                str[i].mtds[j].posX = str[i].prX + mgap * j;
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
            var ind = 0;
            while (str[ind].clzName != obj[i].className) {
                ind++
            }
            var mind = 0;
            while (str[ind].mtds[mind].name != obj[i].methodName) {
                mind++
            }
            drawAction.drawHorixontalCurve(ctx, thGap / 2, upperGap + currtime, str[ind].mtds[mind].posX, upperGap + currtime, thclr, obj[i].start);
            i++;
        }
        draw(ctx, thGap / 2, 0, thGap / 2, h, thclr);
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