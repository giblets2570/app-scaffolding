'use strict';

angular.module('starter')
  .service('Contact', function($q,$ionicPlatform){

    function followLink(attributes){
      var anchor = angular.element('<a/>');
      anchor.attr(attributes)[0].click();
    }

    class Contact {
      static text(phoneNumber,message=''){
        let href = `sms:${phoneNumber}`;
        if ($ionicPlatform.isAndroid && $ionicPlatform.isAndroid()){
          href += `;body=${message}`
        } else if ($ionicPlatform.isIOS && $ionicPlatform.isIOS()){
          href += `&body=${message}`
        }
        followLink({ href: href });
      }
      static phone(phoneNumber){
        let href = `tel:${phoneNumber}`;
        followLink({ href: href });
      }
    }

    return Contact;
    
  });

