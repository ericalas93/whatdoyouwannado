var wdywd = angular.module('wdywdApp')
	.controller('suggestionController', function($rootScope, $scope, ManipulateSuggestion, UserAuthentication, getSuggestionList, getCurrentConditions){
		$scope.message = "Get a suggestion!";
		$scope.listOfSuggestions = [];
		$scope.resultSuggestions = {};
		$scope.numberOfSuggestions = 0;
		
		
		//checks to see if the conditons match the the curerent condition
		$scope.validCondition = function(suggestion){
			//stored in DB as a csv, lets split
			var acceptableConditions = suggestion.suggestion_weather.split(', ');
			
			//if somewhere in the acceptable conditions we have all, automatically return true
			if(acceptableConditions.indexOf('all' !== -1))
				return true;

			//map through the acceptable conditions, returns true or false if they match the current conditon
			var resultConditionTests = acceptableConditions.map(function(condition){
				if(condition == $scope.currentCondition)
					return true;
				else
					return false;
			});
			
			//if it contains at least one true value, we can say its acceptable and passes the test
			if(resultConditionTests.indexOf(true) !== -1)
				return true;
			else
				return false;
		}
		
		//the API returns very specific conditons ->Thunderstorm, Drizzle, Rain; these three and be considered rainy.
		//this function will help generalize them based on their ID
		//see http://openweathermap.org/weather-conditions for information on ID and what they mean
		$scope.generalizeCondition = function(conditionCode){

			if(conditionCode >= 200 && conditionCode <= 531)
				return 'Rain';
			else if(conditionCode >= 600 && conditionCode <= 622)
				return 'Snow';
			else if( (conditionCode >= 800 && conditionCode <= 804) || (conditionCode >= 951 && conditionCode <= 955) )
				return 'Clear'
			else
				return 'Other';
				
		}
		

		$scope.init = function(){
			//get all suggestions, once
			$scope.resultSuggestions = getSuggestionList;
			//lets get the username from localstorage
			$scope.localStorageUsername = localStorage['username'];
			
			if($scope.localStorageUsername !== undefined ){
				//since PHP get input file takes as object, we have to make our token into an object with they key 'token'
				$scope.token = {token: localStorage['jwt']};			
				UserAuthentication.userLoggedIn($scope.token).success(function(data){
					if(data === '1')
						$scope.usernameTableName = $scope.localStorageUsername;				
					else
						$scope.usernameTableName = 'default_suggestion';
				});

			}else{
				$scope.usernameTableName = 'default_suggestion';
			}
			//get current Temp and current conditon (sunny, cloudy, etc) and if we have location permission
			$scope.currentTemperature = getCurrentConditions.main.temp;
			$scope.currentCondition = $scope.generalizeCondition(getCurrentConditions.weather[0].id);
			//get current hour in military time to check for day or night activity
			$scope.currentHour = new Date().getHours();
			$scope.locationPermission = JSON.parse(localStorage['locationPermission']);

		};
		
		$scope.init();

		//check to see if the array (which contains an object, or else we could have used indexOf()) already contains the item. 
		$scope.containsId = function(suggestionList, itemToAdd){
			//hey future eric, add some sets from es6 and use set, it would your life was easier
			var i = 0;
			for(i = 0; i < suggestionList.length; ++i){
				if(suggestionList[i].id === itemToAdd.id)
					return true;
			}
			return false;
		}
		
		$scope.getRandomId = function (min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}
		
		//checks to see the current time and the time of the suggestion match and are valid
		$scope.validTime = function(suggestion){
			
			if(suggestion.suggestion_time === 'Both'){
				return true;
			}
			
			//current time is between [6pm, 4am] -> night time activity
			if( ($scope.currentHour >= 18 && $scope.currentHour <= 24) || ($scope.currentHour >= 0 && $scope.currentHour <= 4) ){
				if(suggestion.suggestion_time === 'Night')
					return true;
				else
					return false;
			}else{
				//current time is between (4am, 6pm) -> day time activity
				if(suggestion.suggestion_time === 'Day')
					return true;
				else
					return false;
			}
		}
		
		//check if suggestion fits the temperature range of the current temp
		//dna == does not apply -> this means it doesnt matter the temp
		$scope.validTemperature = function(suggestion){
			
			if(suggestion.suggestion_temperature === 'DNA'){
				return true;
			}
			
			if( $scope.currentTemperature >= 80 ){
				//meant for activities in temps > 80
				if(suggestion.suggestion_time === 'Hot')
					return true;
				else
					return false;
			}else if( $scope.currentTemperature >= 50 && $scope.currentTemperature < 80 ){
				//meant for activities where temp is between [60, 80)
				if(suggestion.suggestion_time === 'Mild')
					return true;
				else
					return false;
			}else if( $scope.currentTemperature < 50 ){
				//meant for activities where temp is < 60
				if(suggestion.suggestion_time === 'Cold')
					return true;
				else
					return false;
			}
		}
		
		
		
		$scope.getSuggestion = function(){
			var exhaustedAllItems = false;
			var randomSuggestionId;
					
			if($scope.locationPermission === true){
				var tempList = [];
				var suggestionCount = $scope.resultSuggestions.length;
				
				
				while(tempList.length < suggestionCount){
					randomSuggestionId = $scope.getRandomId(0, suggestionCount);
					
					//lets pass the suggestion through a series of tests to make sure its a valid and useful suggestion
					//this includes corrent time, correct conditions, correct temperature
					if( $scope.validTime($scope.resultSuggestions[randomSuggestionId]) && $scope.validTemperature($scope.resultSuggestions[randomSuggestionId]) && $scope.validCondition($scope.resultSuggestions[randomSuggestionId]) ){
						//lets add to the list that the user will see
						$scope.listOfSuggestions.push($scope.resultSuggestions[randomSuggestionId]);
						//remove from the main list
						$scope.resultSuggestions.splice(randomSuggestionId, 1);
						break;
					}else{
						//it didnt pass at least one of the tests, so lets add it to a temp list (why? because this tempList will hold all the failures and once the failure list length > the amount of suggestions remaining we have exhausted all options
						if( !$scope.containsId(tempList, $scope.resultSuggestions[randomSuggestionId]) ){
							//lets add to the tempList to higher the count of failures
							tempList.push($scope.resultSuggestions[randomSuggestionId]);
						}
					}
				}
			}
			else{
				//get random Id, will always be a new random one since the array removes the suggestion once its been added
				randomSuggestionId = $scope.getRandomId(0, suggestionCount);
				//add that new suggestion to array
				$scope.listOfSuggestions.push($scope.resultSuggestions[randomSuggestionId]);
				//remove it from list of options, this is so we dont have duplicates
				$scope.resultSuggestions.splice(randomSuggestionId, 1);
			}
			
			
			//lets ensure that we have exhausted all the good results. we will loop through the remainder of items and make sure they fail all tests (time, weather, temp)
			//if one of them passes that mean we messed up somewhere and we need to fix it.
			var remainderTests = $scope.resultSuggestions.map(function(suggestion){
				if( $scope.validTime(suggestion) && $scope.validTemperature(suggestion) && $scope.validCondition(suggestion))
					return true;				
				else
					return false;
			});
			
			//we look at the mapped results, if there is at least one true, we still have more to go through and the message of exhausting all of suggestions will not show
			if(remainderTests.indexOf(true) === -1){
				$scope.limitMessage = 'You have exhausted all your suggestions!';
				$scope.limitButtonDisable = true;
			}			
		};	
	});