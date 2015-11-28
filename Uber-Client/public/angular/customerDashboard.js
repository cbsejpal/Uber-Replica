var app = angular.module('customers', []);

app.controller('rides', function($scope, $http) {
	$http.get("/rideInfo").success(function(response) {
		if (response.status == 200) {

			$scope.rides = response.data;
		}
	});
});

app.controller('navbar', function($scope, $http) {


	$http.get("/getCustomerInformation").success(function(response) {
		if (response.status == 200) {
			$scope.firstName = response.data.firstName;
		}

	});
});



app.controller('profile', function($scope, $http) {


	$http.get("/getCustomerInformation").success(function(response) {
		if (response.status == 200) {
			$scope.firstName = response.data.firstName;
			$scope.lastName = response.data.lastName;
			$scope.state = response.data.state;
			$scope.zipCode = response.data.zipCode;
			$scope.email = response.data.email;
			$scope.city = response.data.city;
			$scope.creditCard = response.data.creditCard;
			$scope.phoneNumber = response.data.phoneNumber;


			//console.log(JSON.stringify($scope.customer));
		}

	});

	$scope.save = function($event) {

		angular.forEach($scope.profileUpdate.$error.required, function(field) {
			field.$setDirty();
		});

		if($scope.profileUpdate.$error.required){
			//$event.preventDefault();

			alert("Please fill all the fields before saving");
		}

		else{

			$http({
				method : "POST",
				url : '/updateCustomer',
				data : {

					"email" : $scope.email,
					"firstName" : $scope.firstName,
					"lastName" : $scope.lastName,
					"state" : $scope.state,
					"city" : $scope.city,
					"zipCode": $scope.zipCode,
					"creditCard" : $scope.creditCard,
					"phoneNumber" : $scope.phoneNumber

				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					alert("error");
				}
				else{

					//Making a get call to the '/redirectToHomepage' API
					window.location.assign("/customerDashboard");
				}
			}).error(function(error) {

				alert("save error !");
			});
		}

	};




});


app.controller('payment', function($scope, $http) {


	$http.get("/getCustomerInformation").success(function(response) {
		if (response.status == 200) {

			$scope.creditCard = response.data.creditCard;
			//console.log(JSON.stringify($scope.customer));
		}

	});
});

	

