'use strict';

angular.module('starter')
.config(function($stateProvider) {

    $stateProvider
	.state('app.login', {
        url: '/login',
        views: {
			'menuContent': {
				controller: 'LoginCtrl',
				controllerAs: 'login',
				templateUrl: 'scripts/views/login/login.html',
			}
		}
	});
})