var wdywd = angular.module('wdywdApp')
	.controller('mainController', function($scope, $location){
		$scope.message = 'Home Page';
		
		
		$scope.routeSuggestion = function(){
			$location.path('/suggestion');		
		};
		
		$scope.newSuggestion = function(){
			$location.path('/newsuggestion');	
		};
	});