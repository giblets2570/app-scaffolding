'use strict';

angular.module('starter')
  .service('ImageCapture', function ($window,$interval,$ionicPlatform,$cordovaCamera,Loading,ImageUpload) {

    // Dimension is the maximum size of one side of the photo
    let dimension = 600;

    // Default options are extended with camera is ready
    let defaultOptions = {}
    $ionicPlatform.ready(() => {
      if ($window.Camera && $window.CameraPopoverOptions){      
        angular.extend(defaultOptions,{      
          quality: 80,
          destinationType: $window.Camera.DestinationType.DATA_URL,
          sourceType: $window.Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: $window.Camera.EncodingType.JPEG,
          targetWidth: dimension,
          targetHeight: dimension,
          popoverOptions: $window.CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        });
      }
    });

    // Capture an image, upload the image and resolve promise with dataURI
    this.capture = (source = 'camera',options = {}) => {

      // Depending on source set options
      if (source === 'camera'){
        options.sourceType = $window.Camera.PictureSourceType.CAMERA
      } else if (source === 'library'){
        options.sourceType = $window.Camera.PictureSourceType.PHOTOLIBRARY
      }

      // Extend default options
      options = angular.extend({},defaultOptions,options);

      // Capture picture
      let promise = $cordovaCamera
        .getPicture(options)
        .then((localImageData) => ImageUpload.sendFile("data:image/jpeg;base64,"+localImageData))
        .then((remoteImageData) => remoteImageData.headers.Location)

      // Display information
      Loading.handlePromise(promise,'Uploading Image','Upload Complete','Image Upload Error');
      return promise;
    }


  });

