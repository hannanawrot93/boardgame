(function() {
  'use strict';

  angular
    .module('boardgame')
    .directive('playersInfo', playersInfo);

  /** @ngInject */
  function playersInfo($log) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/playersInfo/playersInfo.html',
      scope: {
        players: '=',
        movementId: '='
      },
      link: PlayersInfoLink,
      controller: PlayersInfoController,
      controllerAs: 'playersInfoCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function PlayersInfoController() {
        var vm = this;


    }

    /** @ngInject */
    function PlayersInfoLink(scope, element, attrs) {

    }
  }

})();
