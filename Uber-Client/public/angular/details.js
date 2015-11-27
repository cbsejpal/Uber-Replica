var app = angular.module('details', []);
//defining the login controller
app.controller('details', function($scope, $http) {
	
	
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/updateDriver',
			data : {
				"carName" : $scope.carName,
				"NumberPlate" : $scope.NumberPlate,
				"profilePhoto" : $scope.profilePhoto,
				"video" : $scope.video;
				
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 200) {
				window.location.assign("/driverDashboard");
			}
			else{
					alert("sorry");
				
			}
		}).error(function(error) {
			alert("no");
		});
	};
});
