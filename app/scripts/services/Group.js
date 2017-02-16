'use strict';

angular.module('starter')
  .service('Group', function($http,$timeout,Resource){

    let jobs = {};
    let Group = new Resource('groups');

    Group.prototype.addUsers = function(users){
    	let endpoint = `${Group.endpoint}${this._id}/addUsers`;
    	let request = $http({method: 'PUT', url: endpoint, data: {users: users}});
    	request.then((response) => {
    		console.log(response)
    	})
    	request.catch((error) => {
    		console.log(error);
    	})
    	return request;
    }

    return Group;
    
  });