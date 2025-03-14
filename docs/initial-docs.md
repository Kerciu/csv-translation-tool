# Narzędzie do półautomatycznego tłumaczenia zbiorów tekstu
Kacper Górski (331379)
Szymon Kamiński ([...])

# Opis projektu

Projekt polega na opracowaniu narzędzia wspomagającego półautometyczne tłumaczenie zbiorów tekstu w formacie **.csv**.
Rozwiązanie zaimplementowane jest jako aplikacja webowa z niskopoziomowym backendem i modułem ML do tłumaczenia tekstu.

# Funkcjonalności

[...]

# Założenia technologiczne

Frontend zostanie napisany przy pomocy framework'a React (Typescript). Backend natomiast będzie stworzony w języku Rust przy pomocy biblioteki Actix-Web oraz PyO3, aby zagnieździć Pythona w tym właśnie języku. Jeżeli chodzi o Pythona, to właśnie komponent tłumaczeniowy będzie zrealizowany przy pomocy transformers z Hugging Face (MarianMT) oraz langdetect.
Baza danych w której będziemy przechowywać dane użytkownika oraz informacje potrzebne do wznowienia tłumaczenia przechowywać będziemy w DBMS PostgreSQL.

# Wyzwania i ich podproblemy

[...]
