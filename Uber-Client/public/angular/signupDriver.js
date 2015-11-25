//loading the 'login' angularJS module
var signupDriver = angular.module('signupDriver', []);
//defining the login controller
signupDriver.controller('signupDriver', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false


	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/registerDriver',
			data : {
				
					"email" : $scope.email,
					"password" : $scope.password,				 
			        "firstName" : $scope.firstName,
			        "lastName" : $scope.lastName,
			        "address" : $scope.address,
			        "city" : $scope.city,
			        "state" : $scope.state,
			        "zipCode" : $scope.zipCode,
			        "phoneNumber" : $scope.phoneNumber,
			        "carDetails" : $scope.carDetails
				
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
	
				
			}
			else{
				
				//Making a get call to the '/redirectToHomepage' API
				window.location.assign("/loginDriver");
			}
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
})
