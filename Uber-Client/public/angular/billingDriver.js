var app = angular.module('ngMap');

app.controller('socket',['$scope','socket',function($scope,socket){

    socket.on('request_ride', function (data) {
        alert(JSON.stringify(data));
        window.location.assign('/requestedRide');
    });

}]);

app.controller('navbar',[ '$rootScope','$scope','$http','socket',function($scope,$rootScope, $http,socket) {

    $http.get("/getDriverInformation")
        .success(function(response) {
            //alert(JSON.stringify(response));
            if (response.status == 200) {
                //alert(JSON.stringify(response.data.firstName));
                //alert("inside navbar");
                $scope.firstName = response.data.firstName;
                $scope.email = response.data.email;

                if(typeof(response.data.currentRideId) != "undefined" && response.data.currentRideId.length>0) {
                    $rootScope.currentRideId = response.data.currentRideId;
                }else{
                    $rootScope.currentRideId = false;
                }

                socket.emit('join',{ email: $scope.email });
            }
            else{
                //alert("else");
                //window.location.assign('/logout');
            }

        }).error(function(error){
            window.location.assign('/errorDriver');
        });
}]);

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