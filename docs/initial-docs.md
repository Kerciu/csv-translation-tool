# Narzędzie do półautomatycznego tłumaczenia zbiorów tekstu

**Kacper Górski (331379)**
**Szymon Kamiński ([...])**
---
## Opis projektu

Projekt polega na opracowaniu narzędzia wspomagającego **półautomatyczne tłumaczenie zbiorów tekstu** w formacie **.csv**.
Rozwiązanie zaimplementowane jest jako **aplikacja webowa** z **niskopoziomowym backendem** i **modułem ML** do tłumaczenia tekstu.

## Funkcjonalności

  **Obsługa plików:**
- Wczytywanie plików CSV (z możliwością rozbudowy do innych formatów)
- Wybór kolumn do tłumaczenia
- Wybór zakresu rzędów do przetłumaczenia

**Tłumaczenie:**
- Obsługa wielu języków wejściowych i jednego języka docelowego
- Rozpoznawanie języka tekstu
- Automatyczna propozycja tłumaczenia
- Edytowalne pole do korekty tłumaczenia przez użytkownika

**Interakcja użytkownika:**
- Obsługa skrótów klawiszowych
- Możliwość wznawiania procesu tłumaczenia po ponownym uruchomieniu aplikacji

**Eksport wyników:**
- Pobieranie pliku z przetłumaczonym tekstem

## Założenia technologiczne

Frontend zostanie napisany przy pomocy framework'a **React (Typescript)**.
Backend natomiast będzie stworzony w języku **Rust** przy pomocy biblioteki **Actix-Web** oraz **PyO3**,
aby zagnieździć Pythona w tym właśnie języku. Jeżeli chodzi o **Pythona**,
to właśnie komponent tłumaczeniowy będzie zrealizowany przy pomocy
**transformers z Hugging Face (MarianMT) oraz langdetect**.
Baza danych w której będziemy przechowywać dane użytkownika oraz informacje
potrzebne do wznowienia tłumaczenia przechowywać będziemy w
systemie zarządzania bazami danych **PostgreSQL**.

## Wyzwania i ich podproblemy

[...]

## Podsumowanie

Projekt pozwala na **efektywne zarządzanie procesem tłumaczenia zbiorów tekstu**, łącząc **wydajny backend w Rust** z **modułami ML w Pythonie**.
Implementacja zapewnia użytkownikowi **pełną kontrolę nad procesem tłumaczenia** oraz **możliwość edycji wyników**, co poprawia jakość translacji.
