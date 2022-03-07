var serv = require("../server");

describe("testStartGame", function() {
  var tables = [{
    id: 0,
    botEnable: false,
    closed: false,
    password: '',
    players: [{login: 'test'}, {login: ''}, {login: ''}, {login: ''}], // can be bot
    positions: [0,0,0,0],
    movementArray: [1,2,3,0],
    free: true,
    isRunning: false,
    questionCounter: -1,
    mandateCounter: -1,
    availableArchitects: [],
    availableFirms: [],
    buildProgress: []
  }];


  it("testStartGame00", function() {
    var returnedVal = serv.startGame(tables[0]);
    expect(returnedVal[0].position).toEqual(0);
    expect(returnedVal[0].money).toEqual(200000);
    expect(returnedVal[0].idGame).toEqual(0);
  });

});
