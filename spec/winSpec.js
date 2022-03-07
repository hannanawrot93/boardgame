var serv = require("../server");

describe("testWin", function() {
  var tables = [{id: 0, players: [], botEnable: false}];

  it("testWin00", function() {
    var returnedVal = serv.win(0, tables[0]);
    expect(returnedVal).toEqual(4);
  });

});
