(function() {
  'use strict';

  angular
    .module('boardgame')
    .controller('TablesPageController', TablesPageController);

  /** @ngInject */
  function TablesPageController($scope, $log, clientServerCommFactory, $location) {
    console.log("tablesList ctrl ");

    var vm = this;
    vm.communication = {};
    vm.tables = [];
    vm.communication.collection = clientServerCommFactory.getCollection();
    vm.myTableId;
    vm.tableClosed = false;
    vm.tableBot = false;
    vm.tablePassword = '';


    vm.communication.sendMsg = function(msg){
      clientServerCommFactory.sendMsg(msg);
    }

    vm.communication.sendMsg({type: 3});

    vm.newTable = function(){
      console.log(vm.tableBot+" "+vm.tableClosed+" "+vm.tablePassword);

      vm.communication.sendMsg({type: 4, login:  clientServerCommFactory.getLogin(), bot: vm.tableBot,
        closed: vm.tableClosed, password: vm.tablePassword});
    }

    vm.appendToTable = function(tabId, password){
      console.log(password);
      vm.communication.sendMsg({type: 5, login:  clientServerCommFactory.getLogin(), tableId: tabId, password: password});
    }

    vm.leaveTable = function(tabId){
      vm.communication.sendMsg({type: 6, login:  clientServerCommFactory.getLogin(), tableId: tabId})
    }

    vm.onMessageAction = function(value){
      switch(value.type){
        case 3:
          if (value.result == 0){
            vm.tables = value.tables;
          } else{
          }
          break;

        case 4:
          if (value.result == 1){
            vm.tables = value.tables;
          } else if(value.result == 0){
            vm.tables = value.tables;
            //przejscie na str gry
            console.log(value.tables);
            clientServerCommFactory.myTableId = value.tables[value.tables.length-1].id;
            $location.url('/board/'+value.tables[value.tables.length-1].id);
          }
          break;

        case 5:
          console.log("case 5");
          console.log(value.result);

          if(value.result == 0){
            vm.tables = value.tables;
            //przejscie na str gry

            clientServerCommFactory.myTableId = value.tableId;
            $location.url('/board/'+value.tableId);

          } else if(value.result == 3){
            vm.tables = value.tables;
            console.log("ktos dolaczyl");
            console.log(vm.tables);

          } else if(value.result == -2){
            vm.tables = value.tables;
            vm.passError = 'Niepoprawne hasło!';
            console.log("ktos dolaczyl");
            console.log(vm.tables);

          }
          else {
            // stol juz zajety byl
            console.log("stol zajety");
          }
          break;
      }
    }

    $scope.$watchCollection(function(){
      return clientServerCommFactory.getCollection();
    }, function(value){
      if((angular.isUndefined(value))||(angular.isUndefined(value[value.length-1]))) return;
      vm.onMessageAction(value[value.length-1]);
      clientServerCommFactory.getCollection().splice(0,1);
    });
  }

})();
