'use strict';
(function (recalculations, $, undefined) {
    var w, h;

    recalculations.init = function (width, height) {
        w = width;
        h = height;
    };

    recalculations.redrawByZoom = function (startX, startY, endX, endY) {
        var obj = state.rawData;
        var str = models.getClassStructure(state.visibleStr, startX < endX ? startX : endX, startX > endX ? startX : endX);
        str = models.recalculateX(str, w, startX < endX ? startX : endX, startX > endX ? startX : endX);
        state.visibleStr = str;
        drawclzz(ctx, str);

        var threads = models.filterThreads(state.visibleThrs, startY, endY, startX, endX);
        if (threads.length != 0) {
            threads = models.updateThreadX(threads, str);
            var tme = models.getTimeBorders(threads);
            threads = models.setThreadY(threads, tme.tmin, tme.tmax, h);
            state.visibleThrs = threads;

            drawItems.drawTime( tme.tmin, tme.tmax);
            drawItems.drawThreads( threads);
        }
    };

    recalculations.redrawByTimer = function (obj) {
        var obj = state.rawData;
        var pkgs = models.collapseByPackage(w, state.pkgs, obj);

        //var str = models.buildClassStructure(obj);
        //str = models.buildXIndex(w, str);
        //var threads = models.buildThreads(obj, str);
        //var tme = models.getTimeBorders(threads);
        //threads = models.setThreadY(threads, tme.tmin, tme.tmax, h);
        //state.visibleStr = str;
        //state.visibleThrs = threads;

        drawItems.drawPkgs(pkgs);
        //drawItems.drawclzz(str);
        //drawItems.drawTime( tme.tmin, tme.tmax);
        //drawItems.drawThreads( threads);
    };

}(window.recalculations = window.recalculations || {}, jQuery));