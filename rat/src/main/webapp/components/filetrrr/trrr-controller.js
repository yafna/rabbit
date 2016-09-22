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

         self.getPack = function () {
              getData().then(
                 function (resp) {
                      $scope.dataForTheTree =  resp.data;
//                      			sample.init(document.getElementById( 'container' ));
//                      			sample.animate();
                      jtree.init(document.getElementById( 'container' ), resp.data, document.getElementById( 'upperRow' ).offsetHeight);
                      jtree.animate();
                 }
             );
         };

         function getData() {
             return $http.get("/data/packAll");
         }
    }])