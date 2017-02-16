'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter',[
  'ionic',
  'ionic-modal-select',
  'starter.config',
  'starter.auth',
  'starter.resource',
  'ngStorage',
  'btford.socket-io',
  'ngCordova',
  'ngFileUpload',
  'ngOpenFB'
])

.config(function($logProvider){
  $logProvider.debugEnabled(false);
})

.config(function($httpProvider){
  $httpProvider.interceptors.push(function($q, $localStorage) {
    return {
     'request': function(config) {
        config.headers['x-access-token'] = $localStorage.token;
        return config;
      }
    };
  });
})

.directive('cashInput', function(){
    return{
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
})


.run(function($rootScope,$ionicPlatform,$ionicHistory,Location,Auth) {
  
  // // Get the location when the person has the app in the foreground
  // function update_location(){
  //   if(Auth.isLoggedIn()){
  //     Location.log();
  //   };
  // }

  // Add device ready listener
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {

    // Function to handle notification
    // function handleNotification(data){
    //   console.log('Broadcast Update')
    //   $rootScope.$broadcast('update')  
    // }

    // Configure OneSignal Plugin
    // if (window.plugins && window.plugins.OneSignal) {
    //   let OneSignal = window.plugins.OneSignal;
    //   OneSignal
    //     .startInit('8c72bf54-0d31-4dac-b3f5-33c42857c255', "273744378661")
    //     .inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification)
    //     .handleNotificationReceived(handleNotification)
    //     .handleNotificationOpened(handleNotification)
    //     .endInit();
    // }

    // Configure Keyboard Plugin
    if (window.plugins && window.plugins.Keyboard) {
      let Keyboard = window.plugins.Keyboard;
      Keyboard.hideKeyboardAccessoryBar(true);
      Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      window.StatusBar.styleDefault();
    }

    // update_location();
  }

  // $ionicPlatform.registerBackButtonAction(function (event) {
  //   console.log('GO BACK')
  //   $ionicHistory.goBack()
  // }, 100);

  // $ionicPlatform.on('pause', function() {
  //   update_location();
  // })

  // $ionicPlatform.on('resume', function() {
  //   update_location();
  // })

})

.config(function($urlRouterProvider) {
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/walk-through');
});

function occurences(string,char){
    return string.split('').reduce((cuml,c) => {
        return cuml + (char === c);
    },0);
}


function link(scope, element, attr, ngModel){


    var view_value;

    ngModel.$formatters.push(function(value){
      console.log(value);
      if(value === '') return value;
      value = value || 0;
      view_value = value;
      value = String(value / 100);
      value = value.split('.');
      let result = value[0];
      if(value.length > 1){
          result += `.${value[1].substring(0,2)}`
      }
      return result;
    });
    
    ngModel.$parsers.push(function(value){
        var return_value;
        try{
            value = value || 0;
            let string_value = String(value);

            // Check if decimal point occurs more than once
            let decimal_count = occurences(string_value,'.');
            if(decimal_count > 1) throw 'Too many decimal points';
            else if(decimal_count == 1){
                // If more than two places after the decimal point
                if(string_value.split('.')[1].length > 2) throw 'Too many decimal places';
            }

            value = value || 0;
            value = parseInt(value * 100);

            // Check if is a number 
            if(isNaN(value)) throw 'Result is NaN';

            return_value = value;
            view_value = return_value;
            ngModel.$setValidity('is_valid', true);
        }catch(e){
            console.log(e);
            return_value = view_value;
            ngModel.$setViewValue(view_value / 100);
            ngModel.$render();
            ngModel.$setValidity('is_valid', false);
        }
        
        return return_value;
    });

}
