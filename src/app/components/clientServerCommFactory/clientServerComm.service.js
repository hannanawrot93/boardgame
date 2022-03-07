(function() {
  'use strict';

  angular
    .module('boardgame')
    .factory('clientServerCommFactory', clientServerCommFactory);

  /** @ngInject */
  function clientServerCommFactory($websocket, $log) {

    // Open a WebSocket connection
    var dataStream;

    var collection = [];
    var gameMessages = [];
    var tables = [];
    var login = "hania";


///testted
    return {
      startCommunication: function(){
        dataStream = $websocket('wss://guarded-shelf-78700.herokuapp.com');

        dataStream.onOpen(function(){
          console.log("openinnfdnfd");
        }),
        dataStream.onMessage(function(message) {
          if((angular.isUndefined(angular.fromJson(message.data))) || (angular.fromJson(message.data) === null)) return;
          console.log("Gamammsadjsj");
          if(angular.fromJson(angular.fromJson(message.data).type) < 6){


            if((angular.fromJson(angular.fromJson(message.data).type) == 4)||(angular.fromJson(angular.fromJson(message.data).type) == 5)){
              gameMessages = [];
            }

              collection.push(angular.fromJson(message.data));

          } else{

            gameMessages.push(angular.fromJson(message.data));
          }

        }),
        dataStream.onError(function(err){
          console.log(err);
        }),
        dataStream.onClose(function(m){

          if(this.myTableId == -1) return;
          var msg = {type: 6, login:  this.myLogin, tableId: this.myTableId, myId: this.myId };
          dataStream.send(angular.toJson(msg));
        });

      },
      getLogin: function(){
        return login;
      },

      setLogin: function(log){
        login = log;
      },

      getCollection: function(){
        return collection;
      },
      getGameMessages: function(){
        return gameMessages;
      },
      setCollection: function(coll){
        collection = coll;
      },
      getDataStream: function(){
        return dataStream;
      },

      sendMsg: function(msg) {
        dataStream.send(angular.toJson(msg));

      },
      myTableId: -1,
      myId: -1,
      myLogin: ""
    };
  }

})();
