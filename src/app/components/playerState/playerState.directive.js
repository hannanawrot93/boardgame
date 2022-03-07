(function() {
  'use strict';

  angular
    .module('boardgame')
    .directive('playerState', playerState);

  /** @ngInject */
  function playerState($log, $window, $timeout) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/playerState/playerState.html',
      scope: {
        rollresponse: "=",
        myId: '=',
        myLogin: '=',
        myTableId: '=',
        myMovement: '=',
        movementId: '=',
        table: '=',
        players: '=',
        isRunning: '=',
        serverResponse: '=',
        buyMaterialServerMsg: '=',
        buyPlotServerMsg: '=',
        buyProjectServerMsg: '=',
        answerQuestionServerMsg: '=',
        penaltyAcceptServerMsg: '=',
        endMovementServerMsg: '=',
        ServerMsg: '=',
        availableFirms: '=',
        availableArchitects: '='

      },
      link: PlayerStateLink,
      controller: PlayerStateController,
      controllerAs: 'playerStateCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function PlayerStateController(productsFactory, $scope) {
      var vm = this;
      vm.allProducts = angular.copy(productsFactory.getProducts());
      vm.allStages = angular.copy(productsFactory.getStages());
      vm.allFirms = angular.copy(productsFactory.getFirms());

      console.log("hahahahassihdsdsdohls");


    }

    /** @ngInject */
    function PlayerStateLink(scope, element, attrs, ctrl) {

      scope.isQuestion = false;
      scope.isShop = false;
      scope.isOffice = false;
      scope.isArchitect = false;
      scope.isMandate = false;
      scope.isFirst = false;
      scope.fieldName = '';
      ctrl.buildProgress = [];
      var test = true;
/*
      scope.checkFirmAvailability = function(userId){
       for(var i = 2; i < ctrl.allStages.length+2; i++){
          if(scope.buildProgress[userId][i].counter == -1){


             var filteredProducts = ctrl.allProducts.filter(function(product){
               return product.stage == ctrl.allStages[i - 2];
             });
             var index = filteredProducts.findIndex(function(product){
               return product.actualLacks[userId] != 0;
             });

             if((index == -1)&&(scope.buildProgress[userId][i-1].counter == 0)){
               ctrl.availableFirms[userId] = ctrl.allFirms.filter(function(firm){
                 return ctrl.allStages[firm.stage] == ctrl.allStages[i - 2];
               });
               scope.buildProgress[userId][i] = {id: 2, name: 'dostępna'};
               console.log("warunki spełnione");
               console.log(ctrl.availableFirms[userId]);

             } else {
               ctrl.availableFirms[userId] = -1;
               console.log("warunki NIEEEEEspełnione "+ctrl.allStages[i - 2]+"  "+index+"  "+scope.buildProgress[userId][i-1].counter);
             }


            break;
          }
        }
        console.log("buildprogress");
        console.log(scope.buildProgress);
      };

      scope.setCounters = function(userId){
        for(var i = 0; i < ctrl.allStages.length+2; i++){

          if(scope.buildProgress[userId][i].counter > 0) {
            if (scope.buildProgress[userId][i].counter == 1) {
              scope.buildProgress[userId][i] = {id: 3, name: 'wykonała', counter: 0};


            } else{
              scope.buildProgress[userId][i].counter--;
            }
          }
        }
      };
*/
      scope.pawns = ['czerwony', 'niebieski', 'zielony', 'żółty'];

      scope.checkField = function (type, field) {
        console.log(type);
        console.log(field);
        scope.isFirst = false;
        scope.isShop = false;
        scope.isQuestion = false;
        scope.isMandate = false;
        scope.isOffice = false;
        scope.isArchitect = false;

        switch(type){
          case 'first':
            scope.isFirst = true;
            scope.fieldFirst = field;
            scope.fieldName = "START";
            console.log("start");

            break;

          case 'q':
            scope.isQuestion = true;
            scope.question = field;
            scope.fieldName = "PYTANIE";
            scope.selectedAnswer = 0;
            console.log("pytanie");
            break;

          case 'm':
            scope.isMandate = true;
            scope.mandate = field;
            scope.fieldName = "KARA";
            console.log("kara");
            break;

          case 'o':
            scope.isOffice = true;
            scope.office = field;
            scope.fieldName = "URZĄD";
            scope.selectedPlot = 0;
            console.log("urzad");
            break;

          case 'a':
            scope.isArchitect = true;
            scope.fieldName = "BIURO ARCHITEKTONICZNE";
            scope.architect = field;
            console.log("architekt");
            break;

          case 's':
            scope.isShop = true;
            scope.fieldName = "SKLEP";
            scope.shop = field;
            console.log("sklep");
            break;

        }

      }

      scope.$watch('playerStateCtrl.serverResponse', function(newVal, oldVal){
          if(newVal == 9){

          ctrl.serverResponse = -1;
          if (angular.isUndefined(ctrl.buyMaterialServerMsg)|| angular.isUndefined(ctrl.buyMaterialServerMsg)) return;

          var userId = ctrl.buyMaterialServerMsg.user;

          ctrl.players[userId].money = ctrl.buyMaterialServerMsg.playerMoney;


          ctrl.players[userId].buyList = ctrl.buyMaterialServerMsg.playerBuyList;

          for(var i = 0; i < ctrl.buyMaterialServerMsg.playerBuyList.length; i++){

            var product = ctrl.allProducts[i];
              product.actualLacks[userId] = ctrl.buyMaterialServerMsg.playerBuyList[i].lacks;
              product.actualCounts[userId] = ctrl.buyMaterialServerMsg.playerBuyList[i].has;


          }





        } else if(newVal == 10){

          ctrl.serverResponse = -1;
          if (angular.isUndefined(ctrl.buyPlotServerMsg)|| angular.isUndefined(ctrl.buyPlotServerMsg)) return;

          var userId = ctrl.buyPlotServerMsg.user;
            ctrl.buildProgress = ctrl.buyPlotServerMsg.buildProgress;
/*
          ctrl.buildProgress[userId][0] = {id: 3, name: "wykonała", counter: 0};
          ctrl.buildProgress[userId][1] = {id: 1, name: "dostępna", counter: -1};*/
          ctrl.availableArchitects[userId] = true;
          ctrl.players[userId].plot = ctrl.buyPlotServerMsg.plot;
          ctrl.players[userId].money = ctrl.players[userId].money - ctrl.buyPlotServerMsg.plot.price;

          //ctrl.players[userId].startReward = ctrl.buyPlotServerMsg.startReward;

        } else if(newVal == 11){

          ctrl.serverResponse = -1;
          if (angular.isUndefined(ctrl.buyProjectServerMsg)|| angular.isUndefined(ctrl.buyProjectServerMsg)) return;
          ctrl.availableArchitects[userId] = false;
          var userId = ctrl.buyProjectServerMsg.user;
          ctrl.players[userId].project = ctrl.buyProjectServerMsg.project;
          ctrl.players[userId].money = ctrl.players[userId].money - ctrl.buyProjectServerMsg.project.price;
/*
          ctrl.buildProgress[userId][1] = {id: 2, name: "Prace trwają", counter: ctrl.buyProjectServerMsg.project.time};*/

          ctrl.buildProgress = ctrl.buyProjectServerMsg.buildProgress;

        } else if(newVal == 12){

          ctrl.serverResponse = -1;
          if (angular.isUndefined(ctrl.answerQuestionServerMsg)|| angular.isUndefined(ctrl.answerQuestionServerMsg)) return;

          var userId = ctrl.answerQuestionServerMsg.user;

          if(ctrl.answerQuestionServerMsg.good){
            ctrl.players[userId].money = ctrl.players[userId].money +1000;//////////////////////???????
          }

        } else if(newVal == 13){

          ctrl.serverResponse = -1;
          if (angular.isUndefined(ctrl.penaltyAcceptServerMsg)|| angular.isUndefined(ctrl.penaltyAcceptServerMsg)) return;

          var userId = ctrl.penaltyAcceptServerMsg.user;

          ctrl.players[userId].money = ctrl.players[userId].money - ctrl.penaltyAcceptServerMsg.mandate.price;

        } else if(newVal == 14){
          ctrl.serverResponse = -1;

          if (angular.isUndefined(ctrl.endMovementServerMsg)|| angular.isUndefined(ctrl.endMovementServerMsg)) return;

          var userId = ctrl.endMovementServerMsg.user;

            ctrl.buildProgress = ctrl.endMovementServerMsg.buildProgress;
            ctrl.availableFirms = ctrl.endMovementServerMsg.availableFirms;
            //ctrl.availableArchitects = ctrl.endMovementServerMsg.availableArchitects;
          //scope.setCounters(userId);
          //scope.checkFirmAvailability(userId);
        }

      });

    }
  }

})();
