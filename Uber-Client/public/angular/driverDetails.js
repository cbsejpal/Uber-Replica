var app = angular.module('driverDetails', []);

app.controller('driverDetails', function($scope) {
	
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
	
	
});