var wdywdApp = angular.module('wdywdApp', ['ngRoute', 'ngMessages', 'angular-jwt'])
	.config(["$routeProvider", "$locationProvider", "$httpProvider", function($routeProvider, $locationProvider, $httpProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'partials/home.html', 
				controller: 'mainController', 
				title: 'Home'
			})
			.when('/suggestion', {
				templateUrl: 'partials/suggestion.html', 
				controller: 'suggestionController', 
				title: 'Get Suggestion',
				resolve: {
					getSuggestionList: ["$q", "ManipulateSuggestion", function($q, ManipulateSuggestion){
						//First lets check if theyre logged in
						
						
						var defer = $q.defer(), tableName = {tableName: localStorage['username'] === undefined ? 'default_suggestion' : localStorage['username'] };
						ManipulateSuggestion.getSuggestion(tableName).then(function(data){
							defer.resolve(data);
						});
						return defer.promise;
						
					}], 
					getCurrentConditions: ["$q", "Weather", function($q, Weather){
						var defer = $q.defer();
						//check if location permission has been given or not
						Weather.getLocation().then(function(){
							Weather.getCurrentWeather().then(function(data){
								defer.resolve(data);
							});
						});
						return defer.promise;
						
					}]
				}
			})
			.when('/login', {
				templateUrl: 'partials/login.html', 
				controller: 'loginController', 
				title: 'Login or Sign Up'
			})
			.when('/newsuggestion', {
				templateUrl: 'partials/newsuggestion.html',
				controller: 'newSuggestionController', 
				title: 'Create Suggestion'
			})
			.when('/dashboard', {
				templateUrl: 'partials/user.html', 
				controller: 'userController', 
				title: 'Dashboard',
				resolve: {
						confirmLoggedIn: ["$q", "UserAuthentication", function($q, UserAuthentication) {
							var defer = $q.defer(), tokenRequest = {token: localStorage['jwt']};
							UserAuthentication.userLoggedIn(tokenRequest).success(function(data){ defer.resolve(); });
							return defer.promise;
						}], 
							
						getCustomSuggestions: ["$q", "ManipulateSuggestion", function($q, ManipulateSuggestion) {
							var defer = $q.defer(), username = {tableName: localStorage['username']};
							ManipulateSuggestion.getSuggestion(username).then(function(data){ defer.resolve(data) });
							return defer.promise;
						}]
				}
			})
			.when('/modify/:id', {
				templateUrl: 'partials/editsuggestions.html', 
				controller: 'editSuggestionController', 
				title: 'Modify Suggestion',
				resolve: {
						getCustomSuggestion: ["$q", "ManipulateSuggestion", "$route", function($q, ManipulateSuggestion, $route){
							var defer = $q.defer(), suggestionInfo = localStorage['username'] !== undefined ? {tableName: localStorage['username']} : {tableName: 'default_suggestion'};
							suggestionInfo.id = $route.current.params.id;
							ManipulateSuggestion.getSuggestion(suggestionInfo).then(function(data){ defer.resolve(data) });
							return defer.promise;

						}]
				}
			});
			
			$locationProvider.html5Mode({
				enabled: true, 
				requireBase: false
			});
			
			
			$httpProvider.interceptors.push(["$rootScope", "$q", "$location", function ($rootScope, $q, $location) {
		        return {
		            'response': function (response) {
			           
		                return response;
		            },
		            'responseError': function (rejection) {
		                if(rejection.status === 401){
			                $rootScope.$broadcast('401error');
							$location.path('/login');
		                }
		                return $q.reject(rejection);
		            }
		        };
		    }]);
		    
	}]);
	
