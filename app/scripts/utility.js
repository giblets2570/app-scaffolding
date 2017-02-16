'use strict';

/**
  * @name sum
  * @description Find the sum of values in an array
  */
Array.prototype.sum = function(callback){
  return this.reduce((value,object) => (value + Number(callback(object))),0)
}

/**
  * @name contains
  * @description Check if an array contains a given item
  */
Array.prototype.contains = function(item){
  return (this.indexOf(item) > -1);
} 
