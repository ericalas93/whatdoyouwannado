var wdywd = angular.module('wdywdApp')
	.controller('suggestionController', function($scope, ManipulateSuggestion){
		$scope.message = "Get a suggestion!";
		
		$scope.getSuggestion = function(){
			ManipulateSuggestion.getSuggestion().success(function(result){
				console.log(JSON.stringify(result));
			});
		};
	})