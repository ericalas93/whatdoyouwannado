var wdywd = angular.module('wdywdApp')
	.controller('suggestionController', function($scope, ManipulateSuggestion, UserAuthentication){
		$scope.message = "Get a suggestion!";
		$scope.listOfSuggestions = [];
		$scope.resultSuggestions = {};
		$scope.numberOfSuggestions = 0;
		
		
		
		
		$scope.init = function(){
			
			//lets get the username from localstorage
			$scope.localStorageUsername = localStorage['username'];
			
			if($scope.localStorageUsername !== undefined )
			{
				//since PHP get input file takes as object, we have to make our token into an object with they key 'token'

				$scope.token = {token: localStorage['jwt']};
				
				UserAuthentication.userLoggedIn($scope.token).success(function(data){
					if(data === '1')
						$scope.usernameTableName = $scope.localStorageUsername;				
					else
						$scope.usernameTableName = 'default_suggestion'
				});

			}else{
				$scope.usernameTableName = 'default_suggestion';
			}
	

		};
		
		$scope.init();
		
		
		
		
		$scope.containsId = function(suggestionList, itemToAdd){
			//hey future eric, add some sets from es6 and use set, it would your life was easier
			var i = 0;
			for(i = 0; i < suggestionList.length; ++i){
				if(suggestionList[i].id === itemToAdd.id)
					return true;
			}
			return false;
		}
		
		
		$scope.getSuggestion = function(){
			
			$scope.tableName = {tableName: $scope.usernameTableName}
			ManipulateSuggestion.getSuggestion($scope.tableName).then(function(result){
				console.log(result);
				if(result != 'invalid'){
					//lets get how many suggestions there are
					var numberOfSuggestions = result.length;
					//lets store the results, dont forget to clear the list once we add a new element.
					$scope.resultSuggestions = angular.copy(result);	
					
					//lets pick a random one to try and add to the list!
					var randomSuggestionId = Math.floor(Math.random() * (numberOfSuggestions -1 ) + 1);
					
					//check if the suggestion is already in the list
					var alreadySuggested = $scope.containsId($scope.listOfSuggestions, $scope.resultSuggestions[randomSuggestionId]);
					
					while(alreadySuggested && ($scope.listOfSuggestions.length < 3)){
						//hey we finally got a repeat
						//lets generate a new id
						randomSuggestionId = Math.floor(Math.random() * numberOfSuggestions);
						//lets update the conditional
						alreadySuggested = $scope.containsId($scope.listOfSuggestions, $scope.resultSuggestions[randomSuggestionId]);	
					}
					
					//yeah its under three, lets add it, remove true when we add a limit
					if( $scope.listOfSuggestions.length < 3 || true){
						$scope.listOfSuggestions.push($scope.resultSuggestions[randomSuggestionId])
					}else{
						//theres now more than 3
						//make them wait
						$scope.limitMessage = 'you have reached your limit, please wait.';
						$scope.limitButtonDisable = false;
						//lets call a function that will make them wait 3 minutes
					}	
				}
			});
			
			
		};
		
		
	})