var wdywd = angular.module('wdywdApp')
	.factory('ManipulateSuggestion', function($http){
		return {
			getSuggestion:  function(){ return $http.get('php/suggestions.php?action=get_suggestion'); }, 
			postSuggestion: function(newIdea){ return $http.post('php/suggestions.php?action=post_suggestion', newIdea); }
		};		
	});
