//loading the 'login' angularJS module

var signupCustomer = angular.module('signupCustomer', ['ngMap']);
//defining the login controller

signupCustomer.directive('ngModelOnblur', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		priority: 1, // needed for angular 1.2.x
		link: function(scope, elm, attr, ngModelCtrl) {
			if (attr.type === 'radio' || attr.type === 'checkbox') return;

			elm.unbind('input').unbind('keydown').unbind('change');
			elm.bind('blur', function() {
				scope.$apply(function() {
					ngModelCtrl.$setViewValue(elm.val());
				});
			});
		}
	};
});

signupCustomer.controller('signupCustomer', function($scope, $http) {

	$scope.emailError = true;
	$scope.emailSuccess = true;
	$scope.ssnError = true;
	$scope.ssnSuccess = true;

	$scope.checkEmail = function(){
		//alert('inside 1');
		$http({
			method : "get",
			url : '/checkCustomerEmail',
			params : {
				"email" : $scope.email
			}
		}).success(function(response) {
			//alert('inside 2');
			if(response.status == 500){
				//alert('inside 3');
				$scope.emailError = false;
				$scope.emailSuccess = true;
			}
			else if(response.status == 200){
				//alert('inside 4');
				$scope.emailError = true;
				$scope.emailSuccess = false;
			}

		}).error(function(error) {
			alert("Error");
		});
	};

	$scope.checkSSN = function(){
		//alert('inside 1');
		$http({
			method : "get",
			url : '/checkCustomerSSN',
			params : {
				"ssn" : $scope.ssn
			}
		}).success(function(response) {
			//alert('inside 2');
			if(response.status == 500){
				//alert('inside 3');
				$scope.ssnError = false;
				$scope.ssnSuccess = true;
			}
			else if(response.status == 200){
				//alert('inside 4');
				$scope.ssnError = true;
				$scope.ssnSuccess = false;
			}

		}).error(function(error) {
			alert("Error");
		});
	};



	$scope.validate = function($event){
		angular.forEach($scope.registration.$error.required, function(field) {
		    field.$setDirty();
		});
		angular.forEach($scope.registration.$error.pattern, function(field) {
			field.$setDirty();
		});
		if($scope.registration.$error.required || !$scope.emailError || $scope.registration.$error.pattern
				|| !$scope.ssnError ){
			$event.preventDefault();
			alert('Error! Please check all fields');
		}
		else{
			$http({
				method : "POST",
				url : '/registerCustomer',
				data : {
						"email" : $scope.email,
						"password" : $scope.password,				 
				        "firstName" : $scope.firstName,
				        "lastName" : $scope.lastName,
						"ssn" : $scope.ssn,
						"address" : $scope.address,
				        "city" : $scope.city,
				        "state" : $scope.state,
				        "zipCode" : $scope.zipCode,
				        "phoneNumber" : $scope.phoneNumber,
				        "creditCard" : $scope.creditCard
					
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					$scope.error = "something is wrong";
				}
				else if(data.statusCode == 500){
					window.location.assign('/customerRegistertationFailed');
				}
				else{
					//Making a get call to the '/redirectToHomepage' API
					window.location.assign("/loginCustomer");
				}
			}).error(function(error) {
				$scope.unexpected_error = "something is wrong!";
			});

		}
	}
});
