'use strict';

angular
  .module('starter')
  .controller('GroupViewCtrl', function($q,$scope,$state,$ionicModal,$ionicPopup,User,Job,Transaction,Group,Facebook,Colour){
  	
    let user = User.get();
    user.$promise.then(() => this.user = user);

    let colours = Colour.get();
    let colour_index = 0;
    this.category_colours = {};

    this.leaderboard = () => $state.go('app.group-leaderboard',{group: $state.params.group});

    this.refresh = () => {
      let transactions = Transaction.query({group: $state.params.group});
      let group = Group.get({id: $state.params.group});
      return $q.all([group.$promise,transactions.$promise]).then(() => {
        this.transactions = transactions;
        console.log(this.transactions);
        this.group = group;
        transactions.map((transaction) => {
          if(!this.category_colours[transaction.category]){
            this.category_colours[transaction.category] = colours[colour_index % colours.length];
            colour_index += 1;
          }
        })
        return $q.resolve();
      })
    }

    this.refresh();
    $scope.$on('$ionicView.enter',this.refresh);

    this.addMessage = (transaction) => {
      if(transaction.new_message){
        transaction.messages.push({user: user, text: transaction.new_message, likes: []});
        transaction.new_message="";
        transaction.$update().then(() => {
          transaction.show_messages = true;
        })
      }
    }

    this.for = (transaction) => {
      let show_messages = transaction.show_messages;
      transaction.dislikes = transaction.dislikes.filter((like) => like !== user._id)
      if(!transaction.likes.contains(user._id)){
        transaction.likes.push(user._id);
        transaction.$update().then(() => {
          transaction.show_messages = show_messages;
        })
      }
    }

    this.against = (transaction) => {
      let show_messages = transaction.show_messages;
      transaction.likes = transaction.likes.filter((like) => like !== user._id)
      if(!transaction.dislikes.contains(user._id)){
        transaction.dislikes.push(user._id);
        transaction.$update().then(() => {
          transaction.show_messages = show_messages;
        })
      }
    }

    this.like = (transaction,message) => {
      let show_messages = transaction.show_messages;
      if(message.likes.contains(user._id)){
        message.likes = message.likes.filter((like) => like !== user._id);
      }else{
        message.likes.push(user._id);
      }
      transaction.$update().then(() => {
        transaction.show_messages = show_messages;
      })
    }

    // this.addUser = () => {
    //   $scope.data = {};
    //   // An elaborate, custom popup
    //   var myPopup = $ionicPopup.show({
    //     template: '<input type="text" ng-model="data.username">',
    //     title: 'Enter User\'s name',
    //     scope: $scope,
    //     buttons: [
    //       { text: 'Cancel' },
    //       {
    //         text: '<b>Save</b>',
    //         type: 'button-positive',
    //         onTap: function(e) {
    //           console.log($scope);
    //           if (!$scope.data.username) {
    //             //don't allow the user to close unless he enters wifi password
    //             e.preventDefault();
    //           } else {
                // this.group.addUser($scope.data.username).then(() => {
                //   this.refresh();
                // }).catch((error) => {
                //   let alertPopup = $ionicPopup.alert({
                //     title: 'Error!',
                //     template: error.data.message
                //   });

                //   alertPopup.then(function(res) {
                //     console.log('Thank you for not eating my delicious ice cream cone');
                //   });
                // })
    //           }
    //         }.bind(this)
    //       }
    //     ]
    //   });
    // }
    $ionicModal.fromTemplateUrl('users.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then((modal) => {
      this.users_modal = modal;
    });
    this.openUserModal = () => {
      $scope.users = User.query();
      console.log($scope.users);
      $scope.users.$promise.then((users) => {
        $scope.users = $scope.users.filter((user) => {
          return user.firstName && user.lastName && user._id !== this.user._id
        })
      })
      this.users_modal.show();
    };
    this.closeUserModal = () => {
      this.users_modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', () => {
      this.users_modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', () => {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', () => {
      // Execute action
    });
    $scope.addUsers = () => {
      let users = $scope.users.filter((user) => user.checked);
      this.group.addUsers(users).then(() => {
        this.closeUserModal();
        this.refresh();
      }).catch((error) => {
        let alertPopup = $ionicPopup.alert({
          title: 'Error!',
          template: error.data.message
        });
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });
      })
    }

    $ionicModal.fromTemplateUrl('transacation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.newTransaction = {amount:{amount: ''},description:{}};
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.createTransaction = (newTransaction) => {
      newTransaction.group = $state.params.group;
      let transaction = Transaction.create(newTransaction);
      transaction.$promise.then(() => {
        this.refresh();
        $scope.closeModal();
      });
    }
  })