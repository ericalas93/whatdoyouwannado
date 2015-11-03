var wdywd = angular.module('wdywdApp')
	.controller('userController', function($rootScope, $scope, $location, ManipulateSuggestion, jwtHelper, getCustomSuggestions, ManipulateSuggestion){
		$scope.userSuggestions = {};

		/*
$scope.init = function(){
			//lets get the token from the local storage... if there is one
			$scope.token = localStorage['jwt'];
			
			//here we create a post object that will be recieved in the API
			$scope.tokenRequest = {token: $scope.token};
	
			
			
			UserAuthentication.userLoggedIn($scope.tokenRequest).success(function(data){
				if(data === '1'){
					console.log('made it');
					$scope.token = localStorage['jwt'];
					$scope.tokenDecoded = jwtHelper.decodeToken($scope.token);
					$scope.username = $scope.tokenDecoded.username;
				}//else if handled by the http interceptor
			
			}).error(function(error){
				//I choose you, httpinterceptor
				$rootScope.userLoggingIn = error;
			}).then(function(data){
				console.log(data)
			});
		};
*/

		$scope.init = function(){
			var token = localStorage['jwt'];
			$scope.tokenDecoded = jwtHelper.decodeToken(token);
			$scope.username = $scope.tokenDecoded.username;
			//get custom suggestions
			$scope.userSuggestions = angular.copy(getCustomSuggestions)
		}
		
		$scope.init();
		
		$scope.editSuggestion = function(suggestion_id){
			$location.path('/modify/' + suggestion_id);	
		};

		$scope.newSuggestion = function(url){
			$location.path('/newsuggestion');	
 
		};
		
		$scope.confirmDelete = function(suggestionId, suggestionName){
			alert(suggestionName + ' has been deleted from your list of suggestions.')	
			
			for(var id = 0; id < $scope.userSuggestions.length; ++id ){
				if($scope.userSuggestions[id].id === suggestionId){
					//optimistically remove suggestion from list
					(function(deleteId){
						$scope.$apply(function(){
							$scope.userSuggestions.splice(deleteId, 1);
						});
					})(id);
					break;
				}
			}
			
			
			var suggestion = {
								suggestion_id	:	suggestionId, 
								tableName		:	$scope.username, 
								jwt				:	localStorage['jwt']
							 };
							 
			ManipulateSuggestion.deleteSuggestion(suggestion).then(function(data){	
				//use apply to "rerender" the ng-repeat				
			});

			
		};


		

	});
	
	
