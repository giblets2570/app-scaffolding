'use strict';

angular.module('starter')
  .config(function($stateProvider) {

    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'scripts/views/menu.html',
        controller: 'MenuCtrl'
      })

  })