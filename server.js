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


var receivedMessages = [];
var directLineSpecUrl = 'https://docs.botframework.com/en-us/restapi/directline3/swagger.json';
var directLineClient = rp(directLineSpecUrl)
  .then(function (spec) {
    // Client
    return new Swagger({
      spec: JSON.parse(spec.trim()),
      usePromise: true
    });
  })
  .then(function (client) {
    // Obtain a token using the Direct Line secret
    return rp({
      url: 'https://directline.botframework.com/v3/directline/tokens/generate',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + directLineSecret
      },
      json: true
    }).then(function (response) {
      // Then, replace the client's auth secret with the new token
      var token = response.token;
      client.clientAuthorizations.add('AuthorizationBotConnector', new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + token, 'header'));
      return client;
    });
  })
  .catch(function (err) {
    console.error('Error initializing DirectLine client', err);
    throw err;
  });

// Once the client is ready, create a new conversation
directLineClient.then(function (client) {
  client.Conversations.Conversations_StartConversation()
    .then(function (response) {
      var responseObj = response.obj;

      // Start console input loop from stdin
      sendMessagesFromConsole(client, responseObj.conversationId);


      // Start receiving messages from WS stream - using Node client
      startReceivingWebSocketClient(responseObj.streamUrl, responseObj.conversationId);

    });
});

