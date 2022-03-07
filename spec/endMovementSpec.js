var serv = require("../server");

describe("testEndMovement", function() {
  var tables = [{id: 0, players: [], botEnable: false}];
  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 3000;
  });

  it("testEndMovement00", function() {
    var returnedVal = serv.endMovement(0, 0, -1);
    expect(returnedVal).toEqual(4);
    expect(tables[0].players[0].money).toEqual(3000);
  });

  it("testEndMovement01", function() {
    var returnedVal = serv.endMovement(0, 0, {price: 500});
    expect(returnedVal).toEqual(4);
    expect(tables[0].players[0].money).toEqual(2500);
  });

});
