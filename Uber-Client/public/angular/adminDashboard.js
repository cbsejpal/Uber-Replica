var app = angular.module('ngMap');

app.run(function ($rootScope) {

});

app.controller('drivers', function ($scope, $http) {
    $http.get("/showDrivers").success(function (response) {
        if (response.status == 200) {
            $scope.items = response.data.data;

        }
        else {
            $scope.items = "";
        }
    });

    $scope.deleteDriver = function (email) {

        $scope.email = email;

        $http({
            method: "GET",
            url: '/deleteDriver',
            params: {

                email: $scope.email

            }
        }).success(function (response) {

            if (response.status == 200) {

                $http.get("/showDrivers").success(function (response) {
                    if (response.status == 200) {
                        $scope.items = response.data.data;
                    }
                    else {

                        $scope.items = "";
                    }
                });
            }

        });
    };

    $scope.searchDriver = function () {
        $http({
            method: "GET",
            url: '/searchDriver',
            params: {
                search: $scope.search
            }
        }).success(function (response) {
            if (response.status == 200) {
                $scope.items = response.data;
            }
            else {
                $scope.items = "";
            }

        });
    }
});


app.controller('customers', function ($scope, $http) {

    var startPosition = 0;
    $scope.search = " ";
    $scope.getSearchCustomerListInitial = function () {
        $http({
            method: "GET",
            url: '/searchCustomers',
            params: {
                "search": $scope.search,
                "startPosition": startPosition
            }
        }).success(function (response) {

            $scope.items = response;
            startPosition = $scope.items.length;

        }).error(function (err) {
            $scope.items = [];
        });
    };

    $scope.getSearchCustomerList = function () {
        $http({
            method: "GET",
            url: '/searchCustomers',
            params: {
                "search": $scope.search,
                "startPosition": startPosition
            }
        }).success(function (response) {

            var items = response;
            for (var i = 0, len = items.length; i < len; ++i) {
                $scope.items.push(items[i]);
            }
            startPosition = $scope.items.length;

        }).error(function (err) {
            $scope.items = [];
        });
    };

    $scope.getSearchCustomerListInitial();


    $scope.deleteCustomer = function (email) {

        $http({
            method: "GET",
            url: '/deleteCustomer',
            params: {


                "email": email
            }
        }).success(function (response) {

            if (response.status == 200) {

                $scope.getSearchCustomerListInitial();
            }

        });
    }


});

app.controller('billing', function ($scope, $http) {

    var startPosition = 0;
    $scope.search = " ";
    $scope.getBillList = function () {
        $http({
            method: "GET",
            url: '/searchBills',
            params: {
                "search": $scope.search
            }
        }).success(function (response) {
                $scope.items = response;
                //startPosition = $scope.items.length;
        }).error(function(err){
            $scope.items = [];
        });
    };

    /*$scope.getLazyLoadingCustomerList = function(){
     $http({
     method: "GET",
     url: '/showCustomers',
     params: {
     "startPosition":0
     }
     }).success(function (response) {
     if (response.status == 200) {
     var items = response.data.data;
     for (var i = 0, len = items.length; i < len; ++i) {
     $scope.items.push(items[i]);
     }
     startPosition = $scope.items.length;
     }
     });
     };*/

    $scope.getBillList();


    $scope.deleteBill = function (billID) {

        $http({
            method: "POST",
            url: '/deleteBill',
            data: {
                "billId": billID
            }
        }).success(function (response) {

                $scope.getBillList();

        });
    }


});

app.controller('requests', function ($scope, $http) {


    $http.get("/showCustomersForApproval").success(function (response) {
        //alert("This is requests");
        if (response.status == 200) {

            $scope.customers = response.data.data;

        }

    });


    $http.get("/showDriversForApproval").success(function (response) {
        if (response.status == 200) {

            $scope.drivers = response.data.data;

        }
    });

    $scope.approveCustomer = function (email) {
        $http({
            method: "GET",
            url: '/verifyCustomers',
            params: {

                "email": email
            }
        }).success(function (response) {

            if (response.status == 200) {

                $http.get("/showCustomersForApproval").success(function (response) {
                    if (response.status == 200)
                        $scope.customers = response.data.data;
                    else
                        $scope.customers = ""

                });
            }
            else {
                $scope.customers = "";
            }

        });
    }


    $scope.ignoreCustomer = function (email) {

        $http({
            method: "GET",
            url: '/deleteCustomer',
            params: {
                "email": email
            }
        }).success(function (response) {

            if (response.status == 200) {

                $http.get("/showCustomers").success(function (response) {
                    if (response.status == 200) {
                        $scope.customers = response.data.data;
                    }
                    else {
                        $scope.customers = "";
                    }
                });
            }

        });
    };


    $scope.approveDriver = function (email) {

        //alert(email);

        $http({
            method: "GET",
            url: '/verifyDrivers',
            params: {

                "email": email
            }
        }).success(function (response) {
            //alert(JSON.stringify(response));
            if (response.status == 200) {

                $http.get("/showDriversForApproval").success(function (response) {
                    if (response.status == 200) {
                        $scope.drivers = response.data.data
                    }
                    else {
                        $scope.drivers = ""
                    }
                });
            }
            else {
                alert("sorry");
            }

        });
    }


});

app.controller('ngMapAnalysis',function ($scope, $http,NgMap) {
    NgMap.getMap().then(function (map) {
        $rootScope.map = map;


    });
});