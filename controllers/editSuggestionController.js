var wdywd = angular.module('wdywdApp')
	.controller('editSuggestionController', function($rootScope, $route, $scope, $routeParams, $location, $timeout, getCustomSuggestion, ManipulateSuggestion){
		$scope.showName = $routeParams.id;
		$rootScope.pageTitle = $route.current.title;
		
		$scope.suggestion = getCustomSuggestion[0];
		
		
		$scope.init = function(){
			$scope.token = localStorage['jwt'];
			//setting default values. if they arent editted, use these, else itll overwrite
			$scope.idea = {
				name: $scope.suggestion.suggestion_name, 
				category: $scope.suggestion.suggestion_category, 
				price: $scope.suggestion.suggestion_price, 
				acceptableTime: $scope.suggestion.suggestion_time,
				acceptableTemperature: $scope.suggestion.suggestion_temperature
			}
			$scope.conditionSelection = $scope.suggestion.suggestion_weather.split(', ');
		}
		
		$scope.init(); 
		
		$scope.category = {
			availableOptions: [
				{name: 'Misc'},
				{name: 'Sport'}, 
				{name: 'Entertainment'},
				{name: 'Casual'},  
				{name: 'Social'}
			], 
			selectedOption: {name: $scope.suggestion.suggestion_category}
		};
		
		//options for time frame of activity
		$scope.acceptableTime = {
			availableOptions: [
				{name: 'Both'},
				{name: 'Day'},
				{name: 'Night'}
			], 
			selectedOption: {name: 'Both'}
		};
		
		//options for acceptable temperature range for activities
		$scope.acceptableTemperature = {
			availableOptions: [
				{description: 'Any Temperature', name: 'DNA'},
				{description: 'Hot (greater than 80F)', name: 'Hot'},
				{description: 'Mild (between 50F and 79F', name: 'Mild'},
				{description: 'Cold (less than 50F)', name: 'Cold'}
			], 
			selectedOption: {description: 'Any Temperature', name: 'DNA'}
		}
		
		

		
		
		$scope.save = function(){
			
			//copy the idea the user suggested
			$scope.newIdea = angular.copy($scope.idea);
			//add the category, ideal temperature, ideal time, and ideal weather condition
			$scope.newIdea.category = $scope.category.selectedOption.name;
			$scope.newIdea.acceptableTime = $scope.acceptableTime.selectedOption.name;
			$scope.newIdea.acceptableTemperature = $scope.acceptableTemperature.selectedOption.name;
			//if they deselect all options autodefault to 'All'
			
			$scope.newIdea.acceptableCondition = $scope.conditionSelection === undefined ? 'All' : $scope.conditionSelection.join(', ');
			
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
			$scope.newIdea.jwt = $scope.token;
			$scope.newIdea.username = $scope.username;
			$scope.newIdea.suggestionId = $scope.suggestion.id;
			
			
			
			ManipulateSuggestion.updateSuggestion($scope.newIdea).then(function(data){
				if(data.data === '1'){
					$scope.isItSubmitted = true;
					//we can clear the form data since the post was successful
					$scope.relocate();
				}else{
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