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
                      container = document.getElementById( 'container' );
                      jtree.init(container);
                      jtree.animate();
                 }
             );
         };

         function getData() {
             return $http.get("/data/packAll");
         }
    }])