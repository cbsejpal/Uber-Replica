var app = angular.module('rides', []);

app.controller('rides', function($scope, $http) {
	$http.get("/rideInfo").success(function(response) {
		if (response.status == 200) {
			//alert("ds");
			$scope.rides = response.data;
			console.log(JSON.stringify($scope.rides));
		}
	});
});
	
	app.controller('profile', function($scope, $http) {
	
	
		$http.get("/getCustomerInformation").success(function(response) {
			if (response.status == 200) {
					$scope.customer = response.data;
					//console.log(JSON.stringify($scope.customer));
			}
				
			});

	
});
	

	app.controller('payment', function($scope, $http) {
	
	
		$http.get("/getCustomerInformation").success(function(response) {
			if (response.status == 200) {
					$scope.customer = response.data;
					//console.log(JSON.stringify($scope.customer));
			}
				
			});
	});

	

