'use strict';

angular.module('starter')
  .service('Loading', function($q,$ionicLoading){

    class Loading {
      /**
        * handlePromise
        * Display a loading message while a promise is resolving
        */
      static handlePromise(promise,message='Loading ...',success,error) {
        let promises = [promise];
        promises.push($ionicLoading.show({ template: message }));
        let completed = $q.all(promises).then($ionicLoading.hide);
        if (success) this.displaySuccess(promise,success);
        if (error) this.displayError(promise,error);
        return completed;
      }
      static displaySuccess(promise,message='Completed') {
        promise.then(() => {
          $ionicLoading.show({template: message, duration:500});
        })
      }
      static displayError(promise,message){
        promise.catch((error) => {
          console.error(error)
          message = message || error.message || error;
          $ionicLoading.show({template: message, duration:500});
        })
      }
    }

    return Loading;
    
  });