var wdywd = angular.module('wdywdApp')
	.controller('editSuggestionController', ["$rootScope", "$route", "$scope", "$routeParams", "$location", "$timeout", "getCustomSuggestion", "ManipulateSuggestion", function($rootScope, $route, $scope, $routeParams, $location, $timeout, getCustomSuggestion, ManipulateSuggestion){
		$scope.showName = $routeParams.id;
		$rootScope.pageTitle = $route.current.title;
		
		$scope.suggestion = getCustomSuggestion[0];
		
		
		$scope.init = function(){
			$scope.token = localStorage['jwt'];
			//setting default values. if they arent editted, use these, else itll overwrite
			$scope.idea = {
				name: $scope.suggestion.suggestion_name, 
				category: $scope.suggestion.suggestion_category, 
				price: $scope.suggestion.suggestion_price, 
				acceptableTime: $scope.suggestion.suggestion_time,
				acceptableTemperature: $scope.suggestion.suggestion_temperature
			}
			$scope.conditionSelection = $scope.suggestion.suggestion_weather.split(', ');
		}
		
		$scope.init(); 
		
		$scope.category = {
			availableOptions: [
				{name: 'Misc'},
				{name: 'Sport'}, 
				{name: 'Entertainment'},
				{name: 'Casual'},  
				{name: 'Social'}
			], 
			selectedOption: {name: $scope.suggestion.suggestion_category}
		};
		
		//options for time frame of activity
		$scope.acceptableTime = {
			availableOptions: [
				{name: 'Both'},
				{name: 'Day'},
				{name: 'Night'}
			], 
			selectedOption: {name: 'Both'}
		};
		
		//options for acceptable temperature range for activities
		$scope.acceptableTemperature = {
			availableOptions: [
				{description: 'Any Temperature', name: 'DNA'},
				{description: 'Hot (greater than 80F)', name: 'Hot'},
				{description: 'Mild (between 50F and 79F', name: 'Mild'},
				{description: 'Cold (less than 50F)', name: 'Cold'}
			], 
			selectedOption: {description: 'Any Temperature', name: 'DNA'}
		}
		
		

		
		
		$scope.save = function(){
			
			//copy the idea the user suggested
			$scope.newIdea = angular.copy($scope.idea);
			//add the category, ideal temperature, ideal time, and ideal weather condition
			$scope.newIdea.category = $scope.category.selectedOption.name;
			$scope.newIdea.acceptableTime = $scope.acceptableTime.selectedOption.name;
			$scope.newIdea.acceptableTemperature = $scope.acceptableTemperature.selectedOption.name;
			//if they deselect all options autodefault to 'All'
			
			$scope.newIdea.acceptableCondition = $scope.conditionSelection === undefined ? 'All' : $scope.conditionSelection.join(', ');
			console.log($scope.newIdea.acceptableCondition)
			
			$scope.settingTouched(false);
			$scope.postNewIdea();
		};
		
		$scope.relocate = function(){			
			$timeout(function(){
				$location.path('/dashboard');	
			}, 3000);
		};
		
		$scope.postNewIdea = function(){
			//send over token for auth and username to add to that users specific table!
			$scope.newIdea.jwt = $scope.token;
			$scope.newIdea.username = $scope.username;
			$scope.newIdea.suggestionId = $scope.suggestion.id;
			
			
			
			ManipulateSuggestion.updateSuggestion($scope.newIdea).then(function(data){
				if(data.data === '1'){
					$scope.isItSubmitted = true;
					//we can clear the form data since the post was successful
					$scope.relocate();
				}else{
					console.log(data)
					$scope.unsuccessfulSubmit = true;
				}
				//alert the user it was posted with info of the post
			});
		};
		
		$scope.confirm = function(){
			if($scope.suggestionForm.$valid){
 				$scope.save();
			}
			else{
				$scope.settingTouched(true);
			}
		};
		
		$scope.settingTouched = function(settingTouched){
			if(settingTouched){
				angular.forEach($scope.suggestionForm.$error, function (field) {
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					})
				});
			}
			else{
				$scope.suggestionForm.$setUntouched();
			}	
		};
	}]);
var wdywd = angular.module('wdywdApp')
	.controller('mainController', ["$rootScope", "$route", "$scope", "$location", function($rootScope, $route, $scope, $location){
		$scope.message = 'Home Page';
		$rootScope.pageTitle = $route.current.title;
		
		$scope.routeSuggestion = function(){
			$location.path('/suggestion');		
		};
	}]);
var wdywd = angular.module('wdywdApp')
	.controller('loginController', ["$rootScope", "$route", "$scope", "$location", "UserAuthentication", "jwtHelper", function($rootScope, $route, $scope, $location, UserAuthentication, jwtHelper){
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
				console.log(data)
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
		
		
	}])
	.run(["$rootScope", function($rootScope){
		$rootScope.$on('401error', function(){
			$rootScope.loginControllerError = true;
		});
	}]);
