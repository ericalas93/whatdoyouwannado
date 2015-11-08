var wdywd = angular.module('wdywdApp')
	.factory('Weather', function($q, $http, $window){
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
	});