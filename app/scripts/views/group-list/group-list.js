'use strict';

angular.module('starter')
  .config(function($stateProvider) {

    $stateProvider
      .state('app.group-list', {
        url: '/group-list',
        views: {
          'menuContent': {
            templateUrl: 'scripts/views/group-list/group-list.html',
            controller: 'GroupListCtrl',
            controllerAs: '$ctrl'
          }
        }
      })
  })