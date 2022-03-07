(function() {
  'use strict';

  angular
    .module('boardgame')
    .config(routeConfig);

    function routeConfig($routeProvider) {
    console.log("router");

    $routeProvider
      .when('/board/:id', {
        templateUrl: 'app/pages/templates/GamePage.html',
        controller: 'GamePageController',
        controllerAs: 'gamePageCtrl',
        resolve: {
          "check":function(accessFactory,clientServerCommFactory, $location, $route, $routeParams){   //function to be resolved, accessFac and $location Injected
            if(accessFactory.checkPermission()){    //check if the user has permission -- This happens before the page loads
              console.log("myTableId " + clientServerCommFactory.myTableId);
              console.log("currentParam " + $route.current.params.id);
              console.log("routeParam " + $routeParams.id);
              if(clientServerCommFactory.myTableId == $route.current.params.id){ //$route.current.params.id;

              }else{
                $location.path('/tablesList');
              }
            }else{
              $location.path('/');                //redirect user to home if it does not have permission.
            }
          }
        }
      })
      .when('/tablesList', {
        templateUrl: 'app/pages/templates/TablesPage.html',
        controller: 'TablesPageController',
        controllerAs: 'tablesCtrl',
        resolve: {
          "check":function(accessFactory,$location){   //function to be resolved, accessFac and $location Injected
            if(accessFactory.checkPermission()){    //check if the user has permission -- This happens before the page loads

            }else{
              $location.path('/');                //redirect user to home if it does not have permission.
            }
          }
        }

      })
      .when('/about', {
        templateUrl: 'app/pages/templates/AboutPage.html',
        controller: 'AboutPageController',
        controllerAs: 'aboutCtrl'

      })
      .when('/', {
        templateUrl: 'app/pages/templates/LoginPage.html',
        controller: 'LoginPageController',
        controllerAs: 'main',
        resolve: {
          "check":function(accessFactory,$location){   //function to be resolved, accessFac and $location Injected
            if(!accessFactory.checkPermission()){    //check if the user has permission -- This happens before the page loads

            }else{
              $location.path('/tablesList');                //redirect user to home if it does not have permission.
            }
          }
        }
      });

  }

})();
