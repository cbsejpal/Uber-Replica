var app = angular.module('admin', []);

app.controller('drivers', function($scope, $http) {
	$http.get("/showDrivers").success(function(response) {
		if (response.status == 200) {
			
			$scope.firstName = response.data.data[0].firstName;
			$scope.lastName= response.data.data[0].lastName;
			$scope.email = response.data.data[0].email;
		}
	});
	
	$scope.deleteDriver = function()
		{
		$http({
			method : "GET",
			url : '/deleteDriver',
			data : {

				"email" : $scope.email
			}
			}).success(function(response) {
				if (response.status == 200) 
				{
				alert("done");
				}
				else{
					alert("no");
				}
			});
		}
});
		
	
app.controller('customers', function($scope, $http) {
	$http.get("/showCustomers").success(function(response) {
		if (response.status == 200) {
			$scope.firstName = response.data.data[0].firstName;
			$scope.lastName = response.data.data[0].lastName;
			
			$scope.email = response.data.data[0].email;
		}
	});
});

app.controller('requests', function($scope, $http) {
	$http.get("/showCustomers").success(function(response) {
		if (response.status == 200) {
			if(response.data.data[0].verifyStatus==false){
				
			$scope.firstNameCustomer = response.data.data[0].firstName;
			$scope.email = response.data.data[0].email;
			}
		}
	});
	$http.get("/showDrivers").success(function(response) {
		if (response.status == 200) {
			if(response.data.data[0].verifyStatus==false){
				
			$scope.firstNameDriver = response.data.data[0].firstName;
			$scope.email = response.data.data[0].email;
			}
		}
	});
});
