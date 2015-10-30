var wdywd = angular.module('wdywdApp')
	.factory('ManipulateSuggestion', function($http, $q){
		return {
			getSuggestion:  function(info){ 
				var def = $q.defer();	
				$http.get('php/suggestions.php?action=get_suggestion', {params: info} )
				.success(function(data){
					def.resolve(data);
				});
				
				return def.promise; 
			}, 
			postSuggestion: function(newIdea){ return $http.post('php/suggestions.php?action=post_suggestion', newIdea); }, 
			updateSuggestion: function(updatedIdea){ return $http.post('php/suggestions.php?action=edit_suggestion', updatedIdea); }, 
			deleteSuggestion: function(suggestion){
				
				console.log(suggestion)
				var def = $q.defer();
				$http.delete('php/suggestions.php?action=delete_suggestion', {params: suggestion} )
				.success(function(data){
					def.resolve(data);
				});
				
				return def.promise;
			}
		};		
	});
