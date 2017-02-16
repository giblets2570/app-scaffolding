'use strict';

angular.module('starter')
  .service('ImageModal', function ($rootScope,$ionicModal) {

    var modal;
    var $modal = $rootScope.$new();

    $ionicModal.fromTemplateUrl(
      'scripts/components/image-modal/image-modal.html',
      {
        scope: $modal,
        animation: 'slide-in-up'
      }
    ).then((_modal) => {
      modal = _modal
    });


    this.show = function(image) {
      $modal.image = image;
      modal.show();
    }

    $modal.close = function() {
      modal.hide();
    }

    this.close = function() {
      modal.hide();
    }

  });

