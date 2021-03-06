var wdywd = angular.module('wdywdApp')
	.controller('loginController', function($rootScope, $route, $scope, $location, UserAuthentication, jwtHelper){
		$rootScope.pageTitle = $route.current.title;
		
		$scope.init = function(){
			$scope.loginInfo = {
				username: $rootScope.loggingInUsername, 
				password: undefined
			};
			//if this isnt the first time opening login page then check again
			//these lines are to trigger when there was an invalid login and we must show the errors and related info to the user
			$scope.loginControllerError = $rootScope.loginControllerError;
			
			//lets get the username from localstorage
			$scope.localStorageUsername = localStorage['username'];
			
			if($scope.localStorageUsername !== undefined )
			{
				//since PHP get input file takes as object, we have to make our token into an object with they key 'toeken'

				$scope.token = {token: localStorage['jwt']};
				
				UserAuthentication.userLoggedIn($scope.token).success(function(data){
					$location.path('/dashboard');				
				});

			}
	

		};
		
		$scope.init();

		
		
			
		$scope.message = 'Login/signup page';
		
		$scope.newUser = {};
		$scope.loggedInUser = {};
		
		$scope.signUpUser = function(){
			//reset it and make sure to add message errors and use pattern to protect from any XSS
			$scope.newUser = angular.copy($scope.newUserForm);
						
			UserAuthentication.postNewUser($scope.newUser).success(function(data){
				if(data == 'fail' || data == "taken"){
					$scope.userNameTaken = true;
				}
				else{
					$scope.userNameTaken = false;
					//lets set up the JWT and store that along wiht the username inside the localStorage
					localStorage.setItem("jwt", data);
					localStorage.setItem("username", $scope.newUser.username); 
					$location.path('/dashboard');
				}
				
			}).error(function(error){
				$location.path('/login');
			})
		};
		
		$scope.loginUser = function(){
			//they entered a username
			if($scope.loginInfo.username !== undefined && $scope.loginInfo.password !== undefined){
				$scope.loggedInUser = angular.copy($scope.loginInfo);

				
				//this allows the username to be saved after redirect; see line XX for local saving
				$rootScope.loggingInUsername = $scope.loggedInUser.username;
				UserAuthentication.logInUser($scope.loggedInUser).success(function(data){
					//did we get a good response?
					if(data == 'no such user' || data == "fail"){
						//let redirect just so we can get a login error and autofill the username field... ugly and hacky? yes. I'm sorry.
						$location.path('/dashboard');
					}
					else{		
						//we got a good login and that means that we can go ahead and store all the info and keep it :) 		
						localStorage.setItem("jwt", data);
						localStorage.setItem("username", $scope.loggedInUser.username);
						$location.path('/dashboard');
					}
					
				}).error(function(error){
					$location.path('/login');
				});
				
			}

			
			
		};
		
		
	})
	.run(function($rootScope){
		$rootScope.$on('401error', function(){
			$rootScope.loginControllerError = true;
		});
	});