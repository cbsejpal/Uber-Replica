var app = angular.module('billings', []);

app.controller('billings', function($scope, $http){


    $scope.ratingForm = false;

    $scope.goBack = true;

    $scope.init = function(bill){

        $scope.billingId = bill.billingId;
        $scope.rideId = bill.rideId;
        $scope.rideDate = bill.rideDate;
        $scope.pickUpLocation = bill.pickUpLocation;
        $scope.dropOffLocation =  bill.dropOffLocation;
        $scope.rideStartTime = bill.rideStartTime;
        $scope.rideEndTime = bill.rideEndTime;
        $scope.rideDistance = bill.rideDistance;
        $scope.customerId = bill.customerId;
        $scope.driverId = bill.driverId;
        $scope.rideAmount = bill.rideAmount;
    };


    $scope.rating = function(rate){
        $scope.customerRating = rate;
    };

    $scope.submit = function(){

        $http({
            method : "GET",
            url : '/submitCustomerReview',
            params : {
                customerId: $scope.customerId,
                rating: $scope.customerRating,
                review: $scope.customerReview
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