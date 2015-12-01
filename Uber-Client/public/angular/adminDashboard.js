var app = angular.module('admin', ['infinite-scroll']);


app.controller('analysis', function($scope, $http) {
    //alert(1);
    $http.get("/dailyRevenue").success(function (response) {
        //alert(2);
            var data = response;

            //alert(JSON.stringify(data));

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5, "%");

        var svg = d3.select(".analysis").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) { return d._id; }));
        y.domain([0, d3.max(data, function(d) { return d.sumAmount/100; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Sum Amount");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d._id); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.sumAmount/100); })
            .attr("height", function(d) { return height - y(d.sumAmount/100); });

        function type(d) {
            d.sumAmount = +d.sumAmount;
            return d;
        }

    });

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


app.controller('customers', ['$scope', '$http',function ($scope, $http) {

    var startPosition = 0;
    $scope.search = " ";
    $scope.items = [];
    $scope.loadMore = false;
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
            if(items.length == 0){
                $scope.loadMore = true;
            }
            for (var i = 0, len = items.length; i < len; ++i) {
                $scope.items.push(items[i]);
            }
            startPosition = $scope.items.length;

        }).error(function (err) {
            $scope.items = [];
        });
    };

    //$scope.getSearchCustomerList();


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


}]);

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
            if (response.status == 200) {
                $scope.items = response.data.data;
                //startPosition = $scope.items.length;
            }
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
            method: "GET",
            url: '/deleteBill',
            params: {
                "billId": billID
            }
        }).success(function (response) {

            if (response.status == 200) {
                $scope.getBillList();
            } else {
                $scope.items = "";
            }

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
    }


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
