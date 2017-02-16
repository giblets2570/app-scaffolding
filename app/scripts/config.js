"use strict";

 angular.module('starter.config', [])

.constant('Roles', ['user','admin'])

.constant('Environment', {name:'development',api:'http://localhost:8080/'})

;