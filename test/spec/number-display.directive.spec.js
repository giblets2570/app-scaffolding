'use strict';

describe('numberDisplay', function() {
  var scope;
  var element;
  var injector;
  var invoke;

  beforeEach(module("myTemplates")); 

  beforeEach(function() {
    angular.module('myApp', ['ng','paynApp.directives','myTemplates']);
    injector = angular.injector(['myApp']);
    invoke = function(template,_scope){
      _scope = _scope || {};
      injector.invoke(function($rootScope, $compile) {
        scope = $rootScope.$new();
        angular.extend(scope,_scope);
        element = $compile(template)(scope);
        scope.$apply();
      });
    }
  });

  describe('prefix',function() {  

    beforeEach(function(){
      invoke('<number-display prefix="prefix"></number-display>')
    })  

    it('has a prefix span element', function() {
      expect(element.find('span.number-prefix')[0].innerText).to.equal('prefix');
    });

  })

  describe('editing',function() {

    beforeEach(function(){
      var number = 10;
      var _scope = {
        get: function(){
          return number;
        },
        set: function(_number){
          number = _number;
        }
      }
      sinon.spy(_scope,'get');
      sinon.spy(_scope,'set');
      invoke('<number-display get="get" set="set"></number-display>',_scope)
    })  

    it('input is hidden and display is visible initially', function() {
      expect(element.find('input.number-input').hasClass('ng-hide')).to.be.true;
      expect(element.find('span.number-display').hasClass('ng-hide')).to.be.false;
    });

    it('input is visible once display is clicked', function() {
      element.find('span.number-display').click()
      expect(element.find('input.number-input').hasClass('ng-hide')).to.be.false;
      expect(element.find('span.number-display').hasClass('ng-hide')).to.be.true;
    });

    it('input is hidden once input is blurred', function() {
      element.find('span.number-display').click()
      expect(element.find('input.number-input').hasClass('ng-hide')).to.be.false;
      expect(element.find('span.number-display').hasClass('ng-hide')).to.be.true;
      element.find('input.number-input').blur()
      expect(element.find('input.number-input').hasClass('ng-hide')).to.be.true;
      expect(element.find('span.number-display').hasClass('ng-hide')).to.be.false;
    });

    it('getter is called to determine display value', function() {
      expect(element.find('span.number-display')[0].innerText).to.equal('10')
      expect(scope.get).to.have.been.called
    })

    it('setter is called when input value is changed', function() {
      element.find('span.number-display').click()
      element.find('input.number-input').val('20').change()
      expect(scope.set).to.have.been.calledWith(20)
    })

  })

  describe('postfix',function() {  

    beforeEach(function(){
      invoke('<number-display postfix="postfix"></number-display>')
    })  

    it('has a postfix span element', function() {
      expect(element.find('span.number-postfix')[0].innerText).to.equal('postfix');
    });

  })

});