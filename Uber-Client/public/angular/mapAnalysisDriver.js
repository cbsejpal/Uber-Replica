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

    $scope.init = function(driverId){
        $http({
            method: "GET",
            url: '/driverRides',
            params: {
                "driverId": driverId
            }
        }).success(function (response) {
            $scope.rides = response;
            //startPosition = $scope.items.length;
        }).error(function(err){
            $scope.rides = [];
        });
    };


    NgMap.getMap().then(function (map) {
        $rootScope.map = map;


    });

    //$scope.getCurrentRideInfo();

    //When the destination changed this method got called to set the longitude and latitude of destination
    $scope.dplaceChanged = function () {
        $scope.dplace = this.getPlace();
        console.log(
            $scope.dplace.geometry.location.lat(),
            $scope.dplace.geometry.location.lng(), $scope.dplace
        );
        $scope.destination_pos = $scope.dplace.geometry.location.lat() + "," + $scope.dplace.geometry.location.lng();
        $scope.destination = $scope.dplace.formatted_address;
        console.log($scope.destination_pos);
        console.log($scope.destination);
        //vm.map.setCenter(vm.place.geometry.location);
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