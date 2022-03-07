(function() {
  'use strict';

  angular
    .module('boardgame')
    .directive('newTable', newTable);

  /** @ngInject */
  function newTable() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/newTable/newTable.html',
      scope: {
        newTable: '&',
        tableClosed: '=',
        tableBot: '=',
        tablePassword: '='

      },
      controller: NewTableController,
      controllerAs: 'NewTableCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function  NewTableController($scope, clientServerCommFactory) {
      var vm = this;
    }
  }

})();
