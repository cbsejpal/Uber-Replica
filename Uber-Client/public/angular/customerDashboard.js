var app = angular.module('ngMap',['infinite-scroll']);

app.controller('socket',['$scope','socket',function($scope,socket){

	socket.on('bill_generated', function (data) {

		window.location.assign('/customerRideBill?bill='+data.bill.billingId);
	});

}]);


app.controller('rides', function($scope, $rootScope, $http) {

	//alert("getRideImage");
	var startPosition = 0;
	$scope.rides = [];
	$scope.loadMore = false;
	$rootScope.getRidesInitialInfo = function(customerId){

		$scope.customerId = customerId;
		/*$http({
			method: "GET",
			url : '/searchBills',
			params : {
				startPosition : 0,
				searchText : $scope.customerId
			}
		}).success(function(response){

			// alert('inside');

			$scope.rides = response;
			startPosition = $scope.rides.length;
			angular.forEach(items, function (res) {

				$http({
					method: "GET",
					url: '/getImagesOfRide',
					params: {
						billId: res.billingId
					}
				}).success(function (response) {
//				alert("billId ");
				});

			});

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
				"search":  $scope.customerId,
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

			angular.forEach(items, function (res) {

				$http({
					method: "GET",
					url: '/getImagesOfRide',
					params: {
						billId: res.billingId
					}
				}).success(function (response) {
//				alert("billId ");
				});

			});

		}).error(function (err) {
			alert("error");
			$scope.rides = [];
			startPosition = $scope.rides.length;
		});
	};


});

app.controller('navbar',['$scope','$rootScope', '$http','socket', function($scope, $rootScope, $http,socket) {


	$http.get("/getCustomerInformation").success(function(response) {
		if (response.status == 200) {
			$scope.firstName = response.data.firstName;
			$scope.email = response.data.email;
			$rootScope.getRidesInitialInfo(response.data.email);
			socket.emit('join',{ email: $scope.email });
		}
		else{
			//window.location.assign('/logout');
		}

	}).error(function(error){
		window.location.assign('/errorCustomer');
	});
}]);



app.controller('profile', function($scope, $http) {


	$http.get("/getCustomerInformation").success(function(response) {
		if (response.status == 200) {
			$scope.firstName = response.data.firstName;
			$scope.lastName = response.data.lastName;
			$scope.ssn = response.data.ssn;
			$scope.state = response.data.state;
			$scope.zipCode = response.data.zipCode;
			$scope.email = response.data.email;
			$scope.city = response.data.city;
			$scope.creditCard = response.data.creditCard;
			$scope.phoneNumber = response.data.phoneNumber;


			//console.log(JSON.stringify($scope.customer));
		}
		else{
			//window.location.assign('/logout');
		}

	}).error(function(error){
		window.location.assign('/errorCustomer');
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
				url : '/updateCustomer',
				data : {

					"email" : $scope.email,
					"firstName" : $scope.firstName,
					"lastName" : $scope.lastName,
					"state" : $scope.state,
					"city" : $scope.city,
					"zipCode": $scope.zipCode,
					"creditCard" : $scope.creditCard,
					"phoneNumber" : $scope.phoneNumber

				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					//alert("error");
					window.location.assign('/errorCustomer');
				}
				else{

					//Making a get call to the '/redirectToHomepage' API
					window.location.assign("/customerDashboard");
				}
			}).error(function(error){
				window.location.assign('/errorCustomer');
			});
		}
	};
});


/*app.controller('payment', function($scope, $http) {
 $http.get("/getCustomerInformation").success(function(response) {
 if (response.status == 200) {
 $scope.creditCard = response.data.creditCard;
 //console.log(JSON.stringify($scope.customer));
 }
 }).error(function(error){
 window.location.assign('/errorCustomer');
 });
 });*/