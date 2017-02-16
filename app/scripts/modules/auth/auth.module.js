'use strict';

angular.module('starter.auth', [
  'starter.config',
  'starter.util',
  // 'ngCordova',
  'ngCookies',
  'ngResource',
  'ui.router'
])
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
