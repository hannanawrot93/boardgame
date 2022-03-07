(function() {
  'use strict';

  angular
    .module('boardgame')
    .directive('tablesList', tablesList);

  /** @ngInject */
  function tablesList($log) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/tablesList/tablesList.html',
      scope: {
        tableslist: '=',
        appendToTable: '&',
        passError: '='

      },
      controller: TablesListController,
      controllerAs: 'TablesListCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TablesListController($scope, clientServerCommFactory) {
      var vm = this;
      vm.appendPassword = '';
      vm.passError = '';
console.log(vm.tableslist)
    }
  }

})();
