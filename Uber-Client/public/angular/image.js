var app = angular.module('image', []);

app.controller('image', function ($scope, $http) {

    $scope.getImage = function(email){


        $http({
            method: "GET",
            url: '/getImagesOfRide',
            params: {
                image: email+".jpg"
            }
        }).success(function (response) {
            //alert('./uploads');
            //alert(response);
            $scope.image = './uploads/'+email+".jpg"

        });
    };


});