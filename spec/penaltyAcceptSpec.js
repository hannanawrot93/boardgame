var serv = require("../server");

describe("testPenaltyAccept", function() {
  var tables = [{id: 0, players: [], botEnable: false}];
  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 3000;
  });

  it("testPenaltyAccept00", function() {
    var returnedVal = serv.penaltyAccept(0, 0, {text:"", price: 500});
    expect(returnedVal).toEqual(4);
    expect(tables[0].players[0].money).toEqual(2500);
  });

});
