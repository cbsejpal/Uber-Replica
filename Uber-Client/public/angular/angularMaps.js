/**
 * Created by Rushil on 11/23/2015.
 */
var app = angular.module('ngMap');

app.run(function($rootScope) {

});

app.controller('ngMap1',  function ($rootScope,$scope) {

    var vm = this;
    vm.permenant_positions =[
        {pos:[37.35410789999999, -121.95523559999998],name:1}, {pos:[37.7699298,-122.4463157],name:2},
        {pos:[37.7699294, -122.4463157],name:3}, {pos:[37.4337342 ,-122.40141929999999 ],name:4}];


    vm.setPositions = function() {
        vm.positions = angular.copy(vm.permenant_positions);
    };
    vm.removePositions = function() {
        vm.positions = [];
    };


    $scope.placeChanged = function() {
        $scope.place = this.getPlace();
        console.log(
            $scope.place.geometry.location.lat(),
            $scope.place.geometry.location.lng(),$scope.place
        );
        $scope.origin_pos = $scope.place.geometry.location.lat() + "," + $scope.place.geometry.location.lng();
        $scope.origin = $scope.place.formatted_address;
        $scope.circle =  "[" + $scope.place.geometry.location.lat()
            + "," + $scope.place.geometry.location.lng() + "]";
        console.log($scope.origin_pos);
        console.log($scope.origin);
        //vm.map.setCenter(vm.place.geometry.location);
    };

    $scope.dplaceChanged = function() {
        $scope.dplace = this.getPlace();
        console.log(
            $scope.dplace.geometry.location.lat(),
            $scope.dplace.geometry.location.lng(),$scope.dplace
        );
        $scope.destination_pos = $scope.dplace.geometry.location.lat() + "," + $scope.dplace.geometry.location.lng();
        $scope.destination = $scope.dplace.formatted_address;
        console.log($scope.destination_pos);
        console.log($scope.destination);
        //vm.map.setCenter(vm.place.geometry.location);
    };




    $rootScope.mouseover = function() {
        console.log('mouseover', this);
        this.style.backgroundColor = 'grey';
    };
    $rootScope.mouseout = function() {
        this.style.backgroundColor = 'white';
    };

    $rootScope.currentPositionOnclick = function() {
        /*  $rootScope.origin = 'current-location';
         vm.place = 'current-location';
         vm.placeChanged('origin');*/
    };
});
