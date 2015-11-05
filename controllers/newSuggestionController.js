var wdywd = angular.module('wdywdApp')
	.controller('newSuggestionController', ['$rootScope', '$scope', 'ManipulateSuggestion' , 'UserAuthentication', 'jwtHelper', function($rootScope, $scope, ManipulateSuggestion, UserAuthentication, jwtHelper){
		$scope.newIdea = {};
		$scope.isItSubmitted = false;
		$scope.message = "New Suggestion here";
		
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
			$scope.settingTouched(false);

			$scope.postNewIdea();
		};
		
		$scope.reset = function(){
			$scope.idea.name = '';	
			$scope.idea.price = '';
			$scope.data.selectedOption = {name: 'Misc'};
		};
		
		$scope.postNewIdea = function(){
			//send over token for auth and username to add to that users specific table!
			$scope.newIdea.jwt = $scope.token;
			$scope.newIdea.username = $scope.username;
			
			ManipulateSuggestion.postSuggestion($scope.newIdea).then(function(data){
				console.log(data)
				if(data.data === '11'){
					$scope.isItSubmitted = true;
					//we can clear the form data since the post was successful
					$scope.reset();
				}else{
					$scope.unsuccessfulSubmit = true;
				}
				//alert the user it was posted with info of the post
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
	