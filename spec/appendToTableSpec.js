var serv = require("../server");

describe("testAppendToTable", function() {


  it("testAppendToTable00", function() {
    var tables = [{
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
    }];
    var returnedVal = serv.appendToTable(0, {}, "test", "");
    expect(returnedVal).toEqual(0);
  });

  it("testAppendToTable01", function() {
    var tables = [{
      id: 0,
      botEnable: false,
      closed: false,
      password: '',
      players: ["user", "user", "user", "user"], // can be bot
      positions: [0,0,0,0],
      movementArray: [1,2,3,0],
      free: false,
      isRunning: false,
      questionCounter: -1,
      mandateCounter: -1,
      availableArchitects: [],
      availableFirms: [],
      buildProgress: []
    }];
    var returnedVal = serv.appendToTable(0, {}, "test", "");
    expect(returnedVal).toEqual(-1);
  });

  it("testAppendToTable02", function() {
    var tables = [{
      id: 0,
      botEnable: false,
      closed: true,
      password: '00000',
      players: ["user", "user", "user", "user"], // can be bot
      positions: [0,0,0,0],
      movementArray: [1,2,3,0],
      free: false,
      isRunning: false,
      questionCounter: -1,
      mandateCounter: -1,
      availableArchitects: [],
      availableFirms: [],
      buildProgress: []
    }];
    var returnedVal = serv.appendToTable(0, {}, "test", "11111");
    expect(returnedVal).toEqual(-2);
  });

});
