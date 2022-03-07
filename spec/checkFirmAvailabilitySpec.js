var serv = require("../server");

describe("testCheckFirmAvailability", function() {
  var tables = [{id: 0, players: [], botEnable: false}];
  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 3000;
    tables[0].buildProgress[0][2].counter = -1;

  });

  it("testCheckFirmAvailability00", function() {
    tables[0].buildProgress[0][1].counter = 0;
    tables[0].players[0].buyList = [{lacks: 0}]

    var returnedVal = serv.checkFirmAvailability(0, tables[0]);
    expect(returnedVal).toEqual(2);
  });

  it("testCheckFirmAvailability01", function() {
    tables[0].buildProgress[0][1].counter = 0;
    tables[0].players[0].buyList = [{lacks: 5}]

    var returnedVal = serv.checkFirmAvailability(0, tables[0]);
    expect(returnedVal).toEqual(-1);
  });

  it("testCheckFirmAvailability02", function() {
    tables[0].buildProgress[0][1].counter = 1;
    tables[0].players[0].buyList = [{lacks: 0}]

    var returnedVal = serv.checkFirmAvailability(0, tables[0]);
    expect(returnedVal).toEqual(-1);
  });

});
