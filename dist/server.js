"use strict";

process.title = 'node-chat';
var Swagger = require('swagger-client');
var open = require('open');
var rp = require('request-promise');

// Config settings
var directLineSecret = 'zgmGkfPebCU.cwA.psY.cMShZTT_KzLoKNQRm49urjZ9EmigUeJchDR894QSb90';

// directLineUserId is the field that identifies which user is sending activities to the Direct Line service.
// Because this value is created and sent within your Direct Line client, your bot should not
// trust the value for any security-sensitive operations. Instead, have the user log in and
// store any sign-in tokens against the Conversation or Private state fields. Those fields
// are secured by the conversation ID, which is protected with a signature.

var directLineUserId = 'DirectLineClient';
var responseObj;
var botClient;

var receivedMessages = [];

function JSONStringify(object) {
  var cache = [];
  var str = JSON.stringify(object,
    // custom replacer fxn - gets around "TypeError: Converting circular structure to JSON"
    function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    }, 4);
  cache = null; // enable garbage collection
  return str;
};

function sendMessage(to, message) {
  if((to != undefined)&&(to != '')&&(to != {})){
    to.sendUTF(JSONStringify(message));
  }

}

var directLineSpecUrl = 'https://docs.botframework.com/en-us/restapi/directline3/swagger.json';
var directLineClient = rp(directLineSpecUrl)
  .then(function (spec) {
    // Client
    return new Swagger({
      spec: JSON.parse(spec.trim()),
      usePromise: true
    });
  })
  .then(
    function (client) {
      // add authorization header to client
      client.clientAuthorizations.add('AuthorizationBotConnector', new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + directLineSecret, 'header'));
      return client;
    })
  .catch(function (err) {
    console.error('Error initializing DirectLine client', err);
    throw err;
  });

// Once the client is ready, create a new conversation
directLineClient.then(function (client) {
  client.Conversations.Conversations_StartConversation()
    .then(function (response) {
      responseObj = response.obj;
      botClient = client;
      // Start console input loop from stdin
      sendMessageToBot(botClient, responseObj.conversationId, {type: 100});


      // Start receiving messages from WS stream - using Node client
      startReceivingWebSocketClient(responseObj.streamUrl, responseObj.conversationId);

    });
});

// Read from console (stdin) and send input to conversation using DirectLine client
function sendMessageToBot(client, conversationId, message) {
  var noError = true;
  // Send message
  client.Conversations.Conversations_PostActivity(
    {
      conversationId: conversationId,
      activity: {
        textFormat: 'plain',
        text: JSONStringify(message),
        type: 'message',
        from: {
          id: directLineUserId,
          name: directLineUserId
        }
      }
    }).catch(function (err) {
    console.error('Error sending message:', err);
    noError = false;
  });
  return  noError;
}

function startReceivingWebSocketClient(streamUrl, conversationId) {
  console.log('Starting WebSocket Client for message streaming on conversationId: ' + conversationId);

  var ws = new (require('websocket').client)();

  ws.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
  });

  ws.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
      console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
      console.log('WebSocket Client Disconnected');
    });
    connection.on('message', function (message) {
      // Occasionally, the Direct Line service sends an empty message as a liveness ping
      // Ignore these messages
      if (message.type === 'utf8' && message.utf8Data.length > 0) {
        var data = JSON.parse(message.utf8Data);
        receivedMessages = data.activities;
        console.log('********************************************************');
        console.log(receivedMessages[0].from.id );

        console.log('********************************************************');
        if(receivedMessages[0].from.id == "bothn"){
          var botMsg = JSON.parse(receivedMessages[0].text);
          switch(botMsg.type){

            case 8:
              console.log('type 8888888');
              break;
            // 8 rzut kostka, 9 kupil, nie kupil, zamowil

            case 9:
              console.log("from bot shopping");
              buyProduct(botMsg.myId, botMsg.tableId, botMsg.buyList, botMsg.sum, botMsg.shopId);
              break;

            case 10:
              console.log("from bot plot");
              buyPlot(botMsg.myId, botMsg.tableId, botMsg.plot, botMsg.officeId);
              break;

            case 11:
              console.log("from bot project");
              buyProject(botMsg.myId, botMsg.tableId, botMsg.architect);
              break;

            case 12:
              console.log("from bot question");
              answerQuestion(botMsg.myId, botMsg.tableId, botMsg.good);
              break;

            case 13:
              console.log("from bot accept mandate");
              penaltyAccept(botMsg.myId, botMsg.tableId, botMsg.mandate);
              break;

            case 14:
              console.log("from bot end movement");
              endMovement(botMsg.myId, botMsg.tableId, botMsg.firm);
              break;

          }

        }
        // var watermark = data.watermark;
      }
    });
  });

  ws.connect(streamUrl);
}


