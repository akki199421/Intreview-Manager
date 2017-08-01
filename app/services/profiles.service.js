(function(){
	angular.module('profileMag')
	.factory('ProfileService', function($http, $q){
		var service = {};

		service.getAllProfile = function(){
			return $http.post('/api/candidate/all').then(successFn, errorFn);
		}

		service.updateReview = function(profile, user_id){
			return $http.post('/api/candidate/update-reivew', profile).then(successFn, errorFn);
		}

		service.updateComment = function(comment){
			return $http.post('/api/candidate/update-comment', comment).then(successFn, errorFn);
		}


		var successFn = function(res){
			return res.data;
		}

		var errorFn = function(res){
			 return $q.reject(res.data);
		}

		return service;
	})
})();