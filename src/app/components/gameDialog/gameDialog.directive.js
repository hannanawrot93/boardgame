(function() {
  'use strict';

  angular
    .module('boardgame')
    .directive('gameDialog', gameDialog);

  /** @ngInject */
  function gameDialog($log, $window, $timeout) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/gameDialog/gameDialog.html',
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
        buyMaterialSendServer: '&',
        buyPlotSendServer: '&',
        buyProjectSendServer: '&',
        answerQuestionSendServer: '&',
        penaltyAcceptSendServer: '&',
        endMovementSendServer: '&',
        buyMaterialServerMsg: '=',
        buyPlotServerMsg: '=',
        buyProjectServerMsg: '=',
        answerQuestionServerMsg: '=',
        leaveServerMsg: '=',
        penaltyAcceptServerMsg: '=',
        endMovementServerMsg: '=',
        winServerMsg: '=',
        serverResponse: '=',
        welcome: '=',
        myLevel: '=',
        availableFirms: '=',
        availableArchitects: '='
      },
      link: GameDialogLink,
      controller: GameDialogController,
      controllerAs: 'gameDialogCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function GameDialogController(productsFactory, $scope) {
      var vm = this;
      vm.allStages = angular.copy(productsFactory.getStages());
      vm.allFirms = angular.copy(productsFactory.getFirms());
    }

    /** @ngInject */
    function GameDialogLink(scope, element, attrs, ctrl) {

      scope.isQuestion = false;
      scope.isShop = false;
      scope.isOffice = false;
      scope.isArchitect = false;
      scope.isMandate = false;
      scope.isFirst = false;
      scope.fieldName = '';
      ctrl.response = false;
      scope.btnEnd = false;
      scope.firm = -1;
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
            ctrl.selectedAnswer = 0;
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
            scope.office.plots = scope.office.plots.filter(function(plot){
              return (plot.available == true) && (plot.price <= ctrl.players[ctrl.myId].money);
            });
            ctrl.selectedPlot = 0;
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
            scope.shop.products.forEach(function(product){
              product.selectedCount = 0;
            });
            console.log("sklep");
            break;

        }

      };

      scope.buyMaterial = function(){
        ctrl.productError = "";
        var sum = 0;
        var buyList = [];

        scope.shop.products.forEach(function (product) {
          if(product.selected){
            if((product.selectedCount > product.count)||(isNaN(product.selectedCount))||(product.selectedCount == undefined)){
              product.selectedCount = product.count;
            }
            sum = sum + (product.price*product.selectedCount);
            buyList.push(product);
          }
        });
        console.log('buyMaterial '+ ctrl.myId+" "+ctrl.players[ctrl.myId].money+" "+sum);
        if(ctrl.players[ctrl.myId].money > sum){
          console.log('buyMaterialiff ');
          ctrl.buyMaterialSendServer({param1: buyList, param2: sum, param3: scope.shop.id});
        }else{
          ctrl.productError = "Nie masz tylu pieniędzy, aby kupić wybrane materiały";
        }
      };

      scope.buyPlot = function(){
        ctrl.plotError = "";
           if(ctrl.players[ctrl.myId].money > scope.office.plots[ctrl.selectedPlot].price){
            ctrl.buyPlotSendServer({param1: scope.office.plots[ctrl.selectedPlot], param2: scope.office.id});
          }else{
          ctrl.plotError = "Nie masz tylu pieniędzy, aby kupić wybraną działkę";
        }
      };

      scope.buyProject = function(){
        ctrl.architectError = "";
        if(ctrl.players[ctrl.myId].money > scope.architect.price){
          ctrl.buyProjectSendServer({param1: scope.architect});
        }else{
          ctrl.architectError = "Nie masz tylu pieniędzy, aby zamówić projekt.";
        }
      };

      scope.answerQuestion = function(){
        if(scope.question.goodAnswer == ctrl.selectedAnswer)
          ctrl.answerQuestionSendServer({param1: true});

        else {
          ctrl.answerQuestionSendServer({param1: false});
        }

      };

      scope.penaltyAccept = function(){

        ctrl.penaltyAcceptSendServer({param1: scope.mandate}); //moze wyjsc ujemne konto uzytkownika
      };

      scope.endMovement = function(){
        if(scope.isMandate){
          scope.penaltyAccept();
          scope.isMandate = false;
        }
        ctrl.productError = "";
        ctrl.plotError = "";
        ctrl.architectError = "";
        scope.btnEnd = false;
        ctrl.startOver = false;
        ctrl.endMovementSendServer({param1: ctrl.selectedFirm}); ///////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! firme wybrana dac!!!
        ctrl.selectedFirm = -1;
      };

      scope.endGame = function () {
        $location.url('/tablesList/');
      }

      scope.$watch('gameDialogCtrl.serverResponse', function(newVal, oldVal){
        ctrl.leave = false;
        ctrl.win = false;

        if(newVal == 6){
          ctrl.leave = true;
          ctrl.serverResponse = -1;
          ctrl.response = false;

          if (angular.isUndefined(ctrl.rollresponse)|| angular.isUndefined(ctrl.rollresponse)) return;


        }
        else if(newVal == 8){
          ctrl.serverResponse = -1;
          ctrl.response = false;
          if (angular.isUndefined(ctrl.rollresponse)|| angular.isUndefined(ctrl.rollresponse)) return;

          $timeout(function(){
            scope.checkField(ctrl.rollresponse.fieldType, ctrl.rollresponse.actualField);
            scope.actualField = ctrl.rollresponse.actualField;
            if(ctrl.myMovement){
              scope.btnEnd = true;
            }
            if(ctrl.rollresponse.start){

              var userId = ctrl.rollresponse.user;
              var userReward;
              if(ctrl.players[userId].plot != -1){
                userReward = ctrl.table.rewards[userId] - ctrl.players[userId].plot.cost;
              } else{
                userReward = ctrl.table.rewards[userId] - 1200;
              }
              ctrl.players[userId].startReward = userReward;

              console.log("startOver!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!?????????????? "+ctrl.players[userId].money+"  rew   "+userReward);
              ctrl.players[userId].money = ctrl.players[userId].money + userReward;

              ctrl.startOver = true;
            }
            console.log("odpowiedz kostka "+newVal);
            console.log(ctrl.rollresponse);
          }, 3300);

        } else if((newVal > 8)&&(newVal < 16)){
            ctrl.response = true;
            scope.fieldName = '';
            scope.isFirst = false;
            scope.isShop = false;
            scope.isQuestion = false;
            scope.isOffice = false;
            scope.isArchitect = false;
            scope.isMandate = false;

          switch(newVal){
            case 9:
              if(ctrl.buyMaterialServerMsg.user == ctrl.myId){
                scope.responseMessage = "Zakupiłeś produkty o " +
                  "łącznej wartości "+ctrl.buyMaterialServerMsg.sum;
              } else {
                scope.responseMessage = "Gracz "+ctrl.players[ctrl.buyMaterialServerMsg.user].login+" zakupił produkty o " +
                  "łącznej wartości "+ctrl.buyMaterialServerMsg.sum;
              }
              break;

            case 10:
              if(ctrl.buyPlotServerMsg.user == ctrl.myId){
                scope.responseMessage = "Kupiłeś działkę budowlaną o " +
                  "wartości "+ctrl.buyPlotServerMsg.plot.price;
              } else {
                scope.responseMessage = "Gracz "+ctrl.players[ctrl.buyPlotServerMsg.user].login+" kupił działkę o " +
                  "wartości "+ctrl.buyPlotServerMsg.plot.price;
              }
              break;

            case 11:
              if(ctrl.buyProjectServerMsg.user == ctrl.myId){
                scope.responseMessage = "Zamówiłeś projekt za " +
                  ctrl.buyProjectServerMsg.project.price+' a czas oczekiwania na niego wynosi '+ctrl.buyProjectServerMsg.project.time;
              } else {
                scope.responseMessage = "Gracz "+ctrl.players[ctrl.buyProjectServerMsg.user].login+" zamówił projekt " +
                  "za "+ctrl.buyProjectServerMsg.project.price+' a czas oczekiwania na niego wynosi '+ctrl.buyProjectServerMsg.project.time;;
              }
              break;

            case 12:
              if(ctrl.answerQuestionServerMsg.user == ctrl.myId){
                if(ctrl.answerQuestionServerMsg.good){
                  scope.responseMessage = "Odpowiedziałeś prawidłowo na pytanie. Otrzymujesz dodatkowe 1000 zł.";
                } else {
                  scope.responseMessage = "Źle odpowiedziałeś na pytanie";
                }
               } else {
                if(ctrl.answerQuestionServerMsg.good){
                  scope.responseMessage = "Gracz "+ctrl.players[ctrl.answerQuestionServerMsg.user].login
                    +" odpowiedział prawidłowo na pytanie. Otrzymał dodatkowe 1000 zł.";
                } else {
                  scope.responseMessage = "Gracz "+ctrl.players[ctrl.answerQuestionServerMsg.user].login
                    +" źle odpowiedział na pytanie.";
                }
              }
              break;

            case 13:
              if(ctrl.penaltyAcceptServerMsg.user == ctrl.myId){
                scope.responseMessage = "Zapłaciłeś karę o wartości "+ctrl.penaltyAcceptServerMsg.mandate.price;

              } else {
                scope.responseMessage = "Gracz "+ctrl.players[ctrl.penaltyAcceptServerMsg.user].login
                  +" zapłacił karę o wartości "+ctrl.penaltyAcceptServerMsg.mandate.price;
              }
              break;

            case 14:
              ctrl.startOver = false;
              if(ctrl.endMovementServerMsg.user == ctrl.myId){
                scope.responseMessage = "Zakończyłeś swój ruch. ";
                if((ctrl.endMovementServerMsg.firm != -1)&&(ctrl.endMovementServerMsg.firm != {})&&(ctrl.endMovementServerMsg.firm != undefined)){
                  scope.responseMessage += "Zamówiłeś firmę wykonującą "+ctrl.allStages[ctrl.endMovementServerMsg.firm.stage]
                  +" przez liczbę kolejek równą "+ctrl.endMovementServerMsg.firm.time;
                }

              } else {
                scope.responseMessage = "Gracz "+ctrl.players[ctrl.endMovementServerMsg.user].login
                  +" zakończył swój ruch.";

                if((ctrl.endMovementServerMsg.firm != -1)&&(ctrl.endMovementServerMsg.firm != {})&&(ctrl.endMovementServerMsg.firm != undefined)){
                  scope.responseMessage += " Zamówił firmę wykonującą "+ctrl.allStages[ctrl.endMovementServerMsg.firm.stage]
                    +" przez liczbę kolejek równą "+ctrl.endMovementServerMsg.firm.time;
                }
              }
              break;

            case 15:
                ctrl.win = true;
                ctrl.serverResponse = -1;
                ctrl.response = false;

          }
        }

      });
    }
  }

})();
