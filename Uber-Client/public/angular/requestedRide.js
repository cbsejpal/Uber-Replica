/**
 * Created by Rushil on 11/30/2015.
 */
/**
 * Created by Rushil on 11/23/2015.
 */
var app = angular.module('ngMap');

app.controller('navbar', ['$rootScope', '$scope', '$http', function ($scope, $rootScope, $http) {

    $http.get("/getDriverInformation")
        .success(function (response) {
            //alert(JSON.stringify(response));
            if (response.status == 200) {
                //alert(JSON.stringify(response.data.firstName));
                $scope.firstName = response.data[0].firstName;
                $scope.email = response.data[0].email;
                $rootScope.getCurrentRideInfo(response.data[0].currentRideId);
                // socket.emit('join',{ email: $scope.email });
            }
            else {
                //window.location.assign('/logout');
            }

        }).error(function (error) {
            window.location.assign('/errorDriver');
        });
}]);

app.run(function ($rootScope) {

});

app.controller('ngMap1', function ($rootScope, $scope, $http, NgMap) {

    NgMap.getMap().then(function (map) {
        $rootScope.map = map;


    });

    $rootScope.getCurrentRideInfo = function (rideID) {

        $scope.rideId = rideID;
        $scope.destination_pos =
        $http({
            method: "GET",
            url: '/getRideInfo',
            params: {
                "rideId": rideID
            }
        }).success(function (response) {

            $scope.pickUpLocation = response.pickUpLocation;
            $scope.dropOffLocation = response.dropOffLocation;
            $scope.destination = response.dropOffLocation;
            $scope.destination_pos = response.dropOffLatLong;
        }).error(function (err) {
            $scope.pickupLocation = "";
            $scope.dropOffLocation = "";
        });
    };

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


    $scope.getCurrentRideId = function () {
        $http.get("/getCustomerInformation").success(function (response) {
            if (response.status == 200) {
                $scope.customerName = response.data.firstName;
                $scope.customerId = response.data.email;
            }
        });
    };


    $scope.startRide = function () {

        if (typeof ($scope.destination) != "undefined") {
            $http({
                method: "POST",
                url: '/startRide',
                data: {
                    rideId: $scope.rideId
                }
            }).success(function (data) {
                //alert("Ride started ! Redirecting to your dashboard...");
                alert(data.message);
                //window.location.assign('/customerDashboard');

            }).error(function (data) {
                alert(data.message);
            });
        }
        else {
            alert("Please enter destination properly !");
        }

    };

    $scope.endRide = function() {
        if (typeof ($scope.destination) != "undefined") {
            $http({
                method: "POST",
                url: '/endRide',
                data: {
                    dropOffLocation: $scope.destination_pos,
                    dropOffLatLong:$scope.destination,
                    rideId:$scope.rideId
                }
            }).success(function (data) {
                //alert("Ride started ! Redirecting to your dashboard...");
                $scope.generateBill(data);

            }).error(function (data) {
                alert(data.message);
            });
        }
        else {
            alert("Please enter destination properly !");
        }

    };

    $scope.generateBill = function(ride) {
        if (typeof ($scope.destination) != "undefined") {
            $http({
                method: "POST",
                url: '/generateBill',
                data: {
                    rideId: ride.rideId,
                    customerId:ride.customerId,
                    driverId:ride.driverId,
                    pickUpLocation: ride.pickUpLocation,
                    dropOffLocation:ride.dropOffLocation,
                    rideDate:ride.rideDateTime,
                    rideStartDateTime: ride.rideStartDateTime,
                    rideEndDateTime:ride.rideEndDateTime
                }
            }).success(function (data) {
                //alert("Ride started ! Redirecting to your dashboard...");
                alert("Ride Completed");
                window.location.assign('/driverRideBill?bill='+data.billingId);

            }).error(function (data) {
                alert(data.message);
            });
        }
        else {
            alert("Please enter destination properly !");
        }

    };


});

