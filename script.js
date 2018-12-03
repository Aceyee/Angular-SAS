var app = angular.module('main', ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: './components/home.html',
        controller: 'homeCtrl'
    }).when('/login', {
        templateUrl: './components/login.html',
        controller: 'loginCtrl'
    }).when('/register', {
        templateUrl: './components/register.html',
        controller: 'registerCtrl'
    }).when('/dashboard', {
        resolve:{
            check: function($location, user){
                if(!user.isUserLoggedIn()){
                    $location.path('/login');
                }
            },
        },
        templateUrl: './components/dashboard.html',
        controller: 'dashboardCtrl'
    })
    .otherwise({
        template: '404'
    })
});

// app.config(['$qProvider', function ($qProvider) {
//     $qProvider.errorOnUnhandledRejections(false);
// }]);

app.controller('homeCtrl', function($scope, $location){
    $scope.goToLogin = function(){
        $location.path('/login');
    }
    $scope.register = function(){
        $location.path('/register');
    }
});

app.controller('loginCtrl', function($scope, $http, $location, user){
    $scope.login = function(){
        var username = $scope.username;
        var password = $scope.password;

        $http({
            url: 'http://localhost:90/server.php',
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: 'username='+username+'&password='+password
        }).then(function(response){
            console.log(response.data);
            if(response.data.status == 'loggedin'){
                user.userLoggedIn();
                user.setName(response.data.user);
                $location.path('/dashboard');
            }else{
                alert('invalid login');
            }
        })
    }
});

app.controller('registerCtrl', function($scope, $http, $location, user){
    $scope.register = function(){
        var username = $scope.username;
        var password = $scope.password;
        var university = $scope.university;
        var roll = $scope.roll;
        // console.log(roll);
        var email = $scope.email;

        $http({
            url: 'http://localhost:90/register.php',
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: 'user_name='+username+'&user_pass='+password+'&user_university='+university
                    +'&user_roll='+roll +'&user_email='+email
        }).then(function(response){
            console.log(response.data);
            // if(response.data.status == 'loggedin'){
            //     user.userLoggedIn();
            //     user.setName(response.data.user);
            //     $location.path('/dashboard');
            // }else{
            //     alert('invalid login');
            // }
        })
    }
});

app.service('user', function(){
    var username;
    var loggedin = false;
    var id = "";

    this.setName = function(name){
        username = name;
    };
    this.getName = function(){
        return username;
    };
    this.setID = function(userID){
        id = userID;
    };
    this.getID = function(){
        return id;
    };
    this.isUserLoggedIn = function(){
        return loggedin;
    };
    this.userLoggedIn = function(){
        loggedin = true;
    }
})

app.controller('dashboardCtrl', function($scope, user){
    $scope.user = user.getName();
});