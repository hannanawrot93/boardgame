(function() {
  'use strict';

  angular
    .module('boardgame')
    .directive('loginPanel', loginPanel);

  /** @ngInject */
  function loginPanel($log) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/loginPanel/loginPanel.html',
      scope: {
        login: "&",
        about: "&",
        myLogin: "=",
        errorLogin: "="
      },
      controller: LoginPanelController,
      controllerAs: 'loginPanelCtrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function LoginPanelController(clientServerCommFactory, $scope) {
      var vm = this;
      $scope.error = 'blalalalalal';
      console.log(vm.myLogin);
      console.log(vm.errorLogin);
      console.log($scope.mylogin);

    }

  }

})();
