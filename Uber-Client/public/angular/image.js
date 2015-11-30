var app = angular.module('image', []);

app.controller('image', function ($scope, $http) {

    $http({
        method: "GET",
        url: '/getImagesOfRide',
        params: {
            image: "lol.jpg"
        }
    }).success(function (response) {

        //alert(response);
        $scope.image = response;
    });
});