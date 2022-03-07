(function() {
  'use strict';

  angular
    .module('boardgame')
    .directive('gameRules', gameRules);

  /** @ngInject */
  function gameRules() {

    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/gameRules/gameRules.html'
    };

    return directive;


  }

})();
