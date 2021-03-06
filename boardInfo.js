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
      this.counts[i] = this.count/2;
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
  this.id = id;
  this.name = name;
  this.logo = logo;
  this.products = products;

  this.products.forEach(function(product){
    product.count = product.counts[this.id];
    product.price = product.prices[this.id];
  });

}
function Architect(id, name){
  this.id = id;
  this.name = name;
  this.time = 0;
  this.price = 0;
}
function Office(id){ //kazde biuro po 5 dzialek
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
  board : [], // {type: s, q, m, o, a, f, index: , field: {}}
  start : {
    rewards: [4000,4700,5400,6000],
    costs: [100, 200, 300, 500, 800, 1000], // 1-10, 11-20, 21-30, 31-45, 46-60, 61-100 // po zakupie dzialki
    professions:['programista','weterynarz', 'lekarz', 'prawnik']
  },
  initGame: function(){
    this.allStages = ['fundamenty','??ciany','strop','dach','ocieplenie','stolarka-zewnetrzna','instalacja-elektryczna',
      'instalacja-wod-kan','instalacja c.o.','tynki i gips','posadzki','stolarka-wewn??trzna','??azienka','roboty-zewn??trz',
      'meble','sprz??t rtv i agd'];

    this.allProducts = [
      new Product(this.allProducts.length, 'beton gotowy', 20, 6000, 'm3', 0),
      new Product(this.allProducts.length, 'bloczki betonowe', 1000, 2500, 'szt', 0),
      new Product(this.allProducts.length, 'cement', 8, 250, 'worki', 0),
      new Product(this.allProducts.length, '??wir', 5, 160, 'tony', 0),
      new Product(this.allProducts.length, 'piasek', 4, 100, 'tony', 0),
      new Product(this.allProducts.length, 'zbrojenie', 200, 1400, 'mb', 0),
      new Product(this.allProducts.length, 'rury kanalizacyjne', 150, 600, 'szt', 0),
      new Product(this.allProducts.length, 'kolanka kanalizacyjne', 100, 500, 'szt', 0),
      new Product(this.allProducts.length, 'folia izolacyjna', 250, 700, 'm2', 0),
      new Product(this.allProducts.length, 'emulsja izolacyjna', 60, 200, 'l', 0),

      new Product(this.allProducts.length, 'pustaki', 120, 10400, 'm2', 1),
      new Product(this.allProducts.length, 'cement', 2.4, 900, 'tony', 1),
      new Product(this.allProducts.length, 'piasek', 5, 150, 'tony', 1),
      new Product(this.allProducts.length, 'zaprawa', 7, 150, 'worki', 1),
      new Product(this.allProducts.length, 'ceg??y', 700, 850, 'szt', 1),
      new Product(this.allProducts.length, 'folia izolacyjna', 100, 250, 'm2', 1),

      new Product(this.allProducts.length, 'belka stropowa', 140, 1700, 'mb', 2),
      new Product(this.allProducts.length, 'szalunek budowlany', 2, 250, 'szt', 2),
      new Product(this.allProducts.length, 'beton', 12, 3500, 'm3', 2),
      new Product(this.allProducts.length, 'pustaki', 200, 500, 'szt', 2),
      new Product(this.allProducts.length, 'zbrojenie', 150, 1000, 'mb', 2),
      new Product(this.allProducts.length, 'cement', 1.5, 700, 'tony', 2),

      new Product(this.allProducts.length, 'drewno', 14, 9200, 'm3', 3),
      new Product(this.allProducts.length, 'dach??wka', 140, 9000, 'm2', 3),
      new Product(this.allProducts.length, 'komin', 1, 2000, 'szt', 3),
      new Product(this.allProducts.length, 'okno dachowe', 4, 4000, 'm3', 3),
      new Product(this.allProducts.length, 'podbitka', 140, 2400, 'm2', 3),
      new Product(this.allProducts.length, 'rynny', 50, 2500, 'mb', 3),

      new Product(this.allProducts.length, 'styropian', 120, 3000, 'm2', 4),
      new Product(this.allProducts.length, 'klej do styropianu', 5, 900, 'worki', 4),
      new Product(this.allProducts.length, 'zaprawa do styropianu', 33, 900, 'worki', 4),
      new Product(this.allProducts.length, 'siatka', 220, 500, 'm2', 4),
      new Product(this.allProducts.length, 'we??na do ocieplenia poddasza', 400, 3800, 'm2', 4),

      new Product(this.allProducts.length, 'okna', 10, 8000, 'szt', 5),
      new Product(this.allProducts.length, 'drzwi wej??ciowe', 1, 4000, 'szt', 5),
      new Product(this.allProducts.length, 'parapety wewn??trzne', 10, 500, 'szt', 5),
      new Product(this.allProducts.length, 'parapety zewn??trzne', 10, 2000, 'szt', 5),

      new Product(this.allProducts.length, 'kable', 300, 1500, 'mb', 6),
      new Product(this.allProducts.length, 'puszki', 20, 200, 'szt', 6),
      new Product(this.allProducts.length, 'gniazdka', 40, 400, 'szt', 6),
      new Product(this.allProducts.length, 'w????czniki', 30, 400, 'szt', 6),
      new Product(this.allProducts.length, 'halogeny', 60, 1800, 'szt', 6),

      new Product(this.allProducts.length, 'rury', 23, 350, 'mb', 7),
      new Product(this.allProducts.length, 'kolanka do rur', 10, 150, 'szt', 7),
      new Product(this.allProducts.length, 'otulina', 1, 20, 'szt', 7),

      new Product(this.allProducts.length, 'rury c.o. pex', 400, 600, 'mb', 8),
      new Product(this.allProducts.length, 'z????czki', 20, 300, 'szt', 8),
      new Product(this.allProducts.length, 'rury miedziane', 15, 350, 'mb', 8),
      new Product(this.allProducts.length, 'wk??ad kominkowy', 1, 7000, 'szt', 8),
      new Product(this.allProducts.length, 'grzejniki', 10, 5000, 'szt', 8),
      new Product(this.allProducts.length, 'piec', 1, 4000, 'szt', 8),

      new Product(this.allProducts.length, 'p??yty gk', 300, 2000, 'm2', 9),
      new Product(this.allProducts.length, 'profile', 200, 1500, 'szt', 9),
      new Product(this.allProducts.length, 'wkr??ty', 5, 100, 'kg', 9),
      new Product(this.allProducts.length, 'klej', 8, 500, 'worki', 9),
      new Product(this.allProducts.length, 'gips budowlany', 150, 1500, 'kg', 9),
      new Product(this.allProducts.length, 'farba do ??cian i sufit??w', 150, 1500, 'l', 9),

      new Product(this.allProducts.length, 'styropian', 120, 800, 'm2', 10),
      new Product(this.allProducts.length, 'cement', 6, 2500, 't', 10),
      new Product(this.allProducts.length, 'folia', 120, 300, 'm2', 10),
      new Product(this.allProducts.length, 'p??ytki pod??ogowe', 70, 3500, 'm2', 10),
      new Product(this.allProducts.length, 'panele pod??ogowe', 40, 1200, 'm2', 10),

      new Product(this.allProducts.length, 'schody', 1, 10000, 'szt', 11),
      new Product(this.allProducts.length, 'drzwi', 10, 15000, 'szt', 11),

      new Product(this.allProducts.length, 'kompakt wc', 2, 2500, 'szt', 12),
      new Product(this.allProducts.length, 'p??ytki ??cienne ??azienkowe', 85, 4200, 'm2', 12),
      new Product(this.allProducts.length, 'kabina prysznicowa', 1, 1200, 'szt', 12),
      new Product(this.allProducts.length, 'wanna', 1, 800, 'szt', 12),
      new Product(this.allProducts.length, 'szafka z umywalk??', 2, 2000, 'szt', 12),
      new Product(this.allProducts.length, 'lustro', 2, 300, 'szt', 12),

      new Product(this.allProducts.length, 'tynk zewn??trzny', 550, 800, 'kg', 13),
      new Product(this.allProducts.length, 'kostka brukowa', 150, 15000, 'm2', 13),
      new Product(this.allProducts.length, 'ro??liny ogrodowe', 10, 2000, 'szt', 13),
      new Product(this.allProducts.length, 'ogrodzenie', 200, 10000, 'mb', 13),

      new Product(this.allProducts.length, 'zestaw mebli kuchennych', 1, 8000, 'szt', 14),
      new Product(this.allProducts.length, '??????ko do sypialni', 1, 1500, 'szt', 14),
      new Product(this.allProducts.length, 'kanapa do salonu', 1, 5000, 'szt', 14),
      new Product(this.allProducts.length, 'stolik do salonu', 1, 800, 'szt', 14),
      new Product(this.allProducts.length, 'st???? z krzes??ami do jadalni', 1, 3000, 'szt', 14),
      new Product(this.allProducts.length, 'stoliki nocne do sypialni', 2, 600, 'szt', 14),
      new Product(this.allProducts.length, 'komody', 4, 4000, 'szt', 14),

      new Product(this.allProducts.length, 'pralka', 1, 1400, 'szt', 15),
      new Product(this.allProducts.length, 'tv', 1, 2200, 'szt', 15),
      new Product(this.allProducts.length, 'piekarnik', 1, 800, 'szt', 15),
      new Product(this.allProducts.length, 'p??yta gazowa', 1, 400, 'szt', 15),
      new Product(this.allProducts.length, 'okap', 1, 500, 'szt', 15),
      new Product(this.allProducts.length, 'lod??wka', 1, 1800, 'szt', 15),
      new Product(this.allProducts.length, 'kuchenka mikrofalowa', 1, 700, 'szt', 15)
    ];

    this.allMandates = [
      new Mandate(this.allMandates.length, "Nie zapi????e?? pas??w. Otrzymujesz mandat 200 z??otych.", 200),
      new Mandate(this.allMandates.length, "Musisz zap??aci?? podatek o warto??ci 500 z??.", 500),
      new Mandate(this.allMandates.length, "Przekroczy??e?? pr??dko???? o 50 km/h. Otrzymujesz mandat 400 z??otych.", 400),
      new Mandate(this.allMandates.length, "Popsu?? Ci si?? samoch??d. Musisz zap??aci?? za napraw?? 1000 z??.", 1000),
      new Mandate(this.allMandates.length, "Zachorowa??e??, wi??c udajesz si?? do lekarza na wizyt?? i wykupujesz lekarstwa, co w sumie wynosi 300z??.", 300),
      new Mandate(this.allMandates.length, "??le zaparkowa??e??. Otrzymujesz mandat 100 z??otych.", 100),
      new Mandate(this.allMandates.length, "Mija termin p??atno??ci za energi?? elektryczn??. P??acisz 400 z??otych.", 400),
      new Mandate(this.allMandates.length, "Mija termin p??atno??ci za kanalizacj??. P??acisz 200 z??otych.", 200),
      new Mandate(this.allMandates.length, "Mija termin p??atno??ci za internet, telewizj??, telefon. P??acisz 300 z??otych.", 300),
    ];

    this.allPlots = [
      new Plot(this.allPlots.length, 2, 270000),
      new Plot(this.allPlots.length, 8, 300000),
      new Plot(this.allPlots.length, 12, 210000),
      new Plot(this.allPlots.length, 19, 180000),
      new Plot(this.allPlots.length, 23, 120000),
      new Plot(this.allPlots.length, 28, 100000),
      new Plot(this.allPlots.length, 34, 90000),
      new Plot(this.allPlots.length, 42, 80000),
      new Plot(this.allPlots.length, 50, 60000),
      new Plot(this.allPlots.length, 58, 50000),
      new Plot(this.allPlots.length, 70, 40000),
      new Plot(this.allPlots.length, 80, 30000)
    ];

    for (var i = 0; i < 4; i++){
      this.allOffices.push(new Office(i, 'o'+i));
    }

    for (var i = 0; i < 4; i++){
      this.allArchitects.push(new Architect(i, 'a'+i));
    }

    for (var i = 0; i < 14; i++){
      this.allShops.push(new Shop(i, 's'+i, '', this.allProducts));
    }

    this.allQuestions = [
      new Question(this.allQuestions.length, 'Chemiczne ??rodki ochrony ro??lin przeznaczone do walki z chwastami to: ', ['nematocydy', 'fitoncydy', 'herbicydy', 'insektycydy'], 2, 'biolog'),
      new Question(this.allQuestions.length, 'Dzieci m????czyzny o grupie krwi AB i kobiety o grupie A mog?? mie??: ', ['grup?? AB lub A','grup?? A,B,AB','tylko grup?? AB','grup?? O,A lub B'], 1, 'biolog'),
      new Question(this.allQuestions.length, 'Podobie??stwo budowy oka g??owonoga i ryby jest przyk??adem : ', ['konwergencji','radiacji','sukcesji','specjacji'], 0, 'biolog'),
      new Question(this.allQuestions.length, 'Pierwszym produktem fazy ciemno??ciowej fotosyntezy roslin C3 jest: ', ['skrobia','fruktoza','kwas 3 fosfoglicerynowy','ryboza'], 2, 'biolog'),
      new Question(this.allQuestions.length, 'Informacja genetyczna wirusa HIV zawarta jest w: ', ['2 cz??steczkach jednoniciowego RNA','2 cz??steczkach dwuniciowego RNA','cz????teczce dwuniciowego DNA','2 cz??steczkach dwuniciowego RNA'], 0, 'biolog'),
      new Question(this.allQuestions.length, 'Cia??o jamoch??on??w zbudowane jest z: ', ['tylko ektodermy,entodermy i mezoglei','ektoderny,entodermy i parenchymy','ektodermy i entodermy','ektodermy'], 0, 'biolog'),
      new Question(this.allQuestions.length, 'Aktyna wchodzi w sk??ad: ', ['mikrotubul','mikrofilamentow','miceli','mikrofibryli'], 1, 'biolog'),
      new Question(this.allQuestions.length, 'Odporno???? nabyta bierna sztuczna powstaje poprzez: ', ['kontakt z patogenem','szczepienie ochronne','transfuzje osocza','podanie surowicy z przeciwcialami'], 3, 'biolog'),
      new Question(this.allQuestions.length, 'Stek u prymitywnych ssakow stekowc??w jest wsp??lnym uj??ciem uk??adow: ', ['rozrodczego i wydalniczego','pokarmowego i rozrodczego','pokarmowego i wydalniczego','pokarmowego,rozrodczego,wydalniczego',], 3, 'biolog'),
      new Question(this.allQuestions.length, 'G????wnym zadaniem oddychania kom??rkowego jest: ', ['????czenia w??gla z wodorem','????czenie tlenu z wodorem','synteza ATp','wytworzenie kwasu pirogronowego'], 2, 'biolog'),
      new Question(this.allQuestions.length, 'Nasiona ze skrzyde??kami rozsiewaj?? si?? na drodze: ', ['autochorii','zoochorii','anizogamii','anemochorii'], 3, 'biolog'),
      new Question(this.allQuestions.length, 'Zwielokrotnienie ca??ego kompletu chromosom??w nazywa si??: ', ['poliploidyzacj??','politenizacj??','polimeryzacj??','duplikacj??'], 0, 'biolog'),
      new Question(this.allQuestions.length, 'Kijanki ??ab u??ywaj?? jako narz??d??w oddechowych: ', ['skrzeli wewn??rznych i zewn.','skrzeli wewn??trznych','skrzelotchawek','p??uc i sk??ry',], 0, 'biolog'),
      new Question(this.allQuestions.length, 'Rybosomy s?? miejscem syntezy: ', ['bia??ka','DNA','kwas??w rybonukleinowych','w??glowodan??w'], 0, 'biolog'),
      new Question(this.allQuestions.length, 'Implantacja ludzkiego jaja plodowego w macicy nastepuje w stadium rozwojowym zwanym: ', ['gastrul??','morul??','blastocyst??','zygot??'], 2, 'biolog'),

      new Question(this.allQuestions.length, 'Kt??ry ze zbior??w jest niesko??czony?', ['Zbi??r pusty','Zbi??r liczb naturalnych mniejszych od 4', 'Zbi??r punkt??w przeci??cia stu prostych',	'Zbi??r wszystkich punkt??w prostej'], 3, 'matematyk'),
      new Question(this.allQuestions.length, '(a;b> to przedzia??:', ['obustronnie otwarty','obustronnie domkni??ty','prawostronnie domkni??ty','prawostronnie otwarty'], 2, 'matematyk'),
      new Question(this.allQuestions.length, 'Argument funkcji:', ['nie tworzy dziedziny funkcji', 'tworzy zbi??r warto??ci funkcji', 'jest zmienn?? niezale??n??','musi nale??e?? do zbioru liczb naturalnych'], 2, 'matematyk'),
      new Question(this.allQuestions.length, 'Funkcja rosn??ca:', ['wi??kszym argumentom przyporz??dkowuje wi??ksze warto??ci', 'dla ka??dego argumentu przyjmuje tak?? sam?? warto????', 'wi??kszym argumentom przyporz??dkowuje mniejsze warto??ci', 'przyporz??dkowuje argumentom liczby dodatnie'], 0, 'matematyk'),
      new Question(this.allQuestions.length, 'Wsp????czynnikiem kierunkowym funkcji liniowej, y= ax + b jest:', ['a','b', 'x',	'y'], 0, 'matematyk'),
      new Question(this.allQuestions.length, 'Miejsce zerowe to:', ['warto????, kt??r?? funkcja przyjmuje dla argumentu 0', 'argument, dla kt??rego funkcja przyjmuje warto???? 0', 'punkt przeci??cia wykresu funkcji z osi?? OX','punkt przeci??cia wykresu funkcji z osi?? OY'], 1, 'matematyk'),
      new Question(this.allQuestions.length, 'Zdarzenie elementarne to:', ['wszystkie mo??liwe wyniki do??wiadczenia', 'to samo co zdarzenie niemo??liwe', 'ka??dy mo??liwy wynik do??wiadczenia losowego', 'to samo co zdarzenie pewne'], 2, 'matematyk'),
      new Question(this.allQuestions.length, 'Prawdopodobie??stwo jest liczb?? nale????c?? do przedzia??u:', ['<0;1>','<0;2>','<-1;1>','(-1;1)'], 0, 'matematyk'),
      new Question(this.allQuestions.length, 'Ramiona paraboli s?? na pewno skierowane w g??r??, gdy:', ['wsp????czynnik a > 0', 'wsp????czynnik a < 0', 'r??wnanie funkcji kwadratowej ma posta?? y=ax2', 'r??wnanie funkcji kwadratowej ma posta?? y=ax2 + b'], 3, 'matematyk'),
      new Question(this.allQuestions.length, 'Aby r??wnanie kwadratowe nie mia??o rozwi??za?? delta musi by??:', ['wi??ksza od zera', 'mniejsza od zera','r??wna zero', 'r????na od zera'], 1, 'matematyk'),
      new Question(this.allQuestions.length, 'Ile pierwiastk??w mo??e mie?? maksymalnie r??wnanie kwadratowe:', ['1', '2', '3', '4'], 1, 'matematyk'),
      new Question(this.allQuestions.length, 'Wykresem funkcji y=sin ?? jest:', ['sinusoida', 'cosinusoida',	'parabola', 'prosta'], 0, 'matematyk'),
      new Question(this.allQuestions.length, 'Radian to k??t, o jakiej mierze ??ukowej?', ['0','1', '2',	'???'], 1, 'matematyk'),
      new Question(this.allQuestions.length, 'Jak na pewno mo??na nazwa?? ci??g an je??eli ma co najmniej trzy wyrazy i ka??dy jego wyraz z wyj??tkiem pierwszego powstaje przez dodanie do poprzedniego wyrazu pewnej sta??ej liczby r?', ['Ci??giem geometrycznym',	'Ci??giem arytmetycznym', 'Ci??giem sko??czonym', 'Ci??giem niesko??czonym'], 1, 'matematyk'),
      new Question(this.allQuestions.length, 'Jak nazywa si?? logarytm przy podstawie e?', ['Logarytm dziesi??tny','Logarytm zwyczajny','Logarytm pi', 'Logarytm naturalny'], 3, 'matematyk'),

      new Question(this.allQuestions.length, 'Jakie miasto obejmuje swoimi granicami ciesnin?? Bosfor?', ['Kair', 'Odessa', 'Madras', 'Istambul'], 3, 'geograf'),
      new Question(this.allQuestions.length, 'Wyspy Seszele znajduja si?? na oceanie?', ['Indyjskim', 'Lodowatym', 'Spokojnym', 'Atlantyckim'], 0, 'geograf'),
      new Question(this.allQuestions.length, 'Jak obecnie nazywa si?? wyspa, niegdy?? zwana Cejlonem?', ['Sri lanka', 'Tahiti', 'Wyspa Wielkanocna', 'Kuba'], 0, 'geograf'),
      new Question(this.allQuestions.length, 'Gdzie znajduja si?? G??ry Kaledo??skie?', ['W Szkocji', 'W Szwecji', 'W Szwajcarii', 'na Szetlandach'], 0, 'geograf'),
      new Question(this.allQuestions.length, 'Jakie miasto jest stolica Australii?', ['Sydney', 'Canberra', 'Melbourne', 'Port Darwin'], 1, 'geograf'),
      new Question(this.allQuestions.length, 'Kt??re miasto ma najwi??cej mieszka??c??w na ??wiecie?', ['Pekin', 'Meksyk', 'Nowy Jork', 'Tokio'], 1, 'geograf'),
      new Question(this.allQuestions.length, 'Kt??ra rzeka ma najwi??ksza delt?? na ??wiecie?', ['Amazonka', 'Ganges', 'Nil', 'Dunaj'], 1, 'geograf'),
      new Question(this.allQuestions.length, 'Gdzie znajduje si?? most o nazwie Golden Gate?', ['w Wenecji', 'w Londynie', 'W Nowym Jorku', 'w San Francisco'], 3, 'geograf'),
      new Question(this.allQuestions.length, 'Toskania jest kraina znajduj??ca si??...?', ['w Portugalii', 'W Grecji', 'We Wloszech', 'W Hiszpanii'], 2, 'geograf'),
      new Question(this.allQuestions.length, 'Wyspy Kanaryjskie nale???? do...?', ['Portugalii', 'Maroka', 'Francji', 'Hiszpanii'], 3, 'geograf'),
      new Question(this.allQuestions.length, 'Grenlandia nale??y do...?', ['Kanady', 'Stan??w Zjednoczonych', 'Danii', 'Rosji'], 2, 'geograf'),
      new Question(this.allQuestions.length, 'G??ry Atlas znajduj?? si?? w...?', ['Ameryce Po??udniowej', 'Australii', 'Azji', 'Afryce'], 3, 'geograf'),
      new Question(this.allQuestions.length, 'Jak nazywaj?? si?? "sople" wisz??ce z sufitu w jaskiniach?', ['Stalagmity', 'Stalaktyty', 'Stalagnaty', 'Stalagi'], 1, 'geograf'),
      new Question(this.allQuestions.length, 'Jaka nazw?? nosi g??az narzutowy?', ['Eraton', 'Eratyk', 'Kamlot', 'Stalaktyt'], 1, 'geograf'),
      new Question(this.allQuestions.length, 'Nazwa Wysp Kanaryjskich pochodzi od...?', ['kanark??w', 'arian', 'ps??w', 'aryjczyk??w'], 2, 'geograf'),

      new Question(this.allQuestions.length, 'Elektrony walencyjne to:', ['elektrony pierwszej pow??oki', 'elektrony ostatniej pow??oki', 'wszystkie elektrony', 'elektrony dowolnej pow??oki'], 1, 'chemik'),
      new Question(this.allQuestions.length, 'Izotopy r????ni?? si???', ['liczb?? pow??ok', 'liczb?? proton??w w j??drze', 'liczb?? neutron??w w j??drze', 'liczb?? elektron??w na pow??okach'], 2, 'chemik'),
      new Question(this.allQuestions.length, 'Masa atomowa to:', ['masa atomu w gramach', 'suma proton??w i neutron??w w j??drze', 'suma wszystkich cz??stek elementarnych', 'liczba proton??w w j??drze'], 1, 'chemik'),
      new Question(this.allQuestions.length, 'Liczba atomowa to:', ['masa atomu w gramach', 'suma proton??w i neutron??w w j??drze', 'suma wszystkich cz??stek elementarnych', 'liczba proton??w w j??drze'], 3, 'chemik'),
      new Question(this.allQuestions.length, 'Najl??ejszy w atomie jest:', ['proton', 'elektron', 'neutron', 'proton, elektron i neutron wa???? tyle samo'], 1, 'chemik'),
      new Question(this.allQuestions.length, 'Jon o ??adunku ujemnym to:', ['anion', 'elektron', 'neutron', 'kation'], 0, 'chemik'),
      new Question(this.allQuestions.length, 'Cz??steczki elementarne to:', ['elektrony, protony i neutrony', 'protony i neutrony', 'neutrony', 'elektrony'], 0, 'chemik'),
      new Question(this.allQuestions.length, 'Trwa??ym izotopem wodoru nie jest:', ['prot', 'deuter', 'tryt', 'neuryt'], 3, 'chemik'),
      new Question(this.allQuestions.length, 'Kwas siarkowodorowy mo??na otrzyma??:', ['w reakcji syntezy siarki i wodoru', 'przez rozpuszczenie siarkowodoru w wodzie', 'w reakcji tlenku siarki(IV) z wod??', 'w reakcji tlenku siarki(VI) z wod??'], 1, 'chemik'),
      new Question(this.allQuestions.length, 'Wodorotlenki, s?? zbudowane z:', ['prot', 'deuter', 'tryt', 'neuryt'], 3, 'chemik'),
      new Question(this.allQuestions.length, 'Estryfikacja to rekacja alkoholu z:', ['estrem', 'kwasem organicznym', 'zasad??', 'chlorowodorem'], 1, 'chemik'),
      new Question(this.allQuestions.length, 'Mi??dzy cz??steczkami alkoholi powstaj?? wi??zania:', ['jonowe', 'atomowe', 'spolaryzowane', 'wodorowe'], 3, 'chemik'),
      new Question(this.allQuestions.length, 'Aby otrzyma?? aldehyd nale??y utleni?? alkohol:', ['Jednowodorotlenowy', 'Wielowodorotlenowy', 'Pierwszorz??dowy', 'Drugorz??dowy'], 2, 'chemik'),
      new Question(this.allQuestions.length, 'Propanal i propanon to:', ['Homologi', 'Izomery', 'Polimery', 'Odmiany alotropowe'], 1, 'chemik'),
      new Question(this.allQuestions.length, 'Alkohole wielowodorotlenowe mo??na odr????ni?? od jednowodorotlenowych za pomoc??:', ['Wodorotlenku sodu', 'Pr??by Tollensa', 'Pr??by Trommera', 'Wodorotlenku miedzi(II)'], 3, 'chemik'),
    ];

    this.allPlots = shuffle(this.allPlots);

    var s = 0;
    var e = 1;
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
          return table.questions[field.index];

        case 'm':
          return table.mandates[field.index];

        case 'o':
          return table.offices[field.index];

        case 'a':
          return table.architects[field.index];

      }

    }
}
}

