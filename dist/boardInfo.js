//https://qler.pl/pewna-kobieta-w-taki-oryginalny-sposob-zakomunikowala-swojemu-mezowi-ze-jest-w-ciazy/
function shuffle(arra1) {
  var ctr = arra1.length, temp, index;

// While there are elements in the array
  while (ctr > 0) {
// Pick a random index
    index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
    ctr--;
// And swap the last element with it
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}

function Product(code, name, countMax, price, unit, stage){
  this.code = code;
  this.name = name;
  this.count = countMax;
  this.price = price;
  this.counts = [];
  this.prices = [];
  this.unit = unit;
  this.stage = stage;

    for(var i = 0; i<4; i++){
      this.counts[i] = this.count;
      this.prices[i] = Math.floor((Math.random() * (this.price*1.05)) + (this.price*0.95));
    }
    for(var i = 4; i<7; i++){
      this.counts[i] = Math.ceil(this.count/2);

      this.prices[i] = Math.floor((Math.random() * (this.price*1.05)) + (this.price*0.95))/2;
    }
    for(var i = 7; i<14; i++){
      this.counts[i] = 0;
      this.prices[i] = Math.floor((Math.random() * (this.price*1.05)) + (this.price*0.95));
    }
    this.counts = shuffle(this.counts);


  this.sell = function(size){
    if(this.count < size) return -1;
    this.count = this.count - size;
    return 0;
  }

  this.supply = function(size){
    this.count = this.count + size;
  }

}
function Shop(id, name, logo, products){
  var sh = this;
  sh.id = id;
  sh.name = name;
  sh.logo = logo;
  sh.products = [];

  products.forEach(function(product){
    var prod = {
      code: product.code,
      name: product.name,
      unit: product.unit,
      stage: product.stage,
      count: product.counts[id],
      price: Math.floor(product.prices[id]/product.counts[id])
    };

    sh.products.push(prod);
  });

}
function Architect(id, name, time, price){
  this.id = id;
  this.name = name;
  this.time = time;
  this.price = price;
}
function Office(id){
  this.id = id;
  this.plots = [];
}
function Question(id, text, answers, goodAnswer, field){
  this.id = id;
  this.text = text;
  this.answers = answers;
  this.goodAnswer = goodAnswer;
  this.field = field;
}
function Mandate(id, text, price){
  this.id = id;
  this.text = text;
  this.price = price;
}
function Plot(id, distance, price){
  this.id = id;
  this.distance = distance;
  this.price = price;
  this.available = true;

  if(this.distance < 11){
    this.cost = 100;
  }else if(this.distance < 21){
    this.cost = 200;
  }else if(this.distance < 31){
    this.cost = 300;
  }else if(this.distance < 46){
    this.cost = 500;
  }else if(this.distance <61){
    this.cost = 800;
  } else{
    this.cost = 1000;
  }
}
function Firm(id, name, price, time, stage){
  this.id = id;
  this.name = name;
  this.time = time;
  this.price = price;
  this.stage = stage;
}
module.exports = {
  allShops : [],
  allProducts : [],
  allQuestions : [],
  allMandates : [],
  allPlots : [],
  allOffices : [],
  allArchitects : [],
  allStages: [],
  allFirms: [],
  board : [], // {type: s, q, m, o, a, f, index: , field: {}}
  start : {
    rewards: [4000,4700,5400,6000],
    costs: [100, 200, 300, 500, 800, 1000], // 1-10, 11-20, 21-30, 31-45, 46-60, 61-100 // po zakupie dzialki
    professions:['programista','weterynarz', 'lekarz', 'prawnik']
  },
  initGame: function(){
    this.allStages = ['fundamenty','ściany','strop','dach','ocieplenie','stolarka-zewnetrzna','instalacja-elektryczna',
      'instalacja-wod-kan','instalacja c.o.','tynki i gips','posadzki','stolarka-wewnętrzna','łazienka','roboty-zewnątrz',
      'meble','sprzęt rtv i agd'];

    this.allFirms.push(new Firm(this.allFirms.length, 'f0', 7200,2,0));
    this.allFirms.push(new Firm(this.allFirms.length, 'f1', 6900,3,0));
    this.allFirms.push(new Firm(this.allFirms.length, 'f2', 8700,1,0));
    this.allFirms.push(new Firm(this.allFirms.length, 'f3', 12000,2,1));
    this.allFirms.push(new Firm(this.allFirms.length, 'f4', 8500,3,1));
    this.allFirms.push(new Firm(this.allFirms.length, 'f5', 22000,1,1));
    this.allFirms.push(new Firm(this.allFirms.length, 'f6', 7000,2,2));
    this.allFirms.push(new Firm(this.allFirms.length, 'f7', 5000,3,2));
    this.allFirms.push(new Firm(this.allFirms.length, 'f8', 15000,1,2));
    this.allFirms.push(new Firm(this.allFirms.length, 'f9', 11000,2,3));
    this.allFirms.push(new Firm(this.allFirms.length, 'f10', 8000,3,3));
    this.allFirms.push(new Firm(this.allFirms.length, 'f11', 21000,1,3));
    this.allFirms.push(new Firm(this.allFirms.length, 'f12', 16000,2,4));
    this.allFirms.push(new Firm(this.allFirms.length, 'f13', 13000,3,4));
    this.allFirms.push(new Firm(this.allFirms.length, 'f14', 21000,1,4));
    this.allFirms.push(new Firm(this.allFirms.length, 'f15', 2000,2,5));
    this.allFirms.push(new Firm(this.allFirms.length, 'f16', 3000,3,5));
    this.allFirms.push(new Firm(this.allFirms.length, 'f17', 5600,1,5));
    this.allFirms.push(new Firm(this.allFirms.length, 'f18', 10000,2,6)); //elektr
    this.allFirms.push(new Firm(this.allFirms.length, 'f19', 8000,3,6));
    this.allFirms.push(new Firm(this.allFirms.length, 'f20', 15000,1,6));
    this.allFirms.push(new Firm(this.allFirms.length, 'f21', 4800,2,7)); //wodkan
    this.allFirms.push(new Firm(this.allFirms.length, 'f22', 3900,3,7));
    this.allFirms.push(new Firm(this.allFirms.length, 'f23', 7000,1,7));
    this.allFirms.push(new Firm(this.allFirms.length, 'f24', 15000,2,8)); //inst co
    this.allFirms.push(new Firm(this.allFirms.length, 'f25', 12000,3,8));
    this.allFirms.push(new Firm(this.allFirms.length, 'f26', 20000,1,8));
    this.allFirms.push(new Firm(this.allFirms.length, 'f27', 24000,2,9));
    this.allFirms.push(new Firm(this.allFirms.length, 'f28', 18000,3,9));
    this.allFirms.push(new Firm(this.allFirms.length, 'f29', 34000,1,9));//tynki
    this.allFirms.push(new Firm(this.allFirms.length, 'f30', 5000,2,10));  //posadzki
    this.allFirms.push(new Firm(this.allFirms.length, 'f31', 3800,3,10));
    this.allFirms.push(new Firm(this.allFirms.length, 'f32', 7500,1,10));
    this.allFirms.push(new Firm(this.allFirms.length, 'f33', 4000,2,11)); //stolarka wew
    this.allFirms.push(new Firm(this.allFirms.length, 'f34', 3000,3,11));
    this.allFirms.push(new Firm(this.allFirms.length, 'f35', 5000,1,11));
    this.allFirms.push(new Firm(this.allFirms.length, 'f36',7000,2,12)); //łazienka
    this.allFirms.push(new Firm(this.allFirms.length, 'f37', 5000,3,12));
    this.allFirms.push(new Firm(this.allFirms.length, 'f38', 10000,1,12));
    this.allFirms.push(new Firm(this.allFirms.length, 'f39', 9000,2,13)); //roboty zew
    this.allFirms.push(new Firm(this.allFirms.length, 'f40', 7500,3,13));
    this.allFirms.push(new Firm(this.allFirms.length, 'f41', 11000,1,13));

    this.allProducts.push(new Product(this.allProducts.length, 'beton gotowy', 20, 6000, 'm3', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'bloczki betonowe', 1000, 2500, 'szt', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'cement', 8, 250, 'worki', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'żwir', 5, 160, 'tony', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'piasek', 4, 100, 'tony', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'zbrojenie', 200, 1400, 'mb', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'rury kanalizacyjne', 150, 600, 'szt', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'kolanka kanalizacyjne', 100, 500, 'szt', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'folia izolacyjna', 250, 700, 'm2', 0));
    this.allProducts.push(new Product(this.allProducts.length, 'emulsja izolacyjna', 60, 200, 'l', 0));

    this.allProducts.push(new Product(this.allProducts.length, 'pustaki', 120, 10400, 'm2', 1));
    this.allProducts.push(new Product(this.allProducts.length, 'cement', 2.4, 900, 'tony', 1));
    this.allProducts.push(new Product(this.allProducts.length, 'piasek', 5, 150, 'tony', 1));
    this.allProducts.push(new Product(this.allProducts.length, 'zaprawa', 7, 150, 'worki', 1));
    this.allProducts.push(new Product(this.allProducts.length, 'cegły', 700, 850, 'szt', 1));
    this.allProducts.push(new Product(this.allProducts.length, 'folia izolacyjna', 100, 250, 'm2', 1));

    this.allProducts.push(new Product(this.allProducts.length, 'belka stropowa', 140, 1700, 'mb', 2));
    this.allProducts.push(new Product(this.allProducts.length, 'szalunek budowlany', 2, 250, 'szt', 2));
    this.allProducts.push(new Product(this.allProducts.length, 'beton', 12, 3500, 'm3', 2));
    this.allProducts.push(new Product(this.allProducts.length, 'pustaki', 200, 500, 'szt', 2));
    this.allProducts.push(new Product(this.allProducts.length, 'zbrojenie', 150, 1000, 'mb', 2));
    this.allProducts.push(new Product(this.allProducts.length, 'cement', 1.5, 700, 'tony', 2));

    this.allProducts.push(new Product(this.allProducts.length, 'drewno', 14, 9200, 'm3', 3));
    this.allProducts.push(new Product(this.allProducts.length, 'dachówka', 140, 9000, 'm2', 3));
    this.allProducts.push(new Product(this.allProducts.length, 'komin', 1, 2000, 'szt', 3));
    this.allProducts.push(new Product(this.allProducts.length, 'okno dachowe', 4, 4000, 'm3', 3));
    this.allProducts.push(new Product(this.allProducts.length, 'podbitka', 140, 2400, 'm2', 3));
    this.allProducts.push(new Product(this.allProducts.length, 'rynny', 50, 2500, 'mb', 3));

    this.allProducts.push(new Product(this.allProducts.length, 'styropian', 120, 3000, 'm2', 4));
    this.allProducts.push(new Product(this.allProducts.length, 'klej do styropianu', 5, 900, 'worki', 4));
    this.allProducts.push(new Product(this.allProducts.length, 'zaprawa do styropianu', 33, 900, 'worki', 4));
    this.allProducts.push(new Product(this.allProducts.length, 'siatka', 220, 500, 'm2', 4));
    this.allProducts.push(new Product(this.allProducts.length, 'wełna do ocieplenia poddasza', 400, 3800, 'm2', 4));

    this.allProducts.push(new Product(this.allProducts.length, 'okna', 10, 8000, 'szt', 5));
    this.allProducts.push(new Product(this.allProducts.length, 'drzwi wejściowe', 1, 4000, 'szt', 5));
    this.allProducts.push(new Product(this.allProducts.length, 'parapety wewnętrzne', 10, 500, 'szt', 5));
    this.allProducts.push(new Product(this.allProducts.length, 'parapety zewnętrzne', 10, 2000, 'szt', 5));

    this.allProducts.push(new Product(this.allProducts.length, 'kable', 300, 1500, 'mb', 6));
    this.allProducts.push(new Product(this.allProducts.length, 'puszki', 20, 200, 'szt', 6));
    this.allProducts.push(new Product(this.allProducts.length, 'gniazdka', 40, 400, 'szt', 6));
    this.allProducts.push(new Product(this.allProducts.length, 'włączniki', 30, 400, 'szt', 6));
    this.allProducts.push(new Product(this.allProducts.length, 'halogeny', 60, 1800, 'szt', 6));

    this.allProducts.push(new Product(this.allProducts.length, 'rury', 23, 350, 'mb', 7));
    this.allProducts.push(new Product(this.allProducts.length, 'kolanka do rur', 10, 150, 'szt', 7));
    this.allProducts.push(new Product(this.allProducts.length, 'otulina', 1, 20, 'szt', 7));

    this.allProducts.push(new Product(this.allProducts.length, 'rury c.o. pex', 400, 600, 'mb', 8));
    this.allProducts.push(new Product(this.allProducts.length, 'złączki', 20, 300, 'szt', 8));
    this.allProducts.push(new Product(this.allProducts.length, 'rury miedziane', 15, 350, 'mb', 8));
    this.allProducts.push(new Product(this.allProducts.length, 'wkład kominkowy', 1, 7000, 'szt', 8));
    this.allProducts.push(new Product(this.allProducts.length, 'grzejniki', 10, 5000, 'szt', 8));
    this.allProducts.push(new Product(this.allProducts.length, 'piec', 1, 4000, 'szt', 8));

    this.allProducts.push(new Product(this.allProducts.length, 'płyty gk', 300, 2000, 'm2', 9));
    this.allProducts.push(new Product(this.allProducts.length, 'profile', 200, 1500, 'szt', 9));
    this.allProducts.push(new Product(this.allProducts.length, 'wkręty', 5, 100, 'kg', 9));
    this.allProducts.push(new Product(this.allProducts.length, 'klej', 8, 500, 'worki', 9));
    this.allProducts.push(new Product(this.allProducts.length, 'gips budowlany', 150, 1500, 'kg', 9));
    this.allProducts.push(new Product(this.allProducts.length, 'farba do ścian i sufitów', 150, 1500, 'l', 9));

    this.allProducts.push(new Product(this.allProducts.length, 'styropian', 120, 800, 'm2', 10));
    this.allProducts.push(new Product(this.allProducts.length, 'cement', 6, 2500, 't', 10));
    this.allProducts.push(new Product(this.allProducts.length, 'folia', 120, 300, 'm2', 10));
    this.allProducts.push(new Product(this.allProducts.length, 'płytki podłogowe', 70, 3500, 'm2', 10));
    this.allProducts.push(new Product(this.allProducts.length, 'panele podłogowe', 40, 1200, 'm2', 10));

    this.allProducts.push(new Product(this.allProducts.length, 'schody', 1, 10000, 'szt', 11));
    this.allProducts.push(new Product(this.allProducts.length, 'drzwi', 10, 15000, 'szt', 11));

    this.allProducts.push(new Product(this.allProducts.length, 'kompakt wc', 2, 2500, 'szt', 12));
    this.allProducts.push(new Product(this.allProducts.length, 'płytki ścienne łazienkowe', 85, 4200, 'm2', 12));
    this.allProducts.push(new Product(this.allProducts.length, 'kabina prysznicowa', 1, 1200, 'szt', 12));
    this.allProducts.push(new Product(this.allProducts.length, 'wanna', 1, 800, 'szt', 12));
    this.allProducts.push(new Product(this.allProducts.length, 'szafka z umywalką', 2, 2000, 'szt', 12));
    this.allProducts.push(new Product(this.allProducts.length, 'lustro', 2, 300, 'szt', 12));

    this.allProducts.push(new Product(this.allProducts.length, 'tynk zewnętrzny', 550, 800, 'kg', 13));
    this.allProducts.push(new Product(this.allProducts.length, 'kostka brukowa', 150, 15000, 'm2', 13));
    this.allProducts.push(new Product(this.allProducts.length, 'rośliny ogrodowe', 10, 2000, 'szt', 13));
    this.allProducts.push(new Product(this.allProducts.length, 'ogrodzenie', 200, 10000, 'mb', 13));

    this.allProducts.push(new Product(this.allProducts.length, 'zestaw mebli kuchennych', 1, 8000, 'szt', 14));
    this.allProducts.push(new Product(this.allProducts.length, 'łóżko do sypialni', 1, 1500, 'szt', 14));
    this.allProducts.push(new Product(this.allProducts.length, 'kanapa do salonu', 1, 5000, 'szt', 14));
    this.allProducts.push(new Product(this.allProducts.length, 'stolik do salonu', 1, 800, 'szt', 14));
    this.allProducts.push(new Product(this.allProducts.length, 'stół z krzesłami do jadalni', 1, 3000, 'szt', 14));
    this.allProducts.push(new Product(this.allProducts.length, 'stoliki nocne do sypialni', 2, 600, 'szt', 14));
    this.allProducts.push(new Product(this.allProducts.length, 'komody', 4, 4000, 'szt', 14));

    this.allProducts.push(new Product(this.allProducts.length, 'pralka', 1, 1400, 'szt', 15));
    this.allProducts.push(new Product(this.allProducts.length, 'tv', 1, 2200, 'szt', 15));
    this.allProducts.push(new Product(this.allProducts.length, 'piekarnik', 1, 800, 'szt', 15));
    this.allProducts.push(new Product(this.allProducts.length, 'płyta gazowa', 1, 400, 'szt', 15));
    this.allProducts.push(new Product(this.allProducts.length, 'okap', 1, 500, 'szt', 15));
    this.allProducts.push(new Product(this.allProducts.length, 'lodówka', 1, 1800, 'szt', 15));
    this.allProducts.push(new Product(this.allProducts.length, 'kuchenka mikrofalowa', 1, 700, 'szt', 15));


    this.allMandates.push(new Mandate(this.allMandates.length, "Nie zapiąłeś pasów. Otrzymujesz mandat 200 złotych.", 200));
    this.allMandates.push(new Mandate(this.allMandates.length, "Musisz zapłacić podatek o wartości 500 zł.", 500));
    this.allMandates.push(new Mandate(this.allMandates.length, "Przekroczyłeś prędkość o 50 km/h. Otrzymujesz mandat 400 złotych.", 400));
    this.allMandates.push(new Mandate(this.allMandates.length, "Popsuł Ci się samochód. Musisz zapłacić za naprawę 1000 zł.", 1000));
    this.allMandates.push(new Mandate(this.allMandates.length, "Zachorowałeś, więc udajesz się do lekarza na wizytę i wykupujesz lekarstwa, co w sumie wynosi 300zł.", 300));
    this.allMandates.push(new Mandate(this.allMandates.length, "Źle zaparkowałeś. Otrzymujesz mandat 100 złotych.", 100));
    this.allMandates.push(new Mandate(this.allMandates.length, "Mija termin płatności za energię elektryczną. Płacisz 400 złotych.", 400));
    this.allMandates.push(new Mandate(this.allMandates.length, "Mija termin płatności za kanalizację. Płacisz 200 złotych.", 200));
    this.allMandates.push(new Mandate(this.allMandates.length, "Mija termin płatności za internet, telewizję, telefon. Płacisz 300 złotych.", 300));


    this.allPlots.push(new Plot(this.allPlots.length, 2, 270000));
    this.allPlots.push(new Plot(this.allPlots.length, 8, 300000));
    this.allPlots.push(new Plot(this.allPlots.length, 12, 210000));
    this.allPlots.push(new Plot(this.allPlots.length, 19, 180000));
    this.allPlots.push(new Plot(this.allPlots.length, 23, 120000));
    this.allPlots.push(new Plot(this.allPlots.length, 28, 100000));
    this.allPlots.push(new Plot(this.allPlots.length, 34, 90000));
    this.allPlots.push(new Plot(this.allPlots.length, 42, 80000));
    this.allPlots.push(new Plot(this.allPlots.length, 50, 60000));
    this.allPlots.push(new Plot(this.allPlots.length, 58, 50000));
    this.allPlots.push(new Plot(this.allPlots.length, 70, 40000));
    this.allPlots.push(new Plot(this.allPlots.length, 80, 30000));


    for (var i = 0; i < 4; i++){
      this.allOffices.push(new Office(i, 'o'+i));
    }
    this.allArchitects.push(new Architect(this.allArchitects.length, 'a0',1, 3000));
    this.allArchitects.push(new Architect(this.allArchitects.length, 'a1',1, 2500));
    this.allArchitects.push(new Architect(this.allArchitects.length, 'a2',2, 2000));
    this.allArchitects.push(new Architect(this.allArchitects.length, 'a3',2, 1500));

    for (var i = 0; i < 14; i++){
      this.allShops.push(new Shop(i, 's'+i, '', this.allProducts));
    }

    this.allQuestions.push(new Question(this.allQuestions.length, 'Chemiczne środki ochrony roślin przeznaczone do walki z chwastami to: ', ['nematocydy', 'fitoncydy', 'herbicydy', 'insektycydy'], 2, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Dzieci mężczyzny o grupie krwi AB i kobiety o grupie A mogą mieć: ', ['grupę AB lub A','grupę A,B,AB','tylko grupę AB','grupę O,A lub B'], 1, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Podobieństwo budowy oka głowonoga i ryby jest przykładem : ', ['konwergencji','radiacji','sukcesji','specjacji'], 0, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Pierwszym produktem fazy ciemnościowej fotosyntezy roslin C3 jest: ', ['skrobia','fruktoza','kwas 3 fosfoglicerynowy','ryboza'], 2, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Informacja genetyczna wirusa HIV zawarta jest w: ', ['2 cząsteczkach jednoniciowego RNA','2 cząsteczkach dwuniciowego RNA','cząśteczce dwuniciowego DNA','2 cząsteczkach dwuniciowego RNA'], 0, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Ciało jamochłonów zbudowane jest z: ', ['tylko ektodermy,entodermy i mezoglei','ektoderny,entodermy i parenchymy','ektodermy i entodermy','ektodermy'], 0, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Aktyna wchodzi w skład: ', ['mikrotubul','mikrofilamentow','miceli','mikrofibryli'], 1, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Odporność nabyta bierna sztuczna powstaje poprzez: ', ['kontakt z patogenem','szczepienie ochronne','transfuzje osocza','podanie surowicy z przeciwcialami'], 3, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Stek u prymitywnych ssakow stekowców jest wspólnym ujściem układow: ', ['rozrodczego i wydalniczego','pokarmowego i rozrodczego','pokarmowego i wydalniczego','pokarmowego,rozrodczego,wydalniczego',], 3, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Głównym zadaniem oddychania komórkowego jest: ', ['łączenia węgla z wodorem','łączenie tlenu z wodorem','synteza ATp','wytworzenie kwasu pirogronowego'], 2, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Nasiona ze skrzydełkami rozsiewają się na drodze: ', ['autochorii','zoochorii','anizogamii','anemochorii'], 3, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Zwielokrotnienie całego kompletu chromosomów nazywa się: ', ['poliploidyzacją','politenizacją','polimeryzacją','duplikacją'], 0, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Kijanki żab używają jako narządów oddechowych: ', ['skrzeli wewnęrznych i zewn.','skrzeli wewnętrznych','skrzelotchawek','płuc i skóry',], 0, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Rybosomy są miejscem syntezy: ', ['białka','DNA','kwasów rybonukleinowych','węglowodanów'], 0, 'biolog'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Implantacja ludzkiego jaja plodowego w macicy nastepuje w stadium rozwojowym zwanym: ', ['gastrulą','morulą','blastocystą','zygotą'], 2, 'biolog'));

    this.allQuestions.push(new Question(this.allQuestions.length, 'Który ze zbiorów jest nieskończony?', ['Zbiór pusty','Zbiór liczb naturalnych mniejszych od 4', 'Zbiór punktów przecięcia stu prostych',	'Zbiór wszystkich punktów prostej'], 3, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, '(a;b> to przedział:', ['obustronnie otwarty','obustronnie domknięty','prawostronnie domknięty','prawostronnie otwarty'], 2, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Argument funkcji:', ['nie tworzy dziedziny funkcji', 'tworzy zbiór wartości funkcji', 'jest zmienną niezależną','musi należeć do zbioru liczb naturalnych'], 2, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Funkcja rosnąca:', ['większym argumentom przyporządkowuje większe wartości', 'dla każdego argumentu przyjmuje taką samą wartość', 'większym argumentom przyporządkowuje mniejsze wartości', 'przyporządkowuje argumentom liczby dodatnie'], 0, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Współczynnikiem kierunkowym funkcji liniowej, y= ax + b jest:', ['a','b', 'x',	'y'], 0, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Miejsce zerowe to:', ['wartość, którą funkcja przyjmuje dla argumentu 0', 'argument, dla którego funkcja przyjmuje wartość 0', 'punkt przecięcia wykresu funkcji z osią OX','punkt przecięcia wykresu funkcji z osią OY'], 1, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Zdarzenie elementarne to:', ['wszystkie możliwe wyniki doświadczenia', 'to samo co zdarzenie niemożliwe', 'każdy możliwy wynik doświadczenia losowego', 'to samo co zdarzenie pewne'], 2, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Prawdopodobieństwo jest liczbą należącą do przedziału:', ['<0;1>','<0;2>','<-1;1>','(-1;1)'], 0, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Ramiona paraboli są na pewno skierowane w górę, gdy:', ['współczynnik a > 0', 'współczynnik a < 0', 'równanie funkcji kwadratowej ma postać y=ax2', 'równanie funkcji kwadratowej ma postać y=ax2 + b'], 3, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Aby równanie kwadratowe nie miało rozwiązań delta musi być:', ['większa od zera', 'mniejsza od zera','równa zero', 'różna od zera'], 1, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Ile pierwiastków może mieć maksymalnie równanie kwadratowe:', ['1', '2', '3', '4'], 1, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Wykresem funkcji y=sin α jest:', ['sinusoida', 'cosinusoida',	'parabola', 'prosta'], 0, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Radian to kąt, o jakiej mierze łukowej?', ['0','1', '2',	'∏'], 1, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Jak na pewno można nazwać ciąg an jeżeli ma co najmniej trzy wyrazy i każdy jego wyraz z wyjątkiem pierwszego powstaje przez dodanie do poprzedniego wyrazu pewnej stałej liczby r?', ['Ciągiem geometrycznym',	'Ciągiem arytmetycznym', 'Ciągiem skończonym', 'Ciągiem nieskończonym'], 1, 'matematyk'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Jak nazywa się logarytm przy podstawie e?', ['Logarytm dziesiętny','Logarytm zwyczajny','Logarytm pi', 'Logarytm naturalny'], 3, 'matematyk'));

    this.allQuestions.push(new Question(this.allQuestions.length, 'Jakie miasto obejmuje swoimi granicami ciesninê Bosfor?', ['Kair', 'Odessa', 'Madras', 'Istambul'], 3, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Wyspy Seszele znajduja się na oceanie?', ['Indyjskim', 'Lodowatym', 'Spokojnym', 'Atlantyckim'], 0, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Jak obecnie nazywa siê wyspa, niegdyś zwana Cejlonem?', ['Sri lanka', 'Tahiti', 'Wyspa Wielkanocna', 'Kuba'], 0, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Gdzie znajduja się Góry Kaledońskie?', ['W Szkocji', 'W Szwecji', 'W Szwajcarii', 'na Szetlandach'], 0, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Jakie miasto jest stolica Australii?', ['Sydney', 'Canberra', 'Melbourne', 'Port Darwin'], 1, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Które miasto ma najwięcej mieszkańców na świecie?', ['Pekin', 'Meksyk', 'Nowy Jork', 'Tokio'], 1, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Która rzeka ma największa deltę na świecie?', ['Amazonka', 'Ganges', 'Nil', 'Dunaj'], 1, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Gdzie znajduje się most o nazwie Golden Gate?', ['w Wenecji', 'w Londynie', 'W Nowym Jorku', 'w San Francisco'], 3, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Toskania jest kraina znajdująca się...?', ['w Portugalii', 'W Grecji', 'We Wloszech', 'W Hiszpanii'], 2, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Wyspy Kanaryjskie należą do...?', ['Portugalii', 'Maroka', 'Francji', 'Hiszpanii'], 3, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Grenlandia należy do...?', ['Kanady', 'Stanów Zjednoczonych', 'Danii', 'Rosji'], 2, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Góry Atlas znajdują się w...?', ['Ameryce Południowej', 'Australii', 'Azji', 'Afryce'], 3, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Jak nazywają się "sople" wiszące z sufitu w jaskiniach?', ['Stalagmity', 'Stalaktyty', 'Stalagnaty', 'Stalagi'], 1, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Jaka nazwę nosi głaz narzutowy?', ['Eraton', 'Eratyk', 'Kamlot', 'Stalaktyt'], 1, 'geograf'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Nazwa Wysp Kanaryjskich pochodzi od...?', ['kanarków', 'arian', 'psów', 'aryjczyków'], 2, 'geograf'));

    this.allQuestions.push(new Question(this.allQuestions.length, 'Elektrony walencyjne to:', ['elektrony pierwszej powłoki', 'elektrony ostatniej powłoki', 'wszystkie elektrony', 'elektrony dowolnej powłoki'], 1, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Izotopy różnią się?', ['liczbą powłok', 'liczbą protonów w jądrze', 'liczbą neutronów w jądrze', 'liczbą elektronów na powłokach'], 2, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Masa atomowa to:', ['masa atomu w gramach', 'suma protonów i neutronów w jądrze', 'suma wszystkich cząstek elementarnych', 'liczba protonów w jądrze'], 1, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Liczba atomowa to:', ['masa atomu w gramach', 'suma protonów i neutronów w jądrze', 'suma wszystkich cząstek elementarnych', 'liczba protonów w jądrze'], 3, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Najlżejszy w atomie jest:', ['proton', 'elektron', 'neutron', 'proton, elektron i neutron ważą tyle samo'], 1, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Jon o ładunku ujemnym to:', ['anion', 'elektron', 'neutron', 'kation'], 0, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Cząsteczki elementarne to:', ['elektrony, protony i neutrony', 'protony i neutrony', 'neutrony', 'elektrony'], 0, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Trwałym izotopem wodoru nie jest:', ['prot', 'deuter', 'tryt', 'neuryt'], 3, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Kwas siarkowodorowy można otrzymać:', ['w reakcji syntezy siarki i wodoru', 'przez rozpuszczenie siarkowodoru w wodzie', 'w reakcji tlenku siarki(IV) z wodą', 'w reakcji tlenku siarki(VI) z wodą'], 1, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Wodorotlenki, są zbudowane z:', ['prot', 'deuter', 'tryt', 'neuryt'], 3, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Estryfikacja to rekacja alkoholu z:', ['estrem', 'kwasem organicznym', 'zasadą', 'chlorowodorem'], 1, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Między cząsteczkami alkoholi powstają wiązania:', ['jonowe', 'atomowe', 'spolaryzowane', 'wodorowe'], 3, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Aby otrzymać aldehyd należy utlenić alkohol:', ['Jednowodorotlenowy', 'Wielowodorotlenowy', 'Pierwszorzędowy', 'Drugorzędowy'], 2, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Propanal i propanon to:', ['Homologi', 'Izomery', 'Polimery', 'Odmiany alotropowe'], 1, 'chemik'));
    this.allQuestions.push(new Question(this.allQuestions.length, 'Alkohole wielowodorotlenowe można odróżnić od jednowodorotlenowych za pomocą:', ['Wodorotlenku sodu', 'Próby Tollensa', 'Próby Trommera', 'Wodorotlenku miedzi(II)'], 3, 'chemik'));


    this.allPlots = shuffle(this.allPlots);

    var s = 0;
    var e = 3;
    for (var i = 0; i < 4; i++){

      this.allOffices[i].plots = this.allPlots.slice(s, e);
      s = s + 3;
      e = e + 3;
    }
    this.board = [
      {type: 'first', index: 0}, //0
      {type: 'o', index: 0}, //1
      {type: 's', index: 0}, //2
      {type: 'q', index: 0}, //3
      {type: 's', index: 1}, //4
      {type: 'm', index: 0}, //5
      {type: 's', index: 2}, //6
      {type: 'q', index: 1}, //7
      {type: 'a', index: 0}, //8
      {type: 'q', index: 2}, //9
      {type: 'o', index: 1}, //10

      {type: 's', index: 3}, //11
      {type: 'q', index: 3}, //12
      {type: 's', index: 4}, //13
      {type: 'q', index: 4}, //14
      {type: 's', index: 5}, //15
      {type: 'm', index: 1}, //16
      {type: 's', index: 6}, //17
      {type: 'q', index: 5}, //18
      {type: 'a', index: 1}, //19
      {type: 'o', index: 2}, //20

      {type: 'q', index: 6}, //21
      {type: 'm', index: 2}, //22
      {type: 's', index: 7}, //23
      {type: 'q', index: 7}, //24
      {type: 's', index: 8}, //25
      {type: 'q', index: 8}, //26
      {type: 's', index: 9}, //27
      {type: 'a', index: 2}, //28
      {type: 's', index: 10}, //29
      {type: 'o', index: 3}, //30

      {type: 'q', index: 9}, //31
      {type: 's', index: 11}, //32
      {type: 'm', index: 3}, //33
      {type: 'q', index: 10}, //34
      {type: 's', index: 12}, //35
      {type: 'm', index: 4}, //36
      {type: 's', index: 13}, //37
      {type: 'a', index: 3}, //38
      {type: 'q', index: 11} //39
    ];

    this.checkField = function (field, table) {
      switch(field.type){
        case 'first':
          return this.start;

        case 's':
          return table.shops[field.index];

        case 'q':
          table.questionCounter++;
          if(table.questionCounter >= 60){
            table.questions = shuffle(table.questions)
            table.questionCounter = 0;
          }
          return table.questions[table.questionCounter];

        case 'm':
          table.mandateCounter++;
          if(table.mandateCounter >= 9){
            table.mandates = shuffle(table.mandates)
            table.mandateCounter = 0;
          }
          return table.mandates[table.mandateCounter];

        case 'o':
          return table.offices[field.index];

        case 'a':
          return table.architects[field.index];

      }

    }
}
}

