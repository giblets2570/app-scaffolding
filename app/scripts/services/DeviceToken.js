'use strict';

angular.module('starter')
  .service('DeviceToken', function($q,$http,$cordovaNetwork,Environment) {
    
    // Create a blank bill to use
    var newDeviceToken = user => {
      return angular.extend({},{
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName
        },
        dateAdded: Date.now(),
        playerId: null,
        pushToken: null,
        active: true
      })
    };

    // Saves the device token to the backend
    this.getDeviceToken = user => {
      return $q((resolve, reject) => {
        if(window.plugins && window.plugins.OneSignal){
          if($cordovaNetwork.isOnline()){
            window.plugins.OneSignal.getIds(ids => {
              let deviceToken = newDeviceToken(user);
              deviceToken.playerId = ids.userId;
              deviceToken.pushToken = ids.pushToken;
              resolve(deviceToken);
            });
          }else{
            reject({error: 'Not connected'});
          }
        }else{
          let deviceToken = newDeviceToken(user);
          deviceToken.playerId = "Not a device";
          deviceToken.pushToken = "Not a device";
          resolve(deviceToken);
        }
      });
    }
  });