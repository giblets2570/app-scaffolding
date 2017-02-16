'use strict';

angular.module('starter')
  .service('Timeslot', function($q,$state,$cordovaNetwork,$http,Auth,Environment){
    var myTimeslots = null;
    return {
      getMine: function(){
        if(myTimeslots) return $q.resolve(myTimeslots);
        try{
          if($cordovaNetwork.isOffline()){return $q.reject({error: 'No connection'});}
        }catch(e){
          
        }
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: Environment.api+'api/timeslots',
          params: {
            rep: Auth.getCurrentUser()._id
          },
          cache: false
        }).success(function(data){
          myTimeslots = data;
          deferred.resolve(data);
        }).error(function(err){
          deferred.reject();
        })
        return deferred.promise;
      },
      add: function(date,section){
        try{
          if($cordovaNetwork.isOffline()){return $q.reject({error: 'No connection'});}
        }catch(e){
          
        }
        var deferred = $q.defer();
        $http({
          method: 'POST',
          url: Environment.api+'api/timeslots',
          data: {
            rep: Auth.getCurrentUser()._id,
            rep_name: Auth.getCurrentUser().username,
            date: date,
            section: section
          },
          cache: false
        }).success(function(data){
          deferred.resolve(data);
        }).error(function(err){
          deferred.reject();
        })
        return deferred.promise;
      }
    }
  });