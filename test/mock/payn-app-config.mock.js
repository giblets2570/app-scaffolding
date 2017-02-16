'use strict';

angular
  .module('paynApp.config',[])
  .constant(
    'Environment', 
    {name:'development',api:'http://localhost:8000/',couch:'http://localhost:5984/'}
  )