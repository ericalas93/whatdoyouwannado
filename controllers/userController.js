var wdywd = angular.module('wdywdApp')
	.controller('userController', function($rootScope, $route, $scope, $location, ManipulateSuggestion, jwtHelper, getCustomSuggestions, ManipulateSuggestion){
		$scope.userSuggestions = {};
		$rootScope.pageTitle = $route.current.title;


		$scope.init = function(){
			var token = localStorage['jwt'];
			$scope.tokenDecoded = jwtHelper.decodeToken(token);
			$scope.username = $scope.tokenDecoded.username;
			//get custom suggestions, our API returns 'invalidnull' if there is no suggestions in the DB
			if(getCustomSuggestions === 'invalidnull')
				$scope.userSuggestions = [];
			else
				$scope.userSuggestions = angular.copy(getCustomSuggestions)
			$rootScope.loginControllerError = false;
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
	
	
