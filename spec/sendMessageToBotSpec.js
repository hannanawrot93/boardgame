var serv = require("../server");

describe("testSendMessageToBot", function() {
  var tables = [{id: 0, players: [], botEnable: false, positions: [0,0,0,0]}];

  it("testSendMessageToBot00", function() {
    tables[0].positions[0] = 0;

    var returnedVal = serv.sendMessageToBot(serv.botClient, serv.responseObj.conversationId, {msg: "test"});
    expect(returnedVal).toEqual(true);
  });

});
