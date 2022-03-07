Pliki źródłowe aplikacji zawarte są w katalogu src.
Folder ten składa się z dwóch katalogów: app i assets oraz pliku index.html i pliku favicon.ico.
Pierwszy z tych katalogów zawiera kod źródłowy aplikacji.
Natomiast drugi posiada podkatalog images ze wszystkimi plikami graficznymi, które znajdują się na stronach.
Plik index.html zawiera główny widok aplikacji. Jest on w zasadzie pusty, zawiera jedynie sekcję head i sekcję body z dyrektywą ng-view,
gdzie „wstrzykiwane” są odpowiednie części html po zbudowaniu aplikacji przez gulp build.
Wspomniany już powyżej katalog app zawiera:
- folder components – jest to zbiór wszystkich komponentów, z których składają się strony gry „E-budowa”.

W skład tych komponentów wchodzą katalogi dyrektyw i serwisów, które zostały dokładnie opisane w dalszej części pracy.
- folder pages – zawiera dwa katalogi controllers i templates. Pierwszy z nich zawiera cztery pliki kontrolerów dla każdej
ze stron gry o nazwach AboutPage.controller.js, GamePage.controller.js, LoginPage.controller.js, TablesPage.controller.js.
Natomiast drugi katalog – templates przechowuje pliki z widokami dla każdej ze stron o nazwach: AboutPage.html, GamePage.html,
LoginPage.html, TablesPage.html.
- plik index.module.js – plik, w którym wymienione są wszystkie zewnętrzne moduły z których korzysta aplikacja.
- plik index.route.js – plik, w którym ustawiony jest routing, czyli przekserowanie do odpowiednich stron w zależności od podanego adresu.
- plik index.scss – główny plik ze stylami SASS, do którego w trakcie budowania aplikacji „wstrzykiwane” są wszystkie inne pliki .scss z projektu.

Głównymi komponentami, z których składa się aplikacja są dyrektywy, czyli części, na które podzielone są strony aplikacji.
Poza nimi zaimplementowano dwa serwisy: clientServerComm i products. Pierwszy z nich odpowiada za komunikację z serwerem,
wysyłanie do niego wiadomości i odbieranie. Jest wykorzystywany przez kontrolery stron oraz przez dyrektywy. Przechowywany jest w nim adres serwera,
tu można go też zmienić.

Funkcją drugiego z serwisów jest przechowywanie danych o wszystkich produktach wymaganych do budowy oraz o wszystkich firmach wykorzystywanych
do budowy. Katalogi z dyrektywami, jak już wspomniano znajdują się w katalogu components.
Każdy z nich zawiera trzy pliki: plik .js z kodem dyrektywy, plik .html z widokiem dla danej dyrektywy oraz plik .scss ze zdefiniowanymi
stylami dla obszaru dyrektywy.

Za pomocą narzędzia gulp projekt zostaje serwowany (gulp serve) lub budowany (gulp build) i można go używać.
Zbudowany projekt znajduje się w katalogu dist. Część kliencka jest w jego podkatalogu public,
który zawiera foldery: assets, fonts, maps, scripts, styles i pliki: index.html, favicon.ico.

Plik z kodem serwera znajduje się bezpośrednio w katalogu dist. W pliku serwera został załączony plik pomocniczy boardInfo.js,
który przechowuje dane o sklepach i produktach w nich, o pytaniach, o karach, o architektach, o urzędach o firmach.
W katalogu dist jest umiejscowiony również plik Procfile, w którym zawarte jest polecenie do uruchomienia serwera.

Katalog,który przechowuje testy jednostkowe to spec.



