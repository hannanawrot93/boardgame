var serv = require("../server");

describe("testLogin", function() {
  var loggedUsers = [];

  it("testLogin00", function() {
    var returnedVal = serv.login({}, "test");
    expect(returnedVal).toEqual(1);
  });

  it("testLogin01", function() {
    var returnedVal = serv.login({}, "test");
    expect(returnedVal).toEqual(1);
  });

  it("testLogin02", function() {
    var returnedVal = serv.login({}, "test11");
    expect(returnedVal).toEqual(2);
  });
});
