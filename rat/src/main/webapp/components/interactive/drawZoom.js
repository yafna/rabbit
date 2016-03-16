'use strict';
(function (drawZoom, $, undefined) {

    var zoomModeEnabled = false;
    var zoomEl, rect, ctxZoom, w, h;
    var zoomState = {
        selecting: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    };

    function onMouseDown(event) {
        if (zoomModeEnabled) {
            zoomState.selecting = true;
            zoomState.startX = event.pageX - rect.left;
            zoomState.startY = event.pageY - rect.top;
        }
    }

    function onMouseMove(event) {
        if (zoomModeEnabled && zoomState.selecting) {
            zoomState.endX = event.pageX - rect.left;
            zoomState.endY = event.pageY - rect.top;
            ctxZoom.clearRect(0, 0, w, h);
            drawAction.drawEmptyRect(ctxZoom, zoomState.startX, zoomState.startY, zoomState.endX, zoomState.endY);
        }
    }

    function onMouseUp(event) {
        if (zoomModeEnabled && zoomState.selecting) {
            zoomState.selecting = false;
            ctxZoom.clearRect(0, 0, w, h);
        }
    }

    drawZoom.init = function (zmEl, width, height) {
        zoomEl = zmEl;
        w = width;
        h = height;
        zoomEl.setAttribute('width', w);
        zoomEl.setAttribute('height', h);
        rect = zoomEl.getBoundingClientRect();
        ctxZoom = zoomEl.getContext('2d');

        zoomEl.addEventListener('mousemove', onMouseMove, true);
        zoomEl.addEventListener('mousedown', onMouseDown, true);
        zoomEl.addEventListener('mouseup', onMouseUp, true);
        zoomEl.addEventListener('selectstart', function (e) {
            e.preventDefault();
            return false;
        }, false);
    };
    drawZoom.doZoom = function (enableZoomMode) {
        zoomModeEnabled = enableZoomMode;
    };
}(window.drawZoom = window.drawZoom || {}, jQuery));
