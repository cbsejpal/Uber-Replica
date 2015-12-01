/**
 * Created by Rushil on 11/23/2015.
 */
var app = angular.module('ngMap');

app.run(function ($rootScope) {

});

app.controller('navbar', ['socket', function (socket) {
    socket.on('bill_generated', function (data) {
        alert(JSON.stringify(data.bill.billingId));
        window.location.assign('/customerRideBill?bill='+data.bill.billingId);
    });
}]);


app.controller('ngMap1', function ($rootScope, $scope, $http, NgMap) {




    NgMap.getMap().then(function (map) {
        $rootScope.map = map;

        //console.log(map.getCenter().lat() + ' ' + map.getCenter().lng());
        $scope.getDriversWithInRadius(map.getCenter().lat(), map.getCenter().lng());
        //Call get driver information here with map.getCenter.lat() with key currentLat
        // & map.getCenter().lng() with key currentLng
    });

    var vm = this;
    vm.drivers = [];

    $scope.getDriversWithInRadius = function (currLat, currLon) {
        $http({
            method: "GET",
            url: '/getDriversInRange',
            params: {

                "currentLat": currLat,
                "currentLng": currLon

            }
        }).success(function (data) {
            //checking the response data for statusCode
            if (data.status == 401) {
                window.location.assign("/loginCustomer");
            } else if (data.status == 500) {
                alert('No driver found in your area');
            }
            else {
                $scope.drivers = data.data;
            }
        }).error(function (error) {

            alert("Error fetching data");
        });
    };

    //Filter all driver drivers to filter it that is in the 10 miles radius of current position
    vm.filerPlace = function () {
        vm.drivers = $scope.drivers;
    };

    //Removing all drivers that is selected
    vm.removePositions = function () {
        vm.drivers = [];
    };

    //To set radius of shape
    vm.getRadius = function (num) {
        return 1609.3 * num;
    };

    //When the origin changed this method got called to set the longitude and latitude of origin
    $scope.placeChanged = function () {
        $scope.place = this.getPlace();
        console.log(
            $scope.place.geometry.location.lat(),
            $scope.place.geometry.location.lng(), $scope.place
        );
        $scope.origin_pos = $scope.place.geometry.location.lat() + "," + $scope.place.geometry.location.lng();
        $scope.origin = $scope.place.formatted_address;
        $scope.circle = "[" + $scope.place.geometry.location.lat()
            + "," + $scope.place.geometry.location.lng() + "]";
        console.log($scope.origin_pos);
        console.log($scope.origin);
        //vm.map.setCenter(vm.place.geometry.location);
    };

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
    
    $rootScope.show = function(p){

        var frameSrc  = p.videoURL;

        $(function(){
            $('iframe').attr("src",frameSrc.replace("watch?v=", "v/"));
        });

    	$scope.driverName = p.firstName;
    	$scope.driverEmail = p.email;
    	//$scope.driverVideo = p.videoURL;
    	$scope.driverCity = p.city;

        $http({
            method: "GET",
            url: '/getImagesOfRide',
            params: {
                image: p.email+".jpg"
            }
        }).success(function (response) {
            //alert('./uploads');
            //alert(response);
            $scope.image = './uploads/'+ p.email+".jpg"

        });


        $scope.driverVideo = p.videoURL;

    };


    $http.get("/getCustomerInformation").success(function (response) {
        if (response.status == 200) {
            $scope.customerName = response.data.firstName;
            $scope.customerId = response.data.email;
        }
    });

    $rootScope.bookRide = function () {
        if (typeof ($scope.origin) != 'undefined' || typeof ($scope.destination) != "undefined") {
            $http({
                method: "POST",
                url: '/createRide',
                data: {

                    "pickUpLocation": $scope.origin,
                    "dropOffLocation": $scope.destination,
                    "pickUpLatLong": $scope.origin_pos,
                    "dropOffLatLong": $scope.destination_pos,
                    "driverId": $scope.driverEmail
                }
            }).success(function (data) {
                //alert("Ride started ! Redirecting to your dashboard...");
                alert(data.message + "Your ride is created successfully, Redirecting you to the dashboard !");
                window.location.assign('/customerDashboard');


            }).error(function (data) {
                alert(data.message);
            });
        }
        else {
            alert("Please enter the origin and destination properly !");
        }
    };

})
;

