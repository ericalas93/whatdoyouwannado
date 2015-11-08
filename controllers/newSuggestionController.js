var wdywd = angular.module('wdywdApp')
	.controller('newSuggestionController', ['$rootScope', '$scope', 'ManipulateSuggestion' , 'UserAuthentication', 'jwtHelper', function($rootScope, $scope, ManipulateSuggestion, UserAuthentication, jwtHelper){
		$scope.newIdea = {};
		$scope.isItSubmitted = false;
		
		$scope.init = function(){
			//lets get the token from the local storage... if there is one
			$scope.token = localStorage['jwt'];
			
			//here we create a post object that will be recieved in the API
			$scope.tokenRequest = {token: $scope.token};
			
			UserAuthentication.userLoggedIn($scope.tokenRequest).success(function(data){
				$scope.tokenDecoded = jwtHelper.decodeToken($scope.token);
				$scope.username = $scope.tokenDecoded.username;

			
			}).error(function(error){
				//I choose you, httpinterceptor
				$rootScope.userLoggingIn = error;
			});
		};
		
		$scope.init();
		
		
		//these are the available categories
		$scope.category = {
			availableOptions: [
				{name: 'Misc'},
				{name: 'Sport'}, 
				{name: 'Entertainment'}, 
				{name: 'Social'}
			], 
			selectedOption: {name: 'Misc'}
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
		
		$scope.conditionSelection = ['All'];
		
		$scope.save = function(idea){
			//copy the idea the user suggested
			$scope.newIdea = angular.copy(idea);
			//add the category, ideal temperature, ideal time, and ideal weather condition
			$scope.newIdea.category = $scope.category.selectedOption.name;
			$scope.newIdea.acceptableTime = $scope.acceptableTime.selectedOption.name;
			$scope.newIdea.acceptableTemperature = $scope.acceptableTemperature.selectedOption.name;
			//if they deselect all options autodefault to 'All'
			$scope.newIdea.acceptableCondition = $scope.conditionSelection === undefined ? 'All' : $scope.conditionSelection.join(', ');
			//we want to set all all of them to pristine, that is incase they wish to suggest another idea right after, they dont see error messages on blank fields
			//silly angular
			$scope.settingTouched(false);
			$scope.postNewIdea();
		};
		
		//set the default attributes for the input fields
		$scope.reset = function(){
			$scope.idea.name = '';	
			$scope.idea.price = '';
			$scope.category.selectedOption = {name: 'Misc'};
			$scope.acceptableTime.selectedOption = {name: 'Both'};
			$scope.acceptableTemperature.selectedOption = {description: 'Any Temperature', name: 'DNA'};
		};
		
		$scope.postNewIdea = function(){
			//send over token for auth and username to add to that users specific table!
			$scope.newIdea.jwt = $scope.token;
			$scope.newIdea.username = $scope.username;
			
			ManipulateSuggestion.postSuggestion($scope.newIdea).then(function(data){
				console.log(data)
				if(data.data === '11'){
					$scope.isItSubmitted = true;
					$scope.unsuccessfulSubmit = false;
					//we can clear the form data since the post was successful
					$scope.reset();
				}else{
					$scope.unsuccessfulSubmit = true;
					$scope.isItSubmitted = false;
				}
				//alert the user it was posted with info of the post
			});
		};
		
		
		//the user has send a form submission
		$scope.confirm = function(idea){
			if($scope.suggestionForm.$valid){
				//if the form is valid, proceed to save the idea				
 				$scope.save(idea);
			}
			else{
				//hmm, its not valid, set all options fields to touched, this in turn will turn on error messages
				$scope.settingTouched(true);
			}
		};
		
		//the parameter here will tell us where we want to set all fields to touched to display error message (true)
		//or set all fields to untouched (false)
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
	