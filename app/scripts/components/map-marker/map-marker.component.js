'use strict';

class MapMarker {
  constructor() {
  }
}

angular.module('starter')
  .component('mapMarker', {
    templateUrl: 'scripts/components/map-marker/map-marker.html',
    controller: MapMarker,
    controllerAs: '$marker',
    bindings: {
      header: '<',
      subheader: '<',
      lines: '<',
      buttons: '<'
    }
  });