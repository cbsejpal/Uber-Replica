var app = angular.module('drivers', []);

app.controller('rides', function($scope, $http) {
	$http.get("/rideInfo").success(function(response) {
		if (response.status == 200) {
	
			$scope.rides = response.data;
		}
	});
});

app.controller('navbar', function($scope, $http) {


	$http.get("/getDriverInformation").success(function(response) {
		if (response.status == 200) {
			$scope.firstName = response.data.firstName;
			}

	});
});



app.controller('profile', function($scope, $http) {


	$http.get("/getDriverInformation").success(function(response) {
		if (response.status == 200) {
			$scope.firstName = response.data.firstName;
			$scope.lastName = response.data.lastName;
			$scope.state = response.data.state;

			$scope.email = response.data.email;
			$scope.city = response.data.city;
			$scope.carDetails = response.data.carDetails;
			$scope.phoneNumber = response.data.phoneNumber;


			//console.log(JSON.stringify($scope.customer));
		}

	});
	$scope.save = function() {

		$http({
			method : "POST",
			url : '/updateDriver',
			data : {

				"email" : $scope.email,
				"firstName" : $scope.firstName,
				"lastName" : $scope.lastName,
				"state" : $scope.state,
				"city" : $scope.city,
				"carDetails" : $scope.carDetails,
				"phoneNumber" : $scope.phoneNumber

			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert("error");
			}
			else{

				//Making a get call to the '/redirectToHomepage' API
				window.location.assign("/driverDashboard");
			}
		}).error(function(error) {

			alert("save error !");
		});
	};




});




	

