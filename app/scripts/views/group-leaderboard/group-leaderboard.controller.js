'use strict';

angular
  .module('starter')
  .controller('GroupLeaderboardCtrl', function($q,$scope,$state,$ionicModal,User,Job,Transaction,Group){
    this.refresh = () => {
    	let leaderboard = Transaction.leaderboard($state.params.group);
    	leaderboard.$promise.then(() => {
    		this.leaderboard = leaderboard;
        console.log(leaderboard);
    	})
    	return leaderboard.$promise;
    }
    $scope.$on('$ionicView.enter',this.refresh);
  })