(function () {
	'use strict';

	angular.module('profileMag', ['ui.router', 'ui.bootstrap' ,'pdf'])
	.config(config)
	.run(run);

	function config($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/");
        $stateProvider.state('profiles-dis',{
        	url: '/',
        	templateUrl: 'profiles/index.html',
        	controller: 'ProfileController',
            controllerAs: 'pc'
        });
	}

	function run($http, $rootScope, $window) {
        // jwt token as default
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
    }


	//bootstrap app
	 $(function () {
        // get JWT token
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['profileMag']);
        });
    });
})();