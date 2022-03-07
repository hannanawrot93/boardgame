(function() {
  'use strict';

  angular
    .module('boardgame')
    .controller('GamePageController', GamePageController);

  /** @ngInject */
  function GamePageController($scope, $log, clientServerCommFactory, $location, $routeParams, $window) {
    var vm = this;
    vm.communication = {};
    vm.tables = [];
    vm.myId = -1;
    vm.myMovement = false;
    vm.movementId = -1;
    vm.myLogin = '';
    vm.table = {};
    vm.myTableId = -1;
    vm.players = [];
    vm.isRunning = false;
    vm.btnRoll = false;
    vm.serverResponse = -1;
    vm.welcome = false;
    vm.availableArchitects = [];
    vm.availableFirms = [];
    vm.btnLeave = false;
    vm.communication.collection = clientServerCommFactory.getCollection();
    vm.communication.gameMessages = clientServerCommFactory.getGameMessages();

    vm.leaveTable = function(){
      console.log("leave");
      vm.btnLeave = true;
      vm.communication.sendMsg({type: 6, login:  vm.myLogin, tableId: clientServerCommFactory.myTableId, myId: vm.myId });
    };

    vm.rollDice = function(){
      console.log("rollDice");
      vm.btnRoll = false;///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      vm.communication.sendMsg({type: 8, login:  vm.myLogin, tableId: vm.myTableId,
        myId: vm.myId});
    };

    vm.buyMaterialSendServer = function(buyList, sum, shopId){
      console.log("shopping");
      vm.communication.sendMsg({type: 9, login:  vm.myLogin, tableId: vm.myTableId,
        myId: vm.myId, buyList: buyList, sum: sum, shopId: shopId});
    };
    vm.buyPlotSendServer = function(plot, officeId){
      console.log("plot");
      vm.communication.sendMsg({type: 10, login:  vm.myLogin, tableId: vm.myTableId,
        myId: vm.myId, plot: plot, officeId: officeId});
    };
    vm.buyProjectSendServer = function(architect){
      console.log("project");
      vm.communication.sendMsg({type: 11, login:  vm.myLogin, tableId: vm.myTableId,
        myId: vm.myId, architect: architect});
    };
    vm.answerQuestionSendServer = function(good){
      console.log("question");
      vm.communication.sendMsg({type: 12, login:  vm.myLogin, tableId: vm.myTableId,
        myId: vm.myId, good: good});
    };
    vm.penaltyAcceptSendServer = function(penalty){
      console.log("penalty");
      vm.communication.sendMsg({type: 13, login:  vm.myLogin, tableId: vm.myTableId,
        myId: vm.myId, mandate: penalty});
    };

    vm.endMovementSendServer = function(firm){
      console.log("end move");
      vm.communication.sendMsg({type: 14, login:  vm.myLogin, tableId: vm.myTableId,
        myId: vm.myId, firm: firm});
    };


    vm.onMessageAction = function(value){
      switch(value.type){
        case 6:
          //leave
          if (value.result == 0){
            vm.communication.gameMessages = [];
            vm.communication = {};
            vm.tables = [];
            clientServerCommFactory.myTableId = -1;
            $location.url('/tablesList/');

          } else if(value.result == 1){
            vm.serverResponse = 6;
            vm.leaveServerMsg = value;
          }
          break;

        case 7:
          console.log("77777777777777777");
          console.log(value);

          if (value.result == 0){
            clientServerCommFactory.myId = value.myId;
            clientServerCommFactory.myLogin = value.table.players[value.myId].login;
            vm.myId = value.myId;
            vm.myMovement = value.myMovement;
            vm.movementId = value.movementId;
            vm.myLogin = value.table.players[value.myId].login;
            vm.table = value.table;
            vm.myTableId = value.table.id;
            vm.players = value.table.players;
            vm.isRunning = true;
            vm.welcome = true;
            if(vm.myMovement){
              vm.btnRoll = true;
            }

          }
          break;

        case 8:
          console.log("dice");
          console.log(value);
          vm.serverResponse = 8;
          vm.rollresponse = value;
          vm.welcome = false;

          break;

        case 9:
          console.log("serverResponse");
          console.log(value);
          vm.serverResponse = 9;
          vm.buyMaterialServerMsg = value;
          break;

        case 10:
          console.log("serverResponse");
          console.log(value);
          vm.serverResponse = 10;
          vm.buyPlotServerMsg = value;
          break;

        case 11:
          console.log("serverResponse");
          console.log(value);
          vm.serverResponse = 11;
          vm.buyProjectServerMsg = value;
          break;

        case 12:
          console.log("serverResponse");
          console.log(value);
          vm.serverResponse = 12;
          vm.answerQuestionServerMsg = value;
          break;

        case 13:
          console.log("serverResponse");
          console.log(value);
          vm.serverResponse = 13;
          vm.penaltyAcceptServerMsg = value;
          break;

        case 14:
          console.log("serverResponse");
          console.log(value);
          vm.serverResponse = 14;
          vm.endMovementServerMsg = value;
          vm.myMovement = value.myMovement;
          vm.movementId = value.next;
          vm.firm = value.firm;
          if(vm.myMovement){
            vm.btnRoll = true;
          }
          break;

        case 15:
          console.log("serverResponse");
          console.log(value);
          vm.serverResponse = 15;
          vm.winServerMsg = value;
          vm.myMovement = false;
          vm.movementId = -1;

          break;
      }
    };

    vm.communication.sendMsg = function(msg){
      clientServerCommFactory.sendMsg(msg);
    };
/*
    $window.onbeforeunload = function (e) {
      if(vm.btnLeave){
        vm.btnLeave = false;
        return;
      }
      vm.endMovementSendServer(-1);
      vm.communication.sendMsg({type: 6, login:  vm.myLogin, tableId: vm.myTableId, myId: vm.myId });
    };
*/
$scope.$watchCollection(function(){
  return clientServerCommFactory.getGameMessages();
}, function(value){
  if((angular.isUndefined(value))||(angular.isUndefined(value[value.length-1]))) return;
  vm.onMessageAction(value[value.length-1]);
}, true);

  }

})();
