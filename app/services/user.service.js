(function(){
	angular.module('profileMag')
	.factory('UserService', function($http, $q){
		var service = {}, currentUser;

		_fetchCurrentUser();

		function _fetchCurrentUser(){
			console.log(_fetchCurrentUser)
			$http.post('/api/user/current')
			.then(function(res){
				currentUser = res.data;
				console.log('in service', currentUser);
			}, function(err){
				console.log('error', err);
			});
		}

		service.getCurrentUser = function(){
			return currentUser;
		}

		return service;
	});
})();