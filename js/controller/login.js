app.controller('LoginCtrl',
    function ($scope, $http,$rootScope, $location, AuthenticationService, RESOURCES, User,Image,UserService) {
        // reset login status
        //AuthenticationService.ClearCredentials();
      $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                    var Obj= JSON.parse(response);
                    
                if (Obj.result=='success') {
                    AuthenticationService.SetCredentials(Obj.username, Obj.id,Obj.token,Obj.Usertoken);
                    UserService.isLogged = true;
                    UserService.username = Obj.username;
                    UserService.userId = Obj.id;
                    $location.path('/catalog');
                } else {
                    $scope.error = Obj.message;
                    $scope.dataLoading = false;
                    UserService.isLogged = false;
                    UserService.username = '';
                    UserService.userId = '';
                }
            });
        };

       
       //load all slide images
       Image.findAll().then(function (document) {
            var Obj=JSON.stringify(document); 
            var Images= JSON.parse(Obj);
            $scope.myInterval = 3000;
            $scope.sliders=Images;
            $scope.count=Images.length;
            $scope.uri=RESOURCES.ADMIN_DOMAIN;
           
        });
        

    });

