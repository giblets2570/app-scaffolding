'use strict';

angular.module('starter')
  .service('Job', function($http,$timeout,Resource){

    let jobs = {};
    let Job = new Resource('jobs');

    function storeJob(job){
      delete job.$promise;
      jobs[job._id] = job;
    }

    let query = Job.query;
    Job.query = function(params){
      let _jobs = query(params);
      _jobs.$promise.then(() => {
        console.log('Cache results')
        _jobs.forEach((_job) => storeJob(_job))
      })
      return _jobs;
    }

    let get = Job.get;
    Job.get = function(params){
      let job = new Job({});
      // Use cache initially
      if (params.id in jobs){
        angular.extend(job,jobs[params.id]);
      }
      // Find updated data
      let _job = get(params);
      _job.$promise.then(() => {
        storeJob(_job)
        angular.extend(job,jobs[params.id]);
      });
      job.$promise = _job.$promise;
      return job;
    }

    Job.prototype.createComment = function(comment) {
      let endpoint = `${Job.endpoint}${this._id}/comments`;
      console.log(endpoint)
      var request = $http.post(endpoint,comment);
      request.then((response) => {
        let comment = response.data;
        this.comments.push(comment)
      })
      request.catch((error) => {
        console.error(error)
      })
      return request;
    };

    return Job;
    
  });