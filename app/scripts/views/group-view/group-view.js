'use strict';

angular.module('starter')
  .config(function($stateProvider) {

    $stateProvider
      .state('app.group-view', {
        url: '/group-view/:group',
        views: {
          'menuContent': {
            templateUrl: 'scripts/views/group-view/group-view.html',
            controller: 'GroupViewCtrl',
            controllerAs: '$ctrl'
          }
        }
      })
  })