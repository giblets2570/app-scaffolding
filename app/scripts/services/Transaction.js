'use strict';

angular.module('starter')
.service('Transaction', function($q,$http,Resource){
	
    let Transaction = new Resource('transactions');

    Transaction.leaderboard = function(group){
    	let data = {};
    	let endpoint = `${Transaction.endpoint}leaderboards`;
    	let request = $http({method: 'GET', url: endpoint, params: {group: group}});
    	data.$promise = request;
    	request.then((response) => {
    		angular.extend(data,response.data);
    	})
    	request.catch((error) => {
    		console.log(error);
    	})
    	return data;
    }

    return Transaction;
    
});