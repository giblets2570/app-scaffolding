'use strict';

angular.module('starter')
  .service('Facebook', function($openFB) {

    function convertUrlToBase64(url) {
      return new Promise((resolve,reject)=>{
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
            resolve(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        }
        xhr.open('GET', url);
        xhr.send();
      })
    }
    
    $openFB.init( {appId: '1081625495282149'} );

    this.login = function(callback){
      // console.log('login')
      $openFB.login({scope: 'email,user_friends'})
        .then(function( token ) {
            // log in successful
            // send token to your server
            callback(null,token)
        }, function( err ) {
            // error logging in
            callback(err)
        });
    }

    this.logout = function(callback){
      $openFB.revokePermissions()
        .then(callback)
    }

    // gets first and last name from facebook. 
    // Then combines with Users image
    // Assumed to have authenticated 
    this.getUserData = function() {
      return Promise.all([
        $openFB.api({path: "/me",
                     params: {
                        fields: "id,name,last_name,first_name"}}),
        $openFB.api({path: "/me/picture",
                      params: {
                        redirect: false,
                        height: 64,
                        width: 64}
                      })
      ]).then(response => {
        // console.log(response);
        var user = response[0];
        return convertUrlToBase64(response[1].data.url).then((photo)=>{
          user.facebookPhoto = photo;
          user.firstName = user.first_name;
          user.lastName = user.last_name;
          user.facebookId = user.id;
          delete user.first_name;
          delete user.last_name;
          delete user.id;
          delete user.name;
          return user;
        })
      })
    }

    this.getUserFriends = function() {
      $openFB.api({path: '/me/friends'})
      .then((response) => {
        console.log(response);
      })
    }

    this.getFacebookProfilePicture = function() {
      // console.log("Getting facebook profile Picure")

      return $openFB.api({path: "/me/picture",
                     params: {
                        redirect: false,
                        height: 64,
                        width: 64}})
              .then((response) => {
                return convertUrlToBase64(response.data.url)
              });
    }
  });