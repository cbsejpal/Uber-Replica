var app = angular.module('admin', []);

app.controller('drivers', function($scope, $http) {
	$http.get("/showDrivers").success(function(response) {
		if (response.status == 200) {
				$scope.items = response.data.data;
				
		}
		else
			{
				$scope.items = "";
			}
	});
	
	$scope.deleteDriver = function(email)
		{
		
		$scope.email = email;
		
		$http({
			method : "GET",
			url : '/deleteDriver',
			params : {

				 email : $scope.email
				 
			}
			}).success(function(response) {
				
				if (response.status == 200) 
				{
					
					$http.get("/showDrivers").success(function(response) {
						if (response.status == 200) {
							$scope.items = response.data.data;
						}
						else{
							
							$scope.items = "";
						}
						});
				}
				
			});
		}
});
		
	
app.controller('customers', function($scope, $http) {
	$http.get("/showCustomers").success(function(response) {
		if (response.status == 200) {
			$scope.items = response.data.data;
		}
	});
	
	$scope.deleteCustomer = function(email)
	{
		
	$http({
		method : "GET",
		url : '/deleteCustomer',
		params : {
			
			
			"email" : email
		}
		}).success(function(response) {
			
			if (response.status == 200) 
			{
				
				$http.get("/showCustomers").success(function(response) {
					if (response.status == 200) {
						$scope.items = response.data.data;
					}
					else{
						$scope.items = "";
					}
					});
			}
			
		});
	}
	
	
	
});

app.controller('requests', function($scope, $http) {
	

	$http.get("/showCustomersForApproval").success(function(response) {
		//alert("This is requests");
		if (response.status == 200) {
			
				$scope.customers = response.data.data;
		
		}
			
		});
	

	$http.get("/showDriversForApproval").success(function(response) {
		if (response.status == 200) {
			
			$scope.drivers = response.data.data;	
			
		}
		});
	
	$scope.approveCustomer = function (email)
		{
			$http({
				method : "GET",
				url : '/verifyCustomers',
				params : {

					"email" : email
				}
				}).success(function(response) {
					
					if (response.status == 200) 
					{
						
						$http.get("/showCustomersForApproval").success(function(response) {
							if(response.status==200)
								$scope.customers = response.data.data;
							else
								$scope.customers = ""
							
							});
					}
					else
						{
							$scope.customers = "";
						}
					
				});
			}

		
		$scope.ignoreCustomer = function(email)
		{
			
			$http({
				method : "GET",
				url : '/deleteCustomer',
				params : {
					"email" : email
				}
				}).success(function(response) {
					
					if (response.status == 200) 
					{
						
						$http.get("/showCustomers").success(function(response) {
							if (response.status == 200) {
								$scope.customers = response.data.data;
							}
							else{
								$scope.customers = "";
							}
							});
					}
					
				});
			}
			
			
		
		$scope.approveDriver= function (email)
		{

			alert(email);
			
			$http({
				method : "GET",
				url : '/verifyDrivers',
				params : {

					"email" : email
				}
				}).success(function(response) {
					alert(JSON.stringify(response));
					if (response.status == 200) 
					{
						
						$http.get("/showDriversForApproval").success(function(response) {
								if(response.status == 200)
									{
										$scope.drivers = response.data.data
									}
								else
									{
									$scope.drivers = ""
									}
								});
					}
					else
						{
							alert("sorry");
						}
					
				});
			}
		
		
		
});
