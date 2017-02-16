'use strict';

angular.module('starter.resource')
  .factory('Resource',function($resource,Environment){

    return function(endpoint,params,methods){

        endpoint = `${Environment.api}api/${endpoint}/`;

        var defaultMethods = {
            update: { method: 'PUT', isArray: false },
            create: { method: 'POST' }
        };

        methods = angular.extend( defaultMethods, methods );

        var defaultParams = {
            id : '@_id'
        };

        params = angular.extend( defaultParams, params );

        var $Resource = $resource( endpoint + ':id', params, methods );
        $Resource.endpoint = endpoint;


        $Resource.prototype.$prepare = function(){
          return angular.extend({}, this);
        }

        $Resource.prototype.$transform = function(){
          
        }

        $Resource._get = $Resource.get;
        $Resource.get = function(params, callback){
          var resource = $Resource._get(params, callback);
          resource.$promise.then(function() {
            resource.$transform();
          });
          return resource;
        };

        $Resource._query = $Resource.query;
        $Resource.query = function(params, callback){
          var resources = $Resource._query(params, callback);
          resources.$promise.then(function() {
            resources.map(function(resource){
              resource.$transform();
            });
          });
          return resources;
        };

        $Resource.prototype.toJSON = function() {
          var data = this.$prepare();
          delete data.$promise;
          delete data.$resolved;
          return data;
        };

        $Resource.prototype.$save = function(params, success, error){
          var response;
          if ( !this._id ){
            response = this.$create(params, success, error);
          } else {
            response = this.$update(params, success, error);
          }
          response.then(function() {
            this.$transform()
          }.bind(this))
          return response;
        };

        return $Resource;
    };

});