var serv = require("../server");

describe("testLeaveTable", function() {
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


  it("testLeaveTable00", function() {
    var returnedVal = serv.leaveTable(0, "test", 0);
    expect(returnedVal).toEqual('');
  });

});
