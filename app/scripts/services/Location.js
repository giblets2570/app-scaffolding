'use strict';

angular.module('starter')
  .service('Location', function($q,$cordovaGeolocation,Resource){

    let Location = new Resource('locations');

    Location.locate = function(){
      let promise = $cordovaGeolocation.getCurrentPosition();
      promise.then(function(position){
        Location.log(position);
      });
      return promise;
    }

    Location.log = function(position){
      let promise;

      // If position not provided find position
      if (position){
        promise = $q.resolve(position)
      } else {
        promise = Location.locate();
      }

      // When position found log
      promise.then(function(position){
        let location = new Location({
          lat: position.coords.latitude, 
          lng: position.coords.longitude
        })
        return location.$save();
      })

      return promise;
    }

    return Location;

  });