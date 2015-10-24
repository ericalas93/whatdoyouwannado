var wdywd = angular.module('wdywdApp')
	.controller('newSuggestionController', ['$scope', 'ManipulateSuggestion', function($scope, ManipulateSuggestion){
		$scope.newIdea = {};
		$scope.isItSubmitted = false;
		$scope.message = "New Suggestion here";
		
		$scope.data = {
			availableOptions: [
				{name: 'Misc'},
				{name: 'Sport'}, 
				{name: 'Entertainment'}, 
				{name: 'Social'}
			], 
			selectedOption: {name: 'Misc'}
		};
		
		
		$scope.save = function(idea){
			$scope.newIdea = angular.copy(idea);
			$scope.newIdea.category = $scope.data.selectedOption.name;
			console.log($scope.newIdea);
			$scope.reset();
			$scope.settingTouched(false);

			$scope.postNewIdea();
		};
		
		$scope.reset = function(){
			$scope.idea.name = '';	
			$scope.idea.price = '';
			$scope.data.selectedOption = {name: 'Misc'};
		};
		
		$scope.postNewIdea = function(){
			ManipulateSuggestion.postSuggestion($scope.newIdea).then(function(data){
				console.log(data);
			});
		};
		
		$scope.confirm = function(idea){
			if($scope.suggestionForm.$valid){				
 				$scope.save(idea);
			}
			else{
				$scope.settingTouched(true);
			}
		};
		
		$scope.settingTouched = function(settingTouched){
			if(settingTouched){
				angular.forEach($scope.suggestionForm.$error, function (field) {
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					})
				});
			}
			else{
				$scope.suggestionForm.$setUntouched();
			}	
		};
	}]);
	