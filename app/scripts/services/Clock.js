'use strict';

angular.module('starter')
  .service('Clock', function($q,$state,$http,Auth,Environment){
    var clockIn = null;
    var day = 1000*60*60*24;

    function clockInToday(_clockIn){
      if(!_clockIn) return false;
      return Math.floor(_clockIn.clock_in_time.valueOf() / day) === Math.floor(new Date().valueOf() / day)
    }

    return {
      clockIn: function(){
        if(clockInToday(clockIn)){
          if(clockIn.clocked_out)
            return $q.reject(clockIn);
          else
            return $q.resolve(clockIn);
        }else{
          clockIn = null;
        }
        var deferred = $q.defer();
        $http({
          method: 'POST',
          url: Environment.api+'api/clock-ins',
          data: {
            rep: Auth.getCurrentUser()._id,
            clock_in_time: new Date()
          }
        }).success(function(data){
          clockIn = data;
          deferred.resolve(data);
        }).error(function(err){
          deferred.reject(err);
        })
        return deferred.promise;
      },
      clockOut: function(id){
        if(clockInToday(clockIn)){
          if(clockIn.clocked_out)
            return $q.resolve(clockIn);
        }else{
          return $q.reject(clockIn);
        }
        var deferred = $q.defer();
        $http({
          method: 'PUT',
          url: Environment.api+'api/clock-ins/'+id,
          data: {
            clock_out_time: new Date(),
            clocked_out: true
          }
        }).success(function(data){
          clockIn = data;
          deferred.resolve(data);
        }).error(function(err){
          deferred.reject(err);
        })
        return deferred.promise;
      },
      isClockedIn: function(){
        if(Auth.getCurrentUser()){
          if(clockInToday(clockIn)){
            if(clockIn.clocked_out)
              return $q.reject(clockIn);
            else
              return $q.resolve(clockIn);
          }
          var deferred = $q.defer();
          $http({
            method: 'GET',
            url: Environment.api+'api/clock-ins/'+Auth.getCurrentUser()._id+'/rep'
          }).success(function(data){
            clockIn = data;
            deferred.resolve(data);
          }).error(function(err){
            deferred.reject(err);
          })
          return deferred.promise;
        }else{
          return $q.reject({error: 'Not logged in'});
        }
      },
      takeBreak: function(data,id){
        if(!clockInToday(clockIn)){return $q.reject({error: 'Not clocked in'})};
        var deferred = $q.defer();
        $http({
          method: 'PUT',
          url: Environment.api+'api/clock-ins/'+id,
          data: data
        }).success(function(data){
          clockIn = data;
          deferred.resolve(data);
        }).error(function(err){
          deferred.reject(err);
        })
        return deferred.promise;
      }
    }
  });