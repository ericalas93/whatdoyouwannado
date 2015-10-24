var wdywd = angular.module('wdywdApp')
	.controller('loginController', function($scope, $location, UserAuthentication, jwtHelper){
		
		
		/*
if(localStorage['username'] !==  undefined){
			$location.path('/dashboard');
		}
		
*/
		$scope.message = 'Login/signup page';
		
		$scope.newUser = {};
		$scope.loggedInUser = {};
		
		$scope.signUpUser = function(){
			//reset it and make sure to add message errors and use pattern to protect from any XSS
			$scope.newUser = angular.copy($scope.newUserForm);
			
			UserAuthentication.postNewUser($scope.newUser).success(function(data){
				//console.log(data);
				localStorage.setItem("jwt", data);
				$location.path('/dashboard');
			}).error(function(error){
				console.error(error);
			})
		};
		
		$scope.loginUser = function(){
			$scope.loggedInUser = angular.copy($scope.loginInfo);
			//console.log($scope.loggedInUser);
			
			UserAuthentication.logInUser($scope.loggedInUser).success(function(data){
				localStorage.setItem("jwt", data);
				$location.path('/dashboard');
			}).error(function(error){
				console.error(error);
			});
		};
	});