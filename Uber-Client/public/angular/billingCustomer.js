var app = angular.module('billings', []);

app.controller('billings', function($scope, $http){


    $scope.ratingForm = false;

    $scope.goBack = true;

    $scope.init = function(bill){

        $scope.billingId = 1;
            //bill.billingId;
        $scope.rideId = 2;
            //bill.rideId;
        $scope.rideDate = new Date();
            //bill.rideDate;
        $scope.pickUpLocation = "750 Miller St, San Jose";
            //bill.pickUpLocation;
        $scope.dropOffLocation =  "Howard St, San Francisco";
            //bill.dropOffLocation;
        $scope.rideStartTime = new Date();
            //bill.rideStartTime;
        $scope.rideEndTime = new Date();
            //bill.rideEndTime;
        $scope.rideDistance = "50 miles";
            //bill.rideDistance;
        $scope.customerId = "cbsejpal@gmail.com"
            //bill.customerId;
        $scope.driverId = "soham008@gmail.com"
            //bill.driverId;
        $scope.rideAmount = "50.75$"
            //bill.rideAmount;
    };


    $scope.rating = function(rate){
        $scope.driverRating = rate;
    };

    $scope.submit = function(){

        $http({
            method : "GET",
            url : '/submitDriverReview',
            params : {
                driverId: $scope.driverId,
                rating: $scope.driverRating,
                review: $scope.driverReview
            }
        }).success(function(response) {

            if (data.statusCode == 401) {

            }
            else{
                $scope.ratingForm = true;
                $scope.goBack = true;
            }
        }).error(function(error){

        });
    };

});