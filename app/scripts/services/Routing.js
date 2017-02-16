'use strict';

angular.module('starter')
  .service('Routing', function($q,$httpParamSerializer,$ionicPlatform,$cordovaGeolocation,Loading){

    let cityMapperBaseUrl = 'https://citymapper.com/directions?';

    function followLink(attributes){
      let anchor = angular.element('<a/>');
      anchor.attr(attributes)[0].click();
    }

    $ionicPlatform.ready(() => {
      if ($ionicPlatform.device){
        cityMapperBaseUrl = 'citymapper://directions?';
      }
    })

    class Routing {

      static location() {
        let options = {timeout: 10000, enableHighAccuracy: true};
        let promise = $cordovaGeolocation.getCurrentPosition(options);
        Loading.handlePromise(promise,'Finding Location','Loading Route','Location Error');
        return promise
      }

      static directions(location){

        let coords;
        let address; 

        // If lat and lng then use full address if possible
        if (location.lat && location.lng){
          coords = `${location.lat},${location.lng}`
          if (location.line1 && location.city && location.postcode){
            address = `${location.line1},${location.city},${location.postcode}`;
          }

        // Otherwise use a stripped version of postcode
        } else {
          address = location.postcode.replace(/\W*/g,'');
        }


        this.location().then((position) => {
          let params = {
            startcoord: `${position.coords.latitude},${position.coords.longitude}`,
          }
          if (address){
            params.endaddress = address
          }
          if (coords){
            params.endcoord = coords
          }
          let encodedParams = $httpParamSerializer(params);
          let cityMapperUrl = cityMapperBaseUrl + encodedParams;
          followLink({ href: cityMapperUrl });
        })
      }

    }


    return Routing

    
  });