var webSocketsServerPort = (process.env.PORT || 5000);

var webSocketServer = require('websocket').server;
var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');
var inf = require('./boardInfo');

var clients = [];
var loggedUsers = [];
var tables = [];
/**
 * HTTP server
 */



var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
});

var server = app.listen(webSocketsServerPort, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  httpServer: server
});
console.log(server.address());
inf.initGame();
wsServer.on('request', function (request) {
  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

  var connection = request.accept(null, request.origin);

  var index = clients.push(connection) - 1;

  connection.on('message', function (message) {
    if (message.type === 'utf8') { // accept only text
      var json = JSON.parse(message.utf8Data);
      switch(json.type){
        case 1:
          login(connection, json.login);
          getTables(connection);
          break;

        case 2:
          login(connection, json.login);
          break;

        case 3:
          getTables(connection);
          break;

        case 4:
          newTable(connection, json.login, json.bot, json.closed, json.password);
          break;

        case 5:
          appendToTable(json.tableId, connection, json.login, json.password);
          break;

        case 6:
          leaveTable(json.tableId, json.login, json.myId);
          break;

        case 7:
// tu startgame
          break;

        case 8:
          rollDice(json.tableId, json.myId);
          break;
        // 8 rzut kostka, 9 kupil, nie kupil, zamowil

        case 9:
          buyProduct(json.myId, json.tableId, json.buyList, json.sum, json.shopId);
          break;

        case 10:
          buyPlot(json.myId, json.tableId, json.plot, json.officeId);
          break;

        case 11:
          buyProject(json.myId, json.tableId, json.architect);
          break;

        case 12:
          answerQuestion(json.myId, json.tableId, json.good);
          break;

        case 13:
          penaltyAccept(json.myId, json.tableId, json.mandate);
          break;

        case 14:
          endMovement(json.myId, json.tableId, json.firm);
          break;


      }

    }
  });

  // user disconnected
  connection.on('close', function (connection) {
    console.log("DISCONNECTED");

    function findUser(finded) {
      return finded.connection === connection;
    }
    var user = loggedUsers.find(findUser);

    if((user == -1)||(!user)||(user == {})||(user == undefined)){

      return;
    }

    if(user.tableId == -1){
      loggedUsers.splice(loggedUsers.indexOf(user), 1 );
      return;
    }
    function findTable(finded) {
      return finded.id === user.tableId;
    }
    var table = tables.find(findTable);
    var userId;
    if(table.players[0].login == user.login){
      userId = 0;
    } else if(table.players[1].login == user.login){
      userId = 1;
    } else if(table.players[2].login == user.login){
      userId = 2;
    } else if(table.players[3].login == user.login){
      userId = 3;
    }
    leaveTable(user.tableId, user.login, userId);
    loggedUsers.splice(loggedUsers.indexOf(user), 1 );
  });
});




