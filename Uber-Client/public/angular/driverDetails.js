var app = angular.module('driverDetails', ['ngMap']);

app.controller('driverDetails', function($scope, $http) {
	
	$scope.vehicle = false;
	$scope.background = true;
	$scope.profilePhoto = true;
	$scope.video = true;
	
	$scope.validVehicle = function($event){
		
		angular.forEach($scope.driverDetails.$error.required, function(field) {
		    field.$setDirty();
		});
		
		if($scope.driverDetails.carName.$error.required ||
				$scope.driverDetails.NumberPlate.$error.required)
		{
			$event.preventDefault();
		}
		else{
			angular.forEach($scope.driverDetails.$error.required, function(field) {
			    field.$setPristine();
			});
			
			$scope.showbackground();
		}
	};
	
	$scope.showbackground = function(){
		$scope.vehicle = true;
		$scope.background = false;
	};


	$scope.validBackground = function($event){

		angular.forEach($scope.driverDetails.$error.required, function(field) {
			field.$setDirty();
		});

		if($scope.driverDetails.lisence.$error.required ||
				$scope.driverDetails.currentLocation.$error.required )
		{
			$event.preventDefault();
		}
		else{
			angular.forEach($scope.driverDetails.$error.required, function(field) {
				field.$setPristine();
			});

			$scope.showProfilePhoto();
		}
	};

	$scope.showProfilePhoto = function(){
		$scope.background = true;
		$scope.profilePhoto = false;
	};

	$scope.showVideo = function(){
		$scope.profilePhoto = true;
		$scope.video = false;
	};

	$scope.submit = function($event){

		angular.forEach($scope.driverDetails.$error.required, function(field) {
			field.$setDirty();
		});

		if($scope.driverDetails.VideoURL.$error.required)
		{
			$event.preventDefault();
		}
		else{
			angular.forEach($scope.driverDetails.$error.required, function(field) {
				field.$setPristine();
			});

			$http({
				method : "POST",
				url : '/updateDriverDetails',
				data : {
					"vehicleType" : $scope.carName,
					"numberPlate" : $scope.NumberPlate,
					"license" : $scope.lisence,
					//"profilePhoto" : $scope.profilePhoto,
					"currentLocation" : $scope.currentLocation,
					"videoURL" : $scope.VideoURL
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 500) {
					window.location.assign('/errorDriver');
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