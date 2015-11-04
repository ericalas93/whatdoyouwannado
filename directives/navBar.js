var wdywd = angular.module('wdywdApp')
	.directive('navBar', function($location){
		return{
			restrict: 'E', 
			templateUrl: 'partials/navbar.html', 
			link: function ( scope, element, attrs, location) {
				scope.username = localStorage['username'] === undefined ? 'Guest' : localStorage['username'];
				scope.loggedIn = localStorage['username'] === undefined ? false : true;
				scope.logout =  function(){
					//clean the local storage
					localStorage.clear();
					$location.path('/login');
					
				}
        	}
		}
	});