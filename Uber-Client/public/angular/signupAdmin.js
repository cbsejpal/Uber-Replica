//loading the 'login' angularJS module

var signupAdmin = angular.module('signupAdmin', []);
//defining the login controller
signupAdmin.controller('signupAdmin', function($scope, $http) {
	
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
				url : '/registerAdmin',
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
				        "securityCode" : $scope.securityCode
					
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
		
					$scope.error = "something is wrong";			}
				else{
					
					//Making a get call to the '/redirectToHomepage' API
					window.location.assign("/loginAdmin");
				}
			}).error(function(error) {
				$scope.unexpected_error = "something is wrong!";
				
			});

		}
	}
});
