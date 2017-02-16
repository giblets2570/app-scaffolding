'use strict';

(function() {

function authInterceptor($q, $cookieStore, $injector, Environment, Util) {
  var state;
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token') && Util.isSameOrigin(config.url,Environment.api)) {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }

      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if (response.status === 401) {
        (state || (state = $injector.get('$state'))).go('walk-through');
        // remove any stale tokens
        $cookieStore.remove('token');
      }
      return $q.reject(response);
    }
  };
}

angular.module('starter.auth')
  .factory('authInterceptor', authInterceptor);

})();
