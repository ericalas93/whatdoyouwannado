var wdywd = angular.module('wdywdApp')
	.directive('navBar', function(){
		return{
			restrict: 'E', 
			templateUrl: 'partials/navbar.html'
		}
	});