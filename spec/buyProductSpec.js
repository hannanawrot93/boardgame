var serv = require("../server");

describe("testBuyProduct", function() {
  var tables = [{id: 0, players: [], botEnable: false, offices: []}];

  beforeEach(function() {
    tables[0].players[0].idGame = 0;
    tables[0].players[0].money = 300000;
    tables[0].shops = [{id: 0, products: [{code: 0, count: 1000, price: 100}, {code: 1, count: 800, price: 50}]}];
    tables[0].players[0].buyList[0].has = 0;
    tables[0].players[0].buyList[1].has = 20;
  });

  it("testBuyProduct00", function() {
    var returnedVal = serv.buyProduct(0, 0, [{code: 0, selectedCount: 100}, {code: 1, selectedCount: 50}],12500,0);
    expect(returnedVal).toEqual(4);
    expect(tables[0].players[0].money).toEqual(287500);
    expect(tables[0].players[0].buyList[0].has).toEqual(100);
    expect(tables[0].players[0].buyList[1].has).toEqual(70);
    expect(tables[0].shops[0].products[0].count).toEqual(900);
    expect(tables[0].shops[0].products[1].count).toEqual(750);
  });

  it("testBuyProduct01", function() {
    var returnedVal = serv.buyProduct(0, 0, [],0,0);
    expect(returnedVal).toEqual(4);
    expect(tables[0].players[0].money).toEqual(300000);
    expect(tables[0].players[0].buyList[0].has).toEqual(0);
    expect(tables[0].players[0].buyList[1].has).toEqual(20);
    expect(tables[0].shops[0].products[0].count).toEqual(1000);
    expect(tables[0].shops[0].products[1].count).toEqual(800);
  });

});
