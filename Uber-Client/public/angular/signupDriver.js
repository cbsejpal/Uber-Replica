//loading the 'login' angularJS module
var signupDriver = angular.module('signupDriver', []);
//defining the login controller
signupDriver.controller('signupDriver', function($scope, $http) {
	$scope.validate = function($event){
		angular.forEach($scope.registration.$error.required, function(field) {
		    field.$setDirty();
		});
		if($scope.registration.$error.required){
			$event.preventDefault();
		}
		
		else{
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
				"phoneNumber" : $scope.phoneNumber
				//"carDetails" : $scope.carDetails

			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.error = "something is wrong";
			}
			else if(data.statusCode == 500){
				window.location.assign('/driverRegistertationFailed');
			}
			else{
				//Making a get call to the '/redirectToHomepage' API
				window.location.assign("/driverLogin");
			}
		}).error(function(error) {
			$scope.unexpected_error = false;
		});
	}
	};
});
