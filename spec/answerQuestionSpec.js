var serv = require("../server");

describe("testAnswerQuestion", function() {
  var tables = [{id: 0, players: [], botEnable: false}];
  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 3000;
  });

  it("testAnswerQuestion00", function() {
    var returnedVal = serv.answerQuestion(0, 0, false);
    expect(returnedVal).toEqual(4);
    expect(tables[0].players[0].money).toEqual(3000);
  });

  it("testAnswerQuestion01", function() {
    var returnedVal = serv.answerQuestion(0, 0, true);
    expect(returnedVal).toEqual(4);
    expect(tables[0].players[0].money).toEqual(4000);
  });
});
