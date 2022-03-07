(function() {
  'use strict';

  angular
    .module('boardgame')
    .factory('productsFactory', productsFactory);

  /** @ngInject */
  function productsFactory() {


    function Product(code, name, count, price, unit, stage) {
      this.code = code;
      this.name = name;
      this.count = count;
      this.price = price;
      this.unit = unit;
      this.stage = allStages[stage];
      this.actualCounts = [0,0,0,0];
      this.actualLacks = [count, count, count, count];

    }

    function Firm(id, name, price, time, stage){
      this.id = id;
      this.name = name;
      this.time = time;
      this.price = price;
      this.stage = stage;
    }

    var allFirms = [];

    var allProducts = [];

    var allStages = ['Fundamenty','Ściany','Strop','Dach','Ocieplenie','Stolarka zewnętrzna','Instalacja elektryczna',
      'Instalacja wodno-kanalizacyjna','Instalacja grzewcza','Tynki i gipsowanie','Posadzki','Stolarka wewnętrzna','Łazienka',
      'Roboty na zewnątrz', 'Meble','Sprzęt rtv i agd'];

    allProducts.push(new Product(allProducts.length, 'beton gotowy', 20, 6000, 'm3', 0));
    allProducts.push(new Product(allProducts.length, 'bloczki betonowe', 1000, 2500, 'szt', 0));
    allProducts.push(new Product(allProducts.length, 'cement', 8, 250, 'worki', 0));
    allProducts.push(new Product(allProducts.length, 'żwir', 5, 160, 'tony', 0));
    allProducts.push(new Product(allProducts.length, 'piasek', 4, 100, 'tony', 0));
    allProducts.push(new Product(allProducts.length, 'zbrojenie', 200, 1400, 'mb', 0));
    allProducts.push(new Product(allProducts.length, 'rury kanalizacyjne', 150, 600, 'szt', 0));
    allProducts.push(new Product(allProducts.length, 'kolanka kanalizacyjne', 100, 500, 'szt', 0));
    allProducts.push(new Product(allProducts.length, 'folia izolacyjna', 250, 700, 'm2', 0));
    allProducts.push(new Product(allProducts.length, 'emulsja izolacyjna', 60, 200, 'l', 0));

    allProducts.push(new Product(allProducts.length, 'pustaki', 120, 10400, 'm2', 1));
    allProducts.push(new Product(allProducts.length, 'cement', 2.4, 900, 'tony', 1));
    allProducts.push(new Product(allProducts.length, 'piasek', 5, 150, 'tony', 1));
    allProducts.push(new Product(allProducts.length, 'zaprawa', 7, 150, 'worki', 1));
    allProducts.push(new Product(allProducts.length, 'cegły', 700, 850, 'szt', 1));
    allProducts.push(new Product(allProducts.length, 'folia izolacyjna', 100, 250, 'm2', 1));

    allProducts.push(new Product(allProducts.length, 'belka stropowa', 140, 1700, 'mb', 2));
    allProducts.push(new Product(allProducts.length, 'szalunek budowlany', 2, 250, 'szt', 2));
    allProducts.push(new Product(allProducts.length, 'beton', 12, 3500, 'm3', 2));
    allProducts.push(new Product(allProducts.length, 'pustaki', 200, 500, 'szt', 2));
    allProducts.push(new Product(allProducts.length, 'zbrojenie', 150, 1000, 'mb', 2));
    allProducts.push(new Product(allProducts.length, 'cement', 1.5, 700, 'tony', 2));

    allProducts.push(new Product(allProducts.length, 'drewno', 14, 9200, 'm3', 3));
    allProducts.push(new Product(allProducts.length, 'dachówka', 140, 9000, 'm2', 3));
    allProducts.push(new Product(allProducts.length, 'komin', 1, 2000, 'szt', 3));
    allProducts.push(new Product(allProducts.length, 'okno dachowe', 4, 4000, 'm3', 3));
    allProducts.push(new Product(allProducts.length, 'podbitka', 140, 2400, 'm2', 3));
    allProducts.push(new Product(allProducts.length, 'rynny', 50, 2500, 'mb', 3));

    allProducts.push(new Product(allProducts.length, 'styropian', 120, 3000, 'm2', 4));
    allProducts.push(new Product(allProducts.length, 'klej do styropianu', 5, 900, 'worki', 4));
    allProducts.push(new Product(allProducts.length, 'zaprawa do styropianu', 33, 900, 'worki', 4));
    allProducts.push(new Product(allProducts.length, 'siatka', 220, 500, 'm2', 4));
    allProducts.push(new Product(allProducts.length, 'wełna do ocieplenia poddasza', 400, 3800, 'm2', 4));

    allProducts.push(new Product(allProducts.length, 'okna', 10, 8000, 'szt', 5));
    allProducts.push(new Product(allProducts.length, 'drzwi wejściowe', 1, 4000, 'szt', 5));
    allProducts.push(new Product(allProducts.length, 'parapety wewnętrzne', 10, 500, 'szt', 5));
    allProducts.push(new Product(allProducts.length, 'parapety zewnętrzne', 10, 2000, 'szt', 5));

    allProducts.push(new Product(allProducts.length, 'kable', 300, 1500, 'mb', 6));
    allProducts.push(new Product(allProducts.length, 'puszki', 20, 200, 'szt', 6));
    allProducts.push(new Product(allProducts.length, 'gniazdka', 40, 400, 'szt', 6));
    allProducts.push(new Product(allProducts.length, 'włączniki', 30, 400, 'szt', 6));
    allProducts.push(new Product(allProducts.length, 'halogeny', 60, 1800, 'szt', 6));

    allProducts.push(new Product(allProducts.length, 'rury', 23, 350, 'mb', 7));
    allProducts.push(new Product(allProducts.length, 'kolanka do rur', 10, 150, 'szt', 7));
    allProducts.push(new Product(allProducts.length, 'otulina', 1, 20, 'szt', 7));

    allProducts.push(new Product(allProducts.length, 'rury c.o. pex', 400, 600, 'mb', 8));
    allProducts.push(new Product(allProducts.length, 'złączki', 20, 300, 'szt', 8));
    allProducts.push(new Product(allProducts.length, 'rury miedziane', 15, 350, 'mb', 8));
    allProducts.push(new Product(allProducts.length, 'wkład kominkowy', 1, 7000, 'szt', 8));
    allProducts.push(new Product(allProducts.length, 'grzejniki', 10, 5000, 'szt', 8));
    allProducts.push(new Product(allProducts.length, 'piec', 1, 4000, 'szt', 8));

    allProducts.push(new Product(allProducts.length, 'płyty gk', 300, 2000, 'm2', 9));
    allProducts.push(new Product(allProducts.length, 'profile', 200, 1500, 'szt', 9));
    allProducts.push(new Product(allProducts.length, 'wkręty', 5, 100, 'kg', 9));
    allProducts.push(new Product(allProducts.length, 'klej', 8, 500, 'worki', 9));
    allProducts.push(new Product(allProducts.length, 'gips budowlany', 150, 1500, 'kg', 9));
    allProducts.push(new Product(allProducts.length, 'farba do ścian i sufitów', 150, 1500, 'l', 9));

    allProducts.push(new Product(allProducts.length, 'styropian', 120, 800, 'm2', 10));
    allProducts.push(new Product(allProducts.length, 'cement', 6, 2500, 't', 10));
    allProducts.push(new Product(allProducts.length, 'folia', 120, 300, 'm2', 10));
    allProducts.push(new Product(allProducts.length, 'płytki podłogowe', 70, 3500, 'm2', 10));
    allProducts.push(new Product(allProducts.length, 'panele podłogowe', 40, 1200, 'm2', 10));

    allProducts.push(new Product(allProducts.length, 'schody', 1, 10000, 'szt', 11));
    allProducts.push(new Product(allProducts.length, 'drzwi', 10, 15000, 'szt', 11));

    allProducts.push(new Product(allProducts.length, 'kompakt wc', 2, 2500, 'szt', 12));
    allProducts.push(new Product(allProducts.length, 'płytki ścienne łazienkowe', 85, 4200, 'm2', 12));
    allProducts.push(new Product(allProducts.length, 'kabina prysznicowa', 1, 1200, 'szt', 12));
    allProducts.push(new Product(allProducts.length, 'wanna', 1, 800, 'szt', 12));
    allProducts.push(new Product(allProducts.length, 'szafka z umywalką', 2, 2000, 'szt', 12));
    allProducts.push(new Product(allProducts.length, 'lustro', 2, 300, 'szt', 12));

    allProducts.push(new Product(allProducts.length, 'tynk zewnętrzny', 550, 800, 'kg', 13));
    allProducts.push(new Product(allProducts.length, 'kostka brukowa', 150, 15000, 'm2', 13));
    allProducts.push(new Product(allProducts.length, 'rośliny ogrodowe', 10, 2000, 'szt', 13));
    allProducts.push(new Product(allProducts.length, 'ogrodzenie', 200, 10000, 'mb', 13));

    allProducts.push(new Product(allProducts.length, 'zestaw mebli kuchennych', 1, 8000, 'szt', 14));
    allProducts.push(new Product(allProducts.length, 'łóżko do sypialni', 1, 1500, 'szt', 14));
    allProducts.push(new Product(allProducts.length, 'kanapa do salonu', 1, 5000, 'szt', 14));
    allProducts.push(new Product(allProducts.length, 'stolik do salonu', 1, 800, 'szt', 14));
    allProducts.push(new Product(allProducts.length, 'stół z krzesłami do jadalni', 1, 3000, 'szt', 14));
    allProducts.push(new Product(allProducts.length, 'stoliki nocne do sypialni', 2, 600, 'szt', 14));
    allProducts.push(new Product(allProducts.length, 'komody', 4, 4000, 'szt', 14));

    allProducts.push(new Product(allProducts.length, 'pralka', 1, 1400, 'szt', 15));
    allProducts.push(new Product(allProducts.length, 'tv', 1, 2200, 'szt', 15));
    allProducts.push(new Product(allProducts.length, 'piekarnik', 1, 800, 'szt', 15));
    allProducts.push(new Product(allProducts.length, 'płyta gazowa', 1, 400, 'szt', 15));
    allProducts.push(new Product(allProducts.length, 'okap', 1, 500, 'szt', 15));
    allProducts.push(new Product(allProducts.length, 'lodówka', 1, 1800, 'szt', 15));
    allProducts.push(new Product(allProducts.length, 'kuchenka mikrofalowa', 1, 700, 'szt', 15));

    allFirms.push(new Firm(allFirms.length, 'f0', 7200,2,0));
    allFirms.push(new Firm(allFirms.length, 'f1', 6900,3,0));
    allFirms.push(new Firm(allFirms.length, 'f2', 8700,1,0));
    allFirms.push(new Firm(allFirms.length, 'f3', 12000,2,1));
    allFirms.push(new Firm(allFirms.length, 'f4', 8500,3,1));
    allFirms.push(new Firm(allFirms.length, 'f5', 22000,1,1));
    allFirms.push(new Firm(allFirms.length, 'f6', 7000,2,2));
    allFirms.push(new Firm(allFirms.length, 'f7', 5000,3,2));
    allFirms.push(new Firm(allFirms.length, 'f8', 15000,1,2));
    allFirms.push(new Firm(allFirms.length, 'f9', 11000,2,3));
    allFirms.push(new Firm(allFirms.length, 'f10', 8000,3,3));
    allFirms.push(new Firm(allFirms.length, 'f11', 21000,1,3));
    allFirms.push(new Firm(allFirms.length, 'f12', 16000,2,4));
    allFirms.push(new Firm(allFirms.length, 'f13', 13000,3,4));
    allFirms.push(new Firm(allFirms.length, 'f14', 21000,1,4));
    allFirms.push(new Firm(allFirms.length, 'f15', 2000,2,5));
    allFirms.push(new Firm(allFirms.length, 'f16', 3000,3,5));
    allFirms.push(new Firm(allFirms.length, 'f17', 5600,1,5));
    allFirms.push(new Firm(allFirms.length, 'f18', 10000,2,6)); //elektr
    allFirms.push(new Firm(allFirms.length, 'f19', 8000,3,6));
    allFirms.push(new Firm(allFirms.length, 'f20', 15000,1,6));
    allFirms.push(new Firm(allFirms.length, 'f21', 4800,2,7)); //wodkan
    allFirms.push(new Firm(allFirms.length, 'f22', 3900,3,7));
    allFirms.push(new Firm(allFirms.length, 'f23', 7000,1,7));
    allFirms.push(new Firm(allFirms.length, 'f24', 15000,2,8)); //inst co
    allFirms.push(new Firm(allFirms.length, 'f25', 12000,3,8));
    allFirms.push(new Firm(allFirms.length, 'f26', 20000,1,8));
    allFirms.push(new Firm(allFirms.length, 'f27', 24000,2,9));
    allFirms.push(new Firm(allFirms.length, 'f28', 18000,3,9));
    allFirms.push(new Firm(allFirms.length, 'f29', 34000,1,9));//tynki
    allFirms.push(new Firm(allFirms.length, 'f30', 5000,2,10));  //posadzki
    allFirms.push(new Firm(allFirms.length, 'f31', 3800,3,10));
    allFirms.push(new Firm(allFirms.length, 'f32', 7500,1,10));
    allFirms.push(new Firm(allFirms.length, 'f33', 4000,2,11)); //stolarka wew
    allFirms.push(new Firm(allFirms.length, 'f34', 3000,3,11));
    allFirms.push(new Firm(allFirms.length, 'f35', 5000,1,11));
    allFirms.push(new Firm(allFirms.length, 'f36',7000,2,12)); //łazienka
    allFirms.push(new Firm(allFirms.length, 'f37', 5000,3,12));
    allFirms.push(new Firm(allFirms.length, 'f38', 10000,1,12));
    allFirms.push(new Firm(allFirms.length, 'f39', 9000,2,13)); //roboty zew
    allFirms.push(new Firm(allFirms.length, 'f40', 7500,3,13));
    allFirms.push(new Firm(allFirms.length, 'f41', 11000,1,13));

    return {
      getProducts: function(){
        return allProducts;
      },
      setProducts: function(coll){
        allProducts = coll;
      },
      getFirms: function(){
        return allFirms;
      },
      setFirms: function(coll){
        allFirms = coll;
      },
      getStages: function(){
        return allStages;
      },
      setStages: function(coll){
        allStages = coll;
      }
    };
  }

})();
