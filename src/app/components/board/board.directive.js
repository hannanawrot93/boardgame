(function() {
  'use strict';

  angular
    .module('boardgame')
    .directive('board', board);

  /** @ngInject */
  function board($log, $window, $interval) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/board/board.html',
      scope: {
        rollDice: "&",
        rollresponse: "=",
        myId: '=',
        myLogin: '=',
        myTableId: '=',
        myMovement: '=',
        movementId: '=',
        table: '=',
        players: '=',
        btnRoll: '=',
        serverResponse: '='
      },
      link: BoardLink,
      controller: BoardController,
      controllerAs: 'boardCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function BoardController(clientServerCommFactory, $scope) {
      var vm = this;
    }

    /** @ngInject */
    function BoardLink(scope, element, attrs, ctrl) {
      scope.setPawnsMap = function(){
        scope.pawnsMap = [];
        var red = [], blue = [], green = [], yellow = [];
        var marginConst = 5;
        var mainPos = 136;
        var step = 69;
        var distance = 15;
        var corner1 = 55;
        var corner2 = 30;

        if($window.innerWidth < 768){
          mainPos = 47;
          corner1 = 20;
          corner2 = 10;
          distance = 5;
          step = 23;
          marginConst = 3;

        } else if($window.innerWidth < 992){
          mainPos = 87;
          corner1 = 40;
          distance = 10;
          step = 43;

        }else if($window.innerWidth < 1200){
          mainPos = 104;
          corner1 = 50;
          distance = 12;
          step = 52;
        }


        red[0] = {x: corner1, y: marginConst};                // left top
        blue[0] = {x: corner2, y: marginConst};
        green[0] = {x: marginConst, y: corner2};
        yellow[0] = {x: marginConst, y: corner1};

        for(var i = 1; i < 10; i++){                            //left top
          red[i] = {x: mainPos+((i-1)*step), y: marginConst};
          blue[i] = {x: red[i].x-distance, y: marginConst};
          green[i] = {x: red[i].x-(2*distance), y: marginConst};
          yellow[i] = {x: red[i].x-(3*distance), y: marginConst};
        }

        red[10] = {x: marginConst, y: corner1};                    //right top
        blue[10] = {x: marginConst, y: corner2};
        green[10] = {x: corner2, y: marginConst};
        yellow[10] = {x: corner1, y: marginConst};

        for(var i = 11; i < 20; i++){                              //right top
          red[i] = {x: marginConst, y: mainPos+((i-11)*step)};
          blue[i] = {x: marginConst, y: red[i].y-distance};
          green[i] = {x: marginConst, y: red[i].y-(2*distance)};
          yellow[i] = {x: marginConst, y: red[i].y-(3*distance)};
        }

        red[20] = {x: corner1, y: marginConst};                         //right bottom
        blue[20] = {x: corner2, y: marginConst};
        green[20] = {x: marginConst, y: corner2};
        yellow[20] = {x: marginConst, y: corner1};

        for(var i = 21; i < 30; i++){                              //right bottom
          red[i] = {x: mainPos+((i-21)*step), y: marginConst};
          blue[i] = {x: red[i].x-distance, y: marginConst};
          green[i] = {x: red[i].x-(2*distance), y: marginConst};
          yellow[i] = {x: red[i].x-(3*distance), y: marginConst};
        }

        red[30] = {x: marginConst, y: corner1};                         // left bottom
        blue[30] = {x: marginConst, y: corner2};
        green[30] = {x: corner2, y: marginConst};
        yellow[30] = {x: corner1, y: marginConst};

        for(var i = 31; i < 40; i++){                                    // left bottom
          red[i] = {x: marginConst, y: mainPos+((i-31)*step)};
          blue[i] = {x: marginConst, y: red[i].y-distance};
          green[i] = {x: marginConst, y: red[i].y-(2*distance)};
          yellow[i] = {x: marginConst, y: red[i].y-(3*distance)};
        }

        scope.pawnsMap.push(red);
        scope.pawnsMap.push(blue);
        scope.pawnsMap.push(green);
        scope.pawnsMap.push(yellow);

        return scope.pawnsMap;
      }

      scope.setPawnPosition = function(pos, userId){

        var position = scope.pawnsMap[userId][pos];
        var elemId, vertical, horizontal;
        console.log("robweheoofdf "+position.x +" "+position.y);
        if(userId == 0){
          elemId = 'red-1';
        }else if(userId == 1){
          elemId = 'blue-2';
        }else if(userId == 2){
          elemId = 'green-3';
        }else {
          elemId = 'yellow-4';
        }

        var pawn = document.getElementById(elemId);
        console.log(pawn);
        if(pos < 10){
          pawn.style.left = position.x+"px";
          pawn.style.top = position.y+"px";
          pawn.style.right = "";
          pawn.style.bottom = "";

        } else if((pos >= 10)&&(pos < 20)){
          pawn.style.right = position.x+"px";
          pawn.style.top = position.y+"px";
          pawn.style.left = "";
          pawn.style.bottom = "";

        } else if((pos >= 20)&&(pos < 30)){
          pawn.style.right = position.x+"px";
          pawn.style.bottom = position.y+"px";
          pawn.style.left = "";
          pawn.style.top = "";

        } else if(pos >= 30){
          pawn.style.left = position.x+"px";
          pawn.style.bottom = position.y+"px";
          pawn.style.right = "";
          pawn.style.top = "";
        }


      }

      scope.setRollNumber = function(newVal){
        var counter = 0;
        var oneTimer = $interval(function() {
          if (counter >= 30) {
            $interval.cancel(oneTimer);
            scope.rollnumber = newVal.count;
            scope.setPawnPosition(newVal.position, newVal.user);
          } else {
            counter++;
            scope.rollnumber = Math.floor((Math.random() * 6) + 1);
          }
        }, 110);
      }

      scope.setPawnsMap();
      var p = 0;
      scope.setPawnPosition(p, 0);
      scope.setPawnPosition(p, 1);
      scope.setPawnPosition(p, 2);
      scope.setPawnPosition(p, 3);
      scope.rollnumber = '?';

      scope.$watch('boardCtrl.serverResponse', function(newVal, oldVal){
        console.log("odpowiedz kosdfdfdggggfgftka "+newVal+ ctrl.rollresponse);

        console.log(ctrl.rollresponse);

        if(newVal == 8){
          ctrl.serverResponse = -1;

          if (angular.isUndefined(ctrl.rollresponse)|| angular.isUndefined(ctrl.rollresponse)) return;

          scope.setRollNumber(ctrl.rollresponse);

          if(ctrl.rollresponse.user == ctrl.myId){

          }else{

          }

          console.log("odpowiedz kostka "+ctrl.serverResponse);
          console.log(ctrl.rollresponse);
          console.log("odpowiedz kostka "+newVal);
          console.log(oldVal);
        }

      });
    }
  }

})();
