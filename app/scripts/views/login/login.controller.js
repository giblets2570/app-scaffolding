'use strict';

angular.module('starter')

.controller('LoginCtrl', function($scope, $ionicLoading, $ionicPopup, $timeout, $state, Facebook, Auth, Location) {

  this.user = {};

  // Reset Auth every time the view loads
  $scope.$on('$ionicView.enter', () => {
    $ionicLoading.show({  template: 'Loading up...' }).then(() => {
      return Facebook.getUserData()
    }).then((data) => {
      angular.merge(this.user,data);
      console.log(this.user);
      return Auth.isUser(this.user.facebookId);
    }).then((data) => {
      console.log(data);
      this.is_login = true;
    }).catch((error) => {
      console.log(error);
      this.is_signup = true;
    }).finally(() => {
      this.done = true;
      $ionicLoading.hide();
    })
  })

  // Perform the login action when the user submits the login form
  this.login = () => {
    $ionicLoading.show({  template: 'Logging in...' })
    .then(() => Auth.login(this.user))
    .then(() => {
      $ionicLoading.hide();
      $state.go('app.group-list');
    })
    .catch((error) => {
      $ionicLoading.hide();
      var _alert = $ionicPopup.alert({
        title: 'Login failed',
        template: error.message
      });
      $timeout(() => {if(_alert){_alert.close()}},1500);
    })
  };

  // Perform the login action when the user submits the login form
  this.signup = () => {
    console.log("Singup");
    $ionicLoading.show({  template: 'Signing up...' })
    .then(() => Auth.signup(this.user))
    .then((data) => {
      console.log(data);
      $ionicLoading.hide();
      $state.go('app.group-list');
    })
    .catch((error) => {
      $ionicLoading.hide();
      var _alert = $ionicPopup.alert({
        title: 'Signup failed',
        template: error.message
      });
      $timeout(() => {if(_alert){_alert.close()}},1500);
    })
  };

  this.post = () => {
    if(this.is_signup) return this.signup();
    return this.login()
  }

});