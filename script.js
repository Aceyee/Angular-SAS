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
                    $location.path('/');
                }
            },
        },
        templateUrl: './components/dashboard.html',
        controller: 'dashboardCtrl'
    }).when('/dashboardP', {
        resolve:{
            check: function($location, user){
                if(!user.isUserLoggedIn()){
                    $location.path('/');
                }
            },
        },
        templateUrl: './components/dashboardP.html',
        controller: 'dashboardPCtrl'
    }).when('/dashboardS', {
        resolve:{
            check: function($location, user){
                if(!user.isUserLoggedIn()){
                    $location.path('/');
                }
            },
        },
        templateUrl: './components/dashboardS.html',
        controller: 'dashboardSCtrl'
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
            url: 'http://localhost:90/php/server.php',
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: 'username='+username+'&password='+password
        }).then(function(response){
            if(response.data.status == 'loggedin'){
                user.userLoggedIn();
                user.setName(response.data.user);
                if(response.data.roll=="Professor"){
                    $location.path('/dashboardP');
                }else{
                    $location.path('/dashboardS');
                }
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
        var email = $scope.email;

        $http({
            url: 'http://localhost:90/php/register.php',
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: 'user_name='+username+'&user_pass='+password+'&user_university='+university
                    +'&user_roll='+roll +'&user_email='+email
        }).then(function(response){
            console.log(response.data);
            if(response.data.status == 'registered'){
                alert(response.data.message);
                user.userLoggedIn();
                user.setName(response.data.user);
                if(roll=="Professor"){
                    $location.path('/dashboardP');
                }else{
                    $location.path('/dashboardS');
                }
            }else{
                alert(response.data.message);
            }
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
app.controller('dashboardPCtrl', function($scope, $http, user){
    $scope.user = user.getName();
    $scope.listMyCourse = function(){
        var username = user.getName();
        $http({
            url: 'http://localhost:90/php/listSession.php',
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: 'professor_name='+username
        }).then(function(response){
            if(response.data.status == 'courseFound'){
                var target = document.getElementById('myCourses');
                for(var i in response.data.session){
                    var div = document.createElement("div");
                    div.innerHTML = "<button>"+
                    response.data.session[i].university+" "
                    +response.data.session[i].course+" "
                    +response.data.session[i].professor+" "
                    +"</button>";
                    target.appendChild(div);
                    div.addEventListener("click", function(){ 
                        // alert(response.data.session[i].id);
                        $http({
                            url: 'http://localhost:90/php/display.php',
                            method: 'POST',
                            headers:{
                                'Content-Type':'application/x-www-form-urlencoded'
                            },
                            data: 'courseid='+response.data.session[i].id
                        }).then(function(response){
                            if(response.data.status == 'success'){
                                alert(response.data.num+" people signed up");
                            }else{
                                alert('error');
                            }
                        });
                    });
                }
            }else{
                alert(response.data.message);
            }
        })
    };
    $scope.CreateCourse = function(){
        var username = user.getName();
        var courseNo = $scope.courseNo;
        $http({
            url: 'http://localhost:90/php/createSession.php',
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: 'professor='+username+'&course='+courseNo+'&university=UVic'
        }).then(function(response){
            console.log(response.data);
        })
    }
});
app.controller('dashboardSCtrl', function($scope, $http, user){
    $scope.user = user.getName();

    $scope.searchCourse = function(){
        var course = $scope.courseNo;
        $http({
            url: 'http://localhost:90/php/searchSession.php',
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: 'searchinput='+course
        }).then(function(response){
            if(response.data.status == 'courseFound'){
                var target = document.getElementById('myCourses');
                for(var i in response.data.session){
                    var div = document.createElement("div");
                    div.innerHTML = "<button>"+
                    response.data.session[i].university+" "
                    +response.data.session[i].course+" "
                    +response.data.session[i].professor+" "
                    +"</button>";
                    target.appendChild(div);
                    div.addEventListener("click", function(){ 
                        $http({
                            url: 'http://localhost:90/php/punch.php',
                            method: 'POST',
                            headers:{
                                'Content-Type':'application/x-www-form-urlencoded'
                            },
                            data: 'courseid='+response.data.session[i].id+'&choice=A&university='+
                                response.data.session[i].university
                        }).then(function(response){
                            // console.log(response.data);
                            if(response.data.status == 'success'){
                                // alert(response.data.num+" people signed up");
                                alert("signed up!");
                            }else{
                                alert('error');
                            }
                        });
                    });
                }
            }else{
                alert(response.data.message);
                // console.log(response.data);
            }
        })
    };
});