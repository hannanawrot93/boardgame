var serv = require("../server");

describe("testBuyProject", function() {
  var tables = [{id: 0, players: [], botEnable: false, offices: []}];

  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 300000;
  });

  it("testBuyProject00", function() {
    var returnedVal = serv.buyProject(0, 0, {id: 0, time: 2, price: 1000});
    expect(returnedVal).toEqual(4);
    expect(tables[0].players[0].money).toEqual(299000);
    expect(tables[0].players[0].project).toEqual({id: 0, time: 2, price: 1000});
  });

});
