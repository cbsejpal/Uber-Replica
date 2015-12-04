/**
 * Created by Rushil on 11/30/2015.
 */
/**
 * Created by Rushil on 11/23/2015.
 */
var app = angular.module('ngMap');

app.controller('navbar', ['$rootScope', '$scope', '$http', function ($scope, $rootScope, $http) {


}]);

app.run(function ($rootScope) {

});

app.controller('ngMap1', function ($rootScope, $scope, $http, NgMap) {

    $scope.rides = [];

    NgMap.getMap().then(function (map) {
        $rootScope.map = map;


    });

    $scope.rideCity = "";

    $scope.init = function(){
        $scope.getCities();
        $scope.getRidesFromCity();
    };

    $scope.getCities = function(){
        $http({
            method: "GET",
            url: '/cityList',
            params: {
            }
        }).success(function (response) {
            $scope.cities = response;
            $scope.selected = $scope.cities[0];

            //startPosition = $scope.items.length;
        }).error(function(err){
            $scope.cities = [];
        });
    };

    $scope.getRidesFromCity = function(city){
        //alert(city);
        $http({
            method: "GET",
            url: '/cityRides',
            params: {
                "rideCity": city
            }
        }).success(function (response) {
           // alert(JSON.stringify(response));
            $scope.rides = response;

            //startPosition = $scope.items.length;
        }).error(function(err){
            $scope.rides = [];
        });
    };

    //This method is of no use.
    $rootScope.mouseover = function () {
        console.log('mouseover', this);
        this.style.backgroundColor = 'grey';
    };

    //This method is of no use.
    $rootScope.mouseout = function () {
        this.style.backgroundColor = 'white';
    };

    /**
     * TODO: Have to fix this issue that's whay its commented. on-place-changed not getting call when setting it to current place
     * Created by: Rushil Shah
     */
    $rootScope.currentPositionOnclick = function () {
        /*  $rootScope.origin = 'current-location';
         vm.place = 'current-location';
         vm.placeChanged('origin');*/
    };


});