var app = angular.module('drivers', []);

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
					$scope.firstName = response.data[0].firstName;
					$scope.email = response.data[0].email;
					$rootScope.currentRideId = response.data[0].currentRideId;
					socket.emit('join',{ email: $scope.email });
				}
				else{
					//window.location.assign('/logout');
				}

			}).error(function(error){
				window.location.assign('/errorDriver');
			});
}]);

app.controller('myrides', function($scope, $http) {
	
	$http.get("/driverRideList").success(function(response) {
		//alert(JSON.stringify(response.status));
		if (response.status == 200) {
			//alert(JSON.stringify(response));
			$scope.rides = response.data;
		}
		else{
			$scope.rides = "";
		}
	}).error(function(error){
		window.location.assign('/errorDriver');
	});
});

app.controller('profile', function($scope, $http) {


	$http.get("/getDriverInformation").success(function(response) {
		//alert("dsadsad");
		if (response.status == 200) {
			$scope.firstName = response.data.firstName;
			$scope.lastName = response.data.lastName;
			$scope.ssn = response.data.ssn;
			$scope.state = response.data.state;
			$scope.zipCode = response.data.zipCode;
			$scope.email = response.data.email;
			$scope.city = response.data.city;
			$scope.carDetails = response.data.carDetails;
			$scope.phoneNumber = response.data.phoneNumber;
		}
		else{
			//window.location.assign('/logout');
		}

	}).error(function(error){
		window.location.assign('/errorDriver');
	});

	$scope.save = function($event) {


		angular.forEach($scope.profileUpdate.$error.required, function(field) {
			field.$setDirty();
		});

		if($scope.profileUpdate.$error.required){
			$event.preventDefault();

			alert("Please fill all the fields before saving");
		}

		else{

			$http({
				method : "POST",
				url : '/updateDriver',
				data : {

					"email" : $scope.email,
					"firstName" : $scope.firstName,
					"lastName" : $scope.lastName,
					"state" : $scope.state,
					"city" : $scope.city,
					"zipCode": $scope.zipCode,
					"carDetails" : $scope.carDetails,
					"phoneNumber" : $scope.phoneNumber
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					window.location.assign('/errorCustomer');
				}
				else{
					window.location.assign("/driverDashboard");
				}
			}).error(function(error){
				window.location.assign('/errorDriver');
			});
		}
	};
});