'use strict';

angular.module('starter')
  .config(function($stateProvider) {

    $stateProvider
      .state('app.group-leaderboard', {
        url: '/group-leaderboard/:group',
        views: {
          'menuContent': {
            templateUrl: 'scripts/views/group-leaderboard/group-leaderboard.html',
            controller: 'GroupLeaderboardCtrl',
            controllerAs: '$ctrl'
          }
        }
      })
  })