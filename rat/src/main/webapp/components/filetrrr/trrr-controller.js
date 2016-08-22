'use strict';

angular.module('myApp.filetrrr', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/filetrrr', {
            templateUrl: 'components/filetrrr/filetrrr.html'
        });
    }])
    .controller('TControl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
         var self = this;
         $scope.mtds = [];
         var stop;

         self.startTimer = function () {
             if (angular.isDefined(stop)) return;
             stop = $interval(function () {
                 getData().then(
                         function (resp) {
                             if (self.mtds === undefined) {
                                 self.mtds = resp.data;
                                 $scope.mtds = self.mtds;
                             } else {
                                 self.mtds = self.mtds.concat(resp.data);
                                 $scope.mtds = self.mtds;
                             }
                         }
                 );
             }, 500);
         };

         self.stopTimer = function () {
             if (angular.isDefined(stop)) {
                 $interval.cancel(stop);
                 stop = undefined;
             }
         };

         self.getPack = function () {
             if (angular.isDefined(stop)) return;
             getData().then(
                 function (resp) {
                         var root = treemodel.buildTree(resp.data);
                         $scope.dataForTheTree = root;
                 }
             );
         };

         function getData() {
             return $http.get("/data/pack");
         }


         $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
         }

         getPack();
    }])