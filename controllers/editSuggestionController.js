var wdywd = angular.module('wdywdApp')
	.controller('editSuggestionController', function($scope, $routeParams, $location, $timeout, getCustomSuggestion, ManipulateSuggestion){
		$scope.showName = $routeParams.id;
		
		$scope.suggestion = getCustomSuggestion[0];
		
		
		$scope.init = function(){
			$scope.token = localStorage['jwt'];
			//setting default values. if they arent editted, use these, else itll overwrite
			$scope.idea = {
				name: $scope.suggestion.suggestion_name, 
				category: $scope.suggestion.suggestion_category, 
				price: $scope.suggestion.suggestion_price
				
			}
		}
		
		$scope.init(); 
		
		$scope.data = {
			availableOptions: [
				{name: 'Misc'},
				{name: 'Sport'}, 
				{name: 'Entertainment'},
				{name: 'Casual'},  
				{name: 'Social'}
			], 
			selectedOption: {name: $scope.suggestion.suggestion_category}
		};
		
		
		$scope.save = function(){
			
			$scope.idea.category = $scope.data.selectedOption.name;
			$scope.settingTouched(false);

			$scope.postNewIdea();
		};
		
		$scope.relocate = function(){			
			$timeout(function(){
				$location.path('/dashboard');	
			}, 3000);
		};
		
		$scope.postNewIdea = function(){
			//send over token for auth and username to add to that users specific table!
			$scope.idea.jwt = $scope.token;
			$scope.idea.username = $scope.username;
			$scope.idea.suggestionId = $scope.suggestion.id;
			
			
			
			ManipulateSuggestion.updateSuggestion($scope.idea).then(function(data){
				if(data.data === '1'){
					$scope.isItSubmitted = true;
					//we can clear the form data since the post was successful
					$scope.relocate();
				}else{
					console.log(data)
					$scope.unsuccessfulSubmit = true;
				}
				//alert the user it was posted with info of the post
			});
		};
		
		$scope.confirm = function(){
			if($scope.suggestionForm.$valid){
			
 				$scope.save();
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
	});