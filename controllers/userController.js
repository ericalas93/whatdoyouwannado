var wdywd = angular.module('wdywdApp')
	.controller('userController', function($rootScope, $scope, $location, UserAuthentication, jwtHelper){
		

		$scope.init = function(){
			//lets get the token from the local storage... if there is one
			$scope.token = localStorage['jwt'];
			
			//here we create a post object that will be recieved in the API
			$scope.tokenRequest = {token: $scope.token};
			
			UserAuthentication.userLoggedIn($scope.tokenRequest).success(function(data){
				if(data == 'correct'){
					$scope.token = localStorage['jwt'];
					$scope.tokenDecoded = jwtHelper.decodeToken($scope.token);
					$scope.username = $scope.tokenDecoded.username;
				}//else if handled by the http interceptor
			
			}).error(function(error){
				//I choose you, httpinterceptor
				$rootScope.userLoggingIn = error;
			});
		};
		
		$scope.init();

		
	
		
		
		
	/*
	
		if(localStorage['username'] ===  undefined){
			$location.path('/login');
		}
		else{
			$scope.user = {username: undefined};
			$scope.user.username = angular.copy(localStorage['username']);
			//console.log($scope.user)
		}
*/
	});