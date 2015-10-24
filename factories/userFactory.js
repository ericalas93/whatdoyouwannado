var wdywd = angular.module('wdywdApp')
	.factory('UserAuthentication', function($http){
		return{
			postNewUser: function(newUser){
				return $http.post('php/authentication.php?action=create_user', newUser);
			},
			logInUser: function(user){
				return $http.post('php/authentication.php?action=login_user', user);
			}, 
			userLoggedIn: function(token){
				return $http.post('php/authentication.php?action=check_log', token);
			}

		};
	});