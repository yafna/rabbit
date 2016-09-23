'use strict';

angular.module('myApp.filetrrr', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/filetrrr', {
            templateUrl: 'components/filetrrr/filetrrr.html'
        });
    }])
    .controller('TControl', ['$scope', '$http',  function ($scope, $http) {
         var self = this;
         $scope.dataForTheTree = {};
         jtree.init();

         self.getPack = function () {
              getData().then(
                 function (resp) {
                      $scope.dataForTheTree =  resp.data;
                      jtree.loadData(document.getElementById( 'container' ), resp.data, document.getElementById( 'upperRow' ).offsetHeight);
                      jtree.animate();
                 }
             );
         };

        self.treeAction = function (fullName) {
              console.log("treeAction" + fullName)
              treeClicked(fullName).then(
                 function (resp) {
                      $scope.dataForTheTree = resp.data;
//                      jtree.init(document.getElementById( 'container' ), resp.data, document.getElementById( 'upperRow' ).offsetHeight);
//                      jtree.animate();
                 }
             );
         };


         function getData() {
             return $http.get("/data/packAll");
         }

         function treeClicked(fullName){
              return $http.get("/data/recalculate/packages/" + fullName) ;
         }
    }])