var wdywd = angular.module('wdywdApp')
	.controller('newSuggestionController', ['$rootScope', '$route', '$scope', 'ManipulateSuggestion' , 'UserAuthentication', 'jwtHelper', function($rootScope, $route, $scope, ManipulateSuggestion, UserAuthentication, jwtHelper){
		$scope.newIdea = {};
		$scope.isItSubmitted = false;
		$rootScope.pageTitle = $route.current.title;
		
		$scope.init = function(){
			//lets get the token from the local storage... if there is one
			$scope.token = localStorage['jwt'];
			
			//here we create a post object that will be recieved in the API
			$scope.tokenRequest = {token: $scope.token};
			
			UserAuthentication.userLoggedIn($scope.tokenRequest).success(function(data){
				$scope.tokenDecoded = jwtHelper.decodeToken($scope.token);
				$scope.username = $scope.tokenDecoded.username;

			
			}).error(function(error){
				//I choose you, httpinterceptor
				$rootScope.userLoggingIn = error;
			});
		};
		
		$scope.init();
		
		
		//these are the available categories
		$scope.category = {
			availableOptions: [
				{name: 'Misc'},
				{name: 'Sport'}, 
				{name: 'Entertainment'}, 
				{name: 'Social'}
			], 
			selectedOption: {name: 'Misc'}
		};
		
		//options for time frame of activity
		$scope.acceptableTime = {
			availableOptions: [
				{name: 'Both'},
				{name: 'Day'},
				{name: 'Night'}
			], 
			selectedOption: {name: 'Both'}
		};
		
		//options for acceptable temperature range for activities
		$scope.acceptableTemperature = {
			availableOptions: [
				{description: 'Any Temperature', name: 'DNA'},
				{description: 'Hot (greater than 80F)', name: 'Hot'},
				{description: 'Mild (between 50F and 79F', name: 'Mild'},
				{description: 'Cold (less than 50F)', name: 'Cold'}
			], 
			selectedOption: {description: 'Any Temperature', name: 'DNA'}
		}
		
		$scope.conditionSelection = ['All'];
		
		$scope.save = function(idea){
			//copy the idea the user suggested
			$scope.newIdea = angular.copy(idea);
			//add the category, ideal temperature, ideal time, and ideal weather condition
			$scope.newIdea.category = $scope.category.selectedOption.name;
			$scope.newIdea.acceptableTime = $scope.acceptableTime.selectedOption.name;
			$scope.newIdea.acceptableTemperature = $scope.acceptableTemperature.selectedOption.name;
			//if they deselect all options autodefault to 'All'
			$scope.newIdea.acceptableCondition = $scope.conditionSelection === undefined ? 'All' : $scope.conditionSelection.join(', ');
			//we want to set all all of them to pristine, that is incase they wish to suggest another idea right after, they dont see error messages on blank fields
			//silly angular
			$scope.settingTouched(false);
			$scope.postNewIdea();
		};
		
		//set the default attributes for the input fields
		$scope.reset = function(){
			$scope.idea.name = '';	
			$scope.idea.price = '';
			$scope.category.selectedOption = {name: 'Misc'};
			$scope.acceptableTime.selectedOption = {name: 'Both'};
			$scope.acceptableTemperature.selectedOption = {description: 'Any Temperature', name: 'DNA'};
		};
		
		$scope.postNewIdea = function(){
			//send over token for auth and username to add to that users specific table!
			$scope.newIdea.jwt = $scope.token;
			$scope.newIdea.username = $scope.username;
			
			ManipulateSuggestion.postSuggestion($scope.newIdea).then(function(data){
				console.log(data)
				if(data.data === '11'){
					$scope.isItSubmitted = true;
					$scope.unsuccessfulSubmit = false;
					//we can clear the form data since the post was successful
					$scope.reset();
				}else{
					$scope.unsuccessfulSubmit = true;
					$scope.isItSubmitted = false;
				}
				//alert the user it was posted with info of the post
			});
		};
		
		
		//the user has send a form submission
		$scope.confirm = function(idea){
			if($scope.suggestionForm.$valid){
				//if the form is valid, proceed to save the idea				
 				$scope.save(idea);
			}
			else{
				//hmm, its not valid, set all options fields to touched, this in turn will turn on error messages
				$scope.settingTouched(true);
			}
		};
		
		//the parameter here will tell us where we want to set all fields to touched to display error message (true)
		//or set all fields to untouched (false)
		$scope.settingTouched = function(settingTouched){
			if(settingTouched){
				angular.forEach($scope.suggestionForm.$error, function (field) {
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					})
				});
			}
			else{
				$scope.suggestionForm.$setUntouched();
			}	
		};
	}]);
	
var wdywd = angular.module('wdywdApp')
	.controller('suggestionController', ["$rootScope", "$route", "$scope", "ManipulateSuggestion", "UserAuthentication", "getSuggestionList", "getCurrentConditions", function($rootScope, $route, $scope, ManipulateSuggestion, UserAuthentication, getSuggestionList, getCurrentConditions){
		$scope.message = "Get a suggestion!";
		$rootScope.pageTitle = $route.current.title;
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
	}]);
