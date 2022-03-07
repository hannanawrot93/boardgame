var serv = require("../server");

describe("testSetCounters", function() {
  var tables = [{id: 0, players: [], botEnable: false}];
  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 3000;
    tables[0].buildProgress[0][0].counter = 0;
    tables[0].buildProgress[0][1].counter = 0;


  });

  it("testSetCounters00", function() {
    tables[0].buildProgress[0][2].counter = 2;
    tables[0].buildProgress[0][3].counter = -1;

    var returnedVal = serv.setCounters(0, tables[0]);
    expect(tables[0].buildProgress[0][0].counter).toEqual(0);
    expect(tables[0].buildProgress[0][1].counter).toEqual(0);
    expect(tables[0].buildProgress[0][2].counter).toEqual(1);
    expect(tables[0].buildProgress[0][3].counter).toEqual(-1);
    expect(returnedVal).toEqual(0);
  });

  it("testSetCounters01", function() {
    tables[0].buildProgress[0][2].counter = 0;
    tables[0].buildProgress[0][3].counter = 1;

    var returnedVal = serv.setCounters(0, tables[0]);
    expect(tables[0].buildProgress[0][0].counter).toEqual(0);
    expect(tables[0].buildProgress[0][1].counter).toEqual(0);
    expect(tables[0].buildProgress[0][2].counter).toEqual(0);
    expect(tables[0].buildProgress[0][3].counter).toEqual(0);
    expect(returnedVal).toEqual(1);
  });

});
