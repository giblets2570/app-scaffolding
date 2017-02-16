'use strict';

angular.module('starter')
  .service('Auth', function($http,$q,$window,$cookies,$cookieStore,$localStorage,$cordovaInAppBrowser,User,DeviceToken,Environment) {
    let $storage = $localStorage;
    let currentUser;
    if($cookies.get('token')){
      currentUser = User.get();
    }
    class Auth {
      static login(user){
        return $q((resolve,reject)=>{
          DeviceToken.getDeviceToken(user)
            .then(deviceToken => {
              let endpoint = Environment.api+'auth/login';
              return $http({
                method: 'POST',
                url: endpoint,
                data: user
              })
            })
            .then((response)=>{
              console.log(response);
              let data = response.data;
              $cookieStore.put('token', data.token);
              console.log(data.token);
              currentUser = User.get();
              resolve(user);
            })
            .catch(err => {
              reject(err);
            });
        })
      }

      static signup(user){
        return $q((resolve,reject)=>{
          DeviceToken.getDeviceToken(user)
            .then(deviceToken => {
              let endpoint = Environment.api+'auth/signup';
              return $http({
                method: 'POST',
                url: endpoint,
                data: user
              })
            })
            .then((response)=>{
              let data = response.data;
              $cookieStore.put('token', data.token);
              currentUser = User.get();
              resolve(user);
            })
            .catch(err => {
              reject(err);
            });
        })
      }

      static isUser(facebookId){
        let endpoint = Environment.api+'auth/is-user';
        return $http({
          method: 'GET',
          url: endpoint,
          params: {
            facebookId: facebookId
          }
        })
      }

      static userSession(){
        let endpoint = Environment.api+'token';
        return $http({
          method: 'POST',
          url: endpoint,
          data: {
            userSession: $storage.userSession,
            token: $storage.token
          }
        }).then((response)=>{
          // $storage.token = response.data.user.accessTokens[0].value;
          return $q.resolve(response.data);
        })
      }

      static logout(){
        return $q((resolve,reject) => {
          delete $storage.userSession;
          resolve();
        })
      }

      static loggedIn(){
        return (
          $storage.userId &&
          $storage.userId.length &&
          $storage.password &&
          $storage.password.length
        )
      }

      static getCurrentUser(){
        return $storage.loginName;
      }

      static openFastLink(){
        let token = $cookies.get('token');
        let token_length = token.length;
        let endpoint = Environment.api+"fast-link?access_token="+$cookies.get('token').substring(1,token_length-1);
        return endpoint;
        // $window.open(endpoint,'_blank');
        // document.addEventListener("deviceready", function () {
      //   $cordovaInAppBrowser.open(endpoint, '_blank', {
      //     location: location
      //   })
      //   // $cordovaInAppBrowser.open(endpoint, '_blank')
      //   .then(function(event) {
      //     // success
      //   })
      //   .catch(function(event) {
      //     // error
      //   });
      //     // $cordovaInAppBrowser.close();
      // // }, false);
      }

    }

    return Auth;

  });