var wdywd = angular.module('wdywdApp')
	.controller('userController', ["$rootScope", "$route", "$scope", "$location", "ManipulateSuggestion", "jwtHelper", "getCustomSuggestions", "ManipulateSuggestion", function($rootScope, $route, $scope, $location, ManipulateSuggestion, jwtHelper, getCustomSuggestions, ManipulateSuggestion){
		$scope.userSuggestions = {};
		$rootScope.pageTitle = $route.current.title;


		$scope.init = function(){
			var token = localStorage['jwt'];
			$scope.tokenDecoded = jwtHelper.decodeToken(token);
			$scope.username = $scope.tokenDecoded.username;
			//get custom suggestions, our API returns 'invalidnull' if there is no suggestions in the DB
			if(getCustomSuggestions === 'invalidnull')
				$scope.userSuggestions = [];
			else
				$scope.userSuggestions = angular.copy(getCustomSuggestions)
			$rootScope.loginControllerError = false;
		}
		
		$scope.init();
		
		$scope.editSuggestion = function(suggestion_id){
			$location.path('/modify/' + suggestion_id);	
		};

		$scope.newSuggestion = function(url){
			$location.path('/newsuggestion');	
 
		};
		
		$scope.confirmDelete = function(suggestionId, suggestionName){
			alert(suggestionName + ' has been deleted from your list of suggestions.')	
			
			for(var id = 0; id < $scope.userSuggestions.length; ++id ){
				if($scope.userSuggestions[id].id === suggestionId){
					//optimistically remove suggestion from list
					(function(deleteId){
						$scope.$apply(function(){
							$scope.userSuggestions.splice(deleteId, 1);
						});
					})(id);
					break;
				}
			}
			
			
			var suggestion = {
								suggestion_id	:	suggestionId, 
								tableName		:	$scope.username, 
								jwt				:	localStorage['jwt']
							 };
							 
			ManipulateSuggestion.deleteSuggestion(suggestion).then(function(data){	
				//use apply to "rerender" the ng-repeat				
			});

			
		};


		

	}]);
	
	

var wdywd = angular.module('wdywdApp')
	.directive('ngConfirmDelete', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmDelete || "Are you sure?";
                    var clickAction = attr.confirmedDelete;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }]);
var wdywd = angular.module('wdywdApp')
	.directive('navBar', ["$location", function($location){
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
	}]);
var wdywd = angular.module('wdywdApp')
	.factory('HTTPInterceptor', ["$rootScope", "$q", "location", function ($rootScope, $q, location) {
	    return {
	        'response': function (response) {
	            //Will only be called for HTTP up to 300
	            console.log(response);
	            return response;
	        },
	        'responseError': function (rejection) {
	            if(rejection.status === 401) {
		            $rootScope.broadcast('401response');
	                console.log('errir');
	                location.path('/login');
	            }
	            return $q.reject(rejection);
	        }
	    };
	}]);
var wdywd = angular.module('wdywdApp')
	.factory('ManipulateSuggestion', ["$http", "$q", function($http, $q){
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
				
				var def = $q.defer();
				$http.delete('php/suggestions.php?action=delete_suggestion', {params: suggestion} )
				.success(function(data){
					def.resolve(data);
				});
				
				return def.promise;
			}
		};		
	}]);

var wdywd = angular.module('wdywdApp')
	.factory('UserAuthentication', ["$http", "$q", function($http, $q){
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
	}]);
var wdywd = angular.module('wdywdApp')
	.factory('Weather', ["$q", "$http", "$window", function($q, $http, $window){
		return{
			getCurrentWeather: function(){
				var def = $q.defer();
				var latitude = localStorage['latitude'], longitude = localStorage['longitude']
				var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=2de143494c0b295cca9337e1e96b00e0&units=imperial';
				$http.get(url)
				.success(function(data){
					def.resolve(data);
				});
				
				return def.promise; 
			},
			getLocation: function(){
		            var deferred = $q.defer();
		            
		            if(localStorage['locationPermission'] == undefined){
			            localStorage.setItem('locationPermission', false);
						localStorage.setItem('locationAskedOnce', false);

			            $window.navigator.geolocation.getCurrentPosition(function(position){
							//lets ask for weather permission automatically if we havent asked them yet
						    localStorage['longitude'] = position.coords.longitude
							localStorage['latitude'] = position.coords.latitude 
					        localStorage['locationPermission'] = true;
					        localStorage['locationAskedOnce'] = true;
							deferred.resolve(position);
				    	});  

		            }else
		            {
			            deferred.resolve();
		            }
		
		    	  
		
		            return deferred.promise; 
			}
		}
	}]);