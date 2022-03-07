var serv = require("../server");

describe("testNewTable", function() {
  var tables = [];

  var expectedTable = {
    id: 0,
    botEnable: false,
    closed: false,
    password: '',
    players: ["user", {login: ''}, {login: ''}, {login: ''}], // can be bot
    positions: [0,0,0,0],
    movementArray: [1,2,3,0],
    free: true,
    isRunning: false,
    questionCounter: -1,
    mandateCounter: -1,
    availableArchitects: [],
    availableFirms: [],
    buildProgress: []
  };

  it("testNewTable00", function() {
    var returnedVal = serv.newTable({}, "test", false, false,"");
    expect(returnedVal).toEqual(expectedTable);
    expect(tables.length).toEqual(1);
  });

});
