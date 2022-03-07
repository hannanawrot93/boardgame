(function() {
  'use strict';

  angular
    .module('boardgame')
    .controller('LoginPageController', LoginPageController);

  /** @ngInject */
  function LoginPageController($scope, clientServerCommFactory, accessFactory, $log, $location) {
    var vm = this;
    vm.communication = {};
    vm.collection = [];
    vm.myLogin = '';
    vm.errorLogin = '';

    vm.login = function(){
      getClientServerComm();
      vm.communication.sendMsg({type: 1, login: vm.myLogin});
      vm.communication.setLogin(vm.myLogin);
    }
    vm.getAccess = function(){
      accessFactory.getPermission();       //call the method in acccessFac to allow the user permission.
    }
    vm.about = function(){
      $location.url('/about');
    }
    vm.onMessageAction = function(value){
      if(value.type == 1){
          if (value.result == 0){
            vm.getAccess();
            $location.url('/tablesList');
          } else {
            vm.errorLogin = 'Taki nick już istnieje, podaj inny';
            //komm,zeby podac inny login
          }
      }
    }


    function getClientServerComm(){
      vm.communication.collection = clientServerCommFactory.getCollection();
      clientServerCommFactory.startCommunication();
      vm.communication.sendMsg = function(msg){
        clientServerCommFactory.sendMsg(msg);
      }
      vm.communication.setLogin = function(login){
        clientServerCommFactory.setLogin(login);
      }

      $scope.$watchCollection(function(){
        return clientServerCommFactory.getCollection();
      }, function(value){
        if((angular.isUndefined(value))||(angular.isUndefined(value[value.length-1]))) return;
        vm.onMessageAction(value[value.length-1]);
      }, true);
    }
  }
})();
