'use strict';

angular
  .module('starter')
  .controller('GroupListCtrl', function($scope,$state,$filter,$ionicPopup,Job,Group){
    this.jobs = [];
    this.refresh = () => {
      let groups = Group.query();
      groups.$promise.then(() => this.groups = groups);
      return groups.$promise;
    }
    this.createNewGroup = () => {
      $scope.data = {};
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.name">',
        title: 'Enter new group name',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              console.log($scope);
              if (!$scope.data.name) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                let group = new Group({name: $scope.data.name});
                group.$create().then(() => {
                  return this.refresh();
                }).then(() => $state.go('app.group-view',{group: group._id}));
              }
            }.bind(this)
          }
        ]
      });
      // let name = prompt('Name of the group');
      if(name){
        let group = new Group({name: name});
        group.$create().then(() => {
          return this.refresh();
        }).then(() => $state.go('app.group-view',{group: group._id}));
      }
    }
    $scope.$on('$ionicView.enter',this.refresh);
  })