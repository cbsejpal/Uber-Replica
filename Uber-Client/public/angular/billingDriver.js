var app = angular.module('billings', []);

app.controller('billings', function($scope, $http){


    $scope.ratingForm = false;

    $scope.goBack = true;

    $scope.init = function(bill){

        //alert(bill);

        $http({
            method: "GET",
            url : '/getBill',
            params : {
                billId : bill
            }
        }).success(function(response){

           // alert('inside');

            $scope.billingId = response.billingId;
            $scope.rideId = response.rideId;
            $scope.rideDate = response.rideDate;
            $scope.pickUpLocation = response.pickUpLocation;
            $scope.dropOffLocation =  response.dropOffLocation;
            $scope.rideStartTime = response.rideStartTime;
            $scope.rideEndTime = response.rideEndTime;
            $scope.rideDistance = response.rideDistance;
            $scope.customerId = response.customerId;
            $scope.driverId = response.driverId;
            $scope.rideAmount = response.rideAmount;

        }).error(function(){

            alert("error");
        });


    };

    $scope.rating = function(rate){
        $scope.customerRating = rate;
    };

    $scope.submit = function(){

        $http({
            method : "POST",
            url : '/rateCustomer',
            data : {
                rideId: $scope.rideId,
                customerId: $scope.customerId,
                rating: $scope.customerRating,
                reviews: $scope.customerReview
            }
        }).success(function(response) {

            $scope.ratingForm = true;
            $scope.goBack = false;

        }).error(function(error){

        });
    };
});