function checkFirmAvailability(userId, table){
  for(var i = 2; i < inf.allStages.length+2; i++){
    if(table.buildProgress[userId][i].counter == -1){

      var index = table.players[userId].buyList.findIndex(function(product){
        return product.lacks != 0;
      });

      if((index == -1)&&(table.buildProgress[userId][i-1].counter == 0)){
        table.availableFirms[userId] = inf.allFirms.filter(function(firm){
          return inf.allStages[firm.stage] == inf.allStages[i - 2];
        });
        table.buildProgress[userId][i] = {id: 2, name: 'dostępna'};
        console.log("warunki spełnione");
        console.log(table.availableFirms[userId]);
        return i;

      } else {
        table.availableFirms[userId] = -1;
        console.log("warunki NIEEEEEspełnione "+inf.allStages[i - 2]+"  "+index+"  "+table.buildProgress[userId][i-1].counter);
        return -1;
      }

      break;
    }
  }
  console.log("buildprogress");
  console.log(table.buildProgress);
}

function win(userId, table){
  var returnedVal = 0;
  for(var i = 0; i < 4; i++){
    if(table.botEnable){
      if(userId == i){
        returnedVal++;
        if(i != 3){
          sendMessage(table.players[i].connection, {type: 15, result: 0, table: table, winner: userId});
        }

      } else {
        returnedVal++;
        if(i != 3){
          sendMessage(table.players[i].connection, {type: 15, result: 1, table: table, winner: userId});
        }
      }
    } else {
      if(userId == i){
        returnedVal++;
        sendMessage(table.players[i].connection, {type: 15, result: 0, table: table, winner: userId});

      } else {
        returnedVal++;
        sendMessage(table.players[i].connection, {type: 15, result: 1, table: table, winner: userId});
      }
    }

  }
  return returnedVal;
}
function setCounters(userId, table){
  for(var i = 0; i < inf.allStages.length+2; i++){

    if(table.buildProgress[userId][i].counter > 0) {
      if (table.buildProgress[userId][i].counter == 1) {
        table.buildProgress[userId][i] = {id: 3, name: 'wykonała', counter: 0};
      } else{
        table.buildProgress[userId][i].counter--;
      }
    }
  }
  if(table.buildProgress[userId][inf.allStages.length+1] == 0){
    console.log("Gracz   "+userId + " wygral gre. ")
    win(userId, table);
    return 1;
  }
  return 0;
}