// Read from console (stdin) and send input to conversation using DirectLine client
function sendMessagesFromConsole(client, conversationId) {
  // Send message
  client.Conversations.Conversations_PostActivity(
    {
      conversationId: conversationId,
      activity: {
        textFormat: 'plain',
        text: "llalallalatestetest",
        type: 'message',
        from: {
          id: directLineUserId,
          name: directLineUserId
        }
      }
    }).catch(function (err) {
    console.error('Error sending message:', err);
  });
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
//var index = fs.readFileSync('index.html');
/*var css1 = fs.readFileSync("styles/vendor-c7124ccb33.css");
 var css2 = fs.readFileSync("styles/app-d3b16ab6af.css");
 var js1 = fs.readFileSync("scripts/vendor-6b771df1fb.js");
 var js2 = fs.readFileSync("scripts/app-b1aec4dbee.js");*/

var clients = [];
var loggedUsers = [];
var tables = [];
/**
 * HTTP server
 */

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
          //sendToBot();
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
          leaveTable(json.tableId, json.login);
          break;

        case 7:
// tu startgame
          break;

        case 8:
          rollDice(json.tableId, json.login);
        // 8 rzut kostka, 9 kupil, nie kupil, zamowil

      }

    }
  });

  // user disconnected
  connection.on('close', function (connection) {
    console.log("DISCONNECTED");
  });
});


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

  loggedUsers.forEach(function(user){
    if(user.login == login){

      var idNewTable;

      if(tables.length > 0){
        idNewTable = tables[tables.length-1].id + 1;
      } else {
        idNewTable = 0;
      }

      var proff = Math.floor((Math.random() * 3));
      var rew = Math.floor((Math.random() * 3));

      var table = {
        id: idNewTable,
        botEnable: bot,
        closed: closed,
        password: password,
        players: [user, {login: ''}, {login: ''}, {login: ''}], // can be bot
        positions: [0,0,0,0],
        proffessions: shuffle(inf.start.professions),
        rewards: shuffle(inf.start.rewards),
        free: true,
        shops: shuffle(inf.allShops),
        mandates: shuffle(inf.allMandates),
        offices: shuffle(inf.allOffices),
        architects: shuffle(inf.allArchitects),
        questions: shuffle(inf.allQuestions)

      };
      user.tableId = table.id;
      tables.push(table);

    }
  });
  conn.sendUTF(JSONStringify({type: 4, result: 0, tables: tables}));

  loggedUsers.forEach(function(user){
    user.connection.sendUTF(JSONStringify({type: 4, result: 1, tables: tables}));
  });
}
function appendToTable(tableId, conn, login, password){

  tables.forEach(function(table){
    if(table.id == tableId){
      if((table.closed)&&(table.password.localeCompare(password) != 0)) {
        conn.sendUTF(JSONStringify({
          type: 5,
          result: -2,
          appended: login,
          tableId: tableId,
          tables: tables
        }));
      }
      else if(table.free){
        loggedUsers.forEach(function(user){
          if(user.login == login){
            user.tableId = table.id;

            user.connection.sendUTF(JSONStringify({type: 5, result: 0, appended: login, tableId: tableId, tables: tables}));

            if(table.players[0].login == ''){
              table.players[0] = user;
              //  table.player1.id = user.id;

            } else if(table.players[1].login == ''){
              table.players[1] = user;
              // table.player2.id = user.id;

            } else if(table.players[2].login == ''){
              table.players[2] = user;
              //table.player3.id = user.id;
              if(table.botEnable)
                table.free = false;

            } else if(table.players[3].login == ''){
              table.players[3] = user;
              //table.player4.id = user.id;
              table.free = false;

              loggedUsers.forEach(function(user){
                user.connection.sendUTF(JSONStringify({type: 5, result: 3, tables: tables}));
              });

              startGame(table);
            }

          }
        });
        loggedUsers.forEach(function(user){
          if((user.login != login)&&((user.login == table.players[0].login)||(user.login == table.players[1].login)
            ||(user.login == table.players[2].login)||(user.login == table.players[3].login))){
            user.connection.sendUTF(JSONStringify({type: 5, result: 1, appended: login, tableId: tableId, tables: tables}));
          }
        });
      }
      else {
        conn.sendUTF(JSONStringify({type: 5, result: -1, appended: login,  tableId: tableId}));
      }
    }
  });
}
function leaveTable(tableId, login){
  tables.forEach(function(table){
    if(table.id == tableId){
      if(table.players[0].login == login){
        table.players[0] = {login: ''};
      } else if(table.players[1].login == login){
        table.players[1] = {login: ''};
      } else if(table.players[2].login == login){
        table.players[2] = {login: ''};
      }else if(table.players[3].login == login){
        table.players[3] = {login: ''};
      }
      loggedUsers.forEach(function(user){
        if(user.login == login){
          user.tableId = -1;
          user.connection.sendUTF(JSON.stringify({type: 6, result: 0, login: login, tableId: tableId}));
        }
      });
      if((table.players[0].login == '')&&(table.players[1].login == '')&&(table.players[2].login == '')&&(table.players[3].login == '')){
        tables.splice(tables.indexOf(table),1);
      } else {
        loggedUsers.forEach(function(user){
          if((user.login != login)&&((user.login == table.players[0].login)||(user.login == table.players[1].login)
            ||(user.login == table.players[2].login)||(user.login == table.players[3].login))){
            user.connection.sendUTF(JSON.stringify({type: 6, result: 1, login: login, tableId: tableId}));
          }
        });
      }
    }
  });
}
function startGame(table){
  loggedUsers.forEach(function(user){
    if(user.login == table.players[1].login){
      user.connection.sendUTF(JSONStringify({type: 7, result: 0, table: table, movement: false, myId: 1}));
    }
    if(user.login == table.players[2].login){
      user.connection.sendUTF(JSONStringify({type: 7, result: 0, table: table, movement: false, myId: 2}));
    }
    if(user.login == table.players[3].login){
      user.connection.sendUTF(JSONStringify({type: 7, result: 0, table: table, movement: false, myId: 3}));
    }
    if(user.login == table.players[0].login){
      user.connection.sendUTF(JSONStringify({type: 7, result: 0, table: table, movement: true, myId: 0}));
    }
  });
}
function rollDice(tableId, userId){

  var count = Math.floor((Math.random() * 6) + 1);

  tables.forEach(function(table){
    if(table.id == tableId){

      table.positions[userId] = table.positions[userId] + count;
      if(table.positions[userId] > 39){
        table.positions[userId] = table.positions[userId] - 39;
      }

      for(var i = 0; i < 4; i++){
        if(i == userId){
          table.players[userId].connection.sendUTF(JSON.stringify({type: 8, result: 0, user: userId, count: count, position: table.positions[userId],
            field: inf.checkField((inf.board[table.positions[userId]], table)), fieldType: inf.board[table.positions[userId].type]}));
        } else {
          table.players[i].connection.sendUTF(JSON.stringify({type: 8, result: 1, user: userId, count: count, position: table.positions[userId]}));

        }
      }

      return;
    }
  });
}
