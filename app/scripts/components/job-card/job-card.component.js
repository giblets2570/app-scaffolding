'use strict';

class JobCard {
  constructor($q,$scope,$state,$ionicPopup,Loading,Contact,Routing,Job,ImageCapture,ImageModal) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.job = new Job(this.job);
    this.Loading = Loading;
    this.Contact = Contact;
    this.Routing = Routing;
    this.ImageCapture = ImageCapture;
    this.ImageModal = ImageModal;
    this.$ionicPopup = $ionicPopup;
    this.comment = { comment: '' };
    this.allStatus = ['Order confirmed','On the way','Picked up','At engineer','Repaired','Dropped off'];

    this.$scope.$watch(
      () => this.job.rep_photos,
      () => {
        let width = 3;
        let row, col;
        this.rep_photos = [];
        if (this.job.rep_photos && this.job.rep_photos.length){      
          this.job.rep_photos.forEach((photo,index) => {
            col = index % width;
            row = (index - col) / width;
            this.rep_photos[row] = this.rep_photos[row] || [];
            this.rep_photos[row][col] = this.rep_photos[row][col] || photo;
          })
        }
      },
      true
    )

  }
  showPhotos() {
    return (
      this.job.rep_photos &&
      this.job.rep_photos.length
    )
  }
  takePicture() {
    this.job.rep_photos = this.job.rep_photos || [];
    this.ImageCapture
      .capture()
      .then((imageUrl) => {
        this.job.rep_photos.push({ url: imageUrl })
        let promise = this.job.$save();
        this.Loading.handlePromise(promise,'Saving Job','Job Saved','Error Saving Job')
      })
  }
  showPhoto(photo) {
    this.ImageModal.show(photo)
  }
  changeStatus(nextStatus) {
    let leaveJob = false;
    if(nextStatus){
      this.$ionicPopup
        .confirm({
          title: 'Change the status to "' + nextStatus + '"',
          template: 'Do you want to move the delivery to this stage?'
        })
        .then((result) => {
          if (result){
            this.job.status = nextStatus;
            if (this.job.status === 'Dropped off'){
              let promise = this.submitFeedback()
              promise.then((feedback) => {
                this.job.rep_feedback = feedback;
                leaveJob = true;
              })
              return promise
            }
          } else {
            return this.$q.reject('No result')
          }
        })
        .then(() => {
          let promise = this.job.$save();
          this.Loading.handlePromise(promise,'Updating Job Status');
          return promise;
        })
        .then(() => {
          if (leaveJob){
            this.$state.go('app.job-list')
          }
        })
        .catch((error) => {
          console.error(error)
        })
      }
  }
  submitFeedback() {
    let $popup = this.$scope.$new();
    angular.extend($popup,{
      data: {
        placeholder: 'Please fill this out based on the job you just did',
        feedback: ''
      }
    })
    let promise = this.$ionicPopup.show({
      title: 'Feedback',
      subTitle: 'How can we improve Repairly?',
      template: '<textarea ng-model="data.feedback" placeholder="{{data.placeholder}}" rows="3"></textarea>', 
      scope: $popup, 
      buttons: [{ 
        text: 'Cancel',
        type: 'button-default',
        onTap: (event) => {}
      }, {
        text: 'Submit',
        type: 'button-positive',
        onTap: (event) => $popup.data.feedback
      }]
    })
    return promise;
  }
  openRoute() {
    this.Routing.directions(this.job.pickup_address)
  }
  contact(phoneNumber) {
    this.$ionicPopup.show({
      title: 'Contact Customer',
      template: 'Would you like to phone or text?', 
      scope: null, 
      buttons: [{ 
        text: 'Phone',
        type: 'button-positive',
        onTap: () => this.Contact.phone(phoneNumber)
      }, {
        text: 'Text',
        type: 'button-positive',
        onTap: () => this.Contact.text(phoneNumber)
      }, {
        text: 'Back',
        type: 'button-dark'
      }]
    })
  }
  createComment() {
    if (this.comment && this.comment.comment && this.comment.comment.length){    
      let promise = this.job.createComment(this.comment).then(() => {
        this.comment.comment = ''
      })
      this.Loading.handlePromise(promise,'Posting comment')
    }
  }
}

angular.module('starter')
  .component('jobCard', {
    templateUrl: 'scripts/components/job-card/job-card.html',
    controller: JobCard,
    bindings: {
      job: '='
    }
  });