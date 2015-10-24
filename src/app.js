var wdywdApp = angular.module('wdywdApp', ['ngRoute', 'ngMessages', 'angular-jwt'])
	.config(function($routeProvider, $locationProvider, $httpProvider, HttpErrorInterceptorModule){
		$routeProvider
			.when('/', {
				templateUrl: 'partials/home.html', 
				controller: 'mainController'
			})
			.when('/suggestion', {
				templateUrl: 'partials/suggestion.html', 
				controller: 'suggestionController'
			})
			.when('/login', {
				templateUrl: 'partials/login.html', 
				controller: 'loginController'
			})
			.when('/newsuggestion', {
				templateUrl: 'partials/newsuggestion.html',
				controller: 'newSuggestionController'
			})
			.when('/dashboard', {
				templateUrl: 'partials/user.html', 
				controller: 'userController'
			});
			
			$locationProvider.html5Mode({
				enabled: true, 
				requireBase: false
			});
			
			
			$httpProvider.interceptors.push("HttpErrorInterceptorModule");
	}).factory("HttpErrorInterceptorModule", ["$q", "$rootScope", "$location",
	    function($q, $rootScope, $location) {
		    return{
			        var success = function(response) {
			            // pass through
			            return response;
			        },
			            error = function(response) {
			                if(response.status === 401) {
			                    console.log('hey it worked');
			                }
			
			                return $q.reject(response);
			            };
			
			        return function(httpPromise) {
			            return httpPromise.then(success, error);
			        };
			}
		}
	]);
	
	