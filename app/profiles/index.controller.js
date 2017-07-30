(function(){
	angular.module('profileMag').
	controller('ProfileController', function($scope){
		console.log('sfsdf controller');	
		$scope.name = 'akshsy';
		$scope.oneAtATime = true;
		$scope.isRead = false;
	});
})();