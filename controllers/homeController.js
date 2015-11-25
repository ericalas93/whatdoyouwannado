var wdywd = angular.module('wdywdApp')
	.controller('mainController', function($rootScope, $route, $scope, $location){
		$scope.message = 'Home Page';
		$rootScope.pageTitle = $route.current.title;
		
		$scope.routeSuggestion = function(){
			$location.path('/suggestion');		
		};
	});