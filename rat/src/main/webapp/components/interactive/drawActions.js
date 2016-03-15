'use strict';
(function(drawAction, $, undefined ) {
    drawAction.drawTxt = function (ctx, lx, ly, text) {
        ctx.font = "10px Arial";
        ctx.fillStyle = '#000000';
        ctx.fillText(text, lx, ly);
    };

    drawAction.drawHorizontalCurve = function (ctx, lX, lY, cX, cY, clr, up) {
        ctx.beginPath();
        ctx.moveTo(lX, lY);
        var crv = 5 * (up ? -1 : 1);
        ctx.bezierCurveTo(lX, lY + crv, cX, lY + crv, cX, cY);
        ctx.strokeStyle = clr;
        ctx.stroke();
        ctx.closePath();
    };

    drawAction.draw = function (ctx, lX, lY, cX, cY, clr) {
        ctx.beginPath();
        ctx.moveTo(lX, lY);
        ctx.lineTo(cX, cY);
        ctx.strokeStyle = clr;
        ctx.stroke();
        ctx.closePath();
    };

    drawAction.drawRect = function (ctx, lX, lY, cX, cY, clr) {
        ctx.beginPath();
        ctx.rect(lX, lY, cX - lX, cY - lY);
        ctx.fillStyle = clr;
        ctx.fill();
        ctx.closePath();
    };
}(window.drawAction = window.drawAction || {}, jQuery ));