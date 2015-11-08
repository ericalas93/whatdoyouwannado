var wdywdApp = angular.module('wdywdApp', ['ngRoute', 'ngMessages', 'angular-jwt'])
	.config(function($routeProvider, $locationProvider, $httpProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'partials/home.html', 
				controller: 'mainController'
			})
			.when('/suggestion', {
				templateUrl: 'partials/suggestion.html', 
				controller: 'suggestionController', 
				resolve: {
					getSuggestionList: function($q, ManipulateSuggestion){
						//First lets check if theyre logged in
						
						
						var defer = $q.defer(), tableName = {tableName: localStorage['username'] === undefined ? 'default_suggestion' : localStorage['username'] };
						ManipulateSuggestion.getSuggestion(tableName).then(function(data){
							defer.resolve(data);
						});
						return defer.promise;
						
					}, 
					getCurrentConditions: function($q, Weather){
						var defer = $q.defer();
						//check if location permission has been given or not
						Weather.getLocation().then(function(){
							Weather.getCurrentWeather().then(function(data){
								defer.resolve(data);
							});
						});
						return defer.promise;
						
					}
				}
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
				controller: 'userController', 
				resolve: {
						confirmLoggedIn: function($q, UserAuthentication) {
							var defer = $q.defer(), tokenRequest = {token: localStorage['jwt']};
							UserAuthentication.userLoggedIn(tokenRequest).success(function(data){ defer.resolve(); });
							return defer.promise;
						}, 
							
						getCustomSuggestions: function($q, ManipulateSuggestion) {
							var defer = $q.defer(), username = {tableName: localStorage['username']};
							ManipulateSuggestion.getSuggestion(username).then(function(data){ defer.resolve(data) });
							return defer.promise;
						}
				}
			})
			.when('/modify/:id', {
				templateUrl: 'partials/editsuggestions.html', 
				controller: 'editSuggestionController', 
				resolve: {
						getCustomSuggestion: function($q, ManipulateSuggestion, $route){
							var defer = $q.defer(), suggestionInfo = localStorage['username'] !== undefined ? {tableName: localStorage['username']} : {tableName: 'default_suggestion'};
							suggestionInfo.id = $route.current.params.id;
							ManipulateSuggestion.getSuggestion(suggestionInfo).then(function(data){ defer.resolve(data) });
							return defer.promise;

						}
				}
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
			                $rootScope.$broadcast('401error');
							$location.path('/login');
		                }
		                return $q.reject(rejection);
		            }
		        };
		    });
		    
	});
	