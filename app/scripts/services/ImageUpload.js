'use strict';

angular.module('starter')
  .service('ImageUpload', function ($q,$http,Environment,$cordovaFileTransfer) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      sendFile: function(imageURI,name){
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: Environment.api+'api/s3policy',
          params: {
            bucket_name: "repairlyrepphotos"
          },
          cache: false
        }).success(function(data) {
          var ext = '.jpeg';
          var filename = name ? name+ext : (new Date()).getTime()+ext
          var Uoptions = {};
          Uoptions.fileKey = "file";
          Uoptions.fileName = filename;
          Uoptions.mimeType = "image/jpeg";
          Uoptions.chunkedMode = false;
          Uoptions.headers = {
              connection: "close"
          };
          Uoptions.params = {
            key: 'uploads/'+filename, // the key to store the file on S3, could be file name or customized
            AWSAccessKeyId: data.key,
            acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
            policy: data.policy, // base64-encoded json policy (see article below)
            signature: data.signature, // base64-encoded signature based on policy string (see article below)
            "Content-Type": 'image/jpeg', // content type of the file (NotEmpty)
            // filename: file.name, // this is needed for Flash polyfill IE8-9
          }
          $cordovaFileTransfer.upload("https://repairlyrepphotos.s3.amazonaws.com/", imageURI, Uoptions)
            .then(function(result) {
                // Success!
                // Let the user know the upload is completed
                console.log('upload to s3 succeed ', result);
                deferred.resolve(result);
            }, function(err) {
                // Error
                // Uh oh!
                console.log('upload to s3 fail ', err);
                deferred.reject(err);
            }, function(progress) {
                  console.log(progress);
                // constant progress updates
            });
        }).error(function(err) {
          deferred.reject(err);
        });
        return deferred.promise
      }
    }
  });

