var app = angular.module('rugStudio', ['ui.slider','ngRoute','ngCookies','angularLoad','door3.css','ngTouch','ui.bootstrap','js-data']);
    app.config(function($routeProvider, DSProvider, $sceProvider,$httpProvider) {
		 DSProvider.defaults.basePath = 'http://rugstudioonline.com/WebService'; // etc.
     // DSProvider.defaults.basePath = 'http://localhost/rugstudio/WebService'; // etc.
		$routeProvider.
		   when('/login', {
			  templateUrl: 'views/login.html',
			  controller: 'LoginCtrl',
			 // css: 'release/css/ionic.css'
		   }).
		   when('/', {
			  templateUrl: 'views/login.html',
			  controller: 'LoginCtrl'
		   }).
		   when('/catalog', {
			  templateUrl: 'views/catalog.html',
			  controller: 'CatalogCtrl'
		   }).
       when('/edit/:param1/:param2', {
        templateUrl: 'views/edit_rug.html',
        controller: 'DesignCtrl',
        css: 'css/fonts.css'
       }).
      otherwise({
			  redirectTo: '/'
		   });

$httpProvider.interceptors.push('httpInterceptor');

       //$sceProvider.enabled(false)
	});
	


app.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ,' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            $http.defaults.headers.common['AuthorizedUser'] =$rootScope.globals.currentUser.usertoken;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
           
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });

        $rootScope.range = function(min, max, step) {
          // parameters validation for method overloading
          if (max == undefined) {
          max = min;
          min = 0;
          }
          step = Math.abs(step) || 1;
          if (min > max) {
          step = -step;
          }
          // building the array
          var output = [];
          for (var value=min; value<max; value+=step) {
          output.push(value);
          }
          // returning the generated array
          return output;
        };

    }]);	



//constant define
app.constant('RESOURCES', (function() {
  // Define your variable
  var resource = 'http://204.232.208.115';
  var resource1 = 'http://rugstudioonline.com';
  var admin_domain='http://admin.rugstudioonline.com';
  // Use the variable in your constants
  return {
    USERS_DOMAIN: resource,
    USERS_API: resource1 + '/WebService',
    BASIC_INFO: resource + '/api/info',
    ADMIN_DOMAIN: admin_domain,
    Local_DOMAIN: 'http://localhost/rugstudio/WebService',
    CLOUD_PATH:'https://s3.amazonaws.com/images.rugstudioonline.com'
  }
})());



