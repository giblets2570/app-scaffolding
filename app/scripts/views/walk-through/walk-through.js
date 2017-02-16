'use strict';

angular.module('starter')
  .config(function($stateProvider) {

    // Walk through state
    $stateProvider
      .state('walk-through', {
        auth: false,
        url: '/walk-through',
        templateUrl: 'scripts/views/walk-through/walk-through.html',
        controller: 'WalkThroughController'
      });

  });
