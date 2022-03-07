var serv = require("../server");

describe("testRollDice", function() {
  var tables = [{id: 0, players: [], botEnable: false, positions: [0,0,0,0]}];
  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 3000;
  });

  it("testRollDice00", function() {
    tables[0].positions[0] = 0;
    var returnedVal = serv.rollDice(0, 0);
    expect(tables[0].positions[0]).toEqual(returnedVal);
  });

});
