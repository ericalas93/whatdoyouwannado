var wdywd = angular.module('wdywdApp')
	.controller('userController', function($scope, $location, UserAuthentication, jwtHelper){
		

		$scope.init = function(){
			//lets get the token from the local storage, if there is one
			$scope.token = localStorage['jwt'];
			
			//here we create a post object that will be recieved in the API
			$scope.tokenRequest = {token: $scope.token};
			console.log($scope.tokenRequest)
			
			UserAuthentication.userLoggedIn($scope.tokenRequest).success(function(data){
				console.log(data);
			}).error(function(error){
				//lets try the httpinterceptor
				console.log('no no');
//				$location.path('/login');
			});
		};
		
		$scope.init();

		
		/*
$scope.token = localStorage['jwt'];
		$scope.tokenDecoded = jwtHelper.decodeToken($scope.token);
		$scope.username = $scope.tokenDecoded.username;
*/

		
		
		
		
	//	$scope.init();
		
	
		
		
		
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