var wdywd = angular.module('wdywdApp')
	.factory('HTTPInterceptor', function ($rootScope, $q, location) {
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
	});