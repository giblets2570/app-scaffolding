'use strict';

angular.module('starter')

.filter('ClockFilter',function(){
  return function(input){
    var day = 1000*60*60*24;
    input = input % day;
    var middle = " : ";
    if(input % 60 < 10){
      middle = " : 0";
    }
    return Math.floor(input/60) + middle + input%60;
  }
})

.filter('weekRange',function(){
  return function(input){
    var day = 1000*60*60*24;
    if(!input){return input;}
    if(typeof(input) !== 'object'){input = new Date(input);}
    var end = new Date(input.valueOf() + day * 6);
    return input.getDate()+'/'+(input.getMonth()+1)+'/'+input.getFullYear()+' - '+end.getDate()+'/'+(end.getMonth()+1)+'/'+end.getFullYear()
  }
})

.filter('time',function(){
  return function(date){
    var middle = ' : ';
    if(!date){return '';}
    date = new Date(date);
    if(date.getMinutes() < 10){
      middle = ' : 0';
    }
    return date.getHours() + middle + date.getMinutes();
  }
});