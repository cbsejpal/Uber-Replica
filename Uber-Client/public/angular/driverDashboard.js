var app = angular.module('drivers', ['infinite-scroll']);

app.controller('socket',['$scope','socket',function($scope,socket){

	socket.on('request_ride', function (data) {
		alert(JSON.stringify(data));
		window.location.assign('/requestedRide');
	});

}]);

app.controller('navbar',[ '$scope', '$rootScope','$http','socket',function($scope,$rootScope, $http,socket) {

	$http.get("/getDriverInformation")
			.success(function(response) {
				//alert(JSON.stringify(response));
				if (response.status == 200) {
					//alert(JSON.stringify(response.data.firstName));
					//alert("inside navbar");
					$scope.firstName = response.data.firstName;

					if(typeof(response.data.currentRideId) != "undefined" && response.data.currentRideId.length>0) {
						$rootScope.currentRideId = response.data.currentRideId;
					}else{
						$rootScope.currentRideId = false;
					}
					$rootScope.getRidesInitialInfo(response.data.email);

					socket.emit('join',{ email: response.data.email });
				}
				else{
					//alert("else");
					//window.location.assign('/logout');
				}

			}).error(function(error){
				window.location.assign('/errorDriver');
			});
}]);

app.controller('myrides', function($scope,$rootScope, $http) {
	//alert($rootScope.email);

	//alert("getRideImage");
	var startPosition = 0;
	$scope.rides = [];
	$scope.loadMore = false;
	$rootScope.getRidesInitialInfo = function(driverId){

		$scope.driverId = driverId;
		/*$http({
			method: "GET",
			url : '/searchBills',
			params : {
				startPosition : 0,
				searchText : $scope.driverId
			}
		}).success(function(response){

			// alert('inside');

			$scope.rides = response;
			startPosition = $scope.rides.length;


		}).error(function(){
			alert("error");
			$scope.rides = [];
			startPosition = $scope.rides.length;
		});*/
	};


	$scope.getRidesInfo = function () {
		$http({
			method: "GET",
			url: '/searchBills',
			params: {
				"search":  $scope.driverId,
				"startPosition": startPosition
			}
		}).success(function (response) {

			var items = response;
			if(items.length == 0){
				$scope.loadMore = true;
			}
			for (var i = 0, len = items.length; i < len; ++i) {
				$scope.rides.push(items[i]);
			}
			startPosition = $scope.rides.length;


		}).error(function (err) {
			alert("error");
			$scope.rides = [];
			startPosition = $scope.rides.length;
		});
	};
});



app.controller('profile', function($scope, $http) {


	$http.get("/getDriverInformation").success(function(response) {
		//alert("dsadsad");
		if (response.status == 200) {
			//alert("inside profile");
			//alert(JSON.stringify(response.data));
			$scope.firstName = response.data.firstName;
			$scope.lastName = response.data.lastName;
			$scope.ssn = response.data.ssn;
			$scope.state = response.data.state;
			$scope.zipCode = response.data.zipCode;
			$scope.email = response.data.email;
			$scope.city = response.data.city;
			$scope.carDetails = response.data.carDetails;
			$scope.phoneNumber = response.data.phoneNumber;
		}
		else{
			//alert("else new");
			//window.location.assign('/logout');
		}

	}).error(function(error){
		//alert("error new");
		window.location.assign('/errorDriver');
	});

	$scope.save = function($event) {


		angular.forEach($scope.profileUpdate.$error.required, function(field) {
			field.$setDirty();
		});

		if($scope.profileUpdate.$error.required){
			$event.preventDefault();

			alert("Please fill all the fields before saving");
		}

		else{

			$http({
				method : "POST",
				url : '/updateDriver',
				data : {

					"email" : $scope.email,
					"firstName" : $scope.firstName,
					"lastName" : $scope.lastName,
					"state" : $scope.state,
					"city" : $scope.city,
					"zipCode": $scope.zipCode,
					"carDetails" : $scope.carDetails,
					"phoneNumber" : $scope.phoneNumber
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					window.location.assign('/errorCustomer');
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