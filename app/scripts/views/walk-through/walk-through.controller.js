'use strict';

angular.module('starter')
  .controller('WalkThroughController', function($scope,$state,$timeout,$ionicPopup,$ionicLoading,Auth,Facebook) {

    this.user = {};
  	if(Auth.loggedIn()) $state.go('app.group-list'); // if the user is already logged in, go to dashboard

    // Reset Auth every time the view loads
    $scope.$on('$ionicView.enter', () => {
        Auth.facebookLogin = false;
    })

    $scope.facebookLogin = () => {
      Facebook.login((error,token) => {
        if (error) {
          return $ionicPopup.alert({
            "title": "Error",
            "message": "Could not retrieve facebook token. Please try again"
          })
        }
        Auth.token = token;
        Auth.facebookLogin = true;
        $timeout(()=>$state.go('app.login'));
      });
    };

    // Perform the login action when the user submits the login form
    this.login = () => {
      $ionicLoading.show({  template: 'Logging in...' })
      .then(() => Auth.login(this.user))
      .then(() => {
        $ionicLoading.hide();
        Location.log();
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

  });