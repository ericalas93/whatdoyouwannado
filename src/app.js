var wdywdApp = angular.module('wdywdApp', ['ngRoute'])
	.config(function($routeProvider, $locationProvider){
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
			});
			
			$locationProvider.html5Mode({
				enabled: true, 
				requireBase: false
			});
	});
	