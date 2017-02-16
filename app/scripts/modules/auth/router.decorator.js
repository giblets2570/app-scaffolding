'use strict';

(function() {

angular.module('starter.auth')
  .run(function($rootScope, $state,$timeout, Auth) {
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on('$stateChangeStart', function(event, next) {
      $timeout(function(){
        if (!next.authenticate) {
          return;
        }

        if (typeof next.authenticate === 'string') {
          Auth.hasRoleAsync(next.authenticate).then(has => {
            if (has) {
              return;
            }

            event.preventDefault();
            return Auth.isLoggedInAsync().then(is => {
              $state.go(is ? 'app.home' : 'walk-through');
            });
          });
        } else {
          Auth.isLoggedInAsync().then(is => {
            if (is) {
              return;
            }
            event.preventDefault();
            $state.go('app.home');
          });
        }
      })
    });
  });

})();
