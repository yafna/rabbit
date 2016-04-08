'use strict';
(function(state, $, undefined ) {
    //state.zoomState = {
    //    selecting: false,
    //    startX: 0,
    //    startY: 0,
    //    endX: 0,
    //    endY: 0
    //};
    state.rawData = [];
    state.allRawData = [];
    state.visibleStr = [];
    state.visibleThrs = [];
    state.pkgs = {};
}(window.state = window.state || {}, jQuery ));