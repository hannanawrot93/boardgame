var serv = require("../server");

describe("testBuyPlot", function() {
  var tables = [{id: 0, players: [], botEnable: false, offices: []}];

  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 300000;
    tables[0].offices = [{id: 0, plots: [{id: 0, available: true, price: 10000}]}];
  });

  it("testBuyPlot00", function() {
    var returnedVal = serv.buyPlot(0, 0, {id: 0, available: true, price: 10000},0);
    expect(returnedVal).toEqual(4);
    expect(tables[0].offices[0].plots[0].available).toEqual(false);
    expect(tables[0].players[0].money).toEqual(290000);
    expect(tables[0].players[0].plot).toEqual({id: 0, available: true, price: 10000});
  });

});

