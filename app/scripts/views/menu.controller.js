'use strict';

angular.module('starter')

.controller('MenuCtrl', function($scope,$state,Auth) {

  // Open the login modal
  $scope.logout = function() {
    Auth.logout();
    $state.go('login');
  };

  $scope.isLoggedIn = function() {
    return Auth.isLoggedIn();
  }

  $scope.hide = () => {
  	return $state.current.name==="app.group-list" 
        || $state.current.name==="app.login"
  }
  $scope.back = () => {
  	// if($state.current.name ==)
  	if($state.current.name === 'app.group-view'){
  		$state.go("app.group-list")
  	}else if($state.current.name === 'app.group-leaderboard'){
  		$state.go("app.group-view",{group: $state.params.group})
  	}
  }
});