function shuffle(arra1) {
  var ctr = arra1.length, temp, index;

// While there are elements in the array
  while (ctr > 0) {
// Pick a random index
    index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
    ctr--;
// And swap the last element with it
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}
function login(conn, login){
  if (loggedUsers.map(function(e) { return e.login; }).indexOf(login) != -1){
    conn.sendUTF(JSON.stringify({type: 1, result: -1}));

  } else {
    if(loggedUsers.length > 0){
      loggedUsers.push({id: loggedUsers[loggedUsers.length-1].id + 1, login: login, connection: conn, tableId: -1});
    } else {
      loggedUsers.push({id: 0, login: login, connection: conn, tableId: -1});
    }

    conn.sendUTF(JSON.stringify({type: 1, result: 0, msg: receivedMessages}));

  }
  return loggedUsers.length;
}
function unlogin(conn, login){
  //var i = loggedUsers.indexOf(login);
  var i = loggedUsers.map(function(e) { return e.login; }).indexOf(login);
  if(i != -1) {
    loggedUsers.splice(i, 1);
    conn.sendUTF({type: 2, result: 0})
  } else{
    conn.sendUTF({type: 2, result: -1})
  }

}
function getTables(conn){
  if(tables.length == 0){
    conn.sendUTF(JSONStringify({type: 3, result: -1}));
    return;
  }
  conn.sendUTF(JSONStringify({type: 3, result: 0, tables: tables}));
}
function newTable(conn, login, bot, closed, password){

  function findLogin(finded) {
    return finded.login === login;
  }

  var user = loggedUsers.find(findLogin);
  var userIndex = loggedUsers.findIndex(findLogin);

      var idNewTable;

      if(tables.length > 0){
        idNewTable = tables[tables.length-1].id + 1;
      } else {
        idNewTable = 0;
      }

      var table = {
        id: idNewTable,
        botEnable: bot,
        closed: closed,
        password: password,
        players: [user, {login: ''}, {login: ''}, {login: ''}], // can be bot
        positions: [0,0,0,0],
        movementArray: [1,2,3,0],
        proffessions: shuffle(inf.start.professions.slice()),
        rewards: shuffle(inf.start.rewards.slice()),
        free: true,
        isRunning: false,
        questionCounter: -1,
        mandateCounter: -1,
        shops: shuffle(inf.allShops.slice()),
        mandates: shuffle(inf.allMandates.slice()),
        offices: shuffle(inf.allOffices.slice()),
        architects: shuffle(inf.allArchitects.slice()),
        questions: shuffle(inf.allQuestions.slice()),
        availableArchitects: [],
        availableFirms: [],
        buildProgress: []

      };

      for(var j = 0; j < 4; j++){
        table.buildProgress[j] = [];

        for(var i = 0; i < inf.allStages.length+2; i++){

          if(i == 0){
            table.buildProgress[j][i] = {id: 1, name: "dostępne", counter: -1};
          } else{
            table.buildProgress[j][i] = {id: 0, name: "niedostępne", counter: -1};
          }
        }
        table.availableArchitects[j] = false;
        table.availableFirms[j]= -1;
      }
      loggedUsers[userIndex].tableId = table.id;
      table.players[0].connection = user.connection;
      if(bot){
        table.players[3].login = "bot";
      }
      tables.push(table);

  conn.sendUTF(JSONStringify({type: 4, result: 0, tables: tables}));

  loggedUsers.forEach(function(user){
    sendMessage(user.connection, {type: 4, result: 1, tables: tables});
  });
  return table;
}
function appendToTable(tableId, conn, login, password){
  var returnedVal = -1;

  function findTable(finded) {
    return finded.id === tableId;
  }
  function findLogin(finded) {
    return finded.login === login;
  }

  var table = tables.find(findTable);

  if((table.closed)&&(table.password.localeCompare(password) != 0)) {
    conn.sendUTF(JSONStringify({
      type: 5,
      result: -2,
      appended: login,
      tableId: tableId,
      tables: tables
    }));
    returnedVal = -2;
  }
  else if(table.free){
    var user = loggedUsers.find(findLogin);

    user.tableId = table.id;

    user.connection.sendUTF(JSONStringify({type: 5, result: 0, appended: login, tableId: tableId, tables: tables}));

    if(table.players[0].login == ''){
      table.players[0] = user;
      table.players[0].connection = user.connection;
      //  table.player1.id = user.id;
      returnedVal = 0;

    } else if(table.players[1].login == ''){
      table.players[1] = user;
      table.players[1].connection = user.connection;
      // table.player2.id = user.id;
      returnedVal = 0;

    } else if(table.players[2].login == ''){
      table.players[2] = user;
      table.players[2].connection = user.connection;
      console.log("dolaczyl22222");
      if(table.botEnable){
        table.free = false;
        console.log("dolaczyl22222 BOT");

        startGame(table);

      }
      returnedVal = 0;

    } else if(table.players[3].login == ''){
      table.players[3] = user;
      table.players[3].connection = user.connection;
      //table.player4.id = user.id;
      table.free = false;

      loggedUsers.forEach(function(user){
        sendMessage(user.connection, {type: 5, result: 3, tables: tables});
      });

      startGame(table);
      returnedVal = 0;
    }



    loggedUsers.forEach(function(user){
      if((user.login != login)&&((user.login == table.players[0].login)||(user.login == table.players[1].login)
        ||(user.login == table.players[2].login)||(user.login == table.players[3].login))){

        sendMessage(user.connection, {type: 5, result: 1, appended: login, tableId: tableId, tables: tables});

      }
    });
  }
  else {
    conn.sendUTF(JSONStringify({type: 5, result: -1, appended: login,  tableId: tableId}));
    returnedVal = -1;
  }
return returnedVal;
}
function leaveTable(tableId, login, myId){
  function findTable(finded) {
    return finded.id === tableId;
  }

  var table = tables.find(findTable);
  var tableIndex = tables.findIndex(findTable);

  if((table.movementId == myId)&&(table.isRunning)){
    endMovement(myId, tableId, -1);
  }

  table.players[myId] = {login: ''};

  loggedUsers.forEach(function(user){
    if(user.login == login){
      user.tableId = -1;
      sendMessage(user.connection, {type: 6, result: 0, login: login, tableId: tableId});
    }
  });

  if((table.players[0].login == '')&&(table.players[1].login == '')&&(table.players[2].login == '')&&(table.players[3].login == '')){
    tables.splice(tables.indexOf(table), 1);
  } else {

    for(var i = 0; i < 4; i++){
      if(tables[tableIndex].movementArray[i] == myId){
        tables[tableIndex].movementArray[i] = tables[tableIndex].movementArray[myId];
      }
    }
    table.players.forEach(function(player){
      if(player.idGame != myId){
        sendMessage(player.connection, {type: 6, result: 1, login: login, tableId: tableId, userId: myId});
      }
    });

  }
  return table.players[myId].login;
}
function startGame(table){
  console.log("STARTGAME BOT");
  table.movementId = 0;
  table.isRunning = true;
  table.players.forEach(function(player){
    player.money = 200000;
    player.position = 0;
    player.buyList = [];
    player.plot = -1;
    player.project = -1;
    player.actualStage = 0;


    player.buyList = inf.allProducts.slice();
    player.buyList.forEach(function(prod){
      prod.has = 0;
      prod.lacks = prod.count;
    });

    if((table.botEnable)&&(table.players.indexOf(player) == 3))
      return;

    var user = loggedUsers.find(function(finded){
      return player.login === finded.login;
    });
    player.connection = user.connection;
  });
      table.players[0].idGame = 0;
      sendMessage(table.players[0].connection, {type: 7, result: 0, table: table, myMovement: true, myId: 0, movementId: 0});


      table.players[1].idGame = 1;
      sendMessage(table.players[1].connection, {type: 7, result: 0, table: table, myMovement: false, myId: 1, movementId: 0});

      table.players[2].idGame = 2;
      sendMessage(table.players[2].connection, {type: 7, result: 0, table: table, myMovement: false, myId: 2, movementId: 0});

      table.players[3].idGame = 3;
      if(!table.botEnable){
        console.log("STARTGAME 11111");
        sendMessage(table.players[3].connection, {type: 7, result: 0, table: table, myMovement: false, myId: 3, movementId: 0});
      } else{

        console.log("STARTGAME 22222");

      }

return table.players;
}

function rollDice(tableId, userId){

  var count = Math.floor((Math.random() * 6) + 1);

  var start = false;
  function findTable(finded) {
    return finded.id === tableId;
  }

  var table = tables.find(findTable);
  var tableIndex = tables.findIndex(findTable);

      tables[tableIndex].positions[userId] = tables[tableIndex].positions[userId] + count;
      if(tables[tableIndex].positions[userId] > 39){
        tables[tableIndex].positions[userId] = tables[tableIndex].positions[userId] - 39;
        start = true;
      }

      var actualField = inf.checkField(inf.board[table.positions[userId]], tables[tableIndex]);
      var fieldType = inf.board[table.positions[userId]].type;


      table.players.forEach(function(player){
        if(player.idGame == userId){
            if((table.botEnable)&&(userId == 3)){
              console.log("bot rolling!!!!!");
              sendMessageToBot(botClient, responseObj.conversationId, {
                type: 8,
                result: 0,
                user: userId,
                count: count,
                position: table.positions[userId],
                actualField: actualField,
                fieldType: fieldType,
                start: start,
                tableId: table.id,
                money: table.players[3].money,
                plot: table.players[3].plot,
                project: table.players[3].project,
                buyList: table.players[3].buyList,
                rewards: table.rewards[3],
                actualStage: table.players[3].actualStage,
                availableArchitects: table.availableArchitects[3],
                availableFirms: table.availableFirms[3],
                buildProgress: table.buildProgress
              });
            } else {
              sendMessage(player.connection, {
                type: 8,
                result: 0,
                user: userId,
                count: count,
                position: table.positions[userId],
                actualField: actualField,
                fieldType: fieldType,
                start: start
              });
            }


        } else {
          if(!((table.botEnable)&&(player.idGame == 3))){
            sendMessage(player.connection, {type: 8, result: 1, user: userId, count: count,
              position: table.positions[userId], actualField: actualField, fieldType: fieldType, start: start});
          }


        }
      });

return count;
}

function buyProduct(userId, tableId, buyList, sum, shopId){
  var returnedVal = 0;
  function findTable(finded) {
    return finded.id === tableId;
  }

  var table = tables.find(findTable);

  var shop = tables[tableId].shops.findIndex(function(finded){
    return finded.id === shopId;
  })
  if(buyList.length > 0){
    buyList.forEach(function(product){
      tables[tableId].shops[shop].products[product.code].count = tables[tableId].shops[shop].products[product.code].count
        - product.selectedCount;

    });
  }

  var next = table.movementArray[userId];

  table.players.forEach(function(player){
    if(player.idGame == userId){
      returnedVal++;
      table.players[userId].money = table.players[userId].money - sum;
      if(buyList.length > 0) {
        buyList.forEach(function (buyed) {
          var product = table.players[userId].buyList[buyed.code];
          var countBuyed = buyed.selectedCount;
          product.lacks = parseFloat(product.lacks) - parseFloat(countBuyed);
          if (product.lacks < 0) product.lacks = 0;
          product.has = parseFloat(product.has) + parseFloat(countBuyed);

        });
      }

      if((table.botEnable)&&(userId == 3)){

        return returnedVal;
      }

      sendMessage(player.connection, {
        type: 9,
        result: 0,
        user: userId,
        myMovement: false,
        next: next,
        playerMoney: table.players[userId].money,
        playerBuyList: table.players[userId].buyList,
        sum: sum
      });

    } else if((table.botEnable)&&(player.idGame == 3))
      return returnedVal;
    else if(player.idGame == next){
      returnedVal++;
      sendMessage(player.connection, {type: 9, result: 1, user: userId, myMovement: true,
        next: next, playerMoney: table.players[userId].money, playerBuyList: table.players[userId].buyList, sum: sum});
    } else{
      returnedVal++;
      sendMessage(player.connection, {type: 9, result: 1, user: userId, myMovement: false,
        next: next, playerMoney: table.players[userId].money, playerBuyList: table.players[userId].buyList, sum: sum});
    }
  });
  return returnedVal;
}

function buyPlot(userId, tableId, plot, officeId){
  var returnedVal = 0;

  function findTable(finded) {
    return finded.id === tableId;
  }

  var table = tables.find(findTable);

  table.availableArchitects[userId] = true;

  var next = table.movementArray[userId];

  var office = tables[tableId].offices.findIndex(function(finded){
    return finded.id === officeId;
  });

    var plotIndex = tables[tableId].offices[office].plots.findIndex(function(finded){
      return finded.id === plot.id;
    });

  tables[tableId].offices[office].plots[plotIndex].available = false;

  table.buildProgress[userId][0] = {id: 3, name: "wykonała", counter: 0};
  table.buildProgress[userId][1] = {id: 1, name: "dostępna", counter: -1};


  //table.players[userId].startReward = table.rewards[userId] - inf.allOffices[office].plots[plotIndex].cost;

  table.players.forEach(function(player){
    if(player.idGame == userId){
      returnedVal++;
      if((table.botEnable)&&(userId == 3)){
        table.players[3].plot = plot;
        return;
      }

    sendMessage(player.connection, {
      type: 10,
      result: 0,
      user: userId,
      myMovement: false,
      next: next,
      plot: plot,
      buildProgress: table.buildProgress
      //startReward: table.players[userId].startReward
    });

    } else if((table.botEnable)&&(player.idGame == 3)){
      returnedVal++;
      return;
    }
    else if(player.idGame == next){
      returnedVal++;
      sendMessage(player.connection, {type: 10, result: 1, user: userId, myMovement: true,
        next: next, plot: plot, buildProgress: table.buildProgress});

    } else{
      returnedVal++;
      sendMessage(player.connection, {type: 10, result: 1, user: userId, myMovement: false,
        next: next, plot: plot, buildProgress: table.buildProgress});
    }
  });
  return returnedVal;
}

function buyProject(userId, tableId, architect){
  var returnedVal = 0;
  function findTable(finded) {
    return finded.id === tableId;
  }
  var table = tables.find(findTable);

  table.availableArchitects[userId] = false;

  table.buildProgress[userId][1] = {id: 2, name: "Prace trwają", counter: architect.time};

  var next = table.movementArray[userId];

 table.players.forEach(function(player){
    if(player.idGame == userId){
      returnedVal++;
      if((table.botEnable)&&(player.idGame == 3)){
        table.players[3].project = architect;
        return;
      }

    sendMessage(player.connection, {
      type: 11,
      result: 0,
      user: userId,
      myMovement: false,
      next: next,
      project: architect,
      buildProgress: table.buildProgress
    });

    } else if((table.botEnable)&&(player.idGame == 3)){
      returnedVal++;
      return;
    }

    else if(player.idGame == next){
      returnedVal++;
      sendMessage(player.connection, {type: 11, result: 1, user: userId, myMovement: true,
        next: next, project: architect, buildProgress: table.buildProgress});

    } else{
      returnedVal++;
      sendMessage(player.connection, {type: 11, result: 1, user: userId, myMovement: false,
        next: next, project: architect, buildProgress: table.buildProgress});
    }
  });
 return returnedVal;
}

function answerQuestion(userId, tableId, good){
  var returnedVal = 0;

  function findTable(finded) {
    return finded.id === tableId;
  }
  var table = tables.find(findTable);

  var next = table.movementArray[userId];

  table.players.forEach(function(player){
    if(player.idGame == userId){
      returnedVal++;

      if(good){
        player.money = player.money + 1000;
      }

      if((table.botEnable)&&(player.idGame == 3)){
        return;
      }
      sendMessage(player.connection, {
        type: 12,
        result: 0,
        user: userId,
        myMovement: false,
        next: next,
        good: good,
        playerMoney: table.players[userId].money
      });

    } else if((table.botEnable)&&(player.idGame == 3)){
      returnedVal++;
      return;
    } else if(player.idGame == next){
      returnedVal++;
      sendMessage(player.connection, {type: 12, result: 1, user: userId, myMovement: true,
        next: next, good: good, playerMoney: table.players[userId].money});
    } else{
      returnedVal++;
      sendMessage(player.connection, {type: 12, result: 1, user: userId, myMovement: false,
        next: next, good: good, playerMoney: table.players[userId].money});
    }
  });
return returnedVal;
}

function penaltyAccept(userId, tableId, penalty){
  var returnedVal = 0;
  function findTable(finded) {
    return finded.id === tableId;
  }
  var table = tables.find(findTable);

  var next = table.movementArray[userId];

  table.players.forEach(function(player){
      if(player.idGame == userId){
        returnedVal++;

        player.money = player.money - penalty.price;

        if((table.botEnable)&&(player.idGame == 3)){

          return;
        }

        sendMessage(player.connection, {
          type: 13,
          result: 0,
          user: userId,
          myMovement: false,
          next: next,
          mandate: penalty,
          playerMoney: table.players[userId].money
        });
      }
      else if((table.botEnable)&&(player.idGame == 3)){
        returnedVal++;
        return;
      }

      else if(player.idGame == next){
        returnedVal++;
        sendMessage(player.connection, {type: 13, result: 1, user: userId, myMovement: true,
          next: next, mandate: penalty, playerMoney: table.players[userId].money});
      }
      else {
        returnedVal++;
        sendMessage(player.connection, {
          type: 13, result: 1, user: userId, myMovement: false,
          next: next, mandate: penalty, playerMoney: table.players[userId].money
        });
      }
  });
  return returnedVal;
}

function endMovement(userId, tableId, firm){
  var returnedVal = 0;
  function findTable(finded) {
    return finded.id === tableId;
  }

  var table = tables.find(findTable);

  var next = table.movementArray[userId];
  table.movementId = next;

  if((firm !=-1)&&(!firm)&&(firm != {})&&(firm != undefined)){
    table.players[userId].actualStage++;
    table.players[userId].money = table.players[userId].money - firm.price;
  }

  setCounters(userId, table);
  checkFirmAvailability(userId, table);

  if((firm !=-1)&&(!firm)&&(firm != {})&&(firm != undefined)){

    table.buildProgress[userId][firm.stage] = {id: 2, name: "Prace trwają", counter: firm.time};

  }

  table.players.forEach(function(player){
    if((table.botEnable)){

        if((player.idGame == userId)&&(userId != 3)){
          returnedVal++;
          sendMessage(player.connection, {
            type: 14,
            result: 0,
            user: userId,
            myMovement: false,
            next: next,
            firm: firm,
            buildProgress: table.buildProgress,
            availableArchitects: table.availableArchitects,
            availableFirms: table.availableFirms,
            playerMoney: table.players[userId].money
          });

        }
        else if((player.idGame == next)&&(player.idGame != 3)){
          returnedVal++;
          sendMessage(player.connection, {type: 14, result: 1, user: userId, myMovement: true,
            next: next, firm: firm, buildProgress: table.buildProgress,
            availableArchitects: table.availableArchitects,
            availableFirms: table.availableFirms,
            playerMoney: table.players[userId].money
          });
        }
        else if((player.idGame == next)&&(player.idGame == 3)){
          returnedVal++;
          setTimeout(function(){
            rollDice(table.id, 3);
          }, 3000);
        }
        else if((player.idGame != next)&&(player.idGame != 3)){
          returnedVal++;
          sendMessage(player.connection, {
            type: 14, result: 1, user: userId, myMovement: false,
            next: next, firm: firm, buildProgress: table.buildProgress,
            availableArchitects: table.availableArchitects,
            availableFirms: table.availableFirms,
            playerMoney: table.players[userId].money
          });
        }

    } else {
      if(player.idGame == userId){
        returnedVal++;
          sendMessage(player.connection, {
            type: 14,
            result: 0,
            user: userId,
            myMovement: false,
            next: next,
            firm: firm,
            buildProgress: table.buildProgress,
            availableArchitects: table.availableArchitects,
            availableFirms: table.availableFirms,
            playerMoney: table.players[userId].money
          });
      }
      else if(player.idGame == next){
        returnedVal++;
        sendMessage(player.connection, {type: 14, result: 1, user: userId, myMovement: true,
          next: next, firm: firm, buildProgress: table.buildProgress,
          availableArchitects: table.availableArchitects,
          availableFirms: table.availableFirms,
          playerMoney: table.players[userId].money
        });
      }
      else {
        returnedVal++;
        sendMessage(player.connection, {
          type: 14, result: 1, user: userId, myMovement: false,
          next: next, firm: firm, buildProgress: table.buildProgress,
          availableArchitects: table.availableArchitects,
          availableFirms: table.availableFirms,
          playerMoney: table.players[userId].money
        });
      }
    }

  });
  return returnedVal;
}
