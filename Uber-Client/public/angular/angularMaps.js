/**
 * Created by Rushil on 11/23/2015.
 */
var app = angular.module('ngMap');

app.run(function($rootScope) {

});

app.controller('ngMap1',  function ($rootScope,$scope,NgMap) {

    NgMap.getMap().then(function(map) {
        $rootScope.map = map;

        console.log(map.getCenter().lat()+' '+map.getCenter().lng());

        //Call get driver information here with map.getCenter.lat() with key currentLat
        // & map.getCenter().lng() with key currentLng
    });

    var vm = this;

    $http.get("/getDriverInformation").success(function(response) {
		if (response.status == 200) {
				$scope.items = response.data.data;
				
		}
		else
			{
				$scope.items = "";
			}
	});
    
    
    
    
    vm.positions = [];
    //pre selected positions of drivers
    vm.permenant_positions =[
        {lat:37.35410789999999, lon: -121.95523559999998,name:'Califorina 1'}, {lat:37.7699298,lon:-122.4463157,name:'Califorina 2'},
        {lat:37.7699294, lon: -122.4463157,name:'Califorina 3'}, {lat:37.36410789999999, lon: -121.85523559999998 ,name:'Califorina 4'}];

    //Method to find distance between two geographic points
    function distance(obj) {
        var R = 6371; // km
        var dLat = (obj.lat2 - obj.lat1) * Math.PI / 180;
        var dLon = (obj.lon2 - obj.lon1) * Math.PI / 180;
        var lat1 = obj.lat1 * Math.PI / 180;
        var lat2 = obj.lat2 * Math.PI / 180;

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        var m = d * 0.621371;
        return {
            km: d,
            m: m
        }
    }

    //pre selected current location have to change this
    var location = {
        lat: 37.3495600,
        lon: -121.9016750,
        title: 'Vendome'
    };


    var intPoints = vm.permenant_positions.length;


    //Not in use right now used for testing
    vm.setPositions = function() {
        vm.positions = angular.copy(vm.permenant_positions);
    };

    //Filter all driver positions to filter it that is in the 10 miles radius of current position
    vm.filerPlace = function(){
        var dist = {}, point = {};
        for (var intPoint = 0; intPoint < intPoints; intPoint = intPoint + 1) {
            point = vm.permenant_positions[intPoint];
            dist = distance({
                lat1: location.lat,
                lon1: location.lon,
                lat2: point.lat,
                lon2: point.lon
            });
            if (dist.m < 10) {
                point.distance = dist.m;
                vm.positions.push(point);
            }
            console.log('Positions:',JSON.stringify(dist))
        }

        console.log('Filtered Positions:',JSON.stringify(vm.positions))
    };

    //Removing all positions that is selected
    vm.removePositions = function() {
        vm.positions = [];
    };

    //To set radius of shape
    vm.getRadius = function(num) {
        return 1609.3 * num;
    };

    //When the origin changed this method got called to set the longitude and latitude of origin
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

    //When the destination changed this method got called to set the longitude and latitude of destination
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

    //This method is of no use.
    $rootScope.mouseover = function() {
        console.log('mouseover', this);
        this.style.backgroundColor = 'grey';
    };

    //This method is of no use.
    $rootScope.mouseout = function() {
        this.style.backgroundColor = 'white';
    };

    /**
     * TODO: Have to fix this issue that's whay its commented. on-place-changed not getting call when setting it to current place
     * Created by: Rushil Shah
     */
    $rootScope.currentPositionOnclick = function() {
        /*  $rootScope.origin = 'current-location';
         vm.place = 'current-location';
         vm.placeChanged('origin');*/
    };
    
 
});
