'use strict';
(function (treemodel, $, undefined) {


    //extracts from mtds package+class tree information and builds it in a tree structure.
    //node {
    //   name: ''
    //   children : [ ... node ... ]
    //}
    treemodel.buildTree = function(mtds){
        var root = {};
        root.name = "root";
        root.children = [];
        for(var j = 0; j < mtds.length; j++){
            var pkgs = mtds[j].className.split('/');
            var  pointer = root.children;
            for(var k = 0; k < pkgs.length; ++k){
                var ind = findAndInsertIfMissing(pointer, pkgs[k]);
                pointer = pointer[ind].children;
            }
            findAndInsertIfMissing(pointer, mtds[j].methodName);
        }
        return root;
    }

    function findAndInsertIfMissing(pointer, nodeName){
         var ind = containNode(pointer, nodeName);
             if(ind === -1){
                 ind = pointer.length;
                 pointer[ind] = {};
                 pointer[ind].name = nodeName;
                 pointer[ind].children = [];
             }
         return ind;
    }

    // returns index or -1 otherwise
    function containNode(arrayNodes, nodeName){
        for(var j = 0; j < arrayNodes.length; j++){
           if(arrayNodes[j].name === nodeName){
                return j;
           }
        }
        return -1;
    }

}(window.treemodel = window.treemodel || {}, jQuery));