(function () {
	'use strict';

	angular.module('profileMag', ['ui.router', 'ui.bootstrap'])
	.config(config)
	.run(run);

	function config($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/");
		console.log('profile');
        $stateProvider.state('profiles-dis',{
        	url: '/',
        	templateUrl: 'profiles/index.html',
        	controller: 'ProfileController'
        });
	}

	function run($http, $rootScope, $window) {
        // jwt token as default
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //     $rootScope.activeTab = toState.data.activeTab;
        // });
    }


	//bootstrap app
	 $(function () {
        // get JWT token
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            console.log('in',token);
            angular.bootstrap(document, ['profileMag']);
        });
    });
})();