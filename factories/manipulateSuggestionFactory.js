var wdywd = angular.module('wdywdApp')
	.factory('ManipulateSuggestion', function($http, $q){
		return {
			getSuggestion:  function(tableName){ 
				var def = $q.defer();	
				$http.get('php/suggestions.php?action=get_suggestion', {params: tableName} )
				.success(function(data){
					def.resolve(data);
				});
				
				return def.promise; 
			}, 
			postSuggestion: function(newIdea){ return $http.post('php/suggestions.php?action=post_suggestion', newIdea); }
		};		
	});
