var wdywd = angular.module('wdywdApp')
	.factory('ManipulateSuggestion', function($http){
		return {
			getSuggestion:  function(){
								return $http.get('php/suggestions.php')
							}
		};		
	});
