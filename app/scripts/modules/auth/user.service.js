'use strict';

(function() {

function UserResource(Environment,$resource) {
  return $resource(Environment.api + 'api/users/:id/:controller', {
    id: '@_id'
  }, {
    update: { method: 'PUT', isArray: false },
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
}

angular.module('starter.auth')
  .factory('User', UserResource);

})();
