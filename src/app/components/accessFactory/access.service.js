(function() {
  'use strict';

  angular
    .module('boardgame')
    .factory('accessFactory', accessFactory);

  /** @ngInject */
  function accessFactory() {

    var obj = {}
    this.access = false;
    obj.getPermission = function(){    //set the permission to true
      this.access = true;
    }
    obj.checkPermission = function(){
      return this.access;             //returns the users permission level
    }
    return obj;
  }

})();
