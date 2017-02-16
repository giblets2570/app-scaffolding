'use strict';

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

angular.module('starter')
  .service('Colour', function(){
    let colours = [
      "#1abc9c",
      "#3498db",
      "#9b59b6",
      "#2ecc71",
      "#34495e",
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
      "#2c3e50",
      "#f1c40f",
      "#e67e22",
      "#e74c3c",
      "#ecf0f1",
      "#95a5a6",
      "#f39c12",
      "#d35400",
      "#c0392b",
      "#bdc3c7",
      "#7f8c8d"
    ]

    class Colour{
      static get(){
        shuffle(colours)
        return colours;
      }
    }

    return Colour;
  });