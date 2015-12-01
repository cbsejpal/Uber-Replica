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

		angular.forEach($scope.driverDetails.$error.pattern, function(field) {
			field.$setDirty();
		});

		if($scope.driverDetails.carName.$error.required ||
				$scope.driverDetails.NumberPlate.$error.required || $scope.driverDetails.NumberPlate.$error.pattern)
		{
			$event.preventDefault();
		}
		else{
			angular.forEach($scope.driverDetails.$error.required, function(field) {
			    field.$setPristine();
			});

			angular.forEach($scope.driverDetails.$error.pattern, function(field) {
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

		angular.forEach($scope.driverDetails.$error.pattern, function(field) {
			field.$setDirty();
		});


		if($scope.driverDetails.lisence.$error.required ||
				$scope.driverDetails.currentLocation.$error.required || $scope.driverDetails.lisence.$error.pattern)
		{
			$event.preventDefault();
		}
		else{
			angular.forEach($scope.driverDetails.$error.required, function(field) {
				field.$setPristine();
			});

			$scope.showVideo();
			angular.forEach($scope.driverDetails.$error.pattern, function(field) {
				field.$setPristine();
			});

			$scope.showVideo();
		}
	};

	$scope.showVideo = function(){
		$scope.background = true;
		$scope.video = false;
		$scope.profilePhoto = true
	};

	$scope.submit = function($event){

		angular.forEach($scope.driverDetails.$error.required, function(field) {
			field.$setDirty();
		});

		angular.forEach($scope.driverDetails.$error.pattern, function(field) {
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

			angular.forEach($scope.driverDetails.$error.pattern, function(field) {
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
					//window.location.assign("/driverDashboard");
					$scope.video = true;
					$scope.vehicle = true;
					$scope.background = true;
					//alert($scope.email);
					$scope.profilePhoto = false;
				}
			}).error(function(error){
				window.location.assign('/errorDriver');
			});
		}
	};
});