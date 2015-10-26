var wdywdApp = angular.module('wdywdApp', ['ngRoute', 'ngMessages', 'angular-jwt'])
	.config(function($routeProvider, $locationProvider, $httpProvider){
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
			
			
			$httpProvider.interceptors.push(function ($rootScope, $q, $location) {
		        return {
		            'response': function (response) {
		                return response;
		            },
		            'responseError': function (rejection) {
		                if(rejection.status === 401){
			                console.log('caight the 401')
			                $rootScope.$broadcast('401error');
							$location.path('/login');
		                }
		                return $q.reject(rejection);
		            }
		        };
		    });
	});
	