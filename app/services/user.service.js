(function(){
	angular.module('profileMag')
	.factory('UserService', function($http, $q){
		var service = {}, currentUser;

		function _fetchCurrentUser(){
			return $http.post('/api/user/current')
		}

		service.getCurrentUser = function(){
			return _fetchCurrentUser().then(function(res){
				return res.data;
			},function(err){
				return null;
			});
		}

		return service;
